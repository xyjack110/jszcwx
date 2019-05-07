// eqpt/eqptDetail/workload/workload.js

var baseurl = require('../../../config.js').requestUrl
var app = getApp()

var util = require('../../../util/util.js')
Page({
         
  /**        
   * 页面的初始数据
   */
  data: {
    array: ['运行正常','运行报警', '资产故障', '严重事故'],
    index: 0,

    array1: ['个', '米', '公里','升'],
    index1: 0,
    eqptRepairInfo: { fOperationDesc: "", fEqpID: "", fEqpCmpyID: "" },
fPsnName:"",
   fPsnImg: "",
   fProdCount:0,
   fWorkTime:0,
    fOperationPosition: "",

    btnStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this;
    
    this.setData({
      "eqptRepairInfo.EqpImg": options.fEqpImg,
      "eqptRepairInfo.fEqpID": options.fEqpID,
      "eqptRepairInfo.fEqpCmpyID": options.fEqpCmpyID,
      fPsnImg: app.globalData.userInfo.avatarUrl.value,
      fPsnName: app.globalData.userInfo.psnName.value,
    })




    wx.setNavigationBarTitle({
      title: "报修 " + options.fEqpNum,
      success: function () {

      },
      fail: function (err) {

      }
    })
  },

  bindPickerChange: function (e) {

    this.setData({
      index: e.detail.value,
      //  "income.inType": this.data.inTypeList[e.detail.value]
    })
  },

  bindChange: function (e) {

    this.setData({
      index1: e.detail.value,
      //  "income.inType": this.data.inTypeList[e.detail.value]
    })
  },
  //获取地理位置
  openPosition: function () {
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

  bindWorkNumChange:function(e){

    this.setData({
      fProdCount: e.detail.value
    })

  },
  bindWorkTime: function (e) {

    this.setData({
      fWorkTime: e.detail.value
    })

  },


  //获取报修备注内容
  fRepairRemark: function (e) {
  
    this.setData({
      "eqptRepairInfo.fOperationDesc": e.detail.value
    })
  },
  //执行保存事件
  saveRepairInfo: function () {

    if (this.data.btnStatus == true) {
      return;
    }

    this.uploader = this.selectComponent("#uploader1");
    var me = this;
    var tempRows = [{
      fID: util.randString(), recordState: "new", version: me.data.fWorkTime, fOpratorID: app.globalData.orgInfo.fPath.value, fOperatorCmpyID: app.globalData.orgInfo.fCmpyID.value, fEqpID: this.data.eqptRepairInfo.fEqpID,
      fEqpCmpyID: this.data.eqptRepairInfo.fEqpCmpyID, fOperationDesc: this.data.eqptRepairInfo.fOperationDesc, fOprationType: "工作录入", fOperationJson: "", fOperationImg: me.uploader.getFileList(), fProdMin: this.data.array1[this.data.index1], fProdCount: me.data.fProdCount, fOperationPosition: me.data.fOperationPosition, fPreOperationID: "", fEqptStatus: this.data.array[this.data.index]
    }]
    wx.request({
      url: baseurl + '/saveEqp_operation',
      method: "POST",
      data: { tables: util.conWx2Table(tempRows, "eqp_operation", "Integer,String,String,String,String,String,String,String,String,String,integer,String,String,String") },


      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        wx.request({
          url: baseurl + '/updateEqpStatus',
          method: "POST",
          data: {
            fEqpID: me.data.eqptRepairInfo.fEqpID,
            fEqptStatus: me.data.array[me.data.index]
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {

            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];  //上一个页面


            prevPage.pageUpdate(me.data.eqptRepairInfo.fEqpID)
            //返回上一级页面
            wx.navigateBack({
              delta: 1,
            })

          }



        })


          // var pages = getCurrentPages();
          //   var prevPage = pages[pages.length - 2];  //上一个页面


          //   prevPage.pageUpdate(me.data.eqptRepairInfo.fEqpID)
          //   //返回上一级页面
          //   wx.navigateBack({
          //     delta: 1,
          //   })


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