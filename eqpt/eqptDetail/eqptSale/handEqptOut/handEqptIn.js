// eqpt/eqptDetail/eqptSale/handEqptOut/handEqptIn.js
var requestUrl = require('../../../../config.js').requestUrl
var util = require('../../../../util/util.js')
var app = getApp()
Page({
         
  /**
   * 页面的初始数据
   */
  data: {
    eqptDetail: {},
    currentEqptRepairInfo: {},
    fEqpID:"",
    btnStatus: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  getImgFromList: function (fEqpImg) {
    console.log("拿到资产图片列表", fEqpImg)
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
  onLoad: function (options) {

    app.getUserFromDB(function (mark) {


      console.log("拿到了用户信息")



    })
    console.log(options.scene+"ggg")


this.setData({
  fEqpID: options.scene
})
 
    var me = this;
    wx.request({
      url: requestUrl + '/queryEqp_equipmentDetail',
      method: "POST",
      data: {
        fEqpID:  options.userID || options.scene,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
 
        res.data.rows[0].fEqpImg1 = me.getImgFromList(res.data.rows[0].fEqpImg.value)


        me.setData({
          eqptDetail: res.data.rows[0]
        })

        wx.setNavigationBarTitle({
          title: me.data.eqptDetail.fEqpNum.value,
          success: function () {

          },
          fail: function (err) {

          }
        })
        console.log("查询我的资产信息成功", res)


      }
    })

    //拿到本资产，最早的正在进行的报修单
    var me = this;


    var Filter = "fEqpID='" + (options.userID || options.scene)+ "' and fOprationType='故障报修' and fEqptStatus<>'运行正常'"
    wx.request({
      url: requestUrl + '/queryEqp_operation',
      method: "POST",
      data: {
        filter: Filter,
        orderBy: "fOperationTime asc",
        limit: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        if (res.data.rows.length > 0) {

          me.setData({
            currentEqptRepairInfo: res.data.rows[0]
          })
        }

        console.log("查询最早的，未完成的报修单成功", res)


      }
    })



  },
  previewImage: function (e) {
    var current = e.target.dataset.src
    if (this.data.eqptDetail.fEqpImg.value == "") {
      return;
    }
    wx.previewImage({
      current: current,
      urls: this.data.eqptDetail.fEqpImg.value?this.data.eqptDetail.fEqpImg.value.split("@"):[]
    })
  },
  saveBtn: function () {
    if (this.data.btnStatus == true) {
      return;
    }
    console.log("用户ID",app.globalData.userInfo)
    if (!app.globalData.userInfo.fCmpyID){

      wx.showModal({
        title: '严重警告',
        content: '您当前没有所属公司，不能接受资产',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '/eqpt/mine/mine',
            })
          }
        }
      })
   return;
}

    var me = this;
    var tempRows = [{
      fID: util.randString(), recordState: "new", version: 0, fOpratorID: app.globalData.userInfo.userID, fOperatorCmpyID: app.globalData.userInfo.fCmpyID, fEqpID: this.data.fEqpID,
      fEqpCmpyID: app.globalData.userInfo.fCmpyID, fOperationDesc: "", fOprationType: "资产接收", fOperationJson: JSON.stringify(this.data.eqptDetail), fOperationImg: "", fProdMin: "", fProdCount: 0, fOperationPosition: "", fPreOperationID: "", fEqptStatus: this.data.eqptDetail.fEqpStatus.value
    }]
    wx.request({
      url: requestUrl + '/saveEqp_operation',
      method: "POST",
      data: { tables: util.conWx2Table(tempRows, "eqp_operation", "Integer,String,String,String,String,String,String,String,String,String,integer,String,String,String") },


      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        wx.request({
          url: requestUrl + '/updateEqpOperatiorID',
          method: "POST",
          data: {
            fEqpID: me.data.fEqpID,
            fOpratorID: app.globalData.userInfo.userID,
            fEqpCmpyID: app.globalData.userInfo.fCmpyID
          },
          header: {
            'content-type': 'application/json' // 默认值
          },

          success: function (res) {
wx.reLaunch({
  url: '/eqpt/mine/mine',
})

          }
        })



     

      }

    })

    this.setData({
      btnStatus: true
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