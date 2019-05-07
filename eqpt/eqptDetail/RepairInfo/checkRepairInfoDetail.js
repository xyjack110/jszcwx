// eqpt/eqptDetail/RepairInfo/checkRepairInfoDetail.js
var requestUrl = require('../../../config.js').requestUrl
var util = require('../../../util/util.js')
var app = getApp()
Page({
               
  /**            
   * 页面的初始数据
   */
  data: {
  repairList:[],
repairInfo:{},
    imgList:[],

    repairInfoPsnID:"",
    Flag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

   
//     if (options.flag=='zf'){
// this.setData({
//   readOnly:true
// })
// }
	// 查询我的报修记录详细（报修信息，资产信息，和相关维修记录信息）
    var me = this
    wx.request({    
      url: requestUrl + '/queryRepairInfoDetail',
      method: "POST",
      data: {
        fID: options.fID,
    
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        me.setData({
          repairInfoPsnID: res.data.repairInfo.rows[0].fOpratorID.value,


        })


        if (app.globalData.orgInfo.fPath.value == me.data.repairInfoPsnID) {
          me.setData({
            Flag: true
          })
        } else {
          me.setData({
            Flag: false
          })
        }


        for (var i = 0; i < res.data.repair.rows.length; i++) {//截取时间字符串
       
          res.data.repair.rows[i].fdate = res.data.repair.rows[i].fOperationTime.value.substring(0, 10) 
    

        }





        res.data.repairInfo.rows[0].fdate = res.data.repairInfo.rows[0].fOperationTime.value.substring(0, 10) + " " + res.data.repairInfo.rows[0].fOperationTime.value.substring(11, 19)
        if (res.data.repairInfo.rows[0].fOperationTime2.value){
          res.data.repairInfo.rows[0].fcloseDate = res.data.repairInfo.rows[0].fOperationTime2.value.substring(0, 10) + " " + res.data.repairInfo.rows[0].fOperationTime2.value.substring(11, 19)
}else{
          res.data.repairInfo.rows[0].fcloseDate = ""
}
   
       me.setData({
         repairInfo:res.data.repairInfo.rows[0],
             repairList: res.data.repair.rows,
             imgList: res.data.repairInfo.rows[0].fOperationImg.value?res.data.repairInfo.rows[0].fOperationImg.value.split("@"):[],
       })
  
      }
    })
  },
//跳转到维修的详细信息
  repairDetail:function(e){

 
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/eqpt/eqptDetail/eqptRepair/repairDetail?fID=' +e.currentTarget.id
    })
  },
//获取位置信息
  openPosition:function(){
    var t = JSON.parse(this.data.repairInfo.fOperationPosition.value)  
    wx.openLocation({
      latitude: t.latitude,
      longitude: t.longitude,
      scale: 28
    })

  },
  //拨打电话
  call:function(){
    var that = this
    wx.makePhoneCall({
      phoneNumber: this.data.repairInfo.fCellphone.value,
      success: function () {
        console.log("成功拨打电话")
      }
    })
  },
//关闭报修单
  closeRepairInfo:function(){
  


   var me = this;
   var tempRows = [{
     fID: this.data.repairInfo.fID.value, recordState: "edit", fOperationTime2: util.dateTimeToString(new Date())
   }]
   wx.request({
     url: requestUrl+ '/saveEqp_operation',
     method: "POST",
     data: { tables: util.conWx2Table(tempRows, "eqp_operation","String,String,dateTime") },


     header: {
       'content-type': 'application/json' // 默认值
     },
     success: function (res) {
       var pages = getCurrentPages();
       var prevPage = pages[pages.length - 2];  //上一个页面
       if (prevPage.pageUpdate){
         prevPage.pageUpdate(me.data.repairInfo.fEqpID.value)
}

    
       //返回上一级页面
       wx.navigateBack({
         delta: 1,
       })

     }

   })

//关闭报修单成功之后，修改资产状态
   wx.request({
     url: requestUrl + '/updateEqpStatus',
     method: "POST",
     data: {
       fEqpID: me.data.repairInfo.fEqpID.value,
       fEqptStatus: '运行正常'
     },
     header: {
       'content-type': 'application/json' // 默认值
     },

   })




  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("dddddhhhhh")
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