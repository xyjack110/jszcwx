// login/updateDept/updateDept.js
var baseurl = require('../../config.js').requestUrl
var XY = require('../../login/login.js').XY
var app = getApp()
Page({

  /**
   * 页面的初始数据    
   */

  data: {
    showTopTips:false,
    fDeptName:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({//得到前一个页面，传来的名字
      "orgID": options.orgID,
      "fDeptName": options.fName
    })

 
  },
  inputChange: function (e) {//获取输入框的值

    this.setData({
      "fDeptName": e.detail.value
    })
  },

  updataNameBtn: function () {
    var me = this;



    XY.updateDept(app.globalData.orgInfo.fID.value, this.data.orgID, this.data.fDeptName, function (data) {
      
      if (data.data.result == "fail") {
        me.setData({
          showTopTips: true,
          ErrorMsg: data.data.errMsg

        });
        setTimeout(function () {
          me.setData({
            showTopTips: false
          });
        }, 3000);
        return;
      }
      var pages = getCurrentPages();
      pages[pages.length - 2].onLoadSons();
      for (var i = 0; i < pages.length;i++){
        if (pages[i].globalDataRefresh){
          pages[i].globalDataRefresh();
        }
      }


      wx.navigateBack();

    })


  
    // var userInfo = { "fID": app.globalData.openid, "psnName": this.data.fDeptName }
    // XY.saveUserInfo(userInfo, function (e) {
    //   console.log(e, "yyyy")
    //   app.globalData.userInfo.psnName.value = me.data.fDeptName
    //   var t = app.globalData.orgInfo.fName.value.split("/");
    //   t[t.length - 1] = me.data.fDeptName;

    //   app.globalData.orgInfo.fName.value = t.join("/");
    //   var pages = getCurrentPages();
    //   for (var item in pages) {

    //     if (pages[item].globalDataRefresh)
    //       pages[item].globalDataRefresh()

    //   }

    //   //返回上一级页面


    //   wx.navigateBack({

    //   })


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