// login/updateDept/updateDept.js
var baseurl = require('../../config.js').requestUrl
var XY = require('../../login/login.js').XY
var app = getApp()
Page({

  /**
   * 页面的初始数据    
   */

  data: {

    fCmpyName: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({//得到前一个页面，传来的名字
      "openID": options.openID,
      "fCmpyName": options.fName,
      "fCmpyID": options.fCmpyID,

    })


  },
  inputChange: function (e) {//获取输入框的值

    this.setData({
      "fCmpyName": e.detail.value
    })
  },

  updataNameBtn: function () {
    var me = this;

    XY.updataCmpy(this.data.openID, this.data.fCmpyID, this.data.fCmpyName, function (data) {
      console.log(data, "徐岩公司")


    })
    // var userInfo = { "fID": app.globalData.openid, "psnName": this.data.fDeptName }
    // XY.saveUserInfo(userInfo, function (e) {
    //   console.log(e, "yyyy")
    //   app.globalData.userInfo.psnName.value = me.data.fDeptName
    //   var t = app.globalData.orgInfo.fName.value.split("/");
    //   t[t.length - 1] = me.data.fDeptName;

    //   app.globalData.orgInfo.fName.value = t.join("/");
    //   var pages = getCurrentPages();
    //   for (var item in pages) {

    //     if (pages[item].globalDataRefresh)
    //       pages[item].globalDataRefresh()

    //   }

    //   //返回上一级页面


    //   wx.navigateBack({

    //   })


    // })




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