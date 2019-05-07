// fishbearComponents/checkboxgroup/checkboxgroup.js
// fishbearComponents/dialog/dialog.js
 Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    items:{
      type: Array,
      value: [{ "value": "chn", "name": "中国" }, { "value": "usa", "name": "美国" }, { "value": "jpn", "name": "日本"}]
    },
    selectValue:{
      type: String,     
      value: 'chn,usa'  
    }
  
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
   
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */

    checkboxChange(e){
this.setData({
  selectValue:e.detail.value.join(',')
})
      this.triggerEvent("userSelect", { "selectValue": this.data.selectValue})
    },
    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */
    _cancelEvent() {
      //触发取消回调
      this.triggerEvent("cancelEvent")
    },
    _confirmEvent() {
    
      //触发成功回调
      this.triggerEvent("confirmEventa");
    }
  }
})

