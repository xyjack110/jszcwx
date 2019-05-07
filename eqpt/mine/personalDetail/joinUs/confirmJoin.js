// eqpt/mine/personalDetail/joinUs/confirmJoin.js
var baseurl = require('../../../../config.js').requestUrl

var app = getApp()
Page({

  /**
   * 页面的初始数据            
   */
  data: {    
    options: {},
isLoading:true,
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

              fCmpyID: res.data.rows[0].fCmpyID.value,
              fDeptID: res.data.rows[0].fMyDeptID.value,
              fDept: res.data.rows[0].fMyDept.value,
              fDeptFName: res.data.rows[0].fDeptFName.value,
              fDeptFID: res.data.rows[0].fDeptFID.value,
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
            url: baseurl + '/joinUs',
            method: "POST",
            data: {
              fReceiverID: app.globalData.userInfo.userID,
              fSenderID: me.data.options.fPsnID

            },

            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {

              if (res.data.success != "success") {
                wx.showModal({
                  title: '信息提示',
                  content: res.data.success,
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
              }, 1500)

              wx.showLoading({
                title: '加载中',
                mask: true
              })
              me.setData({
                isLoading: false
              })


            }
          })
        }, 1500)

        
 


      }
    });





  },


  okBtn1: function () {

    if (this.data.btnStatus == true) {
      return;
    }
    this.setData({
      btnStatus: true
    })


if(this.data.isLoading){
return;
}else{
  this.setData({
    isLoading:true
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
      


        console.log("用户点击确认加入后，拿到的用户信息", app.globalData.userInfo)
        //判断用户是否为已有用户

        if (!app.globalData.userInfo.fCmpyID) {//如果为新用户，在数据库中生成新纪录
          wx.request({
            url: baseurl + '/psnNew',
            method: "POST",
            data: {
              fUserID: app.globalData.userInfo.userID,
              fPsnName: app.globalData.userInfo.fPsnName,

              fPsnImg: app.globalData.userInfo.fPsnImg,
              fCmpyName: this.data.options.fCmpyName,
              fCmpyID: this.data.options.fCmpyID,
              fDept: this.data.options.fDept,
              fDeptID: this.data.options.fDeptID,
              fDeptFName: this.data.options.fDeptFName ? this.data.options.fDeptFName + "/" + this.data.options.fDept : this.data.options.fDept,
              fDeptFID: this.data.options.fDeptFID ? this.data.options.fDeptFID + "/" + this.data.options.fDeptID : this.data.options.fDeptID,
            },

            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              me.setData({
                isLoading:false
              })
              setTimeout(function () {
                //返回首页页面
                wx.reLaunch({
                  url: '/eqpt/mine/mine',
                })
              }, 1500)

              wx.showLoading({
                title: '加载中',
                mask: true
              })
          
            }
          })
          //自己不能邀请自己
        } else if (me.data.options.fPsnID == app.globalData.userInfo.userID){
          wx.showModal({
            title: '提示信息',
            content: '自己不能邀请自己',
          })
          me.setData({
            isLoading: false
          })
        }
        
        
         else if (me.realtionOfUs({ yourDeptFID: me.data.options.fDeptFID, yourDeptID: me.data.options.fDeptID }, { myDeptFID: app.globalData.userInfo.fDeptFID, myDeptID: app.globalData.userInfo.fMyDeptID }) == "下级") {//判断发送方是否为我的下级
          wx.showModal({
            title: '提示信息',
            content: '下级不能给上级发加入部门申请',
          })
          me.setData({
            isLoading: false
          })
        } else {//如果为老用户，在数据库中，更改当前用户的上级部门

          wx.request({
            url: baseurl + '/psnChange',
            method: "POST",
            data: {
              fUserID: app.globalData.userInfo.userID,
              fCmpyName: me.data.options.fCmpyName,
              fCmpyID: me.data.options.fCmpyID,
              fDept: me.data.options.fDept,
              fDeptID: me.data.options.fDeptID,
              fDeptFName: me.data.options.fDeptFName ? me.data.options.fDeptFName + "/" + me.data.options.fDept : me.data.options.fDept,
              fDeptFID: me.data.options.fDeptFID ? me.data.options.fDeptFID + "/" + me.data.options.fDeptID : me.data.options.fDeptID,
              fPreDeptID: app.globalData.userInfo.fDeptID,
              MinefCmpyID: app.globalData.userInfo.fCmpyID,

            },

            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {


             
              setTimeout(function () {
                //返回首页页面
                wx.reLaunch({
                  url: '/eqpt/mine/mine',
                })
              }, 1500)

              wx.showLoading({
                title: '加载中',
                mask: true
              })
              me.setData({
                isLoading: false
              })

         
            }
          })
        }


    
        
      
      }
    });



  

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