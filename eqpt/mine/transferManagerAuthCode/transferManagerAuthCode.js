// eqpt/mine/transferManagerAuthCode/transferManagerAuthCode.js

var baseurl = require('../../../config.js').requestUrl
var app = getApp()
Page({

  /**   
   * 页面的初始数据
   */
  data: {
    image: '',
    userID: '',
    src: ''
  },
  miniCode: function () {
    
    var me = this;
    wx.request({
      url: baseurl + '/qureyToken',
      method: "POST",
      data: {

      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

        wx.request({
          url: baseurl + '/getQRcode',
          method: "POST",
          data: {
            fun: "TransferAuth",
            userID: app.globalData.userInfo.userID,
            token: res.data.token,
            page: "eqpt/mine/transferAuth/transferAuth"
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (op) {

            me.setData({
              src: op.data.src
            })

          }

        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: "管理员移交",
      success: function () {

      },
      fail: function (err) {

      }
    })
  
    this.miniCode();
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