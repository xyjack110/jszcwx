// eqpt/mine/transferAuth/transferAuth.js

var baseurl = require('../../../config.js').requestUrl

var app = getApp()
Page({

  /**
   * 页面的初始数据            
   */
  data: {
    options: {},
    isLoading: true,
    btnStatus: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this;
    wx.request({
      url: baseurl + '/queryEqp_person',
      method: "POST",
      data: {
        filter: "fPsnID='" + (options.userID || options.scene) + "'",

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        me.setData({
          "options": {
            fCmpyName: res.data.rows[0].fCmpyName.value,
            fPsnID: res.data.rows[0].fPsnID.value

          },
          isLoading: false
        })




      }
    })



    app.getUserFromDB(function (mark) {


      console.log("拿到了用户信息")



    })







  },
  returnMainPage: function () {//返回首页
    wx.reLaunch({
      url: '/eqpt/mine/mine',
    })
  },
  okBtn: function () {

    if (this.data.btnStatus == true) {
      return;
    }
    this.setData({
      btnStatus: true
    })


    if (this.data.isLoading) {
      return;
    } else {
      this.setData({
        isLoading: true
      })
    }


    var me = this;
    app.getUserInfo(function (mark, result) {

      if (mark == '失败') {


        wx.showModal({
          title: '用户已拒绝授权',
          content: '重新打开权限,请点击关于设备管理系统/设置/开启授权',
          showCancel: false,
          success: function (res) {
            wx.navigateBack({
              delta: 1,
            })
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })


      } else {



        //如果为老用户，在数据库中，更改当前用户的上级部门


        setTimeout(function () {
          wx.request({
            url: baseurl + '/transferManagerAuth',
            method: "POST",
            data: {
              fReceiverID: app.globalData.userInfo.userID,
              fSenderID: me.data.options.fPsnID

            },

            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {

              if (res.data.msg == "success") {


                wx.showToast({
                  title: '权利移交成功',
                  mask: true,


                })

                
        

              } else if (res.data.msg == "failCmpy"){

                wx.showModal({
                  title: '信息提示',
                  content: res.data.failCmpy,
                  showCancel: false,
                })
                me.setData({
                  isLoading: false
                })
                return;
              }else{
                wx.showModal({
                  title: '信息提示',
                  content: res.data.failManager,
                  showCancel: false,
                })
                me.setData({
                  isLoading: false
                })
                return;

              }

              setTimeout(function () {
                //返回首页页面
                wx.reLaunch({
                  url: '/eqpt/mine/mine',
                })
              }, 500)

          
              me.setData({
                isLoading: false
              })


            }
          })
        }, 1500)








      }
    });





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