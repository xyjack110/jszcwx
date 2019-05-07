// eqpt/test.js
//import XYLogin from '../eqpt/login/login.js';
var XY = require('../login/login.js').XY
//var regeneratorRuntime = require('../util/runtime.js').regeneratorRuntime
// import regeneratorRuntime from '../util/runtime.js'
//import ZZLogin from '@zz-vc/fancy-mini-zz/lib/ZZLogin';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
  
  },
  test:   function(){
    var openID ="ooO635ZVUbr3-KXf-cPL-yB8Zjog"
   var  fCmpyName="徐岩公司"
    XY.creatCmpy(openID, fCmpyName,function (data) {
      console.log(data, "徐岩公司")
    })

    // XY.XYLogin({
    //   "openid": "ssss",
    //   callback: function (data) {
    //   console.log(data, "ssssdd")
    //   }})
    // XY.getUserInfo("idid",function (data) {
    //    console.log(data, "ssssdd")
    //    })


  },
  onGetUserInfo:function(data){

    if (data.detail.errMsg =="getUserInfo:ok"){
      var userInfo = {}


      // 合并json项
      var userInfo = Object.assign({ "unionid": "111", "fID": "ooO635ZVUbr3-KXf-cPL-yB8Zjog1", "psnName": "徐岩" }, JSON.parse(data.detail.rawData))
      console.log(Object.assign({ "unionid": "111", "fID": "ooO635ZVUbr3-KXf-cPL-yB8Zjog1" }, JSON.parse(data.detail.rawData)))

      XY.saveUserInfo(userInfo, function (data) {
        console.log(data, "yyyy")
      })
}


    
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