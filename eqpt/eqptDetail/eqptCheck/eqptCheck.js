// eqpt/eqptDetail/eqptCheck/eqptCheck.js
var requestUrl = require('../../../config.js').requestUrl
var app = getApp()

var util = require('../../../util/util.js')
Page({
      
  /**               
   * 页面的初始数据
   */
  data: {
    eqptCheck: { fOperationDesc: "", fEqpID: "", fEqpCmpyID: "" },
    array: ['运行正常', '检查异常'],
    index: 0,
    remarkOrImg:false,
    fOperationPosition:"",
    checkItems:[],
    btnStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    var me = this;
    wx.request({
      url: requestUrl + '/queryEqp_checkitem',
      method: "POST",
      data: {
        filter: "fEqpTypeID='" + options.fEqpTypeID+"'",
    
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

//将字符串转换为Json
   me.setData({
     checkItems: JSON.parse(res.data.rows[0].fCheckContent.value)

   })
 
   for (var i = 0; i < me.data.checkItems.length;i++){

          if (me.data.checkItems[i].itemType=='文字'){
            var tempArr = me.data.checkItems[i].itemOptions?me.data.checkItems[i].itemOptions.split(" "):[]
          me.setData({
            [`checkItems[${i}].itemOptionsArr`]: tempArr,
            [`checkItems[${i}].userSelected`]: tempArr[0]
           
          })  

          }else{
            me.setData({
              [`checkItems[${i}].userSelected`]: me.data.checkItems[i].itemDefault

            })  
          }

}
      }
    })



    this.setData({
      "eqptCheck.EqpImg": options.fEqpImg,
      "eqptCheck.fEqpID": options.fEqpID,
      "eqptCheck.fEqpCmpyID": options.fEqpCmpyID

    })

    wx.setNavigationBarTitle({
      title: "点检 "+options.fEqpNum,
      success: function () {

      },
      fail: function (err) {

      }
    })
  },
  bindPickerChange:function(e){
    if (e.detail.value==0){
    
      this.setData({
        remarkOrImg: false

      })
   }else{
      this.setData({
        remarkOrImg: true

      })
   }
   
   
    this.setData({
      index: e.detail.value,
    
    })
  },

  bindCheckChange:function(e){

var i=e.currentTarget.dataset.index;
this.setData({
  [`checkItems[${i}].userSelected`]: this.data.checkItems[i].itemOptionsArr[e.detail.value]

})

  },
  sliderCagnge:function(e){

    var i = e.currentTarget.dataset.index;
    this.setData({
      [`checkItems[${i}].userSelected`]: e.detail.value

    })
  },

  fCheckRemark: function (e) {
    this.setData({
      "eqptCheck.fOperationDesc": e.detail.value
    })
  },
  //获取位置信息
  openPosition: function () {

    var me = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        me.setData({//将Json转换字符串
      fOperationPosition :JSON.stringify(res)
        })
 

      },
    })
  },
//提交按钮，执行保存事件
  saveCheckBtn:function(){
    if (this.data.btnStatus == true) {
      return;
    } 

    //生成Json数组，以便转换成字符串存下去
var JsonArr=[]
    for (var i = 0; i < this.data.checkItems.length;i++){
var tempJson={}
tempJson.ind = this.data.checkItems[i].ind
      tempJson.itemType = this.data.checkItems[i].itemType
tempJson.itemName = this.data.checkItems[i].itemName
      tempJson.userSelected = this.data.checkItems[i].userSelected

      JsonArr.push(tempJson)
}

  



    this.uploader = this.selectComponent("#uploader1");
    var FileListString=""
    if (this.uploader){
      FileListString=  this.uploader.getFileList()
    }
    var me = this;
    //保存数据库，
    var tempRows = [{
      fID: util.randString(), recordState: "new", version: 0, fOpratorID: app.globalData.orgInfo.fPath.value, fOperatorCmpyID: app.globalData.orgInfo.fCmpyID.value, fEqpID: this.data.eqptCheck.fEqpID,
      fEqpCmpyID: this.data.eqptCheck.fEqpCmpyID, fOperationDesc: this.data.eqptCheck.fOperationDesc, fOprationType: "点检盘点", fOperationJson: JSON.stringify(JsonArr), fOperationImg: FileListString, fProdMin: "", fProdCount: 0, fOperationPosition: this.data.fOperationPosition, fPreOperationID: "", fEqptStatus: this.data.array[this.data.index]
    }]
    wx.request({
      url: requestUrl + '/saveEqp_operation',
      method: "POST",
      data: { tables: util.conWx2Table(tempRows, "eqp_operation", "Integer,String,String,String,String,String,String,String,String,String,integer,String,String,String") },


      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        wx.request({
          url: requestUrl + '/updateEqpStatus',
          method: "POST",
          data: {
            fEqpID: me.data.eqptCheck.fEqpID,
            fEqptStatus: me.data.array[me.data.index]
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {

            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];  //上一个页面


            prevPage.pageUpdate(me.data.eqptCheck.fEqpID)

            //返回上一级页面
            wx.navigateBack({
              delta: 1,
            })
          }

        })



    

      }

    })
    this.setData({
      btnStatus: true
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