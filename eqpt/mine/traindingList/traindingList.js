// eqpt/mine/traindingList/traindingList.js
var app = getApp()
var requestUrl = require('../../../config.js').requestUrl
Page({

  /**
   * 页面的初始数据
   */        
  data: {
    fileList: []   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this;
    wx.request({
      url: requestUrl + '/queryEqp_filelist',
      method: "POST",
      data: {
        filter: "fType='培训操作'",

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


       me.setData({
         fileList  : res.data.rows

            })

      }
    })
    wx.setNavigationBarTitle({
      title: "培训资料",
      success: function () {

      },
      fail: function (err) {

      }
    })

  },

  previewImage: function (e) {


    //预览图片
    wx.previewImage({
      current: "https://xy-1256082024.cos.ap-beijing.myqcloud.com/eqptImg/1533610421000wx49f40760f0ad4ba3.o6zAJs2vmt-w8MUqKTD3ztPDs7wM.FmgQDIi0sdss645a215dd90d6ac756aa926d1aaa5bfc.jpg",
      urls: ["https://xy-1256082024.cos.ap-beijing.myqcloud.com/eqptImg/1533610421000wx49f40760f0ad4ba3.o6zAJs2vmt-w8MUqKTD3ztPDs7wM.FmgQDIi0sdss645a215dd90d6ac756aa926d1aaa5bfc.jpg"]
    })
  },


  checkVideoTrain:function(e){

    // app.globalData.src = encodeURI(e.currentTarget.id)
    wx.navigateTo({ url: '/eqpt/mine/videoTrain/videoTrain?src=' + escape(e.currentTarget.id) })
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