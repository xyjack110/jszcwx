// eqpt/eqptDetail/eqptRepair/repairDetail.js
var requestUrl = require('../../../config.js').requestUrl
var util = require('../../../util/util.js')
var app = getApp()
Page({

  /**  
   * 页面的初始数据        
   */        
  data: {
    repairDetail:{},
    imgList:[],
    repairInfoPsnID:"",
    EvalueFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    var me = this
    wx.request({//查询该资产的维修详细信息
      url: requestUrl + '/queryRepairDetail',
      method: "POST",
      data: {
        fID: options.fID,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        // if (res.data.repairDetail.rows[0].repairDeptFName.value == ".") {
      
        //   if (res.data.repairDetail.rows[0].repairfMyDept.value) {
        //     res.data.repairDetail.rows[0].repairDeptFName = res.data.repairDetail.rows[0].repairfCmpyName.value + "/" + res.data.repairDetail.rows[0].repairfMyDept.value + "/" + res.data.repairDetail.rows[0].repairInfoPsnName.value
        //     console.log(res.data.repairDetail.rows[0].repairDeptFName)

        //   } else {
        //     res.data.repairDetail.rows[0].repairDeptFName = res.data.repairDetail.rows[0].repairfCmpyName.value + "/" + res.data.repairDetail.rows[0].repairInfoPsnName.value
        //   }


        // } else {
      

        //   if (res.data.repairDetail.rows[0].repairfMyDept.value) {
        //     res.data.repairDetail.rows[0].repairDeptFName = res.data.repairDetail.rows[0].repairfCmpyName.value + "/" + me.getfDeptFName(res.data.repairDetail.rows[0].repairDeptFName.value) + "/" + res.data.repairDetail.rows[0].repairfMyDept.value + "/" + res.data.repairDetail.rows[0].repairInfoPsnName.value
        //   } else {
        //     res.data.repairDetail.rows[0].repairDeptFName = res.data.repairDetail.rows[0].repairfCmpyName.value + "/" + me.getfDeptFName(res.data.repairDetail.rows[0].repairDeptFName.value) + "/" + res.data.repairDetail.rows[0].repairfMyDept.value + "/" + res.data.repairDetail.rows[0].repairInfoPsnName.value
        //   }


        // }


 



        res.data.repairDetail.rows[0].fdate = res.data.repairDetail.rows[0].fOperationTime.value.substring(0, 10) + " " + res.data.repairDetail.rows[0].fOperationTime.value.substring(11, 19)
        me.setData({
          repairDetail: res.data.repairDetail.rows[0],
 
          imgList: res.data.repairDetail.rows[0].fOperationImg.value? res.data.repairDetail.rows[0].fOperationImg.value.split("@"):[],
        })

      }
    })

//查询出资产报修人ID

    wx.request({
      url: requestUrl + '/queryRepairInfoPsn',
      method: "POST",
      data: {
        fID: options.fID,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {






        me.setData({
          repairInfoPsnID: res.data.RepairInfoPsnID,


        })

//当前人为报修人才能给他评价
        if (app.globalData.orgInfo.fPath.value == me.data.repairInfoPsnID) {
          me.setData({
            EvalueFlag: true
          })
        } else {
          me.setData({
            EvalueFlag: false
          })
        }

      }
    })


  },

  //去掉部门全名称的前两个字符
  getfDeptFName: function (fDeptFName) {
    return fDeptFName.substring(2)
  },

  pageUpdate:function(fID){
    var me = this
    wx.request({
      url: requestUrl + '/queryRepairDetail',
      method: "POST",
      data: {
        fID: fID,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {





        res.data.repairDetail.rows[0].fdate = res.data.repairDetail.rows[0].fOperationTime.value.substring(0, 10) + " " + res.data.repairDetail.rows[0].fOperationTime.value.substring(11, 19)
        me.setData({
          repairDetail: res.data.repairDetail.rows[0],

          imgList: res.data.repairDetail.rows[0].fOperationImg.value ? res.data.repairDetail.rows[0].fOperationImg.value.split("@") : [],
        })

      }
    })

  },
  //跳到给出评价界面
  giveEvalue:function(){    

    var fID = this.data.repairDetail.fID.value;
    var fOpratorID = this.data.repairDetail.fOpratorID.value;
    var fOperatorCmpyID = this.data.repairDetail.fOperatorCmpyID.value;
    wx.navigateTo({ url: "/eqpt/eqptDetail/repairEvalue/repairEvalue?fID=" + fID + "&fOpratorID=" + fOpratorID + "&fOperatorCmpyID=" + fOperatorCmpyID })
  },




  openPosition: function () {
    var t = JSON.parse(this.data.repairDetail.fOperationPosition.value)
    wx.openLocation({
      latitude: t.latitude,
      longitude: t.longitude,
      scale: 28
    })

  },
  call: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: this.data.repairDetail.fCellphone.value,
      success: function () {
        console.log("成功拨打电话")
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