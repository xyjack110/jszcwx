// eqpt/management/checkSetDetail/checkSetDetail.js
var util = require('../../../util/util.js')
var requestUrl = require('../../../config.js').requestUrl
var app = getApp()
Page({

  /**    
   * 页面的初始数据
   */
  data: {
    prePageIndex: "",
    flag: false,
    array: ['文字', '数字'],
    fEqpTypeID: "",
    eqptType: "",
    checkItems: [{
      ind: 0,
      "itemName": "",
      "itemType": "文字",
      "itemMax": 100,
      "itemMin": 0,
      "itemDefault": 10,
      "itemOptions": ""
    }]
  },
  eqptTypeChange: function (e) {//获取输入框里资产分类的值

    this.setData({

      eqptType: e.detail.value

    })
  },
  itemNameChange: function (e) {//获取输入框里项目名称的值
    this.setData({
      [`checkItems[${e.currentTarget.dataset.index}].itemName`]: e.detail.value,

    })
  },
  bindPickerChange: function (e) {//获取下拉选项里的值

    var t = e.currentTarget.dataset.index;
    this.setData({
      [`checkItems[${e.currentTarget.dataset.index}].ind`]: e.detail.value,
      [`checkItems[${e.currentTarget.dataset.index}].itemType`]: this.data.array[e.detail.value],



    })
  },
  maxChange: function (e) {//获取输入框里的最大值
    this.setData({

      [`checkItems[${e.currentTarget.dataset.index}].itemMax`]: e.detail.value,



    })
  },
  minChange: function (e) {//获取输入框里的最小值
    this.setData({

      [`checkItems[${e.currentTarget.dataset.index}].itemMin`]: e.detail.value,

    })
  },
  defaultChange: function (e) {//获取输入框里的默认值
    this.setData({

      [`checkItems[${e.currentTarget.dataset.index}].itemDefault`]: e.detail.value,



    })
  },
  optionsChange: function (e) {//获取textArear里的值


   
   
   
    this.setData({
      [`checkItems[${e.currentTarget.dataset.index}].itemOptions`]: e.detail.value.replace('\n', ' '),



    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({

      fCompanyID: options.cmptid, 
      fEqpTypeID: options.eqptid,
      prePageIndex: options.index,
    })
    var me = this;
    if (options.cmptid != "undefined" && options.eqptid != "undefined") {//通过公司ID和资产类别ID，判断是新增还是修改。

      wx.request({//向数据库中查出要修改的值
        url: requestUrl + '/queryEqp_checkitem',
        method: "POST",
        data: {
          filter: "fCompanyID='" + options.cmptid + "' and fEqpTypeID = '" + options.eqptid + "'",

        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data.rows[0].fCheckContent.value)
          me.setData({
            flag: JSON.parse(res.data.rows[0].fCheckContent.value).length == 1 ? false : true,
            eqptType: res.data.rows[0].fEqptTypeName.value,
            checkItems: JSON.parse(res.data.rows[0].fCheckContent.value)//将json字符串转换成json
          })
        }
      })
    } else {

    }

  },

  downBtn:function(e){
  
   var i= e.currentTarget.dataset.index;
   if (i + 1<this.data.checkItems.length ){
      var temp = this.data.checkItems[i];
      this.setData({
        [`checkItems[${i}]`] :this.data.checkItems[i + 1],
        [`checkItems[${i + 1}]`]  : temp
      })
   

}

  },

  upBtn:function(e){
    var i = e.currentTarget.dataset.index;
    if (i>0) {
      var temp = this.data.checkItems[i];
      this.setData({
        [`checkItems[${i}]`]: this.data.checkItems[i -1],
        [`checkItems[${i - 1}]`]: temp
      })


    }

  },

  AddBtn: function (e) {//新增一项
    var arr = this.data.checkItems
    arr.splice(e.currentTarget.dataset.index + 1, 0, {
      ind: 0,
      "itemName": "",
      "itemType": "文字",
      "itemMax": 100,
      "itemMin": 0,
      "itemDefault": 10,
      "itemOptions": ""
    }

    )
    this.setData({
      checkItems: arr
    })

    if (this.data.checkItems.length > 1) {
      this.setData({
        flag: true


      })
    }

  },

  delBtn: function (e) {   //删除一项


    var me = this;
    wx.showModal({
      title: "删除警告",
      content: "删除本项之后不可恢复，是否确认",
      showCancel: true,
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {

        if (res.confirm) {

          var arr = me.data.checkItems
          //执行删除操作
          arr.splice(e.currentTarget.dataset.index, 1)
          me.setData({
            checkItems: arr


          })
          //如果该行数据小于一条，隐藏删除按钮
          if (me.data.checkItems.length < 2) {
            me.setData({
              flag: false
            })
          } else {
            me.setData({
              flag: true
            })

          }


        } else if (res.cancel) {

        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  saveBtn: function () {

    if (this.data.eqptType == "") {//判断是否填写了资产分类
      wx.showModal({
        title: '提示信息',
        content: '当前资产分类名称没有填写,是否确定退出',
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({

            })
            return;
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })




    } else {

//       for (var i = 0; i < this.data.checkItems.length;i++){

// // this.setData({
// //   [`checkItems[${i}]`.ind]:i
// // })
//       }
      //根据传过来的ID是否有值，判断是新增还是修改
      if (this.data.fCompanyID != "undefined") {//修改该数据
        var me = this;



        var st = JSON.stringify(this.data.checkItems)
        wx.request({
          url: requestUrl + '/checkItemChange',
          method: "POST",
          data: {
            fCompanyID: me.data.fCompanyID,//
            fEqpTypeID: me.data.fEqpTypeID,
            fEqptTypeName: me.data.eqptType,
            fCheckContent: st,
            fCheckCount: me.data.checkItems.length

          },

          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            var pages = getCurrentPages()
            var pre = pages[pages.length - 2]
            pre.edit({ "name": me.data.eqptType, "count": me.data.checkItems.length, "index": me.data.prePageIndex });
            wx.navigateBack({

            })
          }
        })


      } else {//执行新增操作
        var st = JSON.stringify(this.data.checkItems);
        console.log(st)
        this.setData({
          fEqpTypeID: util.randString()
        })
        // var jsObject = JSON.parse(st); 
        var me = this;
        var tempRows = [{ fID: util.randString(), recordState: "new", fCompanyID: app.globalData.orgInfo.fCmpyID.value, fEqpTypeID: this.data.fEqpTypeID, fEqptTypeName: this.data.eqptType, fCheckContent: st, version: 0, fCheckCount: this.data.checkItems.length }]
        wx.request({
          url: requestUrl + '/saveEqp_checkitem',
          method: "POST",
          data: { tables: util.conWx2Table(tempRows, "eqp_checkitem", "String,String,String,String,String,String,Integer,Integer") },


          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            var pages = getCurrentPages()
            var pre = pages[pages.length - 2]
            pre.add({ "name": me.data.eqptType, "count": me.data.checkItems.length, "fCompanyID": app.globalData.userInfo.fCmpyID, "fEqpTypeID": me.data.fEqpTypeID });
            wx.navigateBack({

            })

          }

        })

      }



      // if (this.data.fCompanyID != "undefined") {//修改
      //   var pages = getCurrentPages()
      //   var pre = pages[pages.length - 2]
      //   pre.edit({ "name": this.data.eqptType, "count": this.data.checkItems.length, "index": this.data.prePageIndex}); 

      // } else {
      //   var pages = getCurrentPages()
      //   var pre = pages[pages.length - 2]
      //   pre.add({ "name": this.data.eqptType, "count": this.data.checkItems.length, "fCompanyID": app.globalData.userInfo.fCmpyID, "fEqpTypeID": this.data.fEqpTypeID}); 

      // }

    }
  },
  onUnload: function () {



  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})