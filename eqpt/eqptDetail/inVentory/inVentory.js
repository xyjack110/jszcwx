// eqpt/eqptDetail/inVentory/inVentory.js
var requestUrl = require('../../../config.js').requestUrl
var app = getApp()
var util = require('../../../util/util.js')
Page({
     
  /**
   * 页面的初始数据
   */
  data: {
    fID:"",
  inventory:{},   
  array: ['运行正常', '检查异常'],
  index: 0,
  fEqpImg:"",
  fOperationPosition: "",
  btnStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

this.setData({
  fID:options.fID ,
  fEqpImg: options.fEqpImg
})
var me = this;
wx.request({
  url: requestUrl + '/queryEqp_operation',
  method: "POST",
  data: {
    filter: "fID='" + options.fID + "'",

  },
  header: {
    'content-type': 'application/json' // 默认值
  },
  success: function (res) {

    me.setData({
      inventory: res.data.rows[0]

    })

    
  }
})

  },
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
  bindPickerChange: function (e) {
   


    this.setData({
      index: e.detail.value,

    })
  },
  fCheckRemark: function (e) {
    this.setData({
      "inventory.fOperationDesc": { value: e.detail.value}
    })
  },
  saveCheckBtn: function () {

    if (this.data.btnStatus == true) {
      return;
    }


    //算出时差,并转换为毫秒：
    var offset = new Date().getTimezoneOffset() * 60 * 1000;
    //算出现在的时间：
    var nowDate = new Date().getTime();
    //算出对应的格林位置时间
    var GMTDate = new Date(nowDate - offset);//Wed Apr 20 2016 22:27:02 GMT+0800 (CST)

   
  
    this.uploader = this.selectComponent("#uploader1");
    var FileListString = ""
    if (this.uploader) {
      FileListString = this.uploader.getFileList()
    }
    var me = this;
    var tempRows = [{
      fID: this.data.fID, recordState: "edit", version: 0, fOpratorID: app.globalData.orgInfo.fPath.value, fOperatorCmpyID: app.globalData.orgInfo.fCmpyID.value, 
      fOperationDesc: (this.data.inventory.fOperationDesc ? this.data.inventory.fOperationDesc.value : ""), fOperationImg: FileListString, fOperationPosition: this.data.fOperationPosition, fEqptStatus: this.data.array[this.data.index], fOperationTime: GMTDate
    }]
    wx.request({
      url: requestUrl + '/saveEqp_operation',

      method: "POST",
      data: { tables: util.conWx2Table(tempRows, "eqp_operation", "Integer,String,String,String,String,String,String,DateTime") },


      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        wx.request({
          url: requestUrl + '/updateEqpStatus',
          method: "POST",
          data: {
            fEqpID: me.data.inventory.fEqpID.value,
            fEqptStatus: me.data.array[me.data.index]
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {


          }

        })



         var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];  //上一个页面


            prevPage.pageUpdate(me.data.inventory.fEqpID.value)

   

         //返回上一级页面
            wx.navigateBack({
              delta: 1,
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