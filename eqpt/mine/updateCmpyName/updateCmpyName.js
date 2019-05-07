

var baseurl = require('../../../config.js').requestUrl
var app = getApp()
Page({

  data: {
    fCmpyName: "",
    focus: false
  },

  onLoad: function (options) {

    this.setData({//得到前一个页面，传来的部门名字
      fDeptName: app.globalData.userInfo.fCmpyName

    })


    wx.setNavigationBarTitle({
      title: "公司改名",
      success: function () {

      },
      fail: function (err) {

      }
    })
  },



  Cancel: function () {//取消返回上一层
    wx.navigateBack()

  },


  okBtn: function () {
    var me = this;
  
    if (this.data.fCmpyName) {//判断该公司是否存在，要求公司必填
      wx.request({
        url: baseurl + '/updateCmpyName',
        method: "POST",
        data: {

          fCmpyName: me.data.fCmpyName,
          fCmpyID: app.globalData.userInfo.fCmpyID

        },

        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {


  
          app.globalData.cmpyInfo.fCmpyName = me.data.fCmpyName;
          app.globalData.userInfo.fCmpyName = me.data.fCmpyName;
       

          //返回上一级页面
          wx.navigateBack({

          })
      
        }
      })
    

    } else {//如果名称为空，要求必填
      var me = this;
      wx.showModal({
        title: '信息提示',
        content: '公司名称必填,并且长度不能超过5个字',
        showCancel: false,
        success: function (res) {
          me.setData({
            "focus": true
          })
        }
      })
    }



  },
  fInputChange: function (e) {//当输入框值改变时，给data赋值
    this.setData({
      "fCmpyName": e.detail.value
    })
  },
});