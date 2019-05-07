// eqpt/eqptDetail/eqptScrap/eqptScrap.js

var baseurl = require('../../../config.js').requestUrl
var app = getApp()
var util = require('../../../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {   
    eqptScrap: { fOperationDesc: "", fEqpID: "", fEqpCmpyID: "" },
    array: ['使用年限过长，功能丧失', '严重破损无法修复', '技术指标达不到生产要求','其他原因'],
    index: 0,
    EqpImg: "",
    btnStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this;

    this.setData({
      "eqptScrap.EqpImg": options.fEqpImg,
      "eqptScrap.fEqpID": options.fEqpID,
      "eqptScrap.fEqpCmpyID": options.fEqpCmpyID

    })




    wx.setNavigationBarTitle({
      title: "报废 " + options.fEqpNum,
      success: function () {

      },
      fail: function (err) {

      }
    })
  },

  openPosition: function () {
    
    var me = this;
    wx.chooseLocation({
      success: function (res) {
    
        console.log(res,"成功")
        me.setData({
          fOperationPosition: JSON.stringify(res)
        })
    

      }, fail: function (res) {
      
        console.log(res, "时报")
        wx.openSetting({
          success(res) {
        
          },
          fail: function (res) {
     
          }
        })

      }
    })
  },



  bindPickerChange: function (e) {

    this.setData({
      index: e.detail.value,
      //  "income.inType": this.data.inTypeList[e.detail.value]
    })
  },

  fRepairRemark: function (e) {
    this.setData({
      "eqptScrap.fOperationDesc": e.detail.value
    })
  },
  saveBtn: function () {


    if (this.data.btnStatus == true) {
      return;
    }



    var me = this;
  
          wx.showModal({
            title: "严重警告",
            content: "资产报废后，只能查询该资产的相关记录，且报废操作不可恢复,是否确认报废该资产？",
            showCancel: "取消",
            confirmText: "确定",
              success: function (res) {
              if (res.confirm) {
                me.uploader = me.selectComponent("#uploader1");
            
                var tempRows = [{
                  fID: util.randString(), recordState: "new", version: 0, fOpratorID: app.globalData.orgInfo.fPath.value, fOperatorCmpyID: app.globalData.orgInfo.fCmpyID.value, fEqpID: me.data.eqptScrap.fEqpID,
                  fEqpCmpyID: me.data.eqptScrap.fEqpCmpyID, fOperationDesc: me.data.eqptScrap.fOperationDesc, fOprationType: "资产报废", fOperationJson: "", fOperationImg: me.uploader.getFileList(), fProdMin: "", fProdCount: 0, fOperationPosition: me.data.fOperationPosition, fPreOperationID: "", fEqptStatus: me.data.array[me.data.index]
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
                        fEqpID: me.data.eqptScrap.fEqpID,
                        fEqptStatus: "资产报废"
                      },
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      success: function (res) {

                        var pages = getCurrentPages();
                        var prevPage = pages[pages.length - 2];  //上一个页面


                        prevPage.pageUpdate(me.data.eqptScrap.fEqpID)

                        //返回上一级页面
                        wx.navigateBack({
                          delta: 1,
                        })

                      }
             

                    })



              

                  }

                })


              } else if (res.cancel) {
                console.log('用户点击取消')
              }
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