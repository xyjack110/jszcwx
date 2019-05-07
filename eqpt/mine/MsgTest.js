//const templateMessageUrl = require('../../config.js').templateMessageUrl

const templateMessageUrl = "https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=" 
var app = getApp()
var baseurl = require('../../config.js').requestUrl


Page({
  onLoad: function () {
    this.miniCode()

  },

  miniCode: function () {
    var me = this;
    wx.request({
      url: baseurl + '/qureyToken',
      method: "POST",
      data: {

      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

me.setData({

  token: res.data.token
})
      }
    })
  },

  submitForm: function (e) {
    console.log("ffff")
    console.log(e.detail.formId)
    var self = this
    var form_id = e.detail.formId
    var formData = e.detail.value
    var openid = app.globalData.userInfo.userID
    console.log('form_id is:', form_id)

    self.setData({
      loading: true
    })


        wx.request({
          url: templateMessageUrl + this.data.token,
          method: 'POST',
          data: {
            "touser": openid,
            "template_id": "7n6K00d6Db2PoBlp0IDZVjNUrO6iYWEsnn5gc6-TyTU",
            "page": "eqpt/mine/minePay",
            "form_id": form_id,
            "data": {
              "keyword1": {
                "value": "鱼熊企管咨询"
              },
              "keyword2": {
                "value": "2018年07月23日"
              },
              "keyword3": {
                "value": "笔记本电脑"
              },
              "keyword4": {
                "value": "1234567"
              }
            },
            "emphasis_keyword": "keyword1.DATA"
          },
          success: function (res) {
            console.log('submit form success', res)
            wx.showToast({
              title: '发送成功',
              icon: 'success'
            })
            self.setData({
              loading: false
            })
          },
          fail: function ({ errMsg }) {
            console.log('submit form fail, errMsg is:', errMsg)
          }
        })

  }
})


