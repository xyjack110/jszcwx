// eqpt/eqptDetail/eqptUse/eqptUse.js
var baseurl = require('../../../config.js').requestUrl
var app = getApp()
var util = require('../../../util/util.js')
Page({
     
  /**
   * 页面的初始数据       
   */
  data: {
    eqptUse: { fOperationDesc: "", fEqpID: "", fEqpCmpyID: "" },
    fEqpNum:"",
    array: ['运行正常', '检查异常'],
    index: 0,
    btnStatus: false,
 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var me = this;
   
    // wx.request({
    //   url: requestUrl + '/queryNoInventoryRecord',
    //   method: "POST",
    //   data: {
    //     fEqpID: fEqpID,

    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {




    //     me.setData({
    //       currentInventory: (res.data.rows.length > 0 ? res.data.rows[0] : [])
    //     })





    //   }
    // })
    
    wx.request({//查询当前资产的详细信息
      url: baseurl + '/queryOrg',
      method: "POST",
      data: {
        filter: "fPath='" + options.fEqpOperatiorID + "'",

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        console.log(res.data.rows[0].fName.value)    
       var fName= res.data.rows[0].fName.value
       //拿到公司名字,人员名字，负责部门
        var t=fName.split("/");
       var psnName= t[t.length - 1]
        var fMyDept = t[t.length - 2]
        t.length=t.length-1
        me.setData({
          "eqptUse.EqpImg": options.fEqpImg,
          "eqptUse.fEqpID": options.fEqpID,
          "eqptUse.fEqpCmpyID": options.fEqpCmpyID,
          fEqpNum: options.fEqpNum,
          fEqpOperatiorID: options.fEqpOperatiorID,
          fOperatorCmpyID: options.fOperatorCmpyID,
          fCmpyName: t[0],
          fDeptFName: t.join("/"),
          fMyDept: fMyDept,
          fPsnName: psnName
        })
   


      }
    })

 
   

    wx.setNavigationBarTitle({
      title: "资产编号 " + options.fEqpNum,
      success: function () {

      },
      fail: function (err) {

      }
    })
  },

  bindPickerChange: function (e) {



    this.setData({
      index: e.detail.value,

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

  fEqptUseRemark:function(e){

    this.setData({
      "eqptUse.fOperationDesc": e.detail.value
    })
  },
  //去掉部门全名称的前两个字符
  getfDeptFName: function (fDeptFName) {
    return fDeptFName.substring(2)
  },
  saveBtn:function(){
    var fDeptName = ""; 
    var fReceiverDeptName = "";
   var other={};
    var other1 = {};
    var me = this;
    if (this.data.btnStatus == true) {
      return;
    }

    
    other.deptName = me.data.fDeptFName
    other.fPsnName = me.data.fPsnName


    var fName = app.globalData.orgInfo.fName.value
    //拿到公司名字
    var t = fName.split("/");

    t.length = t.length - 1
    other1.deptName = t.join("/")
    other1.fPsnName = app.globalData.userInfo.psnName.value

    this.uploader = this.selectComponent("#uploader1");

    var tempRows = [{
      fID: util.randString(), recordState: "new", version: 0, fOpratorID: app.globalData.orgInfo.fPath.value, fOperatorCmpyID: app.globalData.orgInfo.fCmpyID.value, fEqpID: this.data.eqptUse.fEqpID,
      fEqpCmpyID: this.data.eqptUse.fEqpCmpyID, fOperationDesc: this.data.eqptUse.fOperationDesc, fOprationType: "领用资产", fOperationJson: JSON.stringify(other), fOperationImg: me.uploader.getFileList(), fProdMin: "", fProdCount: 0, fOperationPosition: me.data.fOperationPosition, fPreOperationID: "", fEqptStatus: this.data.array[this.data.index]
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
            fEqpID: me.data.eqptUse.fEqpID,
            fEqptStatus: me.data.array[me.data.index],
           
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log("updateEqpStatus")
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];  //上一个页面
            if (prevPage.pageUpdate) {

              prevPage.pageUpdate(me.data.eqptUse.fEqpID)
            }


            //返回上一级页面
            wx.navigateBack({
              delta: 1,
            })
          }

        })
        var tempRows1 = [{
          fID: util.randString(), recordState: "new", version: 0, fOpratorID: me.data.fEqpOperatiorID, fOperatorCmpyID: me.data.fOperatorCmpyID, fEqpID: me.data.eqptUse.fEqpID,
          fEqpCmpyID: me.data.eqptUse.fEqpCmpyID, fOperationDesc: me.data.eqptUse.fOperationDesc, fOprationType: "转出资产", fOperationJson: JSON.stringify(other1), fOperationImg: me.uploader.getFileList(), fProdMin: "", fProdCount: 0, fOperationPosition: me.data.fOperationPosition, fPreOperationID: "", fEqptStatus: me.data.array[me.data.index],
        }]

        wx.request({
          url: baseurl + '/saveEqp_operation',
          method: "POST",
          data: { tables: util.conWx2Table(tempRows1, "eqp_operation", "Integer,String,String,String,String,String,String,String,String,String,integer,String,String,String") },


          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log("saveEqp_operation1")

          }

        })



        wx.request({
          url: baseurl + '/updateEqpOperatiorID',
          method: "POST",
          data: {
            fEqpID: me.data.eqptUse.fEqpID,
            fOpratorID:app.globalData.orgInfo.fPath.value,
 
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log("updateEqpOperatiorID")
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];  //上一个页面
            if (prevPage.pageUpdate) {



              prevPage.pageUpdate(me.data.eqptUse.fEqpID)
            }


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
  
  }
})