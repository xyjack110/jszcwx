// eqpt/mine/personalDetail/MinesameLevelPsn.js
var requestUrl = require('../../../config.js').requestUrl
var app = getApp()
Page({

  /** 
   * 页面的初始数据     
   */
  data: {
    personList: [],
      isLoading: true,
    limit: 7,
    fManagerID:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fManagerID: app.globalData.cmpyInfo.fManagerID
    })
    
    this.LoadSameLevelPsn(0, true);

  },
    //查询出我的同级的信息
  LoadSameLevelPsn: function (offset, append){

    if (this.data.isLoading == false) {
      return;
    }


  

    var personFilter = " fPsnID IN( "
   +" SELECT fPsnID "
      + "FROM eqp_person where  " 
                              
      + "   fDeptFID like (select  concat(fDeptFID, '%') "
      + "							from eqp_person where fPsnID='" + app.globalData.userInfo.userID+"')" +" and fCmpyID= (select  fCmpyID "
      + " from eqp_person where fPsnID= '" + app.globalData.userInfo.userID+"') "
 +")   "

    var me = this;
    wx.request({
      url: requestUrl + '/queryEqp_person',
      method: "POST",
      data: {
        filter: personFilter,
        orderBy: "fDeptFName,fPsnName",
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
        if (append == true) {
          me.setData({

            personList: me.data.personList.concat(res.data.rows)
          })
        } else {
          me.setData({

            personList: res.data.rows
          })
        }

        wx.stopPullDownRefresh({
          complete: function (res) {


          }
        })
      
        console.log("查询当前用户的同级成功", res)


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
    this.LoadSameLevelPsn(0, false);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.LoadSameLevelPsn(this.data.personList.length, true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})