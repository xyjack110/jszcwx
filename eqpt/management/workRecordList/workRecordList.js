
// eqpt/management/eqptUseReport/eqptUseReport.js
var wxCharts = require('../../wxcharts.js');
var requestUrl = require('../../../config.js').requestUrl;
var app = getApp();
var lineChart = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
 
    workNumList: [],
    showChar: false,
    showChar1: false,
    inputVal: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: "工作录入报表",
      success: function () {

      },
      fail: function (err) {

      }
    })



   
    this.LoadWorkRecordList();

  },


  userInput: function (e) {//获取组件中传回来的值


    this.setData({
      workNumList: [],

      inputVal: e.detail.data
    })
    this.LoadWorkRecordList();

  },
  LoadWorkRecordList:function(){
    var me = this;

    var psnFilter = app.globalData.orgInfo.fPath.value;

    console.log(this.data.inputVal + "加载")
    //根据这个人的全路径拿这个人的部门全路径
    if (app.globalData.orgInfo.fAuth.value && app.globalData.orgInfo.fAuth.value.indexOf('部门查询') > -1) {
      var t = []
      t = app.globalData.orgInfo.fPath.value.split("/")
      t.length = t.length - 1;
      psnFilter = t.join("/");
    }


    wx.request({
      url: requestUrl + '/QueryWorkRecordListEcharts',
      method: "POST",
      data: {
        psnFilter: psnFilter,
        inputVal: this.data.inputVal,
        fOpratorID: app.globalData.orgInfo.fPath.value,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        if (res.data.workNumList.rows.length > 0) {
          me.setData({
            workNumList: res.data.workNumList,

            showChar1: true
          })
          me.initChart2()
        }


      }
    });



  },

  initChart2: function () {

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var simulationData = this.createSimulationStopData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas1', //simulationData.categories
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [
        {
          name: '工作量',
          data: simulationData.data,
          // format: function (val, name) {
          //   return val.toFixed(2) + '万';
          // }
        }],
      xAxis: {
        disableGrid: true,
        nameRotate: 0
      },

      yAxis: {
        disabled: false,
        disableGrid: true,
        // format: function (val) {
        //   return val.toFixed(2);
        // },

      },
      width: windowWidth,
      height: 250,
      dataLabel: false,
      dataPointShape: true,
      legend: false,
      extra: {
        lineStyle: 'curve'
      }
    });


  },



  createSimulationStopData: function () {

    var categories = [];
    var data = [];


    for (var i = 0; i < this.data.workNumList.rows.length; i++) {
      categories.push(this.data.workNumList.rows[i].date.value);
      data.push(this.data.workNumList.rows[i].num.value);
    }




    return {
      categories: categories,
      data: data,

    }
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