// eqpt/management/checkList/checkList.js
var app = getApp()
var requestUrl = require('../../../config.js').requestUrl
Page({

  /**
   * 页面的初始数据        
   */           
  data: {
    InventoryList:[],
    btnStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var me = this

    var t = []

    t = app.globalData.orgInfo.fPath.value.split("/");

    t.length = t.length - 1;

    console.log(t.join("/") + "SonsIDSonsIDSonsID")
    wx.request({
      url: requestUrl + '/queryInventoryRecord',
      method: "POST",
      data: {
        fCmpyID: app.globalData.orgInfo.fCmpyID.value,
        fSonsID: t.join("/")
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

      
        for (var i = 0; i < res.data.rows.length; i++) {

          res.data.rows[i].fdate = res.data.rows[i].fOperationTime2.value.substring(0, 10)
          // if (res.data.rows[i].fDeptFName.value == ".") {
          //   if (res.data.rows[i].fMyDept.value) {
          //     res.data.rows[i].fDeptName = res.data.rows[i].fCmpyName.value + "/" + res.data.rows[i].fMyDept.value + "/" + res.data.rows[i].fPsnName.value
          //   } else {
          //     res.data.rows[i].fDeptName = res.data.rows[i].fCmpyName.value + "/" + res.data.rows[i].fPsnName.value
          //   }


          // } else {

          //   if (res.data.rows[i].fMyDept.value) {
          //     res.data.rows[i].fDeptName = res.data.rows[i].fCmpyName.value + "/" + me.getfDeptFName(res.data.rows[i].fDeptFName.value) + "/" + res.data.rows[i].fMyDept.value + "/" + res.data.rows[i].fPsnName.value
          //   } else {
          //     res.data.rows[i].fDeptName = res.data.rows[i].fCmpyName.value + "/" + me.getfDeptFName(res.data.rows[i].fDeptFName.value) + "/" + res.data.rows[i].fMyDept.value + "/" + res.data.rows[i].fPsnName.value
          //   }


          // }

}
        me.setData({
          InventoryList: res.data.rows
        })


      }
    })




    wx.setNavigationBarTitle({
      title: "盘点列表",
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
  
  checkBtn:function(){

    if (this.data.btnStatus == true) {
      return;
    }
    this.setData({
      btnStatus: true
    })
    var t=[]

    t = app.globalData.orgInfo.fPath.value.split("/");

    t.length = t.length - 1;

    console.log(t.join("/") +"SonsIDSonsIDSonsID")
    wx.showModal({

      content: '确认是否发起盘点？',
      showCancel: "取消",
      confirmText: "确定",
      success: function (res) {
        if (res.confirm) {

          var me = this
          wx.request({
            url: requestUrl + '/insertInventoryRecord',
            method: "POST",
            data: {
              fCmpyID: app.globalData.orgInfo.fCmpyID.value,
              fUserID: app.globalData.orgInfo.fPath.value,
fSonsID: t.join("/")
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {


wx.showToast({
  title: '盘点发起成功',
})



            }
          })



     
   
         

        } else if (res.cancel) {
          console.log('用户点击取消')
        }

    }
  })

  },

  InventoryDetail:function(e){


    wx.navigateTo({ url: '/eqpt/management/checkListDetail/checkListDetail?fPsnID=' + this.data.InventoryList[e.currentTarget.dataset.index].fPsnID.value + '&fOperationTime2=' + this.data.InventoryList[e.currentTarget.dataset.index].fOperationTime2.value  })

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