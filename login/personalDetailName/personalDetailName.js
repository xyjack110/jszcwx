// eqpt/mine/personalDetail/personalDetailName/personalDetailName.js
var baseurl = require('../../config.js').requestUrl
var XY = require('../../login/login.js').XY
var app = getApp()
Page({

  /**
   * 页面的初始数据    
   */
  
  data: {
    fPsnName:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({//得到前一个页面，传来的名字
      "fPsnName": options.fPsnName
    })

    wx.setNavigationBarTitle({
      title: "更换姓名",
      success: function () {

      },
      fail: function (err) {

      }
    })
  },
  inputChange: function (e) {//获取输入框的值

    this.setData({
      "fPsnName": e.detail.value
    })
  },

  updataNameBtn: function () {
    var me=this;
    var userInfo = { "fID": app.globalData.openid, "psnName": this.data.fPsnName}
    XY.saveUserInfo(userInfo, function (e) {
      console.log(e, "yyyy")
      app.globalData.userInfo.psnName.value = me.data.fPsnName
      var t = app.globalData.orgInfo.fName.value.split("/");
      t[t.length-1] = me.data.fPsnName;
     
      app.globalData.orgInfo.fName.value = t.join("/");
      var pages = getCurrentPages();
      for (var item in pages) {

        if (pages[item].globalDataRefresh)
          pages[item].globalDataRefresh()

      }

             //返回上一级页面


        wx.navigateBack({

        })


    })



    // wx.request({
    //   url: baseurl + '/psnChange',
    //   method: "POST",
    //   data: {
    //     fUserID: app.globalData.userInfo.userID,
    //     fPsnName: this.data.fPsnName



    //   },

    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     var pages = getCurrentPages();
    //     var prevPage = pages[pages.length - 2];  //上一个页面

    //     //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    //     // prevPage.setData({
    //     //   "userInfo.fPsnName": me.data.fPsnName,

    //     // })
     
    //     app.globalData.userInfo.fPsnName = me.data.fPsnName;
    //     prevPage.updatePage();
    //     //返回上一级页面


    //     wx.navigateBack({
          
    //     })
 

    //   }
    // })
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