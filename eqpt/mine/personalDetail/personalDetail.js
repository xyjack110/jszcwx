// eqpt/mine/personalDetail/personalDetail.js
var baseurl = require('../../../config.js').requestUrl
var app = getApp()
var util = require('../../../util/util.js')
Page({
                
  /**
   * 页面的初始数据
   */
  data: {      
    userInfo: {},
    cmpyInfo:{},  
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

//查询我上级领导姓名
    var personFilter = "fMyDeptID='" + app.globalData.userInfo.fDeptID + "' and fCmpyID='" + app.globalData.userInfo.fCmpyID + "'"

    var me = this;
    wx.request({
      url: baseurl + '/queryEqp_person',
      method: "POST",
      data: {
        filter: personFilter,
    
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        
        if (res.data.rows.length>0){
          me.setData({

            UpLevelName: res.data.rows[0].fPsnName.value
          })
        }else{
          me.setData({

            UpLevelName:""
          })
          

        }

        if (app.globalData.userInfo.fDeptFName == ".") {
          console.log(app.globalData.userInfo.fCmpyName, "fCmpyName....")

          me.setData({
            fDeptName: app.globalData.userInfo.fCmpyName
          })



        } else {


          console.log(app.globalData.userInfo.fCmpyName, "fCmpyName")
          me.setData({
            fDeptName: app.globalData.userInfo.fCmpyName + "/" + me.getfDeptFName(app.globalData.userInfo.fDeptFName) + '/' + res.data.rows[0].fPsnName.value
          })


        }
  
     
      },
        fail: function (err) {
      
        console.log("fail1")
      }
    })

 


    this.setData({
      userInfo: app.globalData.userInfo,
      cmpyInfo: app.globalData.cmpyInfo,
    })



    wx.setNavigationBarTitle({
      title: app.globalData.cmpyInfo.fCmpyName ? app.globalData.cmpyInfo.fCmpyName:"个人信息",
      success: function () {
        console.log("success1")
      },
      fail: function (err) {
        console.log("fail1")
      }
    })




  },

  //去掉部门全名称的前两个字符
  getfDeptFName: function (fDeptFName) {
    return fDeptFName.substring(2)
  },

  joinCompy:function(){

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
      success: function (res) {

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
            success: function (res) {

            }
          })


        }
        else {

          wx.navigateTo({ url: '/eqpt/mine/personalDetail/joinCompyCode/joinCompyCode' })

        }

      }
    })







  },

  createCompy:function(){
    wx.navigateTo({ url: '/eqpt/mine/personalDetail/createCompy/createCompy' })
  },


  editName: function () {//更改姓名
    wx.navigateTo({ url: "/eqpt/mine/personalDetail/personalDetailName/personalDetailName?fPsnName=" + this.data.userInfo.fPsnName + "" })
  },
  editPhone: function () {//更改手机号
    wx.navigateTo({ url: "/eqpt/mine/personalDetail/personalDetailPhone/personalDetailPhone?fCellphone=" + this.data.userInfo.fCellphone + "" })
  },
  //查询我的同级和我的下级
  MyLeve:function(){
    wx.navigateTo({ url: "/eqpt/mine/personalDetail/MinesameLevelPsn" })

  },
  updatePage:function(){
this.setData({

  "userInfo.fCellphone": app.globalData.userInfo.fCellphone,
  "userInfo.fPsnName": app.globalData.userInfo.fPsnName,
  "userInfo.fMyDept":  app.globalData.userInfo.fMyDept,
  "cmpyInfo.fCmpyID": app.globalData.cmpyInfo.fCmpyID,
  "cmpyInfo.fCmpyName": app.globalData.cmpyInfo.fCmpyName
})

    setTimeout(function () {
      wx.setNavigationBarTitle({
        title: app.globalData.cmpyInfo.fCmpyName ? app.globalData.cmpyInfo.fCmpyName : "个人信息2",
        success: function () {
          console.log("success2")
        },
        fail: function (err) {
          console.log("fail2")
        }
      })
    }, 500);



  },

  updateDeptName: function () {//修改我负责的部门名字
    wx.navigateTo({ url: "/eqpt/mine/personalDetail/updateDeptName/updateDeptName?fMyDept=" + this.data.userInfo.fMyDept + "" })

  },
  handOut: function () {
    wx.navigateTo({ url: '/eqpt/mine/personalDetail/handOut/handOut' })
  },
  joinUs: function () {//邀请下属加入


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
      success: function (res) {

        var fExpireDate = res.data.rows[0].fExpireDate.value

        var currentdate = util.getNowFormatDate()
        console.log("当前时间")
        console.log(currentdate)
        console.log("失效时间")
        console.log(fExpireDate)

        if (currentdate > fExpireDate) {//判断充值期限是否失效

          wx.showModal({
            title: '信息提示',
            content: '您的续费到期了,请联系管理员充值！',
            showCancel: false,
            success: function (res) {

            }
          })


        }
        else {

          //判断我是否已经有负责部门了
          if (!app.globalData.userInfo.fMyDept) {//没有负责部门
            wx.navigateTo({ url: '/eqpt/mine/personalDetail/joinUs/msg_success' })
          } else { //有负责部门
            wx.navigateTo({ url: '/eqpt/mine/personalDetail/joinUs/joinUs' })
          }

        }

      }
    })





  },
  management: function () {
    wx.showModal({
      title: "信息提示！",
      content: "权限修改请联系部门负责人",
      showCancel: false,
      confirmText: "确定"
    })
  },
  personClear: function () {//清除个人信息
    var me = this;

    wx.showModal({
      title: "严重警告",
      content: "本操作将清空您的用户信息，是否确认？",
      showCancel: "取消",
      confirmText: "确定",
      success: function (res) {
        if (res.confirm) {//点击确定执行清除函数
          me.clearPersonInfo();
        } else if (res.cancel) {

        }
      }
    })

  },
  clearPersonInfo: function () {//清除按钮事件的具体函数
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
      success: function (e) {

        if (e.data.res && e.data.res == "success") {//返回值为成功时，执行删除操作
          wx.showToast({
            title: '删除个人信息成功',
            mask:true,
  

          })

          app.globalData.userInfo={}
          wx.setStorage({
            key: 'userInfo',
            data: {},
          })

          setTimeout(function () {
            //返回上一级页面
            wx.navigateBack({
              delta: 1,
            })
          }, 1500)


     
        } else if (e.data.res == "failnum"){
          //创建者有资产,给出提示信息
          wx.showToast({
            icon: 'none',
            title: e.data.eqpnum,
          })
        }
        
        
        else {//有下属的情况给个提示信息
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