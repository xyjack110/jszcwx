// eqpt/mine/checkEvalueDetail/checkEvalueDetail.js
var app = getApp()
var requestUrl = require('../../../config.js').requestUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {   
    evalueDetail:[],
  imgList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this
    wx.request({
      url: requestUrl + '/queryEvalueDetail',
      method: "POST",
      data: {
        fID: options.fID,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


res.data.evalueDetail.rows[0].fdate = res.data.evalueDetail.rows[0].fOperationTime.value.substring(0, 10);



me.setData({
  evalueDetail:res.data.evalueDetail.rows[0],
  imgList: res.data.evalueDetail.rows[0].fOperationImg.value?res.data.evalueDetail.rows[0].fOperationImg.value.split("@"):[],
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