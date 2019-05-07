// eqpt/mine/mine.js
var app = getApp()
var baseurl = require('../../config.js').requestUrl
var util = require('../../util/util.js')
var XY = require('../../login/login.js').XY
Page({

  /**
   * 页面的初始数据 
   */    
  data: {

    fPsnImg: "",   
    fDeptFName: "",
    fPsnName: "",
    fCmpyID: "",
    eqptNum: 0,
    eqptErrNum: 0,
    RepairInfoNoEvalueNum: 0,
    repairInfoNoCloseNum: 0,
    EvalueNum: 0,
    EvalueScore: 0,
    ReceiveEvalueNum: 0,
    ReceiveEvalueScore: 0,
    otherRecordNum: 0,
    repairCountPsnNum: 0,
    repairCountScorePsnNum: 0,
    repairInfoCountNum: 0,
    repairCountNum: 0,
    isLoading: false,
    isAuth: false,

    openInfo: {
      creatEqptInfo: true,
      EqptUse: true,
      repairInfoRecord: true,
      evalue: true,
      repairRecord: true,
      receiveEvalue: true,
      repairNumRank: true,
      repairScore: true,
      repairAvgTime: true,
      other: true,
      workRecord:true,
      WaitCheckList:true,
      checkRecord:true,
      eqptUseRecord:true,
      createEqpt:false
    },
  },
  globalDataRefresh() {
    this.setData({
      "userInfo": app.globalData.userInfo,
      "orgInfo": app.globalData.orgInfo,
      "cmpyInfo": app.globalData.cmpyInfo,
      openid: app.globalData.openid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
this.setData({
  t: app.BLEInformation
})
    var me = this;
    XY.XYLogin({
      "openid": app.globalData.openid,callback:function (data) {

     app.globalData.userInfo = data.userInfo
      app.globalData.orgInfo = data.orgInfo
      app.globalData.cmpyInfo = data.cmpyInfo
      app.globalData.openid = data.openid
      app.globalData.unionid = data.unionid
     

      wx.stopPullDownRefresh()

      me.globalDataRefresh()

      //判断该用户是否有管理权限
        if (app.globalData.orgInfo && app.globalData.orgInfo.fAuth.value &&  (app.globalData.orgInfo.fAuth.value.indexOf("资产管理员") >= 0) ) {
      
        me.setData({
          isAuth: true
        })
      } else {

        me.setData({
          isAuth: false
        })
      }
        
      //判断是否
        if (app.globalData.orgInfo && app.globalData.orgInfo.fAuth.value && app.globalData.orgInfo.fAuth.value.indexOf('资产入库') > -1) {

        me.setData({
          createEqpt: true
        })
      }

      

        var psnFilter = app.globalData.orgInfo.fPath.value;
        console.log(psnFilter)

        //根据这个人的全路径拿这个人的部门全路径
        if (app.globalData.orgInfo.fAuth.value && app.globalData.orgInfo.fAuth.value.indexOf('部门查询') > -1) {
          var t = []
          t = app.globalData.orgInfo.fPath.value.split("/")
          t.length = t.length - 1;
          psnFilter = t.join("/");
        }
        console.log(psnFilter,"psnFilter")


      //统计资产的异常数，未关闭的报修数，未评价的维修记录，发出的评价次数
      //收到的评价次数，其他记录次数，共用多少人参加维修，及评分
      wx.request({
        url: baseurl + '/queryMineEqptStatusNum',
        method: "POST",
        data: {
          psnFilter: psnFilter,
          fCmpyID: app.globalData.orgInfo.fCmpyID.value,
        },

        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {

          me.setData({
            eqptNum: res.data.num,
            eqptErrNum: res.data.errNum,
            RepairInfoNoEvalueNum: res.data.RepairInfoNoEvalueNum,
            repairInfoNoCloseNum: res.data.repairInfoNoCloseNum,
            EvalueNum: res.data.EvalueNum,
            EvalueScore: res.data.EvalueScore,
            ReceiveEvalueNum: res.data.ReceiveEvalueNum,
            ReceiveEvalueScore: res.data.ReceiveEvalueScore,
            otherRecordNum: res.data.otherRecordNum,
            repairCountPsnNum: res.data.repairCountPsnNum,
            repairCountScorePsnNum: res.data.repairCountScorePsnNum,
            repairInfoCountNum: res.data.repairInfoCountNum,
            repairCountNum: res.data.repairCountNum,
          })

        }
      })


    }
    })





    // app.getUserFromDB(function(mark) {

    //   wx.stopPullDownRefresh({
    //     complete: function(res) {

    //     }
    //   })


    //   me.setData({
    //     fPsnImg: app.globalData.userInfo.fPsnImg ? app.globalData.userInfo.fPsnImg : "/image/notLogged.png",
    //     fDeptFName: app.globalData.userInfo.fDeptFName ? app.globalData.userInfo.fDeptFName : "未加入任何部门",
    //     fPsnName: app.globalData.userInfo.fPsnName ? app.globalData.userInfo.fPsnName : "未登录",
    //     fCmpyName: app.globalData.userInfo.fCmpyName ? app.globalData.userInfo.fCmpyName : "未加入任何部门",
    //     fCmpyID: app.globalData.userInfo.fCmpyID ? app.globalData.userInfo.fCmpyName : "",
    //   })
     
    //   setTimeout(function () {
    //     //判断该用户是否有管理权限
    //     if ((app.globalData.userInfo.userID == app.globalData.cmpyInfo.fManagerID
    //       || !util.isEmpty(app.globalData.userInfo.fPsnAuth)) && app.globalData.userInfo.fCmpyID) {

    //       me.setData({
    //         isAuth: true
    //       })
    //     } else {

    //       me.setData({
    //         isAuth: false
    //       })
    //     }

    //     //判断是否有公司，有公司才可创建资产
    //     if (app.globalData.cmpyInfo.fCmpyID == app.globalData.userInfo.fCmpyID && app.globalData.cmpyInfo.fCmpyID) {
        
    //       me.setData({
    //         createEqpt: true
    //       })
    //     }
    //   }, 500)




      

    // })
    wx.getStorage({
      key: 'openInfo',
      success: function(res) {


        me.setData({
          openInfo: res.data
        })

      },

    })

  },
  ss:function(){
    app.BLEInformation.str="456"
  },
  getQueryString: function (URLString, name) {


    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = URLString.split("?")[1].match(reg);
    if (r != null) {
      return unescape(r[2]);
    } else {
      return null;
    }
  },
  //执行扫码，跳转到指定页面
  scanBtn: function() {
var me=this;
    wx.scanCode({
      success: function(res) {
       
        console.log("扫描成功的返回", res)
        if (res.scanType =="QR_CODE"){
          console.log("QR_CODE", me.getQueryString(res.result, "scene"))
          wx.navigateTo({
            url: "/eqpt/eqptDetail/eqptDetail?scene=" + me.getQueryString(res.result, "scene")
          })
        }else{
          console.log("ciecle", res.path)
          var path = '/' + res.path
          wx.navigateTo({
            url: path
          })
        }
      
      //  https://fish.fishbear.com.cn/x5/UI2/eqptDetail?scene=15471695101615680
      },
      fail: function(res) {
        console.log("扫描失败的返回", res)
      }
    })
  },

  //点击登录查看，获取个人信息
  checkPersonalDetail: function(data) {
 
  
    wx.navigateTo({
      url: '/login/personDetail/personalDetail'
    })


 

  },


  Pay: function () {


    wx.navigateTo({
      url: '/eqpt/mine/minePay'
    })

  },

//跳转到培训资料
  traindingList: function () {
    wx.navigateTo({ url: '/eqpt/mine/traindingList/traindingList' })
  },
  //跳转到报修响应时间
  repairInfoAvgTime: function() {
    wx.navigateTo({
      url: '/eqpt/management/repairInfoAvgTime/repairInfoAvgTime'
    })
  },
  //跳转到资产管理，报表中心页面
  manageBtn: function() {
    if (this.data.isAuth) {
      wx.navigateTo({
        url: '/eqpt/management/management'
      })
    }

  },

  //跳转待盘点清单
  checkList: function() {
    wx.navigateTo({
      url: '/eqpt/mine/waitCheckListDetail/waitCheckListDetail'
    })
  },
  //跳转到我们的点检盘点记录
  WeCheckRecord: function () {
    wx.navigateTo({
      url: '/eqpt/mine/WeCheckRecord/WeCheckRecord'
    })
  },


  //跳转到设置页面
  set: function() {
    wx.navigateTo({
      url: '/eqpt/management/importModel/importModel'
    })
  },
  //跳到其他操作记录
  otherRecord: function() {
    wx.navigateTo({
      url: '/eqpt/mine/otherRecord/otherRecord'
    })

  },
  //跳转到我们的领用资产记录
  WeEqptUseRecord: function () {
    wx.navigateTo({
      url: '/eqpt/mine/WeEqptUseRecord/WeEqptUseRecord'
    })

  },
  MsgText:function(){
    wx.navigateTo({
      url: '/eqpt/mine/MsgTest'
    })
  },


  //调到创建资产信息
  createEqpt: function() {

   // var me = this;

         wx.navigateTo({
          url: '/eqpt/createEqptInfo/createEqptInfo'
        })
    // app.getUserInfo(function(mark, result) {
    //   me.setData({
    //     isLoading: false
    //   })

    //   if (mark == '失败') {


    //     wx.showModal({
    //       title: '用户已拒绝授权',
    //       content: '重新打开权限,请点击关于资产管理系统/设置/开启授权',
    //       showCancel: false,
    //       success: function(res) {
    //         wx.navigateBack({
    //           delta: 1,
    //         })
    //         if (res.confirm) {
    //           console.log('用户点击确定')
    //         } else if (res.cancel) {
    //           console.log('用户点击取消')
    //         }
    //       }
    //     })


    //   } else { //登录成功，跳转到个人详细信息页

    //     wx.navigateTo({
    //       url: '/eqpt/createEqptInfo/createEqptInfo'
    //     })
    //   }
    // });





  },
  mineEqpt: function() {
    wx.navigateTo({
      url: '/eqpt/mine/mineEqpt/mineEqpt'
    })

  },
//我们的工作录入
  workRecord:function(){
    wx.navigateTo({
      url: '/eqpt/mine/workRecord/workRecord'
    })
  },
  mineRepairInfoRecord: function() {
    wx.navigateTo({
      url: '/eqpt/mine/mineRepairInfoRecord/mineRepairInfoRecord'
    })
  },
  mineRepairRecord: function() {
    wx.navigateTo({
      url: '/eqpt/mine/mineRepairRecord/mineRepairRecord'
    })
  },

  mineEvalue: function() {
    wx.navigateTo({
      url: '/eqpt/mine/mineEvalue/mineEvalue'
    })
  },
  mineReceiveEvalue: function() {
    wx.navigateTo({
      url: '/eqpt/mine/mineReceiveEvalue/mineReceiveEvalue'
    })
  },
  mineReceivedEvalue: function() {
    wx.navigateTo({
      url: '/eqpt/mine/mineReceivedEvalue/mineReceivedEvalue'
    })
  },
  mineRepairRecordNew: function() {
    wx.navigateTo({
      url: '/eqpt/mine/mineRepairRecordNew/mineRepairRecordNew'
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
  onShow: function() {

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

    this.onLoad()
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

  },



})