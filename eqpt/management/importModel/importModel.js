// eqpt/management/importModel/importModel.js
var app = getApp()
var requestUrl = require('../../../config.js').requestUrl

var downloadExcelUrl = require('../../../config.js').downloadExcelUrl
var util = require('../../../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {    
    TransferAuth:false,
    updateCmpyName:false,
    fExpireDate:"",
    trade_no:"",
  
    myDate:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断是否为公司管理员
    if ((app.globalData.userInfo.userID == app.globalData.cmpyInfo.fManagerID
    ) && app.globalData.userInfo.fCmpyID) {
      this.setData({
        TransferAuth:true,
        updateCmpyName:true
      })

    }
    this.queryExpireDate();
    this.queryMoney();
  },

  queryMoney:function(){
 
    var me = this;
    wx.request({
      url: requestUrl + '/queryEqp_checkitem',
      method: "POST",
      data: {
        filter: "(fCompanyID='fishbearRunningConsult')",

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        me.setData({
          total_fee: res.data.rows[0].fCheckCount.value
        })



      }
    }); 


  },

  queryExpireDate:function(){
    console.log("公司ID")
    console.log(app.globalData.userInfo.fCmpyID)
  var me = this;
  wx.request({
    url: requestUrl + '/queryEqp_compaty',
    method: "POST",
    data: {
      filter: "fCmpyID='" + app.globalData.userInfo.fCmpyID + "'",

    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {


      if (res.data.rows.length>0){
        me.setData({
          fExpireDate: res.data.rows[0].fExpireDate.value

        })
}


    }
  })




},






  importEqptModelExcel:function(){

    var me = this;

    wx.request({
      url: requestUrl + '/importEqptModelExcel',
      method: "POST",
      data: {
        fCmpyID: app.globalData.userInfo.fCmpyID,
        fUserID: app.globalData.userInfo.userID

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        me.downLoadFile()


      }
    })
  },

  downLoadFile: function () {

    wx.downloadFile({


      url: downloadExcelUrl + app.globalData.userInfo.userID +  ".xls",
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
        wx.showModal({
          title: '下载文件失败',
          content: "由于生成文件的大小超过了微信限制，请根据索引号(" + app.globalData.userInfo.userID + ")与管理员联系，通过其他方式传递该文件",
        })
        console.log(res, "失败")
   
      },
    })

  },


  downLoadData: function () {

    wx.downloadFile({


      url: downloadExcelUrl + "fishbear" + ".docx",
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
        wx.showModal({
          title: '下载文件失败',
          content: "由于生成文件的大小超过了微信限制，请根据索引号(" + app.globalData.userInfo.userID + ")与管理员联系，通过其他方式传递该文件",
        })
        console.log(res, "失败")

      },
    })

  },

//执行支付事件
  Pay: function () {

   

    var timestamp = Date.parse(new Date())

    var num = "";
    for (var i = 0; i < 4; i++) {
      num += Math.floor(Math.random() * 10)
    }

this.setData({
 trade_no : num + timestamp//生成四位随机字符串+当前时间戳

})

    var me = this;
    wx.showModal({
      title: '订单支付：' + me.data.total_fee/100+'.00 元',
      content: '本订单用于您增加组织用户,原始数据清单下载',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')

          wx.request({
            url: requestUrl + '/wxPay',
            data: {
              openid: app.globalData.userInfo.userID,
              out_trade_no: me.data.trade_no,
              total_fee: me.data.total_fee,
              body: "鱼熊企管咨询"
            },
            method: 'GET',
            success: function (res) {

              console.log(res);
              me.doWxPay(res.data.response);
            }
          })



        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },


  doWxPay(param) {
    //小程序发起微信支付
    var me=this;
    wx.requestPayment({
      timeStamp: param.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
      nonceStr: param.nonceStr,
      package: param.package,
      signType: 'MD5',
      paySign: param.paySign,
      success: function (event) {
        // success   
        console.log(event);



        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        });


        me.updateExpireDate();
      },
      fail: function (error) {
        // fail   
        console.log("支付失败")
        console.log(error)
      },
      complete: function () {
   

        // complete   
        console.log("pay complete")
      }
    });
  },

  insertTradeRecord: function () {

    var currentdate = util.getNowFormatDate()


    var me = this;
    wx.request({
      url: requestUrl + '/insertTradeRecord',
      method: "POST",
      data: {
        trade_no: me.data.trade_no,
        fPayDate: currentdate,
        fPayMoney: me.data.total_fee,
        fPayContent: "服务费 原日期：" + me.data.fExpireDate + "  新日期 " + me.data.myDate,
       fPsnID: app.globalData.userInfo.userID,




      },

      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {



      }
    })



  },





  updateExpireDate: function () {
    var me = this;
    wx.request({
      url: requestUrl + '/queryEqp_compaty',
      method: "POST",
      data: {
        filter: "fCmpyID='" + app.globalData.userInfo.fCmpyID + "'",

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        var fExpireDate = res.data.rows[0].fExpireDate.value//获取失效时间

        var currentdate = util.getNowFormatDate()//获取当前时间
      

        if (currentdate > fExpireDate) {//过期了，在当前日期上加一年
          var Dt = new Date();
          Dt.setFullYear(Dt.getFullYear() + 1);
  

          me.setData({
              myDate: util.dateToString(Dt)
          })
        
          wx.request({
            url: requestUrl + '/updateExpireDate',
            data: {
              fCmpyID: app.globalData.userInfo.fCmpyID,
              fExpireDate: me.data.myDate
            },
            method: 'GET',
            success: function (res) {
              me.insertTradeRecord();
              console.log(res);

            }
          })


        }else{//没过期，在失效日期基础上加一年
          console.log("在失效日期基础上加一年")

          var sta_date = new Date(fExpireDate); 
          sta_date.setFullYear(sta_date.getFullYear() + 1);

          me.setData({
            myDate: util.dateToString(sta_date)
          })
          wx.request({
            url: requestUrl + '/updateExpireDate',
            data: {
              fCmpyID: app.globalData.userInfo.fCmpyID,
              fExpireDate: me.data.myDate
            },
            method: 'GET',
            success: function (res) {
              me.insertTradeRecord();
              console.log(res);

            }
          })


        }
       

      }
    })










 

  },
  
  blueTooth:function(){
    wx.navigateTo({ url: '/eqpt/bleConnect/bleConnect' })
  },
  transferManagerAuth:function(){
    wx.navigateTo({ url: '/eqpt/mine/transferManagerAuthCode/transferManagerAuthCode' })

  },

  updateCmpyName:function(){
    wx.navigateTo({ url: '/eqpt/mine/updateCmpyName/updateCmpyName' })

  },



  video:function(){
    wx.navigateTo({ url: '/eqpt/mine/videoTrain/videoTrain' })
  },

  aboutUs:function(){
    wx.navigateTo({ url: '/eqpt/mine/aboutUs/aboutUs' })
  },

  openClose:function(){
    wx.navigateTo({ url: '/eqpt/mine/openClose/openClose' })
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