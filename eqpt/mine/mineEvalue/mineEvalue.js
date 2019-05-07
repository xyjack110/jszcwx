// eqpt/mine/mineEvalue/mineEvalue.js
var app = getApp()
var requestUrl = require('../../../config.js').requestUrl
Page({
     
  /**
   * 页面的初始数据
   */    
  data: {   
   mineEvakueList: [],  
    isLoading: true,
    limit: 7,
    inputVal:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.LoadMineEvakueRecord(0,true);
  
    wx.setNavigationBarTitle({
      title: "我们发出的评价",
      success: function () {

      },
      fail: function (err) {

      }
    })
  },


  userInput: function (e) {//获取组件中传回来的值


    this.setData({
      mineEvakueList: [],

      inputVal: e.detail.data
    })
    this.LoadMineEvakueRecord(0, true);
  },
  checkEvalueDetail:function(e){


    wx.navigateTo({ url: '/eqpt/mine/checkEvalueDetail/checkEvalueDetail?fID=' + e.currentTarget.id })
  },

  //去掉部门全名称的前两个字符
  getfDeptFName: function (fDeptFName) {
    return fDeptFName.substring(2)
  },
//分页加载我发出的评价
  LoadMineEvakueRecord: function (offset, append) {
    // if (this.data.isLoading == false) {
    //   return;
    // }

    var psnFilter = app.globalData.orgInfo.fPath.value;
    //根据这个人的全路径拿这个人的部门全路径
    if (app.globalData.orgInfo.fAuth.value && app.globalData.orgInfo.fAuth.value.indexOf('部门查询') > -1) {
      var t = []
      t = app.globalData.orgInfo.fPath.value.split("/")
      t.length = t.length - 1;
      psnFilter = t.join("/");
    }
    var me = this
    wx.request({//查询我发出的评价记录
      url: requestUrl + '/queryMineEvakueRecord',
      method: "POST",
      data: {
        psnFilter: psnFilter,
        inputVal: this.data.inputVal,
        fOpratorID: app.globalData.userInfo.userID,
        limit: this.data.limit,
        offset: offset
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        if (res.data.rows.length < me.data.limit) {
          me.setData({
            isLoading: false
          })

        } else {
          me.setData({
            isLoading: true
          })
        }

        var t = null;
        for (var i = 0; i < res.data.rows.length; i++) {
          t = res.data.rows[i].fOperationImg.value.split("@");
          res.data.rows[i].fdate = res.data.rows[i].fOperationTime.value.substring(0, 10)
          if (t.length > 0 && t[0].length > 0) {
            res.data.rows[i].fEqpImg1 = t[0]
          } else {
            res.data.rows[i].fEqpImg1 = "/image/eqpt.png"

          }


          

        }

        if (append == true) {
          me.setData({

            mineEvakueList: me.data.mineEvakueList.concat(res.data.rows)
          })
        } else {
          me.setData({

            mineEvakueList: res.data.rows
          })
        }
  


        wx.stopPullDownRefresh({
          complete: function (res) {

          }
        })
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
    this.setData({

      isLoading:true
    })
    this.LoadMineEvakueRecord(0,false);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.LoadMineEvakueRecord(this.data.mineEvakueList.length, true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})