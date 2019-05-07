// login/psnAuth/psnAuth.js
var app = getApp()
var XY = require('../../login/login.js').XY
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { value: '人员维护', name: '人员维护' },
      { value: '部门查询', name: '部门查询' },
      { value: '业务权限1', name: '业务权限1' },
      { value: '业务权限2', name: '业务权限2' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

this.setData({
  params:options
})

//判断是否为管理员
    if (app.globalData.orgInfo.fAuth.value.indexOf("人员维护") || JSON.parse(app.globalData.cmpyInfo.fOrgJson.value).managerID == app.globalData.orgInfo.fID.value ){
this.setData({
BtnShow:true

})


}
  },
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
this.setData({
  selected: e.detail.value.join(" ")
})
    // const items = this.data.items
    // const values = e.detail.value
    // for (let i = 0, lenI = items.length; i < lenI; ++i) {
    //   items[i].checked = false

    //   for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
    //     if (items[i].value === values[j]) {
    //       items[i].checked = true
    //       break
    //     }
    //   }
    // }

    // this.setData({
    //   items
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
  updataPsnAuthBtn:function(){

    var me = this;

    XY.changeAuth(app.globalData.orgInfo.fID.value, this.data.params.fID, this.data.selected, function (data) {
      console.log(data, "徐岩公司")


    })
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