// eqpt/eqptDetail/eqptRepair/eqptRepair.js
var baseurl = require('../../../config.js').requestUrl
var app = getApp()
var util = require('../../../util/util.js')
Page({
       
  /**
   * 页面的初始数据
   */
  data: {
    array: ['15分钟', '30分钟', '1小时', '2小时', '4小时','8小时'],
    arrayValue: [15, 30, 60, 120, 240, 480],
    index: 0,
    eqptRepair: { fOperationDesc: "", fEqpID: "", fEqpCmpyID: "", fPreOperationID:"" },
    fOperationPosition:"",
fEqpNum:"",
btnStatus:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var me = this;

    this.setData({
      "eqptRepair.EqpImg": options.fEqpImg,
      "eqptRepair.fEqpID": options.fEqpID,
      "eqptRepair.fEqpCmpyID": options.fEqpCmpyID,
      "eqptRepair.fPreOperationID": options.fPreOperationID,
      fEqpNum: options.fEqpNum
    })


    wx.setNavigationBarTitle({
      title: "维修单 "+ this.data.fEqpNum,
      success: function () {

      },
      fail: function (err) {

      }
    })
  },

  bindPickerChange:function(e){
    this.setData({
      index: e.detail.value,

    })
  },
  fEqptRepairRemark: function (e) {

    this.setData({
      "eqptRepair.fOperationDesc": e.detail.value
    })
  },
  openPosition:function(){

    var me = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        me.setData({
          fOperationPosition: JSON.stringify(res)
        })


      },
    })
  },

  saveBtn:function(){

    if (this.data.btnStatus==true){
return;
}

    this.uploader = this.selectComponent("#uploader1");
    var me = this;
    var tempRows = [{
      fID: util.randString(), recordState: "new", version: 0, fOpratorID: app.globalData.orgInfo.fPath.value, fOperatorCmpyID: app.globalData.orgInfo.fCmpyID.value, fEqpID: this.data.eqptRepair.fEqpID,
      fEqpCmpyID: this.data.eqptRepair.fEqpCmpyID, fOperationDesc: this.data.eqptRepair.fOperationDesc, fOprationType: "资产维修", fOperationJson: "", fOperationImg: me.uploader.getFileList(), fProdMin: "", fProdCount: this.data.arrayValue[this.data.index], fOperationPosition: this.data.fOperationPosition, fPreOperationID: this.data.eqptRepair.fPreOperationID, fEqptStatus: "" 
    }]
    wx.request({  
      url: baseurl + '/saveEqp_operation',
      method: "POST",
      data: { tables: util.conWx2Table(tempRows, "eqp_operation", "Integer,String,String,String,String,String,String,String,String,String,integer,String,String,String") },


      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        //返回上一级页面
        wx.navigateBack({
          delta: 1,
        })

      }

    })
this.setData({
  btnStatus:true
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