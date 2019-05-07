// eqpt/mine/personalDetail/createCompy/createCompy.js
var util = require('../util.js')
var baseurl = require('../../config.js').requestUrl
var XY = require('../../login/login.js').XY
var app = getApp()
Page({

  data: {
    fCmpyName: "",


  },
  Cancel: function () {//取消返回上一层
    wx.navigateBack()

  },


  onLoad: function (options) {

  },

  okBtn: function () { 
 
    XY.creatCmpy(app.globalData.openid, this.data.fCmpyName, function (data) {

wx.reLaunch({
  url: '/eqpt/mine/mine',
})
//           XY.XYLogin({
//             "openid": app.globalData.openid,
//       callback: function (data) {
      
//         app.globalData.userInfo = data.userInfo
//         app.globalData.orgInfo = data.orgInfo
//         app.globalData.cmpyInfo = data.cmpyInfo
//         app.globalData.openid = data.openid
//         app.globalData.unionid = data.unionid
//         var pages = getCurrentPages();
// for(var item in pages){
 
//   if (pages[item].globalDataRefresh)
//     pages[item].globalDataRefresh()

// }

//    wx.navigateBack({
//      delta: 1,
//    })
//       }})
    })

  },




  fInputChange: function (e) {//当输入框值改变时，给data赋值
    this.setData({
      "fCmpyName": e.detail.value
    })
  },
});