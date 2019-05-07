// login/changePost/changePost.js
var XY = require('../login.js').XY
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sons:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
var me=this;
    console.log(options.psnID)
    XY.queryOrgByPsnID(
      options.psnID,  function (data) {


        for (var i = 0; i < data.data.Mine.rows.length; i++) {


          data.data.Mine.rows[i].fLastLogin = data.data.Mine.rows[i].fLastLogin.value.substring(0, 10) + " " + data.data.Mine.rows[i].fLastLogin.value.substring(11, 16)//截取时间字符串



        }



me.setData({
 sons: data.data.Mine.rows
})
   
      }
    )
  },

  changePost:function(e){

var index=e.currentTarget.dataset.index
   

    XY.changePost(
      this.data.sons[index].fID.value  , function (data) {
       
        wx.reLaunch({
          url: '/eqpt/mine/mine',
        })
      }
    )
  },

  createCompy: function () {
    wx.navigateTo({
      url: '/login/createCompy/createCompy'
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