// eqpt/mine/personalDetail/personalDetailPhone/personalDetailPhone.js
var baseurl = require('../../../../config.js').requestUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    getText:"获取验证码",
    getChange:true,
    zhengTrue:false,
    yanzheng:"",
    huozheng:"asdfdsdfdf",
    showTopTips: false,
    fCellphone:"",
    fCellphoneFocus:false,
    ErrorMsg:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({//得到前一个页面，传来的名字
      "fCellphone": options.fCellphone && options.fCellphone!='undefined' ? options.fCellphone:""
    })
    wx.setNavigationBarTitle({
      title: "填写手机号",
      success: function () {

      },
      fail: function (err) {

      }
    })
  },
  inputChange: function (e) {//获取输入框的值

    if (!(/^1[34578]\d{9}$/.test(e.detail.value))){
  
      this.setData({
        "fCellphoneFocus": true,
        "fCellphone": e.detail.value
      })
    
    } else{
      this.setData({
        "fCellphone": e.detail.value
      })
   
    }
 
  },
  //输入验证码事件
  inputCodeChange:function(e){

    var that = this;
    that.setData({
      yanzheng: e.detail.value
    
    })
    var that = this;
    var yanzheng = e.detail.value;
    var huozheng = this.data.huozheng
 
    that.setData({
      yanzheng: yanzheng,
      zhengTrue: false,
    })

      if (yanzheng == huozheng) {
        that.setData({
          zhengTrue: true,
        })
      } else {
        //给出提示信息并返回
        if (e.detail.value.length>0){
          that.setData({
            showTopTips: true,
            ErrorMsg: "验证码填写错误"

          });
          setTimeout(function () {
            that.setData({
              showTopTips: false
            });
          }, 3000);
          that.setData({
          
            "zhengTrue": false,
          })
        }

    
     
      }
   

  },
  //点击获取验证码事件
  getCode:function(){


    // console.log(app.globalData.userId);
    var getChange = this.data.getChange
    if (getChange==false){
      console.log("计时器正在变化")
return
    }
    var n = 59;
    var that = this;
    var phone = this.data.fCellphone;
    console.log(phone)
//检查手机号是否合法
    if (!(/^1[34578]\d{9}$/.test(phone))) {
 

      //给出提示信息并返回
      var that = this;
      this.setData({
        showTopTips: true,
        ErrorMsg:"手机号填写错误"
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      this.setData({
        "fCellphoneFocus": true
      })
    




    } else {
      if (getChange) {
        this.setData({
          getChange: false
        })
        var time = setInterval(function () {
          var str = '(' + n + ')' + '重新获取'
          that.setData({
            getText: str
          })
          if (n <= 0) {
            that.setData({
              getChange: true,
              getText: '重新获取'
            })
            clearInterval(time);
          }
          n--;
        }, 1000);
  

        wx.request({
          url: baseurl + '/getYanCode',
          method: "POST",
          data: {
            fCellphone: this.data.fCellphone

          },

          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            // me.clearMyDept(me.data.options.fPsnID)
            //返回首页页面

            that.setData({
              huozheng: res.data.success
            })
         
          }
        })


      }
    }



    
    


  },
  updataPhoneBtn: function () {

    if (!(/^1[34578]\d{9}$/.test(this.data.fCellphone))) {//手机号不合法
    //给出提示信息并返回
      var that = this;
      this.setData({
        showTopTips: true,
        ErrorMsg: "手机号填写错误"
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      this.setData({
        "fCellphoneFocus": true
      })
      return;
    }



    var that = this;
    var yanzheng = this.data.yanzheng
    var huozheng = this.data.huozheng


    if (yanzheng.length =="") {
      //给出提示信息并返回
      var that = this;
      that.setData({
        showTopTips: true,
        ErrorMsg: "验证码不能为空"
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      that.setData({
        "fCellphoneFocus": true,
        "zhengTrue": false,
      })
      return;

    }
      if (yanzheng == huozheng) {
        that.setData({
          zhengTrue: true,
        })



        var me = this;
        wx.request({
          url: baseurl + '/psnChange',
          method: "POST",
          data: {
            fUserID: app.globalData.userInfo.userID,
            fCellphone: this.data.fCellphone



          },

          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];  //上一个页面

            //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
            // prevPage.setData({
            //   "userInfo.fCellphone": me.data.fCellphone,

            // })
      
            app.globalData.userInfo.fCellphone = me.data.fCellphone;
            prevPage.updatePage();

            //返回上一级页面
            wx.navigateBack({
              delta: 1,
            })
          }
        })
      } else {

        //给出提示信息并返回
        var that = this;
        that.setData({
          showTopTips: true,
          ErrorMsg: "验证码填写错误"
        });
        setTimeout(function () {
          that.setData({
            showTopTips: false
          });
        }, 3000);
        that.setData({
          "fCellphoneFocus": true,
          "zhengTrue": false,
        })
        return;
    
    
      
    }

    
    //合法的情况下，检查手机号是否超期
    //超期的花给出提示要求重新获取验证码
    //没超期，检查验证码是否正确
    //不正确，给出提示信息，并返回
    //正确存入数据库
   
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