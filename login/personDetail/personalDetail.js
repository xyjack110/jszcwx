// eqpt/mine/personalDetail/personalDetail.js
var baseurl = require('../../config.js').requestUrl
var app = getApp()
var util = require('../util.js')
var XY = require('../login.js').XY
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    cmpyInfo: {},
    orgInfo: {},
    managerAuth: false,
    showTopTips: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.globalDataRefresh();
//判断是否为顶级管理员
    if (app.globalData.cmpyInfo.fID && app.globalData.orgInfo.fID && JSON.parse(app.globalData.cmpyInfo.fOrgJson.value).managerID == app.globalData.orgInfo.fID.value) {
      this.setData({
        managerAuth: true
      })
    }



  },





  delCompy: function() {
    var me = this;
    wx.showModal({
      title: '提示信息',
      content: '是否確定刪除',
      success(res) {
        if (res.confirm) {
          XY.deleteDept(app.globalData.orgInfo.fID.value, app.globalData.cmpyInfo.fID.value, function(data) {
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
           
  wx.reLaunch({
    url: '/eqpt/mine/mine',
  })

            // XY.XYLogin({
            //   "openid": app.globalData.openid,
            //   callback: function(data) {

            //     app.globalData.userInfo = data.userInfo ? data.userInfo : {}
            //     app.globalData.orgInfo = data.orgInfo ? data.orgInfo : {}
            //     app.globalData.cmpyInfo = data.cmpyInfo ? data.cmpyInfo : {}
            //     app.globalData.openid = data.openid
            //     app.globalData.unionid = data.unionid


            //     var pages = getCurrentPages();
            //     for (var item in pages) {

            //       if (pages[item].globalDataRefresh)
            //         pages[item].globalDataRefresh()

            //     }
            //   }

            // })

          })



        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },
  changePost:function(){
    wx.navigateTo({
      url: '/login/changePost/changePost?psnID='+app.globalData.openid
    })

  },
  managerChange:function(){
  

          var t = new Date();//你已知的时间
      var t_s = t.getTime();//转化为时间戳毫秒数

      t.setTime(t_s + 1000 * 60 * 30);
      var yy = t.getFullYear();      //年
      var mm = t.getMonth() + 1;     //月
      var dd = t.getDate();          //日
      var hh = t.getHours();         //时
      var ii = t.getMinutes();       //分
      var ss = t.getSeconds();       //秒
      var clock = yy + "-";
      if(mm < 10) clock += "0";
      clock += mm + "-";
      if(dd < 10) clock += "0";
      clock += dd + " ";
      if(hh < 10) clock += "0";
      clock += hh + ":";
      if(ii < 10) clock += '0';
      clock += ii + ":";
      if(ss < 10) clock += '0';
      clock += ss;
      console.log(clock)
          wx.navigateTo({ url: '/login/managerChange/managerChange?imgsrc=' + app.globalData.userInfo.avatarUrl.value + '&managerName=' + app.globalData.orgInfo.fName.value +  '&managerID=' + app.globalData.orgInfo.fID.value + '&session=' + clock })
 

  },


  //点击登录查看，获取个人信息
  checkPersonalDetail: function(data) {
    //获取该用户的信息


    var me = this;

    if (data.detail.errMsg == "getUserInfo:ok") {
      var userInfo = {}


      // 合并json项
      var userInfo = Object.assign({
        "unionid": app.globalData.unionid,
        "fID": app.globalData.openid,
        "psnName": app.globalData.userInfo && app.globalData.userInfo.psnName.value!='匿名'? app.globalData.userInfo.psnName.value : JSON.parse(data.detail.rawData).nickName
      }, JSON.parse(data.detail.rawData))


      XY.saveUserInfo(userInfo, function(e) {
        console.log(e, "yyyy")
        XY.XYLogin({
          "openid": app.globalData.openid,
          callback: function(data) {
            console.log(data, "ssssrrr")
            console.log(data.cmpyInfo.fID.value, "sssscmpyInfocmpyInforrr")

            app.globalData.userInfo = data.userInfo
            app.globalData.orgInfo = data.orgInfo
            app.globalData.cmpyInfo = data.cmpyInfo
            app.globalData.openid = data.openid
            app.globalData.unionid = data.unionid


            var pages = getCurrentPages();
            for (var item in pages) {

              if (pages[item].globalDataRefresh)
                pages[item].globalDataRefresh()

            }



          }
        })

      })

    

    }








  },

  //去掉部门全名称的前两个字符
  getfDeptFName: function(fDeptFName) {
    return fDeptFName.substring(2)
  },

  joinCompy: function() {

    var me = this;
    wx.request({
      url: baseurl + '/queryEqp_compaty',
      method: "POST",
      data: {
        filter: "fCmpyID='" + app.globalData.userInfo.fCmpyID + "'",

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {

        var fExpireDate = res.data.rows[0].fExpireDate.value

        var currentdate = util.getNowFormatDate()
        console.log("当前时间")
        console.log(currentdate)
        console.log("失效时间")
        console.log(fExpireDate)

        if (currentdate > fExpireDate) {

          wx.showModal({
            title: '信息提示',
            content: '您的续费到期了,请联系管理员充值！',
            showCancel: false,
            success: function(res) {

            }
          })


        } else {

          wx.navigateTo({
            url: '/eqpt/mine/personalDetail/joinCompyCode/joinCompyCode'
          })

        }

      }
    })







  },

  createCompy: function() {
    wx.navigateTo({
      url: '/login/createCompy/createCompy'
    })
  },


  editName: function() { //更改姓名
    wx.navigateTo({
      url: "/login/personalDetailName/personalDetailName?fPsnName=" + this.data.userInfo.psnName.value + ""
    })
  },
  editPhone: function() { //更改手机号
    wx.navigateTo({
      url: "/login/personalDetailPhone/personalDetailPhone?fCellphone=" + this.data.userInfo.cellphone.value + ""
    })
  },
  //查询我的同级和我的下级
  MyLeve: function() {
    var t = this.data.orgInfo.fPath.value.split("/");
    t.length = t.length - 1;


    wx.navigateTo({
      url: "/login/mineSameLevelPsn/mineSameLevelPsn?fPath=" + t.join("/")
    })

  },
  updatePage: function() {
    this.setData({

      "userInfo.fCellphone": app.globalData.userInfo.fCellphone,
      "userInfo.fPsnName": app.globalData.userInfo.fPsnName,
      "userInfo.fMyDept": app.globalData.userInfo.fMyDept,
      "cmpyInfo.fCmpyID": app.globalData.cmpyInfo.fCmpyID,
      "cmpyInfo.fCmpyName": app.globalData.cmpyInfo.fCmpyName
    })

    setTimeout(function() {
      wx.setNavigationBarTitle({
        title: app.globalData.cmpyInfo.fCmpyName ? app.globalData.cmpyInfo.fCmpyName : "个人信息2",
        success: function() {
          console.log("success2")
        },
        fail: function(err) {
          console.log("fail2")
        }
      })
    }, 500);



  },

  updateDeptName: function() { //修改我负责的部门名字
    wx.navigateTo({
      url: "/eqpt/mine/personalDetail/updateDeptName/updateDeptName?fMyDept=" + this.data.userInfo.fMyDept + ""
    })

  },
  handOut: function() {
    wx.navigateTo({
      url: '/eqpt/mine/personalDetail/handOut/handOut'
    })
  },
  joinUs: function() { //邀请下属加入


    var me = this;
    wx.request({
      url: baseurl + '/queryEqp_compaty',
      method: "POST",
      data: {
        filter: "fCmpyID='" + app.globalData.userInfo.fCmpyID + "'",

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {

        var fExpireDate = res.data.rows[0].fExpireDate.value

        var currentdate = util.getNowFormatDate()
        console.log("当前时间")
        console.log(currentdate)
        console.log("失效时间")
        console.log(fExpireDate)

        if (currentdate > fExpireDate) { //判断充值期限是否失效

          wx.showModal({
            title: '信息提示',
            content: '您的续费到期了,请联系管理员充值！',
            showCancel: false,
            success: function(res) {

            }
          })


        } else {

          //判断我是否已经有负责部门了
          if (!app.globalData.userInfo.fMyDept) { //没有负责部门
            wx.navigateTo({
              url: '/eqpt/mine/personalDetail/joinUs/msg_success'
            })
          } else { //有负责部门
            wx.navigateTo({
              url: '/eqpt/mine/personalDetail/joinUs/joinUs'
            })
          }

        }

      }
    })





  },
  management: function() {
    wx.showModal({
      title: "信息提示！",
      content: "权限修改请联系部门负责人",
      showCancel: false,
      confirmText: "确定"
    })
  },
  personClear: function() { //清除个人信息
    var me = this;

    wx.showModal({
      title: "严重警告",
      content: "本操作将清空您的用户信息，是否确认？",
      showCancel: "取消",
      confirmText: "确定",
      success: function(res) {
        if (res.confirm) { //点击确定执行清除函数
          me.clearPersonInfo();
        } else if (res.cancel) {

        }
      }
    })

  },
  clearPersonInfo: function() { //清除按钮事件的具体函数
    wx.request({
      url: baseurl + '/clearPersonInfo',
      method: "POST",
      data: {
        fUserID: app.globalData.userInfo.userID,
        fCmpyID: app.globalData.userInfo.fCmpyID
      },

      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(e) {

        if (e.data.res && e.data.res == "success") { //返回值为成功时，执行删除操作
          wx.showToast({
            title: '删除个人信息成功',
            mask: true,


          })

          app.globalData.userInfo = {}
          wx.setStorage({
            key: 'userInfo',
            data: {},
          })

          setTimeout(function() {
            //返回上一级页面
            wx.navigateBack({
              delta: 1,
            })
          }, 1500)



        } else if (e.data.res == "failnum") {
          //创建者有资产,给出提示信息
          wx.showToast({
            icon: 'none',
            title: e.data.eqpnum,
          })
        } else { //有下属的情况给个提示信息
          wx.showToast({
            icon: 'none',
            title: e.data.dec,
          })

        }

      }
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

  globalDataRefresh() {





    this.setData({
      "userInfo": app.globalData.userInfo,
      "orgInfo": app.globalData.orgInfo,
      "cmpyInfo": app.globalData.cmpyInfo,
      openid: app.globalData.openid
    })
  },
  onShow: function() {
    this.setData({
      "userInfo": app.globalData.userInfo,
      "orgInfo": app.globalData.orgInfo,
      "cmpyInfo": app.globalData.cmpyInfo,
      openid: app.globalData.openid
    })






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