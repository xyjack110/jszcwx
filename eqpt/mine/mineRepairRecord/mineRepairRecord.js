// eqpt/mine/mineRepairRecord/mineRepairRecord.js
var app = getApp()
var requestUrl = require('../../../config.js').requestUrl
Page({

  /**
   * 页面的初始数据
   */   
  data: {  
    repairList: [],
    isLoading: true,
    limit: 7, 
    inputVal:""  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.LoadRepairRecord(0,true);

    wx.setNavigationBarTitle({
      title: "我们的维修记录",
      success: function () {

      },
      fail: function (err) {

      }
    })
  },

  userInput: function (e) {//获取组件中传回来的值


    this.setData({
      repairList: [],
      inputVal: e.detail.data
    })
    this.LoadRepairRecord(0, true);
  },

  //去掉部门全名称的前两个字符
  getfDeptFName: function (fDeptFName) {
    return fDeptFName.substring(2)
  },

  //分页加载资产维修记录
  LoadRepairRecord: function (offset, append) {

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
    console.log("执行1次加载")
    var me = this
    wx.request({
      url: requestUrl + '/queryRepairRecord',
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
          t = res.data.rows[i].fEqpImg.value ? res.data.rows[i].fEqpImg.value.split("@"):[];
          res.data.rows[i].fdate = res.data.rows[i].fOperationTime.value.substring(0, 10) + " " + res.data.rows[i].fOperationTime.value.substring(11, 19)  
          if (t.length > 0 && t[0].length > 0) {
            res.data.rows[i].fEqpImg1 = t[0]
          } else {
            res.data.rows[i].fEqpImg1 = "/image/eqpt.png"

          }



          // if (res.data.rows[i].fDeptFName.value == ".") {
          //   if (res.data.rows[i].fMyDept.value) {
          //     res.data.rows[i].fDeptName = res.data.rows[i].fCmpyName.value + "/" + res.data.rows[i].fMyDept.value + "/" + res.data.rows[i].fPsnName.value
          //   } else {
          //     res.data.rows[i].fDeptName = res.data.rows[i].fCmpyName.value + "/" + res.data.rows[i].fPsnName.value
          //   }


          // } else {

          //   if (res.data.rows[i].fMyDept.value) {
          //     res.data.rows[i].fDeptName = res.data.rows[i].fCmpyName.value + "/" + me.getfDeptFName(res.data.rows[i].fDeptFName.value) + "/" + res.data.rows[i].fMyDept.value + "/" + res.data.rows[i].fPsnName.value
          //   } else {
          //     res.data.rows[i].fDeptName = res.data.rows[i].fCmpyName.value + "/" + me.getfDeptFName(res.data.rows[i].fDeptFName.value) + "/"  + res.data.rows[i].fPsnName.value
          //   }


          // }

        }

        if (append == true) {
          me.setData({

            repairList: me.data.repairList.concat(res.data.rows)
          })
        } else {
          me.setData({

            repairList: res.data.rows
          })
        }

     
      }
    })
    wx.stopPullDownRefresh({
      complete: function (res) {


      }
    })

  },
  repairDetail: function (e) {    


    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/eqpt/eqptDetail/eqptRepair/repairDetail?fID=' + e.currentTarget.id
    })
  },

  //点击维修评价事件
  repairEvalue:function(e){

   var i= e.currentTarget.dataset.index;
   var fID=this.data.repairList[i].fID.value;
   var fOpratorID = this.data.repairList[i].fOpratorID.value;
   var fOperatorCmpyID = this.data.repairList[i].fOperatorCmpyID.value;
   wx.navigateTo({ url: "/eqpt/eqptDetail/repairEvalue/repairEvalue?fID=" + fID + "&fOpratorID=" + fOpratorID + "&fOperatorCmpyID=" + fOperatorCmpyID })
  },
  // repairEvalueDetail:function(){
  //   wx.navigateTo({ url: '/eqpt/mine/repairEvalueDetail/repairEvalueDetail' })
  // },

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
    this.LoadRepairRecord(0,false);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.LoadRepairRecord(this.data.repairList.length, true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})