// eqpt/mine/openClose/openClose.js
Page({

  /**  
   * 页面的初始数据
   */
  data: {
    openInfo: { creatEqptInfo: true, EqptUse: true, repairInfoRecord: true, evalue: true, repairRecord: true, receiveEvalue: true, repairNumRank: true, repairScore: true, repairAvgTime: true, other: true, workRecord: true, WaitCheckList:true,checkRecord:true,eqptUseRecord:true },
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me=this;
    wx.getStorage({
      key: 'openInfo',
      success: function (res) {


        me.setData({
          openInfo: res.data,
      
        })

      },

    })


    wx.setNavigationBarTitle({
      title: "开启与关闭",
      success: function () {

      },
      fail: function (err) {

      }
    })

  },
  switchChange:function(e){
this.setData({
  "openInfo.creatEqptInfo" : e.detail.value,

})
    
  },
  switchChange1: function (e) {
    this.setData({
      "openInfo.EqptUse": e.detail.value,

    })

  }, 
    switchChange2: function(e) {
    this.setData({
      "openInfo.repairInfoRecord": e.detail.value,

    })

  }, 
    switchChange3: function (e) {
      this.setData({
        "openInfo.evalue": e.detail.value,

      })

    },
    switchChange4: function (e) {
      this.setData({
        "openInfo.repairRecord": e.detail.value,

      })

    },
    switchChange5: function (e) {
      this.setData({
        "openInfo.receiveEvalue": e.detail.value,

      })

    },
    switchChange6: function (e) {
      this.setData({
        "openInfo.repairNumRank": e.detail.value,

      })

    },
    switchChange7: function (e) {
      this.setData({
        "openInfo.repairScore": e.detail.value,

      })

    },
    switchChange8: function (e) {
      this.setData({
        "openInfo.repairAvgTime": e.detail.value,

      })

    },
    switchChange9: function (e) {
      this.setData({
        "openInfo.other": e.detail.value,

      })

    },

  switchChange10: function (e) {
    this.setData({
      "openInfo.workRecord": e.detail.value,

    })

  },

  switchChange11: function (e) {
    this.setData({
      "openInfo.WaitCheckList": e.detail.value,

    })

  },
  switchChange12: function (e) {
    this.setData({
      "openInfo.checkRecord": e.detail.value,

    })

  },
  switchChange13: function (e) {
    this.setData({
      "openInfo.eqptUseRecord": e.detail.value,

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
    wx.setStorageSync('openInfo', this.data.openInfo)

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