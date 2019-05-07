
var app = getApp()
var requestUrl = require('../../../config.js').requestUrl
Page({

  /**
   * 页面的初始数据         
   */       
  data: {
    InventoryList: [],
    isLoading: true,
    limit: 7,
  },

  /**
   * 生命周期函数--监听页面加载  
   */
  onLoad: function (options) {
 
    this.LoadMineWaitCheckRecord(0, true);
  


    wx.setNavigationBarTitle({
      title: "待盘点列表",
      success: function () {

      },
      fail: function (err) {

      }
    })
  },

  //去掉部门全名称的前两个字符
  getfDeptFName: function (fDeptFName) {
    return fDeptFName.substring(2)
  },

  //分页加载查出我的待盘点列表
  LoadMineWaitCheckRecord: function (offset, append) {
    if (this.data.isLoading == false) {
      return;
    }

    var me = this
    wx.request({
      url: requestUrl + '/queryMineWaitCheckList',
      method: "POST",
      data: {
        fCmpyID: app.globalData.orgInfo.fCmpyID.value,
        fPsnID: app.globalData.orgInfo.fPath.value,
        limit: this.data.limit,
        offset: offset
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        if (res.data.rows.length < me.data.limit) {
          me.setData({
            isLoading: false
          })

        } else {
          me.setData({
            isLoading: true
          })
        }



        for (var i = 0; i < res.data.rows.length; i++) {

          res.data.rows[i].fdate = res.data.rows[i].fOperationTime2.value.substring(0, 10)

         

        }

        if (append == true) {
          me.setData({

            InventoryList: me.data.InventoryList.concat(res.data.rows)
          })
        } else {
          me.setData({

            InventoryList: res.data.rows
          })
        }



      }
    })

    wx.stopPullDownRefresh({
      complete: function (res) {


      }
    })






 

  

  },



 

  InventoryDetail: function (e) {


    wx.navigateTo({
      url: '/eqpt/mine/waitCheckList/waitCheckList?fPsnID=' + app.globalData.orgInfo.fPath.value + '&fOperationTime2=' + this.data.InventoryList[e.currentTarget.dataset.index].fOperationTime2.value })

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

      isLoading: true
    })
    this.LoadMineWaitCheckRecord(0, false);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.LoadMineWaitCheckRecord(this.data.exportEqptExcel.length, true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})