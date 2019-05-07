// eqpt/management/eqptRepairReport/eqptRepairReport.js
var wxCharts = require('../../wxcharts.js');
var requestUrl = require('../../../config.js').requestUrl
var app = getApp();

var columnChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    RepairRecordScoreList: [],
    RepairInfoAvgTimeList:[],
    showChar: false,
    showChar1: false,
    inputVal:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.LoadRepairRecordScore();
    this.LoadRepairInfoAvgTime();


  },

  userInput: function (e) {//获取组件中传回来的值


    this.setData({
      RepairRecordScoreList:[],
      RepairInfoAvgTimeList:[],
      inputVal: e.detail.data
    })
    this.LoadRepairRecordScore();
    this.LoadRepairInfoAvgTime();
  },
  LoadRepairRecordScore:function(){
    var me = this;
    wx.request({
      url: requestUrl + '/queryRepairRecordScoreEcharts',
      method: "POST",
      data: {
        inputVal: this.data.inputVal,
        fEqpCmpyID: app.globalData.orgInfo.fCmpyID.value,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        if (res.data.eqptRepairScore.rows.length > 0) {
          me.setData({
            RepairRecordScoreList: res.data.eqptRepairScore,
            showChar: true
          })
          me.initChart();
        }


      }
    });

  },

  LoadRepairInfoAvgTime:function(){
    var me = this;
    wx.request({
      url: requestUrl + '/queryRepairInfoAvgTime',
      method: "POST",
      data: {
        inputVal: this.data.inputVal,
        fEqpCmpyID: app.globalData.orgInfo.fCmpyID.value,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        if (res.data.RepairInfoAvgTime.rows.length > 0) {
          me.setData({
            RepairInfoAvgTimeList: res.data.RepairInfoAvgTime,
            showChar1: true
          })
          me.initChart1();
        }


      }
    });

  },


  createSimulationRepairData: function () {

    var categories = [];
    var data = [];

    for (var i = 0; i < this.data.RepairRecordScoreList.rows.length; i++) {
      categories.push(this.data.RepairRecordScoreList.rows[i].name.value);
      data.push(this.data.RepairRecordScoreList.rows[i].score.value);
    }


    return {
      categories: categories,
      data: data
    }
  },
  createSimulationAvgTimeData: function () {

    var categories = [];
    var data = [];

    for (var i = 0; i < this.data.RepairInfoAvgTimeList.rows.length; i++) {
      categories.push(this.data.RepairInfoAvgTimeList.rows[i].name.value);
      data.push(this.data.RepairInfoAvgTimeList.rows[i].avgTime.value);
    }


    return {
      categories: categories,
      data: data
    }
  },

  initChart: function () {

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var createSimulationRepairData = this.createSimulationRepairData();
    columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      categories: createSimulationRepairData.categories,
      series: [{
        name: '',
        data: createSimulationRepairData.data,
        format: function (val, name) {

          return val + '分';
        },
   
      }],
      yAxis: {

        disabled: true,
        min: 0
      },
      xAxis: {
        disableGrid: true,
        type: 'calibration',

      },
      extra: {
        column: {
          width: 30
        }
      },
      width: windowWidth,
      height: 250,
      legend: false
    });



  },


  initChart1: function () {

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var createSimulationRepairData = this.createSimulationAvgTimeData();
    columnChart = new wxCharts({
      canvasId: 'columnCanvas1',
      type: 'column',
      animation: true,
      categories: createSimulationRepairData.categories,
      series: [{
        name: '',
        data: createSimulationRepairData.data,
        format: function (val, name) {

          return val;
        }
      }],
      yAxis: {

        disabled: true,
        min: 0
      },
      xAxis: {
        disableGrid: true,
        type: 'calibration',

      },
      extra: {
        column: {
          width: 30
        }
      },
      width: windowWidth,
      height: 250,
      legend: false
    });



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