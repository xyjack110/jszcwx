
var app = getApp()
var requestUrl = require('../../../config.js').requestUrl
Page({

  /**
   * 页面的初始数据    
   */
  data: {
    otherRecordDetail: [],
    imgList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this
    wx.request({
      url: requestUrl + '/queryOtherRecordDetail',
      method: "POST",
      data: {
        fID: options.fID,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        res.data.rows[0].fdate = res.data.rows[0].fOperationTime.value.substring(0, 10);

        res.data.rows[0].fEqpImg1 = me.getImgFromList(res.data.rows[0].fEqpImg.value)

        me.setData({
          otherRecordDetail: res.data.rows[0],
          imgList: res.data.rows[0].fOperationImg.value ? res.data.rows[0].fOperationImg.value.split("@") : [],
        })





      }
    })
  },

  //获取位置信息
  openPosition: function () {
    var t = JSON.parse(this.data.otherRecordDetail.fOperationPosition.value)
    wx.openLocation({
      latitude: t.latitude,
      longitude: t.longitude,
      scale: 28
    })

  },

  getImgFromList: function (fEqpImg) {

    if (fEqpImg == undefined) {
      return "/image/eqpt.png";
    }
    if (fEqpImg == "") {
      return "/image/eqpt.png"
    } else {
      var fEqpImgArr = fEqpImg.split("@")
      return fEqpImgArr[0]
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