// eqpt/mine/personalDetail/updateDeptName/updateDeptName.js
var baseurl = require('../../../../config.js').requestUrl
var config = require('../../../../config.js')
var app = getApp()
var COS = require('../../../../fishbearComponents/uploader/cos-wx-sdk-v5.js')
var cos = new COS({

  getAuthorization: function (params, callback) {//获取签名 必填参数


    var authorization = COS.getAuthorization({
      SecretId: config.SECRETID,
      SecretKey: config.SECRETKEY,
      Method: params.Method,
      Key: params.Keym1
    });

    callback(authorization);


  }
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fMyDept:"",
    userInfo:{},
    companyLogo:"",
    logoFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo.fDeptID == ".") {
      this.setData({
        logoFlag:true
      })
    }
    
  this.setData({//得到前一个页面，传来的部门名字
    "fMyDept": options.fMyDept,
    "userInfo.fPsnImg": app.globalData.userInfo.fPsnImg,
    companyLogo: app.globalData.userInfo.fPsnJson && JSON.parse(app.globalData.userInfo.fPsnJson).companyLogo  ? JSON.parse(app.globalData.userInfo.fPsnJson).companyLogo : app.globalData.userInfo.fPsnImg

  })
  },
  inputChange:function(e){//获取输入框的值
    this.setData({
      "fMyDept": e.detail.value
    })
  },
  updateLogo:function(){
    if (app.globalData.userInfo.fDeptID=="."){
      var me = this;

      wx.chooseImage({  // 选择文件
        count: 1, // 默认9，最多可以选择9张图片
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {

         
            var filePath = res.tempFilePaths[0];  //选择本地的文件路径
            var Key = filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名

            //将文件上传至服务器
            cos.postObject({
              Bucket: config.BUCKET, //cos存储的桶名
              Region: config.REGION,//cos 存储的地域名
              Key: "companyLogo" + "/" + Date.parse(new Date()) + Key,
              FilePath: filePath,
              onProgress: function (info) {
            
              }

            }, function (err, data) {


              if (err && err.error) {
                wx.showModal({ title: '返回错误', content: '请求失败：' + err.error.Message + '；状态码：' + err.statusCode, showCancel: false });
              } else if (err) {
                wx.showModal({ title: '请求出错', content: '请求出错：' + err + '；状态码：' + err.statusCode, showCancel: false });
              } else {

                //将请求该文件的路径，存至KeyList数组里，以供wxml渲染。
                me.setData({
                  companyLogo : config.REQUESTCOSURL + this.Key

                })
                var t = JSON.parse(app.globalData.userInfo.fPsnJson ? app.globalData.userInfo.fPsnJson:"{}");
                t.companyLogo = me.data.companyLogo
                app.globalData.userInfo.fPsnJson = JSON.stringify( t )


              }
            });
    



        }
      })
}
  },

  creatDefaultCheckItem: function (fCmpyID) {
    wx.request({
      url: baseurl + '/creatDefaultCheckItem',
      method: "POST",
      data: {

        fCmpyID: fCmpyID


      },

      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        console.log("创建公司默认点检项返回", res)



      }
    })

  },
  deptChange:function(){
    
var me=this;
    if (this.data.fMyDept==""){
      if (app.globalData.userInfo.fDeptID == ".") {

        wx.showModal({
          title: '提示信息',
          content: '您是公司创建者，不能清空部门名称！',
          showCancel:false,
        })
        return;
      }




//判断当前用户是否有下级
      wx.request({
        url: baseurl + '/clearPersonDept',
        method: "POST",
        data: {
          fUserID: app.globalData.userInfo.userID,
          fCmpyID: app.globalData.userInfo.fCmpyID
        },

        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (e) {

          if (e.data.res && e.data.res == "success") {//返回值为成功时，执行删除操作
            wx.showToast({
              title: '清除部门成功',
              mask: true,


            })

            app.globalData.userInfo.fMyDept = "";
            app.globalData.userInfo.fMyDeptID = "";
            wx.setStorage({
              key: 'userInfo',
              data: app.globalData.userInfo
            })
            //返回上一级页面
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];  //上一个页面

            //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
            // prevPage.setData({
            //   "userInfo.fMyDept": me.data.fMyDept,

            // })

            app.globalData.userInfo.fMyDept = me.data.fMyDept;
            prevPage.updatePage();


            setTimeout(function () {
              //返回上一级页面
              wx.navigateBack({
                delta: 1,
              })
            }, 1500)



          } 


          else {//有下属的情况给个提示信息
            wx.showToast({
              icon: 'none',
              title: e.data.dec,
            })

          }

        }
      })
return;

}

    if (app.globalData.userInfo.fDeptID == ".") {//判断fDeptID是否为"."，如果是"."表示该用户为创始人
      //如果存在，需要到数据库中，更新他所负责的部门名称和ID，以及公司名称，公司ID
      // me.creatDefaultCheckItem(app.globalData.userInfo.fCmpyID)
      wx.request({
        url: baseurl + '/psnChange',
        method: "POST",
        data: {
          fUserID: app.globalData.userInfo.userID,

          fMyDept: me.data.fMyDept,
          fMyDeptID: app.globalData.userInfo.fMyDeptID,

          // fCmpyName: me.data.fMyDept,
          // fCmpyID: app.globalData.userInfo.fCmpyID


        },

        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {

          //返回上一级页面
          var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面

        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        // prevPage.setData({
        //   "userInfo.fMyDept": me.data.fMyDept,

        // })

        app.globalData.userInfo.fMyDept = me.data.fMyDept;
          prevPage.updatePage();
       // app.globalData.userInfo.fCmpyName = me.data.fCmpyName;
        wx.setStorageSync('userInfo', app.globalData.userInfo)

    wx.navigateBack({

    })
        }
      })




    } else {




      wx.request({
        url: baseurl + '/psnChange',
        method: "POST",
        data: {
          fUserID: app.globalData.userInfo.userID,
          fMyDept: me.data.fMyDept,
          fMyDeptID: app.globalData.userInfo.fMyDeptID,


        },

        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {

          //返回上一级页面
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //上一个页面

          //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          // prevPage.setData({
          //   "userInfo.fMyDept": me.data.fMyDept,

          // })
          app.globalData.userInfo.fMyDept = me.data.fMyDept;
          prevPage.updatePage();
     
          wx.setStorageSync('userInfo', app.globalData.userInfo)
          wx.navigateBack({

          })
        }
      })

    }





    // var me=this;
    // wx.request({
    //   url: baseurl + '/psnChange',
    //   method: "POST",
    //   data: {
    //     fUserID: app.globalData.userInfo.userID,
    //     fMyDept: this.data.fMyDept,
    //     fPsnJson: app.globalData.userInfo.fPsnJson


    //   },

    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {

    //     var pages = getCurrentPages();
    //     var prevPage = pages[pages.length - 2];  //上一个页面
   
    //     //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    //     prevPage.setData({
    //       "userInfo.fMyDept": me.data.fMyDept,
    
    //     })
    //     app.globalData.userInfo.fMyDept = me.data.fMyDept;
     
    // wx.navigateBack({
      
    // })
    //   }
    // })
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