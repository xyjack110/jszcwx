// eqpt/management/repairInfoAvgTime/repairInfoAvgTime.js
var app = getApp()
var requestUrl = require('../../../config.js').requestUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {      
    repairAvgTimeList: [],
    isLoading: true,
    limit: 7
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.LoadRepairRecord(0, true);

    wx.setNavigationBarTitle({
      title: "报修响应排行榜",
      success: function () {

      },
      fail: function (err) {

      }
    })
  },
  //去掉部门全名称的前两个字符
  getfDeptFName: function (fDeptFName) {
    return fDeptFName.substring(2)
  },
  //分页加载
  LoadRepairRecord: function (offset, append) {


    if (this.data.isLoading == false) {
      return;
    }


    var psnFilter = app.globalData.orgInfo.fPath.value;

    console.log(this.data.inputVal + "加载")
    //根据这个人的全路径拿这个人的部门全路径
    if (app.globalData.orgInfo.fAuth.value && app.globalData.orgInfo.fAuth.value.indexOf('部门查询') > -1) {
      var t = []
      t = app.globalData.orgInfo.fPath.value.split("/")
      t.length = t.length - 1;
      psnFilter = t.join("/");
    }
    console.log("执行1次加载")
    var me = this
    wx.request({
      url: requestUrl + '/queryRepairAvgTimeRank',
      method: "POST",
      data: {
        fCmpyID: app.globalData.orgInfo.fCmpyID.value,
        limit: this.data.limit,
        offset: offset,
     
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        // for (var i = 0; i < res.data.rows.length; i++) {




        //   if (res.data.rows[i].fDeptFName.value == ".") {
        //     if (res.data.rows[i].fMyDept.value) {
        //       res.data.rows[i].fDeptName = res.data.rows[i].fCmpyName.value + "/" + res.data.rows[i].fMyDept.value
        //     } else {
        //       res.data.rows[i].fDeptName = res.data.rows[i].fCmpyName.value
        //     }


        //   } else {

        //     if (res.data.rows[i].fMyDept.value) {
        //       res.data.rows[i].fDeptName = res.data.rows[i].fCmpyName.value + "/" + me.getfDeptFName(res.data.rows[i].fDeptFName.value) + "/" + res.data.rows[i].fMyDept.value
        //     } else {
        //       res.data.rows[i].fDeptName = res.data.rows[i].fCmpyName.value + "/" + me.getfDeptFName(res.data.rows[i].fDeptFName.value) 
        //     }


        //   }






        // }

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

        if (append == true) {
          me.setData({

            repairAvgTimeList: me.data.repairAvgTimeList.concat(res.data.rows)
          })
        } else {
          me.setData({

            repairAvgTimeList: res.data.rows
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


      isLoading: true
    })
    //this.onLoad();
    this.LoadRepairRecord(0, false)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.LoadRepairRecord(this.data.repairAvgTimeList.length, true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})