// eqpt/mine/personalDetail/createCompy/createCompy.js
var util = require('../../../../util/util.js')
var baseurl = require('../../../../config.js').requestUrl

var app = getApp()
Page({

  data: {
    fDeptName: "",
    focus: false,
    trade_no:"",
    creatCompyTotal_fee:""
  },
  Cancel: function () {//取消返回上一层
    wx.navigateBack()

  },


  onLoad: function (options) {

  var me = this;
  wx.request({
    url: baseurl + '/queryEqp_checkitem',
    method: "POST",
    data: {
      filter: "(fCompanyID='fishbearConsult')",

    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      me.setData({
        creatCompyTotal_fee:   res.data.rows[0].fCheckCount.value
      })



    }
  }); 
  },

  okBtn: function () { 
 
    var timestamp = Date.parse(new Date())

    var num = "";
    for (var i = 0; i < 4; i++) {
      num += Math.floor(Math.random() * 10)
    }


this.setData({
   trade_no :num + timestamp//生成四位随机字符串+当前时间戳
})

    var me = this;
    console.log(app.globalData.userInfo)
    if (this.data.fDeptName) {//判断该公司是否存在，要求公司必填
      console.log("支付提示")
      wx.showModal({
        title: '订单支付：' + me.data.creatCompyTotal_fee/100 +' 元',
        content: '本订单用于在该系统中创建公司。',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            
            wx.request({
              url: baseurl + '/wxPay',
              data: {
                openid: app.globalData.userInfo.userID,
                out_trade_no: me.data.trade_no,
                total_fee: me.data.creatCompyTotal_fee,
                body: "徐岩公司"
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



    } else {//如果名称为空，要求必填
      var me = this;
      wx.showModal({
        title: '信息提示',
        content: '公司名称必填,并且长度不能超过5个字',
        showCancel: false,
        success: function (res) {
          me.setData({
            "focus": true
          })
        }
      })
    }



  },



  doWxPay(param) {
    //小程序发起微信支付
    var me = this;
console.log("执行支付")
    wx.requestPayment({
      timeStamp: param.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了
      nonceStr: param.nonceStr,
      package: param.package,
      signType: 'MD5',
      paySign: param.paySign,
      success: function (event) {
        // success   
        console.log(event);
        console.log("支付成功")


        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        });

        me.insertCmpy();
 




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



  insertTradeRecord:function(){
    console.log("执行插入记录")
    var currentdate = util.getNowFormatDate()


    var me=this;
    wx.request({
      url: baseurl + '/insertTradeRecord',
      method: "POST",
      data: {
        trade_no: me.data.trade_no,
        fPayDate: currentdate,
        fPayMoney: me.data.creatCompyTotal_fee/100,
        fPayContent: "创建公司：" + me.data.fDeptName,
        fPsnID: app.globalData.userInfo.userID,

      },

      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.updatePage();

        //返回上一级页面
        wx.navigateBack({

        })


      }
    })



  },
insertCmpy:function(){

  console.log("执行插入公司")
  var me = this;
  var Dt = new Date();
  Dt.setFullYear(Dt.getFullYear() + 1);
  var myDate = util.dateToString(Dt);
  console.log("日期为：")
  console.log(myDate)

  var tempRows = [{
    fID: util.randString(), recordState: "new", version: 0, fCmpyID: app.globalData.userInfo.fCmpyID, fCmpyName: this.data.fDeptName, fManagerID: app.globalData.userInfo.userID,fExpireDate:myDate
  }]
  wx.request({
    url: baseurl + '/saveEqp_compaty',
    method: "POST",
    data: { tables: util.conWx2Table(tempRows, "eqp_compaty", "Integer,String,String,String,String") },


    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {

      wx.request({
        url: baseurl + '/psnChange',
        method: "POST",
        data: {

          fUserID: app.globalData.userInfo.userID,
          fCmpyName: me.data.fDeptName,
          fCmpyID: app.globalData.userInfo.fCmpyID



        },

        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
     

    
          app.globalData.cmpyInfo.fCmpyID = app.globalData.userInfo.fCmpyID;
          app.globalData.cmpyInfo.fCmpyName = me.data.fDeptName;
          app.globalData.cmpyInfo.fManagerID = app.globalData.userInfo.userID;
        

      

          me.insertTradeRecord();

        }
      })


    }

  })


},


  fInputChange: function (e) {//当输入框值改变时，给data赋值
    this.setData({
      "fDeptName": e.detail.value
    })
  },
});