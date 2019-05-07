// login/joinUS/joinUS.js
var XY = require('../login.js').XY
var app = getApp()
var homePage = require('../../config.js').homePage  
var requestUrl = require('../../config.js').requestUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params:{},
    dataAvilble:false,
    orgAvilble:false,
    showTopTips: false
  },
  miniCode: function (str) {
    var me = this;
    // var paramsArr = str.split("&");
    console.log(str.deptID +"paramsArrparamsArr")
    wx.request({
      url: requestUrl + '/qureyToken',
      method: "POST",
      data: {

      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // wx.navigateTo({ url: '/login/joinUS/joinUS?imgsrc=' + app.globalData.userInfo.avatarUrl.value + '&managerName=' + app.globalData.orgInfo.fName.value + '&deptID=' + me.data.current.fID.value + '&deptName=' + me.data.current.fName.value + '&managerID=' + app.globalData.orgInfo.fID.value + '&session=' + clock })
        wx.request({
          url: requestUrl + '/getQRcode',
          method: "POST",
          data: {
            fun: "joinUs1",
            userID: app.globalData.openid,
            deptID: str.deptID,
            managerID:str.managerID,
            token: res.data.token,
            page: "login/joinUsCode/joinUsCode"//""
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (op) {

            me.setData({
              src: op.data.src
            })

          }
        })


      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // var str = "?";
    // for (var key in options) {
    //   str = str + key+ options[key] + '&'


    // }
    // str = str.substring(1, str.length - 1)
    // console.log(str, "strstr")


    this.miniCode(options);

    console.log(options,"params1111")
    var me=this;
    XY.XYLogin({
      "openid": app.globalData.openid, callback: function (data) {
  
        app.globalData.userInfo = data.userInfo
        app.globalData.orgInfo = data.orgInfo
        app.globalData.cmpyInfo = data.cmpyInfo
        app.globalData.openid = data.openid
        app.globalData.unionid = data.unionid
      

        me.globalDataRefresh()

        XY.checkPsnInDept(
          options.deptID, app.globalData.openid,  function (data) {
          
            console.log("num", data.data.num)
            if (data.data.num<1){
me.setData({
  orgAvilble:true
})
            }
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
dataAvilble:true
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

  addPsn:function(){
    var me = this;

    XY.addPsn(me.data.params.managerID, me.data.params.deptID, app.globalData.userInfo.fID.value,app.globalData.orgInfo.fName.value, function (data) {
  if(data.data.result=="success"){
    wx.reLaunch({
      url: homePage,
    })
  }

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
var str="?";
    for (var key in this.data.params) {
      str = str + key + '=' + this.data.params[key] + '&'
      　　　

    　　}
str=str.substring(0, str.length-1)
    console.log(str,"strstr")
    return {
      title: '人员邀请',
      path: 'login/joinUS/joinUS'+str+"&flag=1"
    }


  }
})