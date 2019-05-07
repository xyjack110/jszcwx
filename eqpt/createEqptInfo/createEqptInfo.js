    // eqpt/createEqptInfo/createEqptInfo.js
var baseurl = require('../../config.js').requestUrl
var COS = require('../../fishbearComponents/uploader/cos-wx-sdk-v5')
var config = require('./config')
var requestCosUrl = require('./config.js').requestCosUrl
var app = getApp()
var KeyArr = [];
var util = require('../../util/util.js')
var Print = require('../bleConnect/print.js').Print
var cos = new COS({

  getAuthorization: function (params, callback) {//获取签名 必填参数

  
    var authorization = COS.getAuthorization({
      SecretId: 'AKIDY1KYbXeO9j9OJ8sKg8R4iEYkcN0UeslH',
      SecretKey: 'iWEpDTGxXzFJB0e5KNRfkDj9MNCqdJqH',
      Method: params.Method,
      Key: params.Key
    });

    callback(authorization);


  }
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    eqptInfo: { fEqptType: "", fEqpTypeID: "", fEqptSize: "", fEqptCode: "", fEqptDesc: "", fEqptimg: "", fEqptNum: 1, fProducer: "", fEqptDate: util.dateToString(new Date()), fEqpID: "", fEqpCmpyID:""},
    preEqptInfo:{},
    fEqpTypeID:[],
    array: [],
    index: 0,
    userID: "",//手机用户ID

    token:"",
    imgList:[],
    btnStatus: false,
    SN:false,
    checkItems:[],
    CodeArr:[],
    recur:false,
    printFlag: false,
    deleteShow:false
  },

  //点击蒙版事件
  _clearDelete: function () {

    this.setData({
      deleteShow: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 

var me=this
if (options.fEqpID){//通过ID判断是修改还是新增


  wx.request({//向数据库中查出该公司的资产
    url: baseurl + '/queryEqp_equipment',
    method: "POST",
    data: {
      filter: "fEqpID='" + options.fEqpID + "'",


    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      if(res.data.rows.length>0){
        me.setData({
         "eqptInfo.fEqptType":res.data.rows[0].fEqpType.value,
         "eqptInfo.fEqptSize": res.data.rows[0].fEqpSize.value,  
         "eqptInfo.fEqpTypeID": res.data.rows[0].fEqpTypeID.value,
         "eqptInfo.fEqptDesc": res.data.rows[0].fEqpDesc.value,
         "imgList": res.data.rows[0].fEqpImg.value? res.data.rows[0].fEqpImg.value.split("@"):[],
         "fEqptCode": res.data.rows[0].fEqpNum.value,
         "eqptInfo.fProducer": res.data.rows[0].fProducer.value,
          "eqptInfo.fFinancial": res.data.rows[0].fFinancial.value,
          "eqptInfo.fEqptDate": res.data.rows[0].fEqptDate.value,
         "eqptInfo.fEqpID": res.data.rows[0].fEqpID.value,
         "eqptInfo.fEqpCmpyID": res.data.rows[0].fEqpCmpyID.value,
         
        })

        me.setData({
          "preEqptInfo.fEqptType": res.data.rows[0].fEqpType.value,
          "preEqptInfo.fEqptSize": res.data.rows[0].fEqpSize.value,
          "eqptInfo.fFinancial": res.data.rows[0].fFinancial.value,
          "preEqptInfo.fEqpTypeID": res.data.rows[0].fEqpTypeID.value,
          "preEqptInfo.fEqptDesc": res.data.rows[0].fEqpDesc.value,
          "preEqptInfo.PreImgList": res.data.rows[0].fEqpImg.value,
          "fEqptCode": res.data.rows[0].fEqpNum.value,
          "preEqptInfo.fProducer": res.data.rows[0].fProducer.value,
          "preEqptInfo.fEqptDate": res.data.rows[0].fEqptDate.value,
          "preEqptInfo.fEqpCmpyID": res.data.rows[0].fEqpCmpyID.value,
          "preEqptInfo.fEqpID": res.data.rows[0].fEqpID.value,

        })
      }
   


    }
  })

}
    wx.request({//向数据库中查出该公司的资产类别
      url: baseurl + '/queryEqp_checkitem',
      method: "POST",
      data: {
        filter: "fCompanyID='fishbear' or fCompanyID='" + app.globalData.orgInfo.fCmpyID.value+"'",

  
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        for (var i = 0; i < res.data.rows.length;i++){
          me.setData({
              [`array[${i}]`]: res.data.rows[i].fEqptTypeName.value,
              [`fEqpTypeID[${i}]`]: res.data.rows[i].fEqpTypeID.value,
              
          })
}
      
      }
      
    })






 
  },

  print:function(){
    wx.navigateTo({
      url: '/eqpt/bleConnect/bleConnect?selectedEqptIDs=' + this.data.selectedEqptIDs,
    })
 
//     Print.printText(this.data.selectedEqptIDs, function (data) {
//       console.log(data.data.result)
// //  //返回上一级页面
// //           wx.navigateBack({
// //             delta: 1,
// //           })
//     })

    // this.setData({
    //   selectedEqptIDs: "",
    
    // })
  },

  bindDateChange: function (e) {
    this.setData({
      "eqptInfo.fEqptDate": e.detail.value
    })
  },
  fProducerChange:function(e){
    this.setData({
      "eqptInfo.fProducer": e.detail.value
    })
  },
  fEqptSizeChange: function (e) {
    this.setData({
      "eqptInfo.fEqptSize": e.detail.value
    })

  },
  fEqptCodeChange: function (e) {
    console.log("编码"+e.detail.value)
    this.setData({
      "fEqptCode": e.detail.value,
             SN: false,

    })

  },

  getSnCode:function(){
    var me = this;
    me.setData({
      recur: false
    })
  
    wx.scanCode({
      // scanType: 'barCode',
      success: function (res) {
        console.log("扫描成功的返回", res)

        // wx.showModal({
        //         title: '提示信息',
        //   content: res.result,
        //         showCancel:false,
        //         success(res) {

        //         }
        //       })
              
        if (me.data.checkItems.length==0){
          me.setData({
            "fEqptCode": res.result,
            SN: true,

          })
          var arr = me.data.checkItems
          arr.splice(0, 0, {//将值加到数组后面
            "fEqptCode": res.result,


          })
          me.setData({
            checkItems: arr,
            "eqptInfo.fEqptNum": arr.length,
            CodeArr: me.data.checkItems
          })
}else{
          for (var i = 0; i < me.data.checkItems.length;i++){
     
            if (res.result == me.data.checkItems[i].fEqptCode){

              me.setData({
                recur: true
              })
              wx.showModal({
                title: '提示信息',
                content: '编码不能重复！',
                showCancel:false,
                success(res) {
                
                }
              })

}
  }

            if (!me.data.recur) {
             
              me.setData({
                "fEqptCode": res.result,
                SN: true,

              })
              var arr = me.data.checkItems
              arr.splice(0, 0, {//将值加到数组后面
                "fEqptCode": res.result,


              })
              me.setData({
                checkItems: arr,
                "eqptInfo.fEqptNum": arr.length,
                CodeArr: me.data.checkItems
              })
            }
      

    

}
    
       
        

      

       



      },
      fail: function (res) {
        console.log("扫描失败的返回", res)
      }
    })

  },

  delete:function(e){
var me=this;

    wx.showModal({
      title: '提示信息',
      content: '确定删除该资产?',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          var index = e.currentTarget.dataset.index
          var arr = me.data.checkItems


          //执行删除操作
          arr.splice(index, 1)
          me.setData({
            checkItems: arr,
            "eqptInfo.fEqptNum": arr.length,
            CodeArr: arr
          })


          //如果该行数据小于一条，
          if (arr.length < 1) {

            me.setData({
              SN: false,
              "eqptInfo.fEqptNum": 1,
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })





  

  },

  fFinancialChange: function (e) {
    console.log("价值" + e.detail.value)
    this.setData({
      "eqptInfo.fFinancial": e.detail.value
    })

  },





  fEqptDescChange: function (e) {
    this.setData({
      "eqptInfo.fEqptDesc": e.detail.value
    })

  },
  //最多输入10个数量
  fEqptNumChange: function (e) {

  if (e.detail.value >= 1000) {
    this.setData({
      "eqptInfo.fEqptNum": 1000
    })
  } else {
    this.setData({
      "eqptInfo.fEqptNum": e.detail.value
    })
  }

  

  },
  bindPickerChange: function (e) {

    this.setData({
      index: e.detail.value,
     "eqptInfo.fEqptType":this.data.array[e.detail.value],
     "eqptInfo.fEqptTypeID": this.data.fEqpTypeID[e.detail.value],
  
    })
  },
  //执行保存按钮
  Save: function () {

    if (this.data.btnStatus == true) {
      return;
    }
    this.setData({
      btnStatus: true
    })
    
    wx.showLoading({
      title: '正在生成',
      mask: true
    })


var me=this;
    if (this.data.eqptInfo.fEqptSize==""){//判断规格型号是否必填
      wx.showModal({
        title: '提示信息',
        content: '当前规格型号没有填写！',
        success: function (res) {
          if (res.confirm) {
          

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      this.setData({
        btnStatus: false
      })
      wx.hideLoading();
      return; 
}
    if (this.data.fEqptCode == "") {//判断资产编码是否必填
      wx.showModal({
        title: '提示信息',
        content: '当前资产编码没有填写！',
        success: function (res) {
          if (res.confirm) {

           
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      this.setData({
        btnStatus: false
      })
      wx.hideLoading();
      return;
    }


    if (this.data.eqptInfo.fEqptNum == 0) {//判断数量是否为0
      wx.showModal({
        title: '提示信息',
        content: '请填写资产数量！',
        success: function (res) {
          if (res.confirm) {


          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      this.setData({
        btnStatus: false
      })
      wx.hideLoading();
      return;
    }

    console.log(this.data.eqptInfo.fEqpID,"fEqpIDfEqpIDfEqpID")


//调用上传模板，以便获取图片路径
    this.uploader = this.selectComponent("#uploader1");

//保存资产信息
    wx.request({
      url: baseurl + '/EqptInfoSaveData',
      method: "POST",
      data: {
        fEqptType: this.data.eqptInfo.fEqptType ? this.data.eqptInfo.fEqptType:this.data.array[this.data.index],
        fEqpTypeID: this.data.eqptInfo.fEqpTypeID ? this.data.eqptInfo.fEqpTypeID:this.data.fEqpTypeID[this.data.index],
        fEqpID: this.data.eqptInfo.fEqpID,
        fEqptSize: this.data.eqptInfo.fEqptSize,
        fEqptCode: this.data.fEqptCode,
        fEqptDesc: this.data.eqptInfo.fEqptDesc,
        fEqptNum: this.data.eqptInfo.fEqptNum,
        fEqpImg: this.uploader.getFileList(),
       // fEqpOperatiorID: app.globalData.userInfo.userID,
        fEqpOperatiorID: app.globalData.orgInfo.fPath.value,
       // fCmpyID: app.globalData.userInfo.fCmpyID, 
        fCmpyID: app.globalData.cmpyInfo.fID.value,
        fProducer: this.data.eqptInfo.fProducer,
        fEqptDate: this.data.eqptInfo.fEqptDate,
        fFinancial: this.data.eqptInfo.fFinancial ? this.data.eqptInfo.fFinancial:0,
        preEqptInfo: JSON.stringify(this.data.preEqptInfo),
        currentEqptInfo: JSON.stringify(this.data.eqptInfo),
     //   fEqpCmpyID: this.data.eqptInfo.fEqpID ? this.data.eqptInfo.fEqpCmpyID : app.globalData.userInfo.fCmpyID,
        fEqpCmpyID: this.data.eqptInfo.fEqpID ? this.data.eqptInfo.fEqpCmpyID : app.globalData.cmpyInfo.fID.value,
         token: me.data.token,
        SN:me.data.SN?"1":"0",
        checkItems: me.data.checkItems
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        //二维码创建成功
      //  if (res.data.success == "成功") {
  
        if (res.data.success ) {
me.setData({
  selectedEqptIDs: res.data.success,
printFlag:true,
  deleteShow:true
})
          wx.hideLoading();
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //上一个页面
          if (prevPage.pageUpdate) {

            prevPage.pageUpdate(me.data.eqptInfo.fEqpID)
          }
        }
        if (res.data.fail) {
          me.setData({
            selectedEqptIDs: res.data.success,
            printFlag: true,
            deleteShow: true
          })
          wx.hideLoading();
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //上一个页面
          if (prevPage.pageUpdate) {

            prevPage.pageUpdate(me.data.eqptInfo.fEqpID)
          }
          wx.showModal({
            title: '提示信息',
            content: res.data.fail,
            showCancel: false,
            success(res) {
              me.setData({
                btnStatus: false
              })
            }
          })

        }
        if (res.data.faile){
          
          wx.hideLoading();
          wx.showModal({
            title: '提示信息',
            content: res.data.faile,
            showCancel: false,
            success(res) {
              me.setData({
                btnStatus: false
              })
            }
          })
        }


          // //返回上一级页面
          // wx.navigateBack({
          //   delta: 1,
          // })

      
        // } else { //重新生成二维码

        //   wx.hideLoading()
        //   wx.showModal({
        //     title: '信息提示',
        //     content: '网络繁忙，请重新生成运单！',
        //     showCancel: false,
        //     success: function (res) {
        //       me.setData({
        //         btnStatus: false
        //       })
        //       me.onReady();
        //     }
        //   })




        // }









      }
    })
  

  

  },







 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var me = this;
//     wx.request({
//       url: baseurl + '/qureyToken',
//       method: "POST",
//       data: {

//       },
//       header: {
//         'content-type': 'application/json'
//       },
//       success: function (res) {
// me.setData({
//   token: res.data.token,
// })
        
//       }
//     })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     this.setData({
        printName: "打印标签（先连接打印机）" 
      })
    // if (app.BLEInformation.blueTooh) {
    //   this.setData({
    //     printName: "打印标签 " + app.BLEInformation.blueToohName
    //   })
    // } else {
    //   this.setData({
    //     printName: "打印标签（先连接打印机）" 
    //   })
    // }

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