// eqpt/management/orgPerson/orgPersonEdit/orgPersonEdit.js
var requestUrl = require('../../../../config.js').requestUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fPsnAuth:"",
    currentPerson:{},
    fPsnID:"",
    items: [

      { value: '资产管理', name: '资产管理' },
   { value: '人员管理', name: '人员管理' }

    ],
    btnStatus: false,

  },

  deletePsnAuthBtn: function () {//清除个人信息
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
      url: requestUrl + '/clearPersonInfoNew',
      method: "POST",
      data: {
        fUserID: this.data.fPsnID,
        
      },

      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (e) {

        if (e.data.res && e.data.res == "success") {//返回值为成功时，执行删除操作
          wx.showToast({
            title: '删除个人信息成功',
            mask: true,


          })

  

          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //上一个页面

   

          setTimeout(function () {
            //返回上一级页面
            wx.navigateBack({
              delta: 1,
            })
          }, 1500)



        } else  {
          //创建者有资产,给出提示信息
          wx.showToast({
            icon: 'none',
            title: e.data.desc,
          })
        }


    

      }
    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.fPsnID)
    this.setData({//得到前一个页面，传来的名字
      "fPsnID": options.fPsnID
    })

    var me = this;
    wx.request({
      url: requestUrl + '/queryEqp_person',
      method: "POST",
      data: {
        filter: "fPsnID='" + this.data.fPsnID +"'",
    
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

     me.setData({
       
       currentPerson:res.data.rows[0]
     })
      


      }
    })
  },
  getSelectedValue:function(e){

    this.setData({//得到前一个页面，传来的名字
      "fPsnAuth": e.detail.selectValue
    })

  },
  updataPsnAuthBtn:function(){

    if (this.data.btnStatus == true) {
      return;
    }
    this.setData({
      btnStatus: true
    })

    var me = this;
    wx.request({
      url: requestUrl + '/psnChange',
      method: "POST",
      data: {
        fUserID: this.data.fPsnID,
        fPsnAuth: this.data.fPsnAuth,



      },

      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面

        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        // prevPage.setData({
        //   "userInfo.fPsnAuth": me.data.fPsnAuth,

        // })
        prevPage.onLoad();
        app.globalData.userInfo.fPsnAuth = me.data.fPsnAuth;

        //返回上一级页面


        wx.navigateBack({

        })


      }
    })

  },

  clearAuthBtn:function(){
    // this.setData({//得到前一个页面，传来的名字
    //   "fPsnAuth": ""
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
    this.onLoad();
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