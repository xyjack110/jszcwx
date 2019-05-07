
var util = require('../util.js')
var baseurl = require('../../config.js').requestUrl
var XY = require('../../login/login.js').XY
var app = getApp()
Page({

  data: {
    fCmpyName: "",
orgID:"",
    showTopTips:false

  },
  Cancel: function () {//取消返回上一层
    wx.navigateBack()

  },


  onLoad: function (options) {

this.setData({
  orgID: options.orgID
})
    

   
  },

  okBtn: function () {
var me=this;
    XY.creatDept(app.globalData.orgInfo.fID.value, this.data.orgID, this.data.fCmpyName ,function (data) {
  
      if(data.data.result=="fail"){
        me.setData({
          showTopTips: true,
          ErrorMsg: data.data.errMsg

        });
        setTimeout(function () {
          me.setData({
            showTopTips: false
          });
        }, 3000);
        return;
      }
var pages=getCurrentPages();
      pages[pages.length - 2].onLoadSons();
     wx.navigateBack();
    })




    

  },




  fInputChange: function (e) {//当输入框值改变时，给data赋值
    this.setData({
      "fCmpyName": e.detail.value
    })
  },
});