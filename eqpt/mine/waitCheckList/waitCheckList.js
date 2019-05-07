
var requestUrl = require('../../../config.js').requestUrl
var downloadExampleUrl = require('../../../config.js').downloadExampleUrl
var app = getApp()
Page({

  /**  
   * 页面的初始数据     
   */
  data: {
    InventoryRecordDetail: [],
    isLoading: true,
    limit: 7,
    options: {},
    btnStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      options: options
    })
    this.LoadCheckDetail(0, true)




    wx.setNavigationBarTitle({
      title: "盘点明细",
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

  LoadCheckDetail: function (offset, append) {
    if (this.data.isLoading == false) {
      return;
    }

    var me = this
    wx.request({
      url: requestUrl + '/queryWatiCheckListDetail',
      method: "POST",
      data: {
        fPsnID: this.data.options.fPsnID,
        fOperationTime2: this.data.options.fOperationTime2,
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

        for (var i = 0; i < res.data.rows.length; i++) {

          res.data.rows[i].fEqpImg1 = me.getImgFromList(res.data.rows[i].fEqpImg.value)

         

        }
        if (append == true) {
          me.setData({

            InventoryRecordDetail: me.data.InventoryRecordDetail.concat(res.data.rows)
          })
        } else {
          me.setData({

            InventoryRecordDetail: res.data.rows
          })
        }


        wx.stopPullDownRefresh({
          complete: function (res) {


          }
        })






      }
    })



  },
  exportEqptExcel: function () {


    if (this.data.btnStatus == true) {
      return;
    }
    this.setData({
      btnStatus: true
    })


    wx.showLoading({
      title: '加载中',
    })
    var me = this;
    wx.request({
      url: requestUrl + '/creatCheckExcel',
      method: "POST",
      data: {
        fCmpyID: app.globalData.userInfo.fCmpyID,
        fOperationTime2: this.data.options.fOperationTime2,
        fPsnID: this.data.options.fPsnID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.flag && res.data.flag == "成功") {

          me.downLoadFile()

        }
        console.log(res)

      }
    })

  },
  downLoadFile: function () {

    wx.downloadFile({


      url: downloadExampleUrl + "/" + app.globalData.userInfo.fCmpyID + ".xls",
      success: function (res) {

        wx.openDocument({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log(res, "成功")



          },
          fail: function (res) {
            console.log(res, "失败")
          },
        })
      },
      fail: function (res) {
        console.log(res, "失败")
      },
    })

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
    this.LoadCheckDetail(0, false);

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.LoadCheckDetail(this.data.InventoryRecordDetail.length, true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})