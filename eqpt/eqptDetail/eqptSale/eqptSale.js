// eqpt/eqptDetail/eqptSale/eqptSale.js
var baseurl = require('../../../config.js').requestUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: { 
  src:"",
  fEqpID:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.miniCode();
    this.setData({
      fEqpID: options.fEqpID
    })
  
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
            fun: "handEqptOut",
            userID: me.data.fEqpID,
            token: res.data.token,
            page: "eqpt/eqptDetail/eqptSale/handEqptOut/handEqptIn"
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