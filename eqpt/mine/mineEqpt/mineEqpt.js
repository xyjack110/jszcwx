// eqpt/mine/mineEqpt/mineEqpt.js
var app = getApp()
var requestUrl = require('../../../config.js').requestUrl
var downloadExcelUrl = require('../../../config.js').downloadExcelUrl
var tsc = require("../../../util/tsc.js");
var Print = require('../../bleConnect/print.js').Print
var downloadExampleUrl = require('../../../config.js').downloadExampleUrl
Page({

  /**
   * 页面的初始数据      
   */
  data: {
    eqptList: [],
    isLoading: true,
    limit: 7,
    editStatus: false,
    selectedEqptIDs: "",
    inputShowed: false,
    inputVal: "",
    eqptCondition: [],
    showSearchOption: false,
    EqptIDs: [],






  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {





    var me = this;
    this.loadEqptList1(0, true);


    wx.setNavigationBarTitle({
      title: "我们的资产",
      success: function () {

      },
      fail: function (err) {

      }
    })









    //打印
    var that = this;
    setTimeout(function () {
      // wx.notifyBLECharacteristicValueChange({
      //   deviceId: that.data.deviceId,
      //   serviceId: that.data.notifyServiceId,
      //   characteristicId: that.data.notifyCharaterId,
      //   state: true,
      //   success: function(res) {
      //     wx.onBLECharacteristicValueChange(function(r) {
      //     //  console.log(`characteristic ${r.characteristicId} has changed, now is ${r}`)
      //     })
      //     console.log(e, "notifyBLECharacteristicValueChangesuccess")
      //   },
      //   fail: function(e) {
      //     console.log(e,"notifyBLECharacteristicValueChangefail")
      //   },
      //   complete: function(e) {
      //     console.log(e)
      //   }
      // })
    }, 500)
  },

  userInput: function (e) { //获取组件中传回来的值


    this.setData({
      eqptList: [],
      inputVal: e.detail.data
    })
    this.loadEqptList1(0, true);
  },




  //选中多选框事件
  checkboxChange: function (e) {

    //将数组用，分割，连接成字符串
    this.setData({
      selectedEqptIDs: e.detail.value.join("','")
    })

  },

  mineEqptDetail: function (e) {

    if (this.data.editStatus == true) {
      return;
    }
    wx.navigateTo({
      url: "/eqpt/eqptDetail/eqptDetail?fEqpID=" + e.currentTarget.id
    })
  },
  //获取第一张图片，没值给给个默认图片
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

  //分页加载我的资产
  loadEqptList: function (offset, append) {

    if (this.data.isLoading == false) {
      return;
    }
    var me = this;

    wx.request({
      url: requestUrl + '/queryUsEqp_equipment',
      method: "POST",
      data: {
        fPsnID: app.globalData.userInfo.userID,
        fCmpyID: app.globalData.userInfo.fCmpyID,
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
        if (append == true) { //执行分页
          me.setData({
            eqptList: me.data.eqptList.concat(res.data.rows)
          })
        } else {
          me.setData({
            eqptList: res.data.rows
          })
        }

        console.log("查询我的资产信息成功", res)
        wx.stopPullDownRefresh({
          complete: function (res) {


          }
        })

      }
    })

  },
  editSelect: function () {

    this.setData({
      editStatus: true,
      selectedEqptIDs: ""
    })
  },

  //导出资产标签
  printEqptLable: function (filterString) {
    var me = this;

    wx.request({
      url: requestUrl + '/printEqptLable',
      method: "POST",
      data: {
        fileterString: filterString,
        fUserID: app.globalData.orgInfo.fPath.value,
        fPsnName: app.globalData.userInfo.psnName.value
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //到指定文件中，下载excel
        me.downLoadFile()



      }
    })

  },


  /**
   * 到指定文件中，下载excel
   */
  downLoadFile: function () {

    wx.downloadFile({


      url: downloadExcelUrl + app.globalData.userInfo.psnName.value + ".xls",
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


  downLoadFile2: function () {

    wx.downloadFile({


      url: downloadExcelUrl + app.globalData.orgInfo.fCmpyID.value + "EqptStockExcel.xls",
      success: function (res) {

        wx.openDocument({
          filePath: res.tempFilePath,
          fileType: 'xls',
          success: function (res) {
            console.log(res, "成功")
            wx.hideLoading()


          },
          fail: function (res) {
            console.log(res, "失败ss")

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
  //执行相关操作按钮
  relateAction: function () {


    this.setData({
      editStatus: false
    })




    if (this.data.selectedEqptIDs) {
      wx.showLoading({
        title: '正在加载',
      })

      var fileter = "eqp_equipment.fEqpID in ('" + this.data.selectedEqptIDs + "')"
      this.printEqptLable(fileter)
    }







  },


  // relateActionNew: function() {

  //   var me = this;

  //   for (var i = 0; i < me.data.eqptList.length; i++) {
  //     me.data.EqptIDs[i] = me.data.eqptList[i].fEqpID.value
  //   }
  //   console.log("EqptIDs", me.data.EqptIDs.join("','"))
  //   var arrList = [ '导出资产库存统计表']
  //   if (app.BLEInformation.blueTooh ) {
  //     arrList.push("打印标签 " + app.BLEInformation.blueToohName)
  //   }else{
  //     arrList.push("打印标签 (先连接打印机)" )
  //   }
  //   wx.showActionSheet({
  //     itemList: arrList,
  //     success: function(e) {
  //       me.setData({
  //         editStatus: false
  //       })
  //       console.log(e.tapIndex)

  //       if (e.tapIndex == 0) {


  //         me.exportEqptExcel(me.data.EqptIDs.join("','"))


  //       } else if (e.tapIndex == 1) {//打印
  //         Print.printText(me.data.selectedEqptIDs, function (data) {
  //           console.log(data.data.result)

  //         })
  //         me.setData({
  //           selectedEqptIDs: ""
  //         })

  //         me.setData({
  //           editStatus: false,

  //         })




  //       } 
  //     }
  //   })

  // },


  relateActionNew: function () {

    var me = this;

    for (var i = 0; i < me.data.eqptList.length; i++) {
      me.data.EqptIDs[i] = me.data.eqptList[i].fEqpID.value
    }
    console.log("EqptIDs", me.data.EqptIDs.join("','"))
    var arrList = ['导出资产库存统计表', '导出资产列表']

    wx.showActionSheet({
      itemList: arrList,
      success: function (e) {
        me.setData({
          editStatus: false
        })
        console.log(e.tapIndex)

        if (e.tapIndex == 0) {


          me.exportEqptExcel(me.data.EqptIDs.join("','"))


        } else if (e.tapIndex == 1) {
          me.exportEqptListExcel()
        }
      }
    })

  },

  downLoadFile3: function () {
    console.log(wx.env.USER_DATA_PATH + "pathpath")

  
    wx.downloadFile({

 
      url: downloadExampleUrl + "/eqptOprationRecord/" + app.globalData.orgInfo.fCmpyID.value + "USLIST.xls",
      success: function (res) {
        console.log(res.tempFilePath)

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



  //导出资产列表
  exportEqptListExcel: function () {

    wx.showLoading({
      title: '加载中',
    })
    var me = this;
    var psnFilter = app.globalData.orgInfo.fPath.value;

    console.log(this.data.inputVal + "加载")
    //根据这个人的全路径拿这个人的部门全路径
    if (app.globalData.orgInfo.fAuth.value && app.globalData.orgInfo.fAuth.value.indexOf('部门查询') > -1) {
      var t = []
      t = app.globalData.orgInfo.fPath.value.split("/")
      t.length = t.length - 1;
      psnFilter = t.join("/");
    }

    wx.request({
      url: requestUrl + '/creatUSEqptListExcel',
      method: "POST",
      data: {
        fCmpyID: app.globalData.orgInfo.fCmpyID.value,
        psnFilter: psnFilter,
        // EqptIDs: EqptIDs,
        // fPsnID: app.globalData.orgInfo.fPath.value,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.flag && res.data.flag == "成功") {

          me.downLoadFile3()

        }
        console.log(res)

      }
    })

  },


  //导出资产库存统计表
  exportEqptExcel: function (EqptIDs) {

    wx.showLoading({
      title: '加载中',
    })
    var me = this;

    var psnFilter = app.globalData.orgInfo.fPath.value;

    console.log(this.data.inputVal + "加载")
    //根据这个人的全路径拿这个人的部门全路径
    if (app.globalData.orgInfo.fAuth.value && app.globalData.orgInfo.fAuth.value.indexOf('部门查询') > -1) {
      var t = []
      t = app.globalData.orgInfo.fPath.value.split("/")
      t.length = t.length - 1;
      psnFilter = t.join("/");
    }
    wx.request({
      url: requestUrl + '/creatStockEqptExcel',
      method: "POST",
      data: {
        fCmpyID: app.globalData.orgInfo.fCmpyID.value,
        EqptIDs: EqptIDs,
        fPsnID: app.globalData.orgInfo.fPath.value,
        psnFilter: psnFilter
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        if (res.data.flag && res.data.flag == "成功") {

          me.downLoadFile2()

        }
        console.log(res)

      }
    })

  },

  //去掉部门全名称的前两个字符
  getfDeptFName: function (fDeptFName) {
    return fDeptFName.substring(2)
  },

  //分页加载我过滤的资产
  loadEqptList1: function (offset, append) {

    var me = this;
    var psnFilter = app.globalData.orgInfo.fPath.value;

    console.log(this.data.inputVal + "加载")
    //根据这个人的全路径拿这个人的部门全路径
    if (app.globalData.orgInfo.fAuth.value && app.globalData.orgInfo.fAuth.value.indexOf('部门查询') > -1) {
      var t = []
      t = app.globalData.orgInfo.fPath.value.split("/")
      t.length = t.length - 1;
      psnFilter = t.join("/");
    }
    wx.request({
      url: requestUrl + '/queryFilterEqptList',
      method: "POST",
      data: {
        orgInfoID: app.globalData.orgInfo.fID.value,
        inputVal: this.data.inputVal,
        psnFilter: psnFilter,
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
        for (var i = 0; i < res.data.rows.length; i++) {
          res.data.rows[i].fEqpImg1 = me.getImgFromList(res.data.rows[i].fEqpImg.value)


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
          //     res.data.rows[i].fDeptName = res.data.rows[i].fCmpyName.value + "/" + me.getfDeptFName(res.data.rows[i].fDeptFName.value) + "/" + res.data.rows[i].fPsnName.value
          //   }


          // }
        }

        if (append == true) { //执行分页
          me.setData({
            eqptList: me.data.eqptList.concat(res.data.rows)
          })
        } else {
          me.setData({
            eqptList: res.data.rows
          })
        }

        console.log("查询我的资产信息成功", res)



      }, fail: function (err) {

      }
    })
    wx.stopPullDownRefresh({
      complete: function (res) {


      }
    })


  },




  //在数组中，找到包含somthing的6个元素
  findSthInArr: function (arr, element) {
    var t = [];
    for (var i = 0; i < arr.length; i++) {

      if (arr[i].indexOf(element) != -1) {
        t.push(arr[i])
        if (t.length > 5) {
          return t;
        }

      }

    }
    return t;

  },




  in_array: function (arr, e) {
    var r = new RegExp(',' + e + ',');
    return (r.test(',' + arr.join(arr.S) + ','));
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var list = []
    var numList = []
    var j = 0
    for (var i = 20; i < 200; i += 10) {
      list[j] = i;
      j++
    }
    for (var i = 1; i < 10; i++) {
      numList[i - 1] = i
    }
    this.setData({
      buffSize: list,
      oneTimeData: list[0],
      printNum: numList,
      printerNum: numList[0]
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // var me=this;
    // wx.getStorage({
    //   key: 'blueTooh',
    //   success: function (res) {
    //     console.log(res.data, "blueTooh连接成功")
    //     
    //     me.setData({
    //       blueToohConncat: res.data
    //     })

    //   },
    //   fail: function (err) {

    //   }

    // })

    // wx.getStorage({
    //   key: 'blueToohName',
    //   success: function (res) {
    //     console.log(res.data, "blueToohName连接成功")
    //     
    //     me.setData({
    //       blueToohName: res.data
    //     })

    //   }

    // })

    // wx.getStorage({
    //   key: 'deviceId',
    //   success: function (res) {
    //     console.log(res.data, "deviceId连接成功")

    //     me.setData({
    //       deviceId: res.data
    //     })

    //   }

    // })

    // wx.getStorage({
    //   key: 'notifyCharaterId',
    //   success: function (res) {
    //     console.log(res.data, "notifyCharaterId连接成功")
    //     
    //     me.setData({
    //       notifyCharaterId: res.data
    //     })

    //   }

    // })

    // wx.getStorage({
    //   key: 'notifyServiceId',
    //   success: function (res) {
    //     console.log(res.data, "notifyServiceId连接成功")
    //     
    //     me.setData({
    //       notifyServiceId: res.data
    //     })

    //   }

    // })

    // wx.getStorage({
    //   key: 'writeCharaterId',
    //   success: function (res) {
    //     console.log(res.data, "writeCharaterId连接成功")

    //     me.setData({
    //       writeCharaterId: res.data
    //     })

    //   }

    // })

    // wx.getStorage({
    //   key: 'writeServiceId',
    //   success: function (res) {
    //     console.log(res.data, "writeServiceId连接成功")

    //     me.setData({
    //       writeServiceId: res.data
    //     })

    //   }

    // })

    // wx.getStorage({
    //   key: 'readCharaterId',
    //   success: function (res) {
    //     console.log(res.data, "readCharaterId连接成功")

    //     me.setData({
    //       readCharaterId: res.data
    //     })

    //   }

    // })

    // wx.getStorage({
    //   key: 'readServiceId',
    //   success: function (res) {
    //     console.log(res.data, "readServiceId连接成功")

    //     me.setData({
    //       readServiceId: res.data
    //     })

    //   }

    // })


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
    // wx.closeBLEConnection({
    //   deviceId: app.BLEInformation.deviceId,
    //   success: function (res) {
    //     console.log("关闭蓝牙成功")
    //   },
    // })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

    this.setData({

      isLoading: true
    })

    this.loadEqptList1(0, false);

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.editStatus == true) {
      return
    }
    this.loadEqptList1(this.data.eqptList.length, true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})