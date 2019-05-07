// login/mineSameLevelPsn/mineSameLevelPsn.js
var XY = require('../login.js').XY
var AuthArr = require('../../config.js').AuthArr  
var downloadExcelUrl = require('../../config.js').downloadExcelUrl 
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fPath:"",
    activePath:"",
    orgClip:{},
    showTopTips:false,
    items: [
      { value: '人员维护', name: '人员维护' },
      { value: '部门查询', name: '部门查询' },
   
    ],


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
this.setData({

  managerID: JSON.parse(app.globalData.cmpyInfo.fOrgJson.value).managerID
})
    

var arr=[]
    for (var i = 0; i < AuthArr.length;i++){
      var t = { value: AuthArr[i], name: AuthArr[i] }
      arr.push(t)
}


    console.log(arr, "arrarr")


    this.setData({
      fPath: options.fPath,
      items: this.data.items.concat(arr)
    })
this.onLoadSons();
   this.globalDataRefresh();
  },
  globalDataRefresh() {
    this.setData({
      "userInfo": app.globalData.userInfo,
      "orgInfo": app.globalData.orgInfo,
      "cmpyInfo": app.globalData.cmpyInfo,
      openid: app.globalData.openid
    })
  },

  onLoadSons:function(){

    var me = this;
    XY.querySonByPath(
      me.data.fPath,
      function (data) {

        if (data.data.success == "ok") {

          var t = [];
          for (var i = 0; i < data.data.sons.rows.length; i++) {
            t = data.data.sons.rows[i].fName.value.split("/")
            data.data.sons.rows[i].fName.value = t[t.length - 1];
          }
          if (data.data.current.rows.length &&  data.data.current.rows[0].fPsnID.value){
            me.setData({
              params: data.data.current.rows[0],
             

            })
}
          me.setData({
            params: data.data.current.rows[0],
            current: data.data.current.rows[0],
            sons: data.data.sons.rows,
           
  
     
          })
 
          //判断是否为管理员
          if (app.globalData.orgInfo.fAuth.value &&app.globalData.orgInfo.fAuth.value.indexOf("人员维护")>-1 || JSON.parse(app.globalData.cmpyInfo.fOrgJson.value).managerID == app.globalData.orgInfo.fID.value) {
            me.setData({
              BtnShow: true

            })


          }
        }


      }
    )

  },
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      selected: e.detail.value.join(" ")
    })

  },
  updataPsnAuthBtn: function () {

    var me = this;

    XY.changeAuth(app.globalData.orgInfo.fID.value, this.data.params.fID.value, this.data.selected, function (data) {
      console.log(data, "徐岩公司")
      if (data.data.result == "fail") {
        me.setData({
          showTopTips: true,
          ErrorMsg: data.data.errMsg

        });
        setTimeout(function () {
          me.setData({
            showTopTips: false
          });
        }, 3000);
        return;
      }else{
        wx.showToast({
          title: '成功授权！',
        })
      }

    })
  },
  upOrg:function(e){
var me=this;

    var orgAIndex =e.currentTarget.dataset.index



    if (orgAIndex==0){
return;
    }
    var orgAID = e.currentTarget.id
    var orgBID = this.data.sons[orgAIndex - 1].fID.value
    XY.orgOrder(app.globalData.orgInfo.fID.value, orgAID, orgBID, function (data) {
      if (data.data.result == "fail") {
        me.setData({
          showTopTips: true,
          ErrorMsg: data.data.errMsg

        });
        setTimeout(function () {
          me.setData({
            showTopTips: false
          });
        }, 3000);
        return;
      }

      if (data.data && data.data.result == "success") {
  
        var t = me.data.sons[orgAIndex]
me.setData({
  [`sons[${orgAIndex}]`]: me.data.sons[orgAIndex - 1],
  [`sons[${orgAIndex-1}]`]: t,

})
      }

 

    })

  },
  downOrg: function (e) {

var me=this;
    var orgAIndex = e.currentTarget.dataset.index

    if (orgAIndex == me.data.sons.length-1) {
      return;
    }
    var orgAID = e.currentTarget.id
    var orgBID = this.data.sons[orgAIndex + 1].fID.value
    XY.orgOrder(app.globalData.orgInfo.fID.value, orgAID, orgBID, function (data) {
      console.log(data, "徐岩公司")
      if (data.data.result == "fail") {
        me.setData({
          showTopTips: true,
          ErrorMsg: data.data.errMsg

        });
        setTimeout(function () {
          me.setData({
            showTopTips: false
          });
        }, 3000);
        return;
      }

      if (data.data && data.data.result == "success") {

        var t = me.data.sons[orgAIndex]
        me.setData({
          [`sons[${orgAIndex}]`]: me.data.sons[orgAIndex + 1],
          [`sons[${orgAIndex + 1}]`]: t,

        })
      }
    })

  },

  orgMove:function(e){
var me=this;
 
    XY.orgMove(app.globalData.orgInfo.fID.value, this.data.current.fID.value, this.data.orgClip.fID.value, function (data) {

      if (data.data.result == "fail") {
        me.setData({
          showTopTips: true,
          ErrorMsg: data.data.errMsg

        });
        setTimeout(function () {
          me.setData({
            showTopTips: false
          });
        }, 3000);
        return;
      }


    
      if (data.data && data.data.result=="success"){
me.setData({
  orgClip: {},
 
})

        me.onLoadSons();


      }


    })
 
  },
  clearClip:function(){
    this.setData({
      orgClip: {},

    })
  },

  touchmove:function(e){

    if (app.globalData.orgInfo.fAuth.value &&app.globalData.orgInfo.fAuth.value.indexOf("人员维护")>-1){
  this.setData({
    activePath: e.currentTarget.id,
    orgClip:""

  })
}


  },
  CancelActive:function(){

    this.setData({
      activePath: "",


    })
  },

  clipDept:function(e){

  
 var me=this;

    for(var i=0;i<this.data.sons.length;i++){
      if (this.data.sons[i].fID.value == e.currentTarget.id){   
 me.setData({
   orgClip: me.data.sons[i],
 
 })

}
    }
    setTimeout(function () {
   
      me.setData({

        activePath: "",
      })

      }, 200)



  },
  goBack:function(){
 var t= this.data.current.fPath.value.split("/")
    t.length = t.length - 1
    this.setData({
      fPath: t.join("/")
    })
    this.onLoadSons();
  },

  loadNextDept:function(e){
 if(this.data.activePath){
return;
 }
var index=e.currentTarget.dataset.index;
// if(this.data.sons[index].fPsnID.value){
//   wx.navigateTo({ url: '/login/psnAuth/psnAuth?avatarUrl=' + this.data.sons[index].avatarUrl.value + '&fName=' + this.data.sons[index].fName.value + '&fAuth=' + this.data.sons[index].fAuth.value + '&fID=' + this.data.sons[index].fID.value})

// }else{
  this.setData({
    fPath: e.currentTarget.id,

  })
  this.onLoadSons();
//}
  


  },



  relateActionNew: function () {

    var me = this;

    var List = ['添加部门', '添加人员', '当前部门改名']
    //判断是否为顶级管理员
    if (app.globalData.cmpyInfo.fID && app.globalData.orgInfo.fID && JSON.parse(app.globalData.cmpyInfo.fOrgJson.value).managerID == app.globalData.orgInfo.fID.value) {
      List.push('导出人员表')
    }

    wx.showActionSheet({
      itemList: List,
      success: function (e) {
   
  

        if (e.tapIndex == 0) {

          wx.navigateTo({ url: '/login/addDept/addDept?orgID=' + me.data.current.fID.value})



        } else if (e.tapIndex == 1) {
          console.log(app.globalData.orgInfo.fID.value+"dddfdg")

          var t = new Date();//你已知的时间
          var t_s = t.getTime();//转化为时间戳毫秒数

          t.setTime(t_s + 1000 * 60*30);
          var yy = t.getFullYear();      //年
          var mm = t.getMonth() + 1;     //月
          var dd = t.getDate();          //日
          var hh = t.getHours();         //时
          var ii = t.getMinutes();       //分
          var ss = t.getSeconds();       //秒
          var clock = yy + "-";
          if (mm < 10) clock += "0";
          clock += mm + "-";
          if (dd < 10) clock += "0";
          clock += dd + " ";
          if (hh < 10) clock += "0";
          clock += hh + ":";
          if (ii < 10) clock += '0';
          clock += ii + ":";
          if (ss < 10) clock += '0';
          clock += ss;
          console.log(clock)
          wx.navigateTo({ url: '/login/joinUS/joinUS?imgsrc=' + app.globalData.userInfo.avatarUrl.value + '&managerName=' + app.globalData.orgInfo.fName.value + '&deptID=' + me.data.current.fID.value + '&deptName=' + me.data.current.fName.value + '&managerID=' + app.globalData.orgInfo.fID.value + '&session=' + clock  +'&deptFID=' + app.globalData.orgInfo.fID.value })

  
        }

        else if (e.tapIndex == 2) {
          var t = me.data.current.fName.value.split("/")
          wx.navigateTo({ url: '/login/updateDept/updateDept?orgID=' + me.data.current.fID.value + '&fName=' + t[t.length - 1] })

        }
        else if (e.tapIndex == 3) {

//导出Excel
          me.exportEqptExcel(app.globalData.cmpyInfo.fID.value)


        }

 
    
    }})

  },


  //导出人员表
  exportEqptExcel: function (fCmpyID) {

    wx.showLoading({
      title: '加载中',
    })
    var me = this;

    XY.CreatPsnExcel(fCmpyID, function (data) {

      if (data.data.result == "success") {
        wx.hideLoading()
        me.downLoadFile2()
      }



 


    })





  },

  downLoadFile2: function () {
console.log("下载")
    wx.downloadFile({


      url: downloadExcelUrl + "ExcelOrg.xls",
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
  delDept:function(e){
var me=this;
    wx.showModal({
      title: '提示信息',
      content: '是否確定刪除',
      success(res) {
        if (res.confirm) {
          XY.deleteDept(app.globalData.orgInfo.fID.value, e.currentTarget.id, function (data) {
       

            if (data.data.result == "fail") {
              me.setData({
                showTopTips: true,
                ErrorMsg: data.data.errMsg

              });
              setTimeout(function () {
                me.setData({
                  showTopTips: false
                });
              }, 3000);
              return;
            }
            var t = e.currentTarget.dataset.index.split("/")
            console.log(t, "hhh")
            t.length = t.length - 1
            console.log(t.join("/"), "hhh")
            me.setData({
              fPath: t.join("/"),
              activePath: "",
            })
            me.onLoadSons();

          })

  

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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