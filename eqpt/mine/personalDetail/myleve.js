// eqpt/mine/personalDetail/myleve.js
var baseurl = require('../../../config.js').requestUrl
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    samePsnNum: 0,
    LowerLevelPsnNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })

    //查询出我的同级人数

    var me = this;
    wx.request({
      url: baseurl + '/querySamePsnNum',
      method: "POST",
      data: {
        fDeptFID: app.globalData.userInfo.fDeptFID,
        fCmpyID: app.globalData.userInfo.fCmpyID,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        me.setData({
          samePsnNum: res.data.samePsnNum

        })

      }
    })

    //查询出我的下级人数

    var myDeptFID1 = app.globalData.userInfo.fMyDeptID ? app.globalData.userInfo.fDeptFID + "/" + app.globalData.userInfo.fMyDeptID : app.globalData.userInfo.fDeptFID + "空";

    var me = this;
    wx.request({
      url: baseurl + '/queryLowerLevelPsnNum',
      method: "POST",
      data: {
        fDeptFID: myDeptFID1,
        fCmpyID: app.globalData.userInfo.fCmpyID,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        me.setData({
          LowerLevelPsnNum: res.data.LowerLevelPsnNum

        })

      }
    })



  },


  //查询同级人
  querySamePsn: function () {
    wx.navigateTo({ url: "/eqpt/mine/personalDetail/MinesameLevelPsn?fDeptFID=" + app.globalData.userInfo.fDeptFID + "&fCmpyID=" + app.globalData.userInfo.fCmpyID })
  },
  //查询下级人信息
  queryLowerLevelPsn: function () {
    wx.navigateTo({ url: "/eqpt/mine/personalDetail/mineLowerLevelPsn?fDeptFID=" + app.globalData.userInfo.fDeptFID + "&fCmpyID=" + app.globalData.userInfo.fCmpyID })

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