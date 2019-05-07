// eqpt/mine/minePay.js
var baseurl = require('../../config.js').requestUrl
var util = require('../../util/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  requestPayment:function(){
var me=this;
    wx.showModal({
      title: '支付提示',
      content: '5万元，创建公司（现场指导，用户培训,一年数据清单下载）',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')

          wx.request({
            url: baseurl + '/wxPay',
            data: {
              openid: app.globalData.userInfo.userID,
              out_trade_no: "12345692",
              total_fee: "1",
              body: "鱼熊企管咨询"
            },
            method: 'GET',
            success: function (res) {

              console.log(res);
              me.doWxPay(res.data.response);
            }
          })
   


        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })



  },

  doWxPay(param) {
    //小程序发起微信支付
    wx.requestPayment({
      timeStamp: param.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
      nonceStr: param.nonceStr,
      package: param.package,
      signType: 'MD5',
      paySign: param.paySign,
      success: function (event) {
        // success   
        console.log(event);



        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail: function (error) {
        // fail   
        console.log("支付失败")
        console.log(error)
      },
      complete: function () {

        // complete   
        console.log("pay complete")
      }
    });
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