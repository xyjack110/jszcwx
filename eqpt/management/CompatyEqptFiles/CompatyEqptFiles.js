// eqpt/management/CompatyEqptFiles/CompatyEqptFiles.js
var requestUrl = require('../../../config.js').requestUrl
var downloadExampleUrl = require('../../../config.js').downloadExampleUrl
var downloadExcelUrl = require('../../../config.js').downloadExcelUrl
var app = getApp()
var util = require('../../../util/util.js')
var Print = require('../../bleConnect/print.js').Print
Page({
                   
  /**        
   * 页面的初始数据         
   */
  data: {
    CompanyEqptFiles: [],
    isLoading: true,
    limit: 7,
    editStatus: false,
    selectedEqptIDs: "",
inputVal:"",
    EqptIDs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.LoadCompanyEqptFiles(0, true)

  },

  downLoadEqptList: function () {

    var me = this;

 
    var arrList = ['导出资产列表','导出资产库存统计表']
    // if (app.BLEInformation.blueTooh) {
    //   arrList.push("打印标签 " + app.BLEInformation.blueToohName)
    // } else {
    //   arrList.push("打印标签 (先连接打印机)")
    // }
    arrList.push("打印标签 (先连接打印机)")
    wx.showActionSheet({
      itemList: arrList,
      success: function (e) {
        me.setData({
          editStatus: false
        })
        console.log(e.tapIndex)

        if (e.tapIndex == 0) {
          // if (me.data.selectedEqptIDs.length <= 0) {
          //   wx.showModal({
          //     title: '信息提示',
          //     content: '请长按要打印标签的资产！',
          //     showCancel: false,
          //     success: function (res) {

          //     }
          //   })
          //   return;
          // }

          me.exportEqptListExcel()


        } 
        
        else if (e.tapIndex == 1) {
          me.exportStockEqptExcel()


        }else if (e.tapIndex == 2) {//打印


          if (me.data.selectedEqptIDs.length <= 0) {
            wx.showModal({
              title: '信息提示',
              content: '请长按要打印标签的设备！',
              showCancel: false,
              success: function (res) {

              }
            })
            return;
          }


          wx.navigateTo({
            url: '/eqpt/bleConnect/bleConnect?selectedEqptIDs=' + me.data.selectedEqptIDs,
          })
          // Print.printText(me.data.selectedEqptIDs, function (data) {
          //   console.log(data.data.result)

          // })
          me.setData({
            selectedEqptIDs: ""
          })

          me.setData({
            editStatus: false,

          })




        }
      }
    })

  },
//导出资产列表
  exportEqptListExcel: function () {

    wx.showLoading({
      title: '加载中',
    })
    var me = this;


    wx.request({
      url: requestUrl + '/creatEqptListExcel',
      method: "POST",
      data: {
        fCmpyID: app.globalData.orgInfo.fCmpyID.value,
        // EqptIDs: EqptIDs,
        // fPsnID: app.globalData.orgInfo.fPath.value,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.flag && res.data.flag == "成功") {

          me.downLoadFile2()

        }
        console.log(res)

      }
    })

  },

  //导出资产库存统计表
  exportStockEqptExcel: function (EqptIDs) {

    wx.showLoading({
      title: '加载中',
    })
    var me = this;


    wx.request({
      url: requestUrl + '/creatCmpyStockEqptExcel',
      method: "POST",
      data: {
        fCmpyID: app.globalData.orgInfo.fCmpyID.value,
        EqptIDs: EqptIDs,
        fPsnID: app.globalData.orgInfo.fPath.value,
   
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
       
        if (res.data.flag && res.data.flag == "成功") {

          me.downLoadFile3()

        }
        console.log(res)

      }
    })

  },

  downLoadFile3: function () {

    wx.downloadFile({


      url: downloadExcelUrl + app.globalData.orgInfo.fCmpyID.value +"stockExcel.xls",
      success: function (res) {
        wx.hideLoading({})
        wx.openDocument({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log(res, "成功")
            wx.hideLoading()


          },
          fail: function (res) {
            console.log(res, "失败")

          },
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '下载文件失败',
          content: "由于生成文件的大小超过了微信限制，请根据索引号(" + app.globalData.userInfo.userID + ")与管理员联系，通过其他方式传递该文件",
        })
        console.log(res, "失败")
        wx.hideLoading({})
      },
    })

  },

  downLoadFile2: function () {

    wx.downloadFile({


      url: downloadExampleUrl + "/eqptOprationRecord/" + app.globalData.orgInfo.fCmpyID.value + "EqptList.xls",
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


  userInput: function (e) {//获取组件中传回来的值


    this.setData({
      CompanyEqptFiles: [],
      inputVal: e.detail.data
    })
    this.LoadCompanyEqptFiles(0, true);
  },

  relateAction: function () {
    var me = this;
    wx.showActionSheet({
      itemList: ['下载选择的资产标签', '下载所有的资产标签', '导出资产报表','取消'],
      success: function (e) {
        me.setData({
          editStatus: false
        })
        console.log(e.tapIndex)
        if (e.tapIndex == 0) {

          wx.showLoading({
            title: '正在加载',
          })
          var fileter = "eqp_equipment.fEqpID in ('" + me.data.selectedEqptIDs + "')"
          me.printEqptLable(fileter)
        }
        else if (e.tapIndex == 1) {

          wx.showLoading({
            title: '正在加载',
          })
          var fileter = "eqp_equipment.fEqpCmpyID='" + app.globalData.userInfo.fCmpyID + "' and eqp_equipment.fEqpStatus<>'资产报废'"
          me.printEqptLable(fileter)
        } else if (e.tapIndex == 2){

         me.exportEqptExcel()
        }


      }
    })

  },


  relateActionNew: function () {

    var me = this;

    for (var i = 0; i < me.data.CompanyEqptFiles.length;i++){
      me.data.EqptIDs[i] = me.data.CompanyEqptFiles[i].fEqpID.value
    }
    me.exportEqptExcel(me.data.EqptIDs.join("','"));
    console.log("EqptIDs", me.data.EqptIDs.join("','"))

    // wx.showActionSheet({
    //   itemList: [ '下载所有的资产标签', '导出资产报表','下载新的资产标签'],
    //   success: function (e) {
    //     me.setData({
    //       editStatus: false
    //     })
    //     console.log(e.tapIndex)
     
    //    if (e.tapIndex == 0) {

    //       wx.showLoading({
    //         title: '正在加载',
    //       })
    //       var fileter = "eqp_equipment.fEqpID in ('" + me.data.EqptIDs.join("','") + "')"
      
    //       me.printEqptLable(fileter)
    //     } else if (e.tapIndex == 1) {

    //       me.exportEqptExcel()
    //     }else{
    //      me.printEqptLableNew()
    //     }


    //   }
    // })



    // wx.showActionSheet({
    //   itemList: ['下载所有的资产标签', '导出资产报表'],
    //   success: function (e) {
    //     me.setData({
    //       editStatus: false
    //     })
    //     console.log(e.tapIndex)

    //     if (e.tapIndex == 0) {

    //       me.printEqptLableNew()

    //      // me.printEqptLable(fileter)
    //     } else  {

        
    //     }


    //   }
    // })

  },





  printEqptLable: function (filterString) {
    var me = this;

    wx.request({
      url: requestUrl + '/printEqptLable',
      method: "POST",
      data: {
        fileterString: filterString,
        fUserID: app.globalData.userInfo.userID

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        me.downLoadFile1()



      }
    })

  },
  editSelect: function () {

    var me = this;
    

       
        

          me.setData({
            editStatus: true,
            selectedEqptIDs: ""
          })

    

    








   
  },

  //选中多选框事件
  checkboxChange: function (e) {

    //     if (e.detail.value.length>10){
    // wx.showModal({
    //   title: '信息提示',
    //   content: '每次打开资产标签的数量不能超过10个',
    // })

    // }
    this.setData({
      selectedEqptIDs: e.detail.value.join("','")
    })


  },

  /**
  * 到指定文件中，下载excel
  */
  downLoadFile1: function () {

    wx.downloadFile({


      url: downloadExcelUrl + app.globalData.userInfo.userID + ".xls",
      success: function (res) {
        wx.hideLoading({})
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
        wx.showModal({
          title: '下载文件失败',
          content: "由于生成文件的大小超过了微信限制，请根据索引号(" + app.globalData.userInfo.userID + ")与管理员联系，通过其他方式传递该文件",
        })
        console.log(res, "失败")
        wx.hideLoading({})
      },
    })

  },

  companyEqptFilesDetail:function(e){

    if (this.data.editStatus == true) {
      return;
    }

    wx.navigateTo({ url: "/eqpt/eqptDetail/eqptDetail?fEqpID=" + e.currentTarget.id })
  },

  LoadCompanyEqptFiles: function (offset, append) {

    // if (this.data.isLoading == false) {
    //   return;
    // }

    var me = this
    wx.request({
      url: requestUrl + '/queryCompanyEqptFiles',
      method: "POST",
      data: {
        inputVal: this.data.inputVal,
        fEqpCmpyID: app.globalData.orgInfo.fCmpyID.value,
        limit: this.data.limit,
        offset: offset

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        if (res.data.table.rows.length < me.data.limit) {
          me.setData({
            isLoading: false
          })

        } else {
          me.setData({
            isLoading: true
          })
        }

        for (var i = 0; i < res.data.table.rows.length; i++) {

          res.data.table.rows[i].fEqpImg1 = me.getImgFromList(res.data.table.rows[i].fEqpImg.value)

          // res.data.rows[i].fdate = res.data.rows[i].fOperationTime.value?res.data.rows[i].fOperationTime.value.substring(0, 10):""
        

        }
        if (append == true) {
          me.setData({
            eqptNum: res.data.eqptNum,
            CompanyEqptFiles: me.data.CompanyEqptFiles.concat(res.data.table.rows)
          })
        } else {
          me.setData({
            eqptNum: res.data.eqptNum,
            CompanyEqptFiles: res.data.table.rows
          })
        }


        wx.stopPullDownRefresh({
          complete: function (res) {


          }
        })




      }
    })



  },
//导出资产报表
  exportEqptExcel: function (EqptIDs){
    wx.showLoading({
      title: '加载中',
    })
    var me = this;  
    wx.request({
      url: requestUrl + '/creatEqptExcel',
      method: "POST",
      data: {
        fCmpyID: app.globalData.orgInfo.fCmpyID.value,
        EqptIDs: EqptIDs
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
//下载新的资产标签
  printEqptLableNew:function(){
    wx.showLoading({
      title: '加载中',
    })
    var me = this;
    wx.request({
      url: requestUrl + '/creatEqptExcelNew',
      method: "POST",
      data: {
        fCmpyID: app.globalData.userInfo.fCmpyID
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


      url: downloadExampleUrl + "/固定资产明细表.xls",
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
    console.log("拿到资产图片列表", fEqpImg)
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

//去掉部门全名称的前两个字符
  getfDeptFName: function (fDeptFName) {
    return fDeptFName.substring(2)
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
    this.LoadCompanyEqptFiles(0, false)

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.editStatus == true) {
      return
    }
    this.LoadCompanyEqptFiles(this.data.CompanyEqptFiles.length, true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})