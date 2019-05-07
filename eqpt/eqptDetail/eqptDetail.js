// eqpt/eqptDetail/eqptDetail.js
var requestUrl = require('../../config.js').requestUrl
var app = getApp()
var XY = require('../../login/login.js').XY
Page({       

  /**
   * 页面的初始数据 
   */
  data: {          
    eqptDetail:{},
    currentEqptRepairInfo:{},
    currentCheckDetail:{},
    currentInventory:{},
    scene:"",
  actionSheet:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
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

  getQueryString: function (URLString,name) {
  
   
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = URLString.split("?")[1].match(reg);
    if(r != null){
  return unescape(r[2]);
}else {
  return null;
} 
 },
  onLoad: function (options) {
    console.log(options, "optionsoptionsoptions")
 
   var me=this;
  
//判断是否为扫码进来的
    if (!options.fEqpID){
      //扫码进来的

  this.setData({
    scene: options.scene || options.userID || this.getQueryString(decodeURIComponent(options.q), "scene")
  })
      console.log(app.globalData.orgInfo,"orgInfo")
      if (!app.globalData.orgInfo.fID){
        console.log(app.globalData.orgInfo, "orgInfoorgInfoorgInfo")
        
        XY.XYLogin({
          "openid": app.globalData.openid, callback: function (data) {

            app.globalData.userInfo = data.userInfo
            app.globalData.orgInfo = data.orgInfo
            app.globalData.cmpyInfo = data.cmpyInfo
            app.globalData.openid = data.openid
            app.globalData.unionid = data.unionid


            me.setData({
              actionSheet: true
            })


          }
        })
}else{
        me.setData({
          actionSheet: true
        })
  
}
  


      




}else{
  
  me.setData({
    actionSheet:true
  })
}
 
    this.pageUpdate(options.fEqpID || options.scene || options.userID || this.getQueryString(decodeURIComponent(options.q), "scene"))


  
  },
  pageUpdate: function (fEqpID){

    var me = this;
    wx.request({//查询当前资产的详细信息
      url: requestUrl + '/queryEqp_equipmentDetail',
      method: "POST",
      data: {
        fEqpID: fEqpID,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        res.data.rows[0].fEqpImg1 = me.getImgFromList(res.data.rows[0].fEqpImg.value)


        me.setData({
          eqptDetail: res.data.rows[0]
        })

        // wx.setNavigationBarTitle({//设置标题
        //   title: me.data.eqptDetail.fEqpNum.value,
        //   success: function () {

        //   },
        //   fail: function (err) {

        //   }
        // })
        console.log("查询我的资产信息成功", res)


      }
    })

    //拿到本资产，最早的正在进行的报修单
    var me = this;
    var Filter = "fEqpID='" + fEqpID + "' and fOprationType='故障报修' and fOperationTime2 is null"
    wx.request({
      url: requestUrl + '/queryEqp_operation',
      method: "POST",
      data: {
        filter: Filter,
        orderBy: "fOperationTime asc",
        limit: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        if (res.data.rows.length > 0) {

          me.setData({
            currentEqptRepairInfo: res.data.rows[0]
          })
        }else{
          me.setData({
            currentEqptRepairInfo: []
          })
        }

        console.log("查询最早的，未完成的报修单成功", res)


      }
    })



//拿到本资产最近的点检单

    var Filter = "fEqpID='" + fEqpID + "' and fOprationType='点检盘点' "
    wx.request({
      url: requestUrl + '/queryEqp_operationWithPerson',
      method: "POST",
      data: {
        filter: Filter,
        orderBy: "fOperationTime desc",
        limit: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        if (res.data.rows.length > 0) {

          me.setData({
            currentCheckDetail: res.data.rows[0]
          })
        }

        console.log("查询最近的点检单", res)


      }
    })


//查询当前资产没有完成的最早盘点单
    var me = this;
    wx.request({
      url: requestUrl + '/queryNoInventoryRecord',
      method: "POST",
      data: {
        fEqpID: fEqpID,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

    


        me.setData({
          currentInventory: (res.data.rows.length>0?res.data.rows[0]:[])
        })

      
     


      }
    })



  },
  checkEqptUseRecord:function(){
    wx.navigateTo({ url: '/eqpt/eqptDetail/eqptUse/eqptUseRecord?fEqptID=' + this.data.eqptDetail.fEqpID.value })
  },
  checkRepairInfoDetail:function(){
    wx.navigateTo({ url: '/eqpt/eqptDetail/RepairInfo/checkRepairInfoDetail?fID=' + this.data.currentEqptRepairInfo.fID.value})
  },

    checkDetail: function() {
      wx.navigateTo({ url: '/eqpt/eqptDetail/eqptCheck/eqptCheckDetail?fID=' + this.data.currentCheckDetail.fID.value })
    },
    
 
  previewImage:function(e){
  var current = e.target.dataset.src
  if ( this.data.eqptDetail.fEqpImg.value==""){
    return;
  }
  //预览图片
      wx.previewImage({
    current: current,
    urls: this.data.eqptDetail.fEqpImg.value?this.data.eqptDetail.fEqpImg.value.split("@"):[]
  })
  },
  //资产记录登记按钮，分配相关权限
  eqptRecord:function(){
    console.log(app.globalData.cmpyInfo.fID.value +"cmpyInfocmpyInfocmpyInfo")


    var me = this;
    var itemListID =[]
    var  itemList=[]

    //当前用户ID与资产操作者ID不一致时，可以操作领用资产
    if (app.globalData.orgInfo.fPath.value != this.data.eqptDetail.fEqpOperatiorID.value && app.globalData.cmpyInfo.fID.value=='94308d837586417ea96e3a88f5ffd908'&&itemListID.length < 6 && this.data.scene ){
      itemListID.push('eqptUse')
      itemList.push('领用资产') 
 }
//1.当前用户ID与资产操作者ID一致时
//2.当前用户与资产所属同一公司，并且当前用户为资产管理员
  
    if ( (app.globalData.orgInfo.fCmpyID.value == this.data.eqptDetail.fEqpCmpyID.value && (app.globalData.orgInfo.fAuth.value && app.globalData.orgInfo.fAuth.value.indexOf("资产管理员") >=0 )) && itemListID.length<6){
      itemListID.push('editEqptInfo')
      itemList.push('修改资产信息')
}

//当前资产没有报修单时，可以日常点检
   
      if (this.data.currentEqptRepairInfo.length == 0 && this.data.scene && itemListID.length < 6){
        itemListID.push('eqptCheck')
        itemList.push('日常点检')     
}
 
//当前用户与资产操作者一致，可以故障报修
//     if (app.globalData.orgInfo.fPath.value  == this.data.eqptDetail.fEqpOperatiorID.value && !this.data.currentEqptRepairInfo.fOperationTime && itemListID.length <6){
//       itemListID.push('RepairInfo')
//       itemList.push('故障报修')
// }


    //当前用户与资产操作者一致，可以录入工作量
    // if (app.globalData.orgInfo.fPath.value  == this.data.eqptDetail.fEqpOperatiorID.value  && itemListID.length < 6) {
    //   itemListID.push('workload')
    //   itemList.push('工作量录入')
    // }

  

//当前资产有未关闭的报修单，可以资产维修
//     if (this.data.currentEqptRepairInfo.fID && app.globalData.orgInfo.fPath.value  != this.data.currentEqptRepairInfo.fOpratorID.value && this.data.scene &&itemListID.length < 6){
//       itemListID.push('eqptRepair')
//       itemList.push('资产维修')
// }
  
    
//1.当前用户与资产操作者一致，并且当前资产有未完成的盘点单

    if (app.globalData.orgInfo.fPath.value  == this.data.eqptDetail.fEqpOperatiorID.value && this.data.currentInventory.fID && this.data.scene  &&itemListID.length < 6){
      itemListID.push('inVentory')
      itemList.push('资产盘点')
      
    }
   
    //.当前用户与资产所属同一公司，并且当前用户为资产管理员，或公司创建人,可以资产转让
    // if ((app.globalData.userInfo.fCmpyID == this.data.eqptDetail.fEqpCmpyID.value && (app.globalData.userInfo.fPsnAuth&&app.globalData.userInfo.fPsnAuth.indexOf("资产管理员")>0 || app.globalData.userInfo.fDeptID == ".")) && itemListID.length < 6) {
    //   itemListID.push('eqptSale')
    //   itemList.push('资产转让')
    // }

    
    //.当前用户与资产所属同一公司，并且当前用户为资产管理员，或公司创建人,可以资产报废
  
    if ((app.globalData.orgInfo.fCmpyID.value == this.data.eqptDetail.fEqpCmpyID.value && (app.globalData.orgInfo.fAuth.value && app.globalData.orgInfo.fAuth.value.indexOf("资产管理员") >= 0 )) && itemListID.length <6) {
      itemListID.push('eqptScrap')
      itemList.push('资产报废')
    }


    wx.showActionSheet({
  
      itemList: itemList,
    
      success: function (e) {
        console.log(e)
   

       if (itemListID[e.tapIndex] == 'eqptRepair'){
          wx.navigateTo({ url: '/eqpt/eqptDetail/' + itemListID[e.tapIndex] + '/' + itemListID[e.tapIndex] + '?fEqpID=' + me.data.eqptDetail.fEqpID.value + '&fEqpNum=' + me.data.eqptDetail.fEqpNum.value + '&fEqpImg=' + me.data.eqptDetail.fEqpImg1 + '&fEqpCmpyID=' + me.data.eqptDetail.fEqpCmpyID.value + '&fEqpTypeID=' + me.data.eqptDetail.fEqpTypeID.value + '&fPreOperationID=' + me.data.currentEqptRepairInfo.fID.value })


       } else if (itemListID[e.tapIndex] == 'editEqptInfo'){
         wx.navigateTo({ url: '/eqpt/createEqptInfo/createEqptInfo?fEqpID=' + me.data.eqptDetail.fEqpID.value })
        }
     
       else if (itemListID[e.tapIndex] == 'inVentory') {
         wx.navigateTo({ url: '/eqpt/eqptDetail/' + itemListID[e.tapIndex] + '/' + itemListID[e.tapIndex] + '?fID=' + me.data.currentInventory.fID.value + '&fEqpImg=' + me.data.eqptDetail.fEqpImg1} )
       }
        else{
         wx.navigateTo({ url: '/eqpt/eqptDetail/' + itemListID[e.tapIndex] + '/' + itemListID[e.tapIndex] + '?fEqpID=' + me.data.eqptDetail.fEqpID.value + '&fEqpNum=' + me.data.eqptDetail.fEqpNum.value + '&fEqpImg=' + me.data.eqptDetail.fEqpImg1 + '&fEqpCmpyID=' + me.data.eqptDetail.fEqpCmpyID.value + '&fEqpTypeID=' + me.data.eqptDetail.fEqpTypeID.value + '&fEqpOperatiorID=' + me.data.eqptDetail.fEqpOperatiorID.value + '&fOperatorCmpyID=' + me.data.eqptDetail.fCmpyID.value})
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