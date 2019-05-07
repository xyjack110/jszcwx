// login/managerChange/managerChange.js
var XY = require('../login.js').XY
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {},
    dataAvilble: false,
    orgAvilble: false,
    showTopTips: false,
    sons: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

 var me=this;


    if (app.globalData.orgInfo.fID!=undefined){
      if (options.managerID != app.globalData.orgInfo.fID.value) {
        me.setData({
          orgAvilble: true

        })
      }
     
    }
    XY.XYLogin({
      "openid": app.globalData.openid, callback: function (data) {

        app.globalData.userInfo = data.userInfo
        app.globalData.orgInfo = data.orgInfo
        app.globalData.cmpyInfo = data.cmpyInfo
        app.globalData.openid = data.openid
        app.globalData.unionid = data.unionid


        console.log("XYLoginXYLogin")

        me.globalDataRefresh()




        if (app.globalData.orgInfo == undefined ||   options.managerID != app.globalData.orgInfo.fID.value) {
        
          me.setData({
            orgAvilble: true

          })
        }
    

        XY.queryOrgByPsnID(
          app.globalData.openid, function (data) {


            me.setData({
              sons: data.data.Mine.rows
            })

          }
        )

      }
    })
 

    this.setData({
      params: options
    })




    var start_str = (options.session).replace(/-/g, "/");//一般得到的时间的格式都是：yyyy-MM-dd hh24:mi:ss，所以我就用了这个做例子，是/的格式，就不用replace了。  
    var start_date = new Date(start_str);//将字符串转化为时间
    var end_date = new Date()
    if (start_date > end_date) {
      me.setData({
        dataAvilble: true
      })
    }



  },
  globalDataRefresh() {
    this.setData({
      "userInfo": app.globalData.userInfo,
      "orgInfo": app.globalData.orgInfo,
      "cmpyInfo": app.globalData.cmpyInfo,
      openid: app.globalData.openid
    })
  },

  addPsn: function (e) {
    
    var me = this;
    if (app.globalData.orgInfo == undefined){
      console.log("当前用户与管理员不是同一公司")
      return;
}
    XY.managerChange(me.data.params.managerID,  e.currentTarget.id, function (data) {
      if (data.data.result == "success") {


        wx.reLaunch({
          url: '/eqpt/mine/mine',
        })
      }else{
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
    var str = "?";
    for (var key in this.data.params) {
      str = str + key + '=' + this.data.params[key] + '&'


    }
    str = str.substring(0, str.length - 1)
    console.log(str, "strstr")
    return {
      title: '顶级权限交接',
      path: 'login/managerChange/managerChange' + str
    }


  }
})