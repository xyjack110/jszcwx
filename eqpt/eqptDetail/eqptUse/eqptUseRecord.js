// eqpt/eqptDetail/eqptUse/eqptUseRecord.js
var app = getApp()
var requestUrl = require('../../../config.js').requestUrl
Page({

  /**
   * 页面的初始数据
   */    
  data: {
  fEqptID:"",
  eqptUseRecord:[],
  isLoading: true,
  limit: 7,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.setData({
    fEqptID: options.fEqptID
  })
  this.loadEqptUseRecord(0, true);
  },
  loadEqptUseRecord: function (offset, append){

    if (this.data.isLoading == false) {
      return;
    }

    var me = this
    wx.request({
      url: requestUrl + '/queryEqptUseRecord',
      method: "POST",
      data: {
        fEqptID: this.data.fEqptID,
        limit: this.data.limit,
        offset: offset
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        var t = null;
        for (var i = 0; i < res.data.rows.length; i++) {

          res.data.rows[i].fdate = res.data.rows[i].fOperationTime.value.substring(0, 10) + " " + res.data.rows[i].fOperationTime.value.substring(11, 19)
        

        }




        if (res.data.rows.length < me.data.limit) {
          me.setData({
            isLoading: false
          })

        } else {
          me.setData({
            isLoading: true
          })
        }

     

        if (append == true) {
          me.setData({

            eqptUseRecord: me.data.eqptUseRecord.concat(res.data.rows)
          })
        } else {
          me.setData({

            eqptUseRecord: res.data.rows
          })
        }



      }
    })

    wx.stopPullDownRefresh({
      complete: function (res) {


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
    this.setData({
      repairInfoList: [],
      isLoading: true
    })
    this.loadEqptUseRecord(0, false);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadEqptUseRecord(this.data.eqptUseRecord.length, true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})