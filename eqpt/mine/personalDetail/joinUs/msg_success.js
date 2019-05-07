var util = require('../../../../util/util.js')
var baseurl = require('../../../../config.js').requestUrl
var app = getApp()
Page({

  data: {
    fDeptName: "",
    focus: false
  },
  Cancel: function () {//取消返回上一层
    wx.navigateBack()

  },
//   creatDefaultCheckItem: function (fCmpyID){
//   wx.request({
//     url: baseurl + '/creatDefaultCheckItem',
//     method: "POST",
//     data: {

//       fCmpyID: fCmpyID


//     },

//     header: {
//       'content-type': 'application/json' // 默认值
//     },
//     success: function (res) {

//       console.log("创建公司默认点检项返回",res)



//     }
//   })

// },

  okBtn: function () {
var me=this;
    console.log(app.globalData.userInfo)
    if (this.data.fDeptName) {//判断该部门是否存在，要求部门必填
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      var fMyDeptID = util.randString();//获取部门ID的随机字符串
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        "userInfo.fMyDept": this.data.fDeptName,
        "userInfo.fMyDeptID": fMyDeptID
      })
      //把数据存到公共位置app.globalData.userInfo里
      app.globalData.userInfo.fMyDept = this.data.fDeptName;
      app.globalData.userInfo.fMyDeptID = fMyDeptID;

      if (app.globalData.userInfo.fDeptID == ".") {//判断fDeptID是否为"."，如果是"."表示该用户为创始人
//如果存在，需要到数据库中，更新他所负责的部门名称和ID，以及公司名称，公司ID
       
        wx.request({
          url: baseurl + '/psnChange',
          method: "POST",
          data: {
            fUserID: app.globalData.userInfo.userID,
      
            fMyDept: this.data.fDeptName,
            fMyDeptID: fMyDeptID,
      
            // fCmpyName: this.data.fDeptName,
            // fCmpyID: app.globalData.userInfo.fCmpyID 
        
         
         
          },

          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {

            // me.creatDefaultCheckItem(app.globalData.userInfo.fCmpyID)


            //返回上一级页面
            wx.redirectTo({
              url: '/eqpt/mine/personalDetail/joinUs/joinUs',
            })
          }
        })
       
       
      

}else{//如果不是“.”，需要根据相应的参数，进行更改

      


        wx.request({
          url: baseurl + '/psnChange',
          method: "POST",
          data: {
            fUserID: app.globalData.userInfo.userID,
            fMyDept: this.data.fDeptName,
            fMyDeptID: fMyDeptID


          },

          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {

            //返回上一级页面
            wx.redirectTo({
              url: '/eqpt/mine/personalDetail/joinUs/joinUs',
            })
          }
        })

    }


    } else {//如果名称为空，要求必填
      var me = this;
      wx.showModal({
        title: '信息提示',
        content: '部门名称必填,并且长度不能超过5个字',
        showCancel: false,
        success: function (res) {
          me.setData({
            "focus": true
          })
        }
      })
    }



  },
  fInputChange: function (e) {//当输入框值改变时，给data赋值
    this.setData({
      "fDeptName": e.detail.value
    })
  },
});