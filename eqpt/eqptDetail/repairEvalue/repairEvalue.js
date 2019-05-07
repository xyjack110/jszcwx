// eqpt/eqptDetail/repairEvalue/repairEvalue.js
var wxStar = require('../../eqptDetail/wxStar/wxStar.js');
var baseurl = require('../../../config.js').requestUrl
var app = getApp()
var util = require('../../../util/util.js')
Page({

  /**             
   * 页面的初始数据
   */
  data: {
    repairEvalue: { fOperationDesc: "", fEqpID: "", fEqpCmpyID: "", fPreOperationID: "" },
    fProdCount:0  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  

    this.setData({
  
      "repairEvalue.fPreOperationID": options.fID,
      "repairEvalue.fEqpID": options.fOpratorID,
      "repairEvalue.fEqpCmpyID": options.fOperatorCmpyID,
  
    })
    // wxStar初始化
    wxStar.wxStar(this, 6, true);



    wx.setNavigationBarTitle({
      title: "维修评价",
      success: function () {

      },
      fail: function (err) {

      }
    })
  },
//点击维修备注时，所触发的事件
  repairEvalueRemark: function (e) {

    this.setData({
      "repairEvalue.fOperationDesc": e.detail.value
    })
  },
  resetStar: function () {
    this.wxStarInit(0);
  },
  alertStar: function () {
    var self = this;
    wx.showModal({
      title: '提示',
      content: '当前选中' + self.wxStarCont() + '星',
    })
  },
  //选择星之后的回调~
  starChangeCb: function () {
    console.log('选择星之后的回调~' + this.wxStarCont());
    // this.setData({

    //   fProdCount: this.wxStarCont()*10

    // })
  },

saveBtn:function(){
  
  this.setData({

    fProdCount: this.wxStarCont() * 10

  })



  this.uploader = this.selectComponent("#uploader1");
  var me = this;
  var tempRows = [{
    fID: util.randString(), recordState: "new", version: 0, fOpratorID: app.globalData.orgInfo.fPath.value, fOperatorCmpyID: app.globalData.orgInfo.fCmpyID.value, fEqpID: this.data.repairEvalue.fEqpID,
    fEqpCmpyID: this.data.repairEvalue.fEqpCmpyID, fOperationDesc: this.data.repairEvalue.fOperationDesc, fOprationType: "维修评价", fOperationJson: "", fOperationImg: me.uploader.getFileList(), fProdMin: "", fProdCount: this.data.fProdCount, fOperationPosition: "", fPreOperationID: this.data.repairEvalue.fPreOperationID, fEqptStatus: ""
  }]
  wx.request({
    url: baseurl + '/saveEqp_operation',
    method: "POST",
    data: { tables: util.conWx2Table(tempRows, "eqp_operation", "Integer,String,String,String,String,String,String,String,String,String,integer,String,String,String") },


    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面


      prevPage.pageUpdate(me.data.repairEvalue.fPreOperationID)



      //返回上一级页面
      wx.navigateBack({
        delta: 1,
      })

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