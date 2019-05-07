// fishbearComponents/dialog/dialog.js
 Component({

  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {

//存储位置

    storyPosition: {            
      type: String,    
      value: 'fishbear'    
    },
//localstory最大数量
    MaxCount: {
      type: Number,
      value: 500
    },
    //下拉菜单数量
    optionCount: {
      type: Number,
      value: 6
    },
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
  tarr :[],
    inputShowed: false,
    inputVal: "",
    eqptCondition: [],
    showSearchOption: false
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    showInput: function () {
      var t = wx.getStorageSync(this.data.storyPosition);

      this.setData({
        tarr: t?t:[]
     
      });
      this.setData({

        inputShowed: true,
    
      });

    },
    hideInput: function () {
      this.setData({
        inputVal: "",
        inputShowed: false,
        showSearchOption: false
      });
      this.triggerEvent("userInput", { "data": this.data.inputVal })//把值传回父界面

    },
    clearInput: function () {
      this.setData({
        inputVal: "",
        showSearchOption: false
      });
      this.triggerEvent("userInput", { "data": this.data.inputVal })
    },
    inputTyping: function (e) {
      this.setData({
        inputVal: e.detail.value,

        eqptCondition: this.findSthInArr(this.data.tarr, e.detail.value)
      });
      if (e.detail.value.length > 0) {
        this.setData({
          showSearchOption: true
        });
      }

      console.log(this.data.inputVal + "改变")


    },
    confirm: function (e) {


      this.setData({
        showSearchOption: false

      });
      this.triggerEvent("userInput", { "data": this.data.inputVal })
      if (this.data.inputVal == null || this.data.inputVal == "") {
        return;
      }

      if (this.in_array(this.data.tarr, this.data.inputVal)) {
        return;
      }

     
      this.data.tarr.unshift(this.data.inputVal)
 
      if (this.data.tarr.length >= this.data.MaxCount) {
        this.data.tarr.splice(this.data.MaxCount, this.data.tarr.length - this.data.MaxCount);
      }
      wx.setStorageSync(this.data.storyPosition, this.data.tarr)

   



    },
    chooseOption:function(e){

      this.setData({
        inputVal:   e.currentTarget.id

      });
      this.confirm();

    },


    //在数组中，找到包含somthing的6个元素
    findSthInArr: function (arr, element) {

      var t = [];
      if (element ==null||element.length == 0  ){
return t;
      }
      for (var i = 0; i < arr.length; i++) {

        if (arr[i].indexOf(element) != -1) {

          t.push(arr[i])
          if (t.length > this.data.optionCount) {
            return t;
          }


        }

      } return t;

    },




    in_array: function (arr, e) {
      var r = new RegExp(',' + e + ',');
      return (r.test(',' + arr.join(arr.S) + ','));
    },


  }
})

