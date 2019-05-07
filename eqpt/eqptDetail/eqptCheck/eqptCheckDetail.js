// eqpt/eqptDetail/eqptCheck/eqptCheckDetail.js

var requestUrl = require('../../../config.js').requestUrl
var util = require('../../../util/util.js')
var app = getApp()
Page({

  /**   
   * 页面的初始数据
   */
  data: {

    eqptCheckDetail: {},
    imgList: [],
    fOperationJson:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    var me = this
    wx.request({
      url: requestUrl + '/queryEqptCheckDetail',
      method: "POST",
      data: {
        fID: options.fID,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {






res.data.eqptCheckDetail.rows[0].fdate = res.data.eqptCheckDetail.rows[0].fOperationTime.value.substring(0, 10) + " " + res.data.eqptCheckDetail.rows[0].fOperationTime.value.substring(11, 19)
        me.setData({
          eqptCheckDetail: res.data.eqptCheckDetail.rows[0],

          imgList: res.data.eqptCheckDetail.rows[0].fOperationImg.value?res.data.eqptCheckDetail.rows[0].fOperationImg.value.split("@"):[],
          fOperationJson: JSON.parse(res.data.eqptCheckDetail.rows[0].fOperationJson.value)
        })



      }
    })
  },



  openPosition: function () {
    var t = JSON.parse(this.data.eqptCheckDetail.fOperationPosition.value)
    wx.openLocation({
      latitude: t.latitude,
      longitude: t.longitude,
      scale: 28
    })

  },
  call: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: this.data.eqptCheckDetail.fCellphone.value,
      success: function () {
        console.log("成功拨打电话")
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