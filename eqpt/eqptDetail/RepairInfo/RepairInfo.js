// eqpt/eqptDetail/RepairInfo/RepairInfo.js
var baseurl = require('../../../config.js').requestUrl
var app = getApp()

var util = require('../../../util/util.js')
Page({     
          
  /**        
   * 页面的初始数据
   */ 
  data: {
    eqptRepairInfo: { fOperationDesc:"", fEqpID:"", fEqpCmpyID:""},
    array: ['运行报警', '资产故障', '严重事故'],
    index: 0,
    EqpImg:"",
    fOperationPosition:"",
    fID:"",
    btnStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
var me=this;

this.setData({
 "eqptRepairInfo.EqpImg": options.fEqpImg,
  "eqptRepairInfo.fEqpID": options.fEqpID,
  "eqptRepairInfo.fEqpCmpyID": options.fEqpCmpyID

})



 
    wx.setNavigationBarTitle({
      title: "报修 "+options.fEqpNum,
      success: function () {

      },
      fail: function (err) {

      }
    })
  },
  //获取地理位置
  openPosition:function(){
    var me=this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res)
        me.setData({
          fOperationPosition: JSON.stringify(res)
        })
  
   
      },
    })
  },
//
  bindPickerChange: function (e) {

    this.setData({
      index: e.detail.value,
      //  "income.inType": this.data.inTypeList[e.detail.value]
    })
  },
//获取报修备注内容
  fRepairRemark:function(e){
    this.setData({
      "eqptRepairInfo.fOperationDesc": e.detail.value
    })
  },
  //执行保存事件
  saveRepairInfo:function(){

    if (this.data.btnStatus == true) {
      return;
    }
    
    this.uploader = this.selectComponent("#uploader1");
    var me = this;
    var tempRows = [{
      fID:me.data.fID, recordState: "new", version: 0, fOpratorID: app.globalData.orgInfo.fPath.value, fOperatorCmpyID: app.globalData.orgInfo.fCmpyID.value,fEqpID: this.data.eqptRepairInfo.fEqpID,
      fEqpCmpyID: this.data.eqptRepairInfo.fEqpCmpyID, fOperationDesc: this.data.eqptRepairInfo.fOperationDesc, fOprationType: "故障报修", fOperationJson: "", fOperationImg: me.uploader.getFileList(), fProdMin: "", fProdCount: 0, fOperationPosition: me.data.fOperationPosition, fPreOperationID: "", fEqptStatus: this.data.array[this.data.index]}]
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
            fEqptStatus: me.data.array[me.data.index],

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

this.setData({
  fID: util.randString()
})
   

    
    var me = this;

      return {
        title:"查看报修详细",
        path: '/eqpt/eqptDetail/RepairInfo/checkRepairInfoDetail?fID=' + me.data.fID+'&flag='+'zf',
        success: function (res) {
          this.saveRepairInfo();
          wx.hideShareMenu({
          })
 
        },
        fail: function (res) {

          // 转发失败
        }
      }
    }



  
})