// eqpt/management/checkSet/checkSet.js
var requestUrl = require('../../../config.js').requestUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
edit:function(e){

this.setData({

  [`detailList[${e.index}].fEqptTypeName.value`]:e.name,
  [`detailList[${e.index}].fCheckCount.value`]:e.count,
})
},
add:function(e){

  var y = this.data.detailList

  y.splice(0, 0, { "fEqptTypeName": { "value": e.name }, "fCheckCount": { value: e.count }, "fCompanyID": { value: e.fCompanyID }, "fEqpTypeID": { value: e.fEqpTypeID} })
 
this.setData({
  detailList: y
})
  
  // 

},
   
  onLoad: function (options) {

  var me=this;
  options.fCompanyID
  wx.request({//向数据库中查出要修改的值
    url: requestUrl + '/queryEqp_checkitem',
    method: "POST",
    data: {
      filter: "fCompanyID='" + options.fCompanyID + "'",

             orderBy: "fCreatTime DESC"
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {


       me.setData({
   
         detailList: res.data.rows
      })
    }
  })

  },
  checkSetDetail:function(e){//跳转到增加资产类别页面
//将公司ID，和资产类型ID传过去
    var cmptid=e.currentTarget.dataset.cmptid
   var eqptid=e.currentTarget.dataset.eqptid
   var index = e.currentTarget.dataset.index
   wx.navigateTo({
     url: "/eqpt/management/checkSetDetail/checkSetDetail?cmptid=" + cmptid + "&eqptid=" + eqptid + "&index=" + index})
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