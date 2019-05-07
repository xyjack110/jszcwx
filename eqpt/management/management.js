
// eqpt/management/management.js
var app = getApp()
var baseurl = require('../../config.js').requestUrl
var util = require('../../util/util.js')
var downloadExampleUrl = require('../../config.js').downloadExampleUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    compPsnNum: 0,
    compEqptNum: 0,
    displayEqpt: false,
    displayPsn: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var me = this;
    //查看公司人数和资产数
    wx.request({
      url: baseurl + '/queryCompPsnNum',
      method: "POST",
      data: {

        fCmpyID: app.globalData.orgInfo.fCmpyID.value,
      },

      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {

        me.setData({
          compPsnNum: res.data.compPsnNum,
          compEqptNum: res.data.compEqptNum,
          intoEqptNum: res.data.intoEqptNum,
          ScrapEqptNum: res.data.ScrapEqptNum,
        })

      }
    })
    
   // if ((app.globalData.userInfo.userID == app.globalData.cmpyInfo.fManagerID) && app.globalData.userInfo.fCmpyID) {
  //
    if (app.globalData.orgInfo && (app.globalData.orgInfo.fAuth.value.indexOf("资产管理员") >= 0 || app.globalData.orgInfo.fAuth.value.indexOf("部门查询") >= 0)) {
      this.setData({
        displayEqpt: true,
        displayPsn: true,
      })
    }

    if (app.globalData.userInfo.fPsnAuth) {
      if (app.globalData.userInfo.fPsnAuth.indexOf("资产管理") != -1) {
        this.setData({

          displayEqpt: true,
        })
      }
      if (app.globalData.userInfo.fPsnAuth.indexOf("人员管理") != -1) {
        this.setData({

          displayPsn: true,
        })
      }

    }

  },
  //下载资产操作记录事件
  DownLoadEqptOprationRecord: function() {

    var me = this;


 

        var currentdate = util.getNowFormatDate()


          wx.showLoading({
            title: '加载中',
          })

          wx.request({
            url: baseurl + '/DownLoadEqptOprationRecord',
            method: "POST",
            data: {
              fCmpyID: app.globalData.orgInfo.fCmpyID.value,

            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function(res) {
              wx.hideLoading()
              if (res.data.flag && res.data.flag == "成功") {

                me.downLoadFile()

              }


            }
          })

       

    


  },

  //执行下载人员操作事件
  DownLoadPsnOprationRecord: function() {
    var me = this;


    

      


          wx.showLoading({
            title: '加载中',
          })

          wx.request({
            url: baseurl + '/DownLoadPsnOprationRecord',
            method: "POST",
            data: {
              fCmpyID: app.globalData.orgInfo.fCmpyID.value,

            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function(res) {
              wx.hideLoading()
              if (res.data.flag && res.data.flag == "成功") {

                me.downLoadPsnFile()

              }
              console.log(res)

            }
          })

        

  

  },

  downLoadFile: function() {

    wx.downloadFile({


      url: downloadExampleUrl + "/eqptOprationRecord/" + app.globalData.orgInfo.fCmpyID.value + ".xls",
      success: function(res) {

        wx.openDocument({
          filePath: res.tempFilePath,
          success: function(res) {
            console.log(res, "成功")



          },
          fail: function(res) {
            console.log(res, "失败")
          },
        })
      },
      fail: function(res) {
        console.log(res, "失败")
      },
    })

  },
  //下载人员操作记录
  downLoadPsnFile: function() {

    wx.downloadFile({


      url: downloadExampleUrl + "/psnOprationRecord/" + app.globalData.orgInfo.fCmpyID.value + ".xls",
      success: function(res) {

        wx.openDocument({
          filePath: res.tempFilePath,
          success: function(res) {
            console.log(res, "成功")



          },
          fail: function(res) {
            console.log(res, "失败")
          },
        })
      },
      fail: function(res) {
        console.log(res, "失败")
      },
    })

  },


  eqptRepairReport: function() {
    wx.navigateTo({
      url: '/eqpt/management/eqptRepairReport/eqptRepairReport'
    })
  },
  eqptUseReport: function() {
    wx.navigateTo({
      url: '/eqpt/management/eqptUseReport/eqptUseReport'
    })
  },
  compatyEqptReport: function() {
    wx.navigateTo({
      url: '/eqpt/management/compatyEqptReport/compatyEqptReport'
    })
  },


  workRecordList: function() {
    wx.navigateTo({
      url: '/eqpt/management/workRecordList/workRecordList'
    })
  },
  orgPerson: function() {
    wx.navigateTo({
      url: '/eqpt/management/orgPerson/orgPerson'
    })
  },
  CompatyEqptFiles: function() {
    wx.navigateTo({
      url: '/eqpt/management/CompatyEqptFiles/CompatyEqptFiles'
    })
  },
  EqptIntoFiles: function () {
    wx.navigateTo({
      url: '/eqpt/management/EqptIntoFiles/EqptIntoFiles'
    })
  },

  ScrapFiles: function () {
    wx.navigateTo({
      url: '/eqpt/management/ScrapFiles/ScrapFiles'
    })
  },
  checkList: function() {
    wx.navigateTo({
      url: '/eqpt/management/checkList/checkList'
    })
  },
  employeesUseEqptRecord: function() {
    wx.navigateTo({
      url: '/eqpt/management/employeesUseEqptRecord/employeesUseEqptRecord'
    })
  },
  employeesRepairEqptRecord: function() {
    wx.navigateTo({
      url: '/eqpt/management/employeesRepairEqptRecord/employeesRepairEqptRecord'
    })
  },
  companySet: function() {
    wx.navigateTo({
      url: '/eqpt/management/companySet/companySet'
    })

  },
  checkSet: function() {
    wx.navigateTo({
      url: '/eqpt/management/checkSet/checkSet?fCompanyID=' + app.globalData.orgInfo.fCmpyID.value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})