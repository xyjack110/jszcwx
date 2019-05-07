// pages/blueconn/blueconn.js
var app = getApp()
var Print = require('../bleConnect/print.js').Print
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    services: [],
    serviceId: 0,
    writeCharacter: false,
    readCharacter: false,
    notifyCharacter: false,
    isScanning: false,
     connectedDeviceId:"",
    deviceId:"",
    selectedEqptIDs:"",
    printBtn:false
  },
//开始搜索
  startSearch: function () {
    var that = this
    app.BLEInformation.list = []
 
    app.BLEInformation.blueTooh = false

    that.setData({
      blueTooh: false,
      list:[],
     
    })

    wx.closeBLEConnection({
       deviceId: app.BLEInformation.deviceId,
     //deviceId: "DC:0D:30:36:28:DC",
      success: function (res) {
console.log("关闭蓝牙成功")

      }, fail: function (e) {
    
        console.log(e,"关闭蓝牙失败")
    
     


     
      }
    })
    wx.openBluetoothAdapter({
      success: function (res) {
        wx.getBluetoothAdapterState({
          success: function (res) {
            if (res.available) {
              if (res.discovering) {
          
                wx.stopBluetoothDevicesDiscovery({
                  success: function (res) {
                    console.log(res)
                  }
                })
              }
              that.checkPemission()
            } else {
              wx.showModal({
                title: '提示',
                content: '本机蓝牙不可用',
              })
            }
          },
        })
      }, fail: function () {
        wx.showModal({
          title: '提示',
          content: '蓝牙初始化失败，请打开蓝牙',
        })

      }
    })
  },

  startSearch1: function () {
    var that = this
    wx.openBluetoothAdapter({
      success: function (res) {

      }, fail: function () {
        app.BLEInformation.list = []
        app.BLEInformation.connectedDeviceId = '否'
        app.BLEInformation.blueTooh = false
    
        // wx.setStorageSync('list', [])
        // wx.setStorageSync('connectedDeviceId', "否")
        // wx.setStorageSync('blueTooh', false)
      }
    })
  },
  checkPemission: function () {  //android 6.0以上需授权地理位置权限
    var that = this
    var platform = app.BLEInformation.platform
    if (platform == "ios") {

      app.globalData.platform = "ios"
      that.getBluetoothDevices()
    } else if (platform == "android") {
  
      app.globalData.platform = "android"
      console.log(app.getSystem().substring(app.getSystem().length - (app.getSystem().length - 8), app.getSystem().length - (app.getSystem().length - 8) + 1),"未知")
      if (app.getSystem().substring(app.getSystem().length - (app.getSystem().length - 8), app.getSystem().length - (app.getSystem().length - 8) + 1) > 5) {
        wx.getSetting({
       
          success: function (res) {
  
            console.log(res)
            if (!res.authSetting['scope.userLocation']) {
 
              wx.authorize({
                scope: 'scope.userLocation',
                complete: function (res) {
                  that.getBluetoothDevices()
                }
              })
            } else {
      
              that.getBluetoothDevices()
            }
          },
           fail: function (e) {
         

             console.log(e, "getSetting失败")

          }

        })
      }else{

      //  that.getBluetoothDevices()
        wx.getSetting({
          success: function (res) {
 
            console.log(res)
            if (!res.authSetting['scope.userLocation']) {
        
              wx.authorize({
                scope: 'scope.userLocation',
                complete: function (res) {
                  that.getBluetoothDevices()
                }
              })
            } else {
    
              that.getBluetoothDevices()
            }
          },
          fail: function (e) {
     

            console.log(e, "getSetting失败")

          }

        })
      }
    }
  },
     // 
  getBluetoothDevices: function () { 
    //获取蓝牙设备信息

    var that = this
    console.log("start search")
    wx.showLoading({
      title: '正在加载',
    })
    that.setData({
      isScanning:true
    })
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
       
        console.log(res)
        setTimeout(function () {
          wx.getBluetoothDevices({
     
            success: function (res) {
           
              var devices = []
              var num = 0
              for (var i = 0; i < res.devices.length; ++i) {
                if (res.devices[i].name.indexOf("Printer") > -1 ) {
             
                   devices[num] = res.devices[i]
                   num++
                 }
              }
              that.setData({
                list: devices,
                isScanning:false
              })
              app.BLEInformation.blueToohName = devices.length>0 ? devices[0].name:""
              // wx.setStorageSync('blueToohName', devices.length > 0 ? devices[0].name : "")
              wx.hideLoading()
              wx.stopPullDownRefresh()
            },
            fail: function (e) {
     

              console.log(e, "getBluetoothDevices失败")

            }
          })
        }, 3000)
      }, fail: function (e) {

    
        console.log(e, "startBluetoothDevicesDiscovery失败")
 
      }
    })
  },
  bindViewTap: function (e) {

    var that = this
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) { 
    
        console.log(res) },
    })

    that.setData({
      serviceId: 0,
      writeCharacter: false,
      readCharacter: false,
      notifyCharacter: false
    })

    console.log(e.currentTarget.dataset.title,"title")
    wx.showLoading({
      title: '正在连接',
    })
  
    wx.createBLEConnection({
    //timeout:400000,
      deviceId: e.currentTarget.dataset.title,
      success: function (res) {
        console.log(res,"createBLEConnection")
      //  wx.setStorageSync('deviceId', e.currentTarget.dataset.title)
 
     app.BLEInformation.deviceId = e.currentTarget.dataset.title
        that.setData({
          deviceId: e.currentTarget.dataset.title
        })
        app.BLEInformation.list = that.data.list
      //  wx.setStorageSync('list', that.data.list)

        console.log('blueTooh is true')  
       //  wx.setStorageSync('blueTooh', true)
        that.getSeviceId()
      }, fail: function (e) {

        wx.showModal({
          title: '提示',
          content: '连接失败1',
        })
        wx.closeBLEConnection({
          deviceId: app.BLEInformation.deviceId,
          success: function (res) {
      
            console.log("关闭连接成功")
          }, fail: function (e) {
        

            console.log(e, "关闭连接失败")

          }
        })

    
      
 
      
        console.log(e,"hh")
        wx.hideLoading()
     


      }, complete: function (e) {
      //  console.log(e)
      }
    })
  },

  getSeviceId: function () {

    var that = this
    var platform = app.BLEInformation.platform

    wx.getBLEDeviceServices({
      deviceId: app.BLEInformation.deviceId,
      success: function (res) {
 
        console.log(res)
        // var realId = ''
        // if (platform == 'android') {
        //   // for(var i=0;i<res.services.length;++i){
        //   // var item = res.services[i].uuid
        //   // if (item == "0000FEE7-0000-1000-8000-00805F9B34FB"){
        //   realId = "0000FEE7-0000-1000-8000-00805F9B34FB"
        //   //       break;
        //   //     }
        //   // }
        // } else if (platform == 'ios') {
        //   // for(var i=0;i<res.services.length;++i){
        //   // var item = res.services[i].uuid
        //   // if (item == "49535343-FE7D-4AE5-8FA9-9FAFD205E455"){
        //   realId = "49535343-FE7D-4AE5-8FA9-9FAFD205E455"
        //   // break
        //   // }
        //   // }
        // }
        // app.BLEInformation.serviceId = realId
        that.setData({
          services: res.services
        })
        that.getCharacteristics()
      }, fail: function (e) {
       
        wx.showModal({
          title: '提示',
          content: '连接失败',
        })
        wx.closeBLEConnection({
          deviceId: app.BLEInformation.deviceId,
          success: function (res) {
            console.log("关闭连接成功")
          },
        })
       
        wx.hideLoading()
        console.log(e)
      }, complete: function (e) {
        console.log(e)
      }
    })
  },
  getCharacteristics: function () {

    var that = this
    var list = that.data.services
    var num = that.data.serviceId
    var write = that.data.writeCharacter
    var read = that.data.readCharacter
    var notify = that.data.notifyCharacter
    wx.getBLEDeviceCharacteristics({
      deviceId: app.BLEInformation.deviceId,
      serviceId: list[num].uuid,
      success: function (res) {
        console.log(res)
      
        for (var i = 0; i < res.characteristics.length; ++i) {
          var properties = res.characteristics[i].properties
          var item = res.characteristics[i].uuid
          if (!notify) {
            if (properties.notify) {
             // wx.setStorageSync('notifyCharaterId', item)
             // wx.setStorageSync('notifyServiceId', list[num].uuid)
         

             app.BLEInformation.notifyCharaterId = item
             app.BLEInformation.notifyServiceId = list[num].uuid
              notify = true
            }
          }
          if (!write) {
            if (properties.write) {

             //wx.setStorageSync('writeCharaterId', item)
            //  wx.setStorageSync('writeServiceId', list[num].uuid)
             app.BLEInformation.writeCharaterId = item
              app.BLEInformation.writeServiceId = list[num].uuid
              write = true
            }
          }
          if (!read) {
            if (properties.read) {
             // wx.setStorageSync('readCharaterId', item)
             // wx.setStorageSync('readServiceId', list[num].uuid)
               app.BLEInformation.readCharaterId = item
              app.BLEInformation.readServiceId = list[num].uuid
              read = true
            }
          }
        }
        if (!write || !notify || !read) {
          num++
          that.setData({
            writeCharacter: write,
            readCharacter: read,
            notifyCharacter: notify,
            serviceId: num
          })
         if(num == list.length){
           wx.showModal({
             title: '提示',
             content: '找不到该读写的特征值',
           })
         }else{
           that.getCharacteristics()
         }
        } else {
          wx.showToast({
            title: '连接成功',
          })

          that.setData({
            blueTooh: true,
            printBtn: true
          })
        
    
       app.BLEInformation.blueTooh = true
          //wx.setStorageSync('blueTooh', true)
         // that.openControl()
        }
      }, fail: function (e) {
        console.log(e)
      }, complete: function (e) {
      
      }
    })
  },
  openControl: function () {
    wx.navigateTo({
      url: '../sendCommand/sendCommand',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var me=this;
    this.startSearch1()
    app.BLEInformation.platform = app.getPlatform()
    this.setData({
      blueTooh: app.BLEInformation.blueTooh ,
 
    })
    // wx.setStorageSync('list', [])
    // wx.setStorageSync('connectedDeviceId', "否")
    // wx.setStorageSync('blueTooh', false)

    
  
   
    app.BLEInformation.blueTooh = true
 // setTimeout(function () {

        me.setData({
          list: app.BLEInformation.list,
          connectedDeviceId: app.BLEInformation.connectedDeviceId,
          selectedEqptIDs: options.selectedEqptIDs
          })


//     wx.getStorage({

//       key: 'deviceId',
//       success: function (res) {
//         console.log(res.data)
//       
//         me.setData({
//           deviceId: res.data
//         })

//       }

//     })
//  wx.getStorage({

//    key: 'blueTooh',
//         success: function (res) {
//           console.log(res.data)

//           me.setData({
//             blueTooh: res.data
//           })
        
//         }

//       })

      

//       wx.getStorage({

//         key: 'list',
//         success: function (res) {
//           console.log(res.data)

//           me.setData({
//             list: res.data
//           })

//         }

//       })

//       wx.getStorage({

//         key: 'connectedDeviceId',
//         success: function (res) {
//           console.log(res.data, "sss")

//           me.setData({
//             connectedDeviceId: res.data
//           })

//         }

//       })





//     }, 500)
  },

  printEqpt:function(){

          Print.printText(this.data.selectedEqptIDs, function (data) {
            console.log(data.data.result)

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
      var that = this
      wx.startPullDownRefresh({})
      that.startSearch()
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