// eqpt/mine/personalDetail/joinUs/confirmJoin.js
var baseurl = require('../../../../config.js').requestUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    disableOkBtn:false,
    btnStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {//获取发送传过来的值

    var me = this;

    app.getUserFromDB(function (mark) {


      console.log("拿到了用户信息")



    })

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

            fCmpyID: res.data.rows[0].fCmpyID.value,
            fDeptID: res.data.rows[0].fMyDeptID.value,
            fDept: res.data.rows[0].fMyDept.value,
            fDeptFName: res.data.rows[0].fDeptFName.value,
            fDeptFID: res.data.rows[0].fDeptFID.value,
            fPreDeptID: res.data.rows[0].fDeptID.value,
            fPsnID: res.data.rows[0].fPsnID.value

          }
        });

      }
    });

     
    
  },
  returnMainPage: function () {//返回首页
    wx.reLaunch({
      url: '/eqpt/mine/mine',
    })
  },
//   clearMyDept: function (fPsnID){//清除发送方负责的部门
//     wx.request({
//       url: baseurl + '/clearMyDept',
//       method: "POST",
//       data: {
//         fUserID: fPsnID,

//       },

//       header: {
//         'content-type': 'application/json' // 默认值
//       },
//       success: function (res) {

// console.log("清除发送方负责部门返回",res) 

//       }
//     })
//   },
  okBtn: function () {
    if (this.data.btnStatus == true) {
      return;
    }
    this.setData({
      btnStatus: true
    })
  this.setData({
    disableOkBtn:true
  })
var me=this;
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


  } else{

    console.log("用户点击确认加入后，拿到的用户信息", app.globalData.userInfo)
    //判断用户是否为已有用户"
    if (!app.globalData.userInfo.fCmpyID) {//如果为新用户，在数据库中生成新纪录
      wx.request({
        url: baseurl + '/psnNew',
        method: "POST",
        data: {
          fUserID: app.globalData.userInfo.userID,
          fPsnName: app.globalData.userInfo.fPsnName,

          fPsnImg: app.globalData.userInfo.fPsnImg,
          fCmpyName: me.data.options.fCmpyName,
          fCmpyID: me.data.options.fCmpyID,
          fMyDept: me.data.options.fDept,
          fMyDeptID: me.data.options.fDeptID,
          fDeptID: me.data.options.fPreDeptID,
          fDeptFName: me.data.options.fDeptFName,
          fDeptFID: me.data.options.fDeptFID,
          fSenderID: me.data.options.fPsnID
        },

        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {


          // me.clearMyDept(me.data.options.fPsnID)
          //返回首页页面
          wx.reLaunch({
            url: '/eqpt/mine/mine',
          })
        }
      })
    } else if (me.realtionOfUs({ yourDeptFID: me.data.options.fDeptFID, yourDeptID: me.data.options.fDeptID }, { myDeptFID: app.globalData.userInfo.fDeptFID, myDeptID: app.globalData.userInfo.fMyDeptID }) == "上级" &&  me.data.options.fPreDeptID!=".") {//如果发送方是我的上级，
      wx.request({//接受上级领导的组织机构
        url: baseurl + '/ReceiveOrgFromManager',
        method: "POST",
        data: {
          fUserID: app.globalData.userInfo.userID,
          fCmpyName: me.data.options.fCmpyName,
          fCmpyID: me.data.options.fCmpyID,
          fMyDept: me.data.options.fDept,
          fMyDeptID: me.data.options.fDeptID,
          fDeptID: me.data.options.fPreDeptID,
          fDeptFName: me.data.options.fDeptFName,
          fDeptFID: me.data.options.fDeptFID,
          fSenderID: me.data.options.fPsnID

        },

        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          //  me.clearMyDept(me.data.options.fPsnID)
          console.log("接受上级领导的组织交接的结果", res)
          //返回首页页面
          wx.reLaunch({
            url: '/eqpt/mine/mine',
          })
        }
      })


    } else if (me.realtionOfUs({ yourDeptFID: me.data.options.fDeptFID, yourDeptID: me.data.options.fDeptID }, { myDeptFID: app.globalData.userInfo.fDeptFID, myDeptID: app.globalData.userInfo.fMyDeptID }) == "上级" && me.data.options.fPreDeptID == ".") {

      wx.showModal({
        title: '提示信息',
        content: '您不能接受创建者的权限！',

      })
 
    }



    else {//如果发送方不是我的上级，
      if (me.data.options.fCmpyID == app.globalData.userInfo.fCmpyID){
      if (app.globalData.userInfo.fMyDeptID) {//判断接收方是否有负责的部门
        wx.request({//经理接受非上级的组织交接
          url: baseurl + '/ManagerReceiveOrgFromOther',
          method: "POST",
          data: {
            fUserID: app.globalData.userInfo.userID,
            fCmpyName: me.data.options.fCmpyName,
            fCmpyID: me.data.options.fCmpyID,
            fMyDept: me.data.options.fDept,
            fMyDeptID: me.data.options.fDeptID,
            fDeptID: me.data.options.fPreDeptID,
            fDeptFName: me.data.options.fDeptFName,
            fDeptFID: me.data.options.fDeptFID,
            fSenderID: me.data.options.fPsnID

          },

          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            //清除发送方负责的部门
            // me.clearMyDept(me.data.options.fPsnID)

            console.log("经理接受非上级的组织交接的结果", res)
            //返回首页页面
            wx.reLaunch({
              url: '/eqpt/mine/mine',
            })
          }
        })
      } 
      
      
      
      
      else {//普通职员接受非上级的组织交接
        wx.request({
          url: baseurl + '/ReceiveOrgFromOther',
          method: "POST",
          data: {
            fUserID: app.globalData.userInfo.userID,
            fCmpyName: app.globalData.userInfo.fCmpyName,
            fCmpyID: app.globalData.userInfo.fCmpyID,
            fMyDept: me.data.options.fDept,
            fMyDeptID: me.data.options.fDeptID,
            fDeptID: me.data.options.fPreDeptID,
            fDeptFName: me.data.options.fDeptFName,
            fDeptFID: me.data.options.fDeptFID,
            fSenderID: me.data.options.fPsnID

          },

          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            //清除发送方的负责部门
            // me.clearMyDept(me.data.options.fPsnID)
            console.log("普通职员接受非上级的组织交接的结果", res)
            //返回首页页面
            wx.reLaunch({
              url: '/eqpt/mine/mine',
            })
          }
        })

      }


      

    }else{
        wx.showModal({
          title: '提示信息',
          content: '公司不同，禁止权利转接',

        })
    }

    }
    
  }


})



  

  },

  realtionOfUs: function (you, me) {//判断发送方是我的什么级别

    var yourDeptFID1 = you.yourDeptFID ? you.yourDeptFID + "/" + you.yourDeptID : you.yourDeptID;
    var myDeptFID1 = me.myDeptFID ? me.myDeptFID + "/" + me.myDeptID : me.myDeptID;
    if (yourDeptFID1 == myDeptFID1) {
      return "同级";
    } else if (myDeptFID1.indexOf(yourDeptFID1) >= 0) {
      if (you.yourDeptID) {
        return "上级";
      } else {
        return "其他";
      }
    }
    else if (yourDeptFID1.indexOf(myDeptFID1) >= 0) {
      if (me.myDeptID) {
        return "下级";
      } else {
        return "其他";
      }
    } else {
      return "其他";
    }

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