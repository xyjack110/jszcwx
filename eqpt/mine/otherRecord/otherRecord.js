// eqpt/mine/otherRecord/otherRecord.js
var app = getApp()
var requestUrl = require('../../../config.js').requestUrl

Page({

  /**     
   * 页面的初始数据
   */
  data: {  
    otherRecordList: [],
    isLoading: true,
    limit: 7,
    inputVal:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.LoadRepairInfoRecord(0,true);

    wx.setNavigationBarTitle({
      title: "其他操作记录记录",
      success: function () {

      },
      fail: function (err) {

      }
    })
  },

  userInput: function (e) {//获取组件中传回来的值


    this.setData({
      otherRecordList: [],
      inputVal: e.detail.data
    })
    this.LoadRepairInfoRecord(0, true);
  },

  getImgFromList: function (fEqpImg) {

    if (fEqpImg == undefined) {
      return "/image/eqpt.png";
    }
    if (fEqpImg == "") {
      return "/image/eqpt.png"
    } else {
      var fEqpImgArr = fEqpImg.split("@")
      return fEqpImgArr[0]
    }
  },
  checkRepairInfoDetail: function (e) {

    wx.navigateTo({ url: '/eqpt/eqptDetail/RepairInfo/checkRepairInfoDetail?fID=' + e.currentTarget.id })
  },

  LoadRepairInfoRecord: function (offset, append) {

    // if (this.data.isLoading == false) {
    //   return;  
    // }


    var psnFilter = app.globalData.orgInfo.fPath.value;

    console.log(this.data.inputVal + "加载")
    //根据这个人的全路径拿这个人的部门全路径
    if (app.globalData.orgInfo.fAuth.value && app.globalData.orgInfo.fAuth.value.indexOf('部门查询') > -1) {
      var t = []
      t = app.globalData.orgInfo.fPath.value.split("/")
      t.length = t.length - 1;
      psnFilter = t.join("/");
    }

    var me = this
    wx.request({   
      url: requestUrl + '/queryOtherRecord',
      method: "POST",
      data: {
        psnFilter: psnFilter,
        inputVal: this.data.inputVal,
        fOpratorID: app.globalData.orgInfo.fPath.value,
        fCmpyID: app.globalData.orgInfo.fCmpyID.value,
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


          t = res.data.rows[i].fEqpImg.value ? res.data.rows[i].fEqpImg.value.split("@"):[];
          res.data.rows[i].fdate = res.data.rows[i].fOperationTime.value.substring(0, 10) + " " + res.data.rows[i].fOperationTime.value.substring(11, 19)
          if (t.length > 0 && t[0].length > 0) {
            res.data.rows[i].fEqpImg1 = t[0]
          } else {
            res.data.rows[i].fEqpImg1 = "/image/eqpt.png"

          }

        }


        if (append == true) {
          me.setData({

            otherRecordList: me.data.otherRecordList.concat(res.data.rows)
          })
        } else {
          me.setData({

            otherRecordList: res.data.rows
          })
        }
   


        wx.stopPullDownRefresh({
          complete: function (res) {


          }
        })
      }
    })

  },
  checkOtherRecordDetail:function(e){

    wx.navigateTo({ url: '/eqpt/mine/checkOtherRecordDetail/checkOtherRecordDetail?fID=' + e.currentTarget.id })
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
    this.LoadRepairInfoRecord(0,false);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.LoadRepairInfoRecord(this.data.otherRecordList.length, true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})