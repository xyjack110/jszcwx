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
    monthRepairList: [],
    eqptRepairInfoList:[],
    eqptStopList:[],
    showChar: false,
    showChar1: false,
    inputVal:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.loadEqptUseReportEcharts();
    this.loadEqptStopEcharts();

    


  },

  userInput: function (e) {//获取组件中传回来的值


    this.setData({
      monthRepairList: [],
      eqptRepairInfoList: [],
      eqptStopList:[],
      inputVal: e.detail.data
    })
    this.loadEqptUseReportEcharts();
    this.loadEqptStopEcharts();
  },
//报修维修次数
  loadEqptUseReportEcharts:function(){
    var me = this;
    wx.request({
      url: requestUrl + '/queryEqptUseReportEcharts',
      method: "POST",
      data: {
        inputVal: this.data.inputVal,
        fOperatorCmpyID: app.globalData.orgInfo.fCmpyID.value,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        if (res.data.eqptUseRepair.rows.length > 0 || res.data.eqptUseRepairInfo.rows.length > 0) {
          me.setData({
            monthRepairList: res.data.eqptUseRepair,
            eqptRepairInfoList: res.data.eqptUseRepairInfo,
            showChar: true
          })
          me.initChart1()
        }


      }
    });

  },

  loadEqptStopEcharts:function(){
    var me = this;
    wx.request({
      url: requestUrl + '/QueryEqptStopEcharts',
      method: "POST",
      data: {
        inputVal: this.data.inputVal,
        fOperatorCmpyID: app.globalData.orgInfo.fCmpyID.value,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        if (res.data.eqptStopTime.rows.length > 0) {
          me.setData({
            eqptStopList: res.data.eqptStopTime,

            showChar1: true
          })
          me.initChart2()
        }


      }
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

    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas', //simulationData.categories
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '维修次数',
        data: simulationData.data,
        // format: function (val, name) {
        //   return val.toFixed(2) + '万';
        // }
      },
        {
          name: '报修次数',
          data: simulationData.RepairInfoData,
          // format: function (val, name) {
          //   return val.toFixed(2) + '万';
          // }
        }],
      xAxis: {
        disableGrid: true,
        nameRotate: 0
      },
      legend: false,
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
      legend: true,
      extra: {
        lineStyle: 'curve'
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
        name: '停机时间',
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
 legend:false,
      extra: {
        lineStyle: 'curve'
      }
    });


  },






  createSimulationData: function () {

    var categories = [];
    var data = []; 
    var RepairInfoData=[];

    for (var i = 0; i < this.data.monthRepairList.rows.length; i++) {
      categories.push(this.data.monthRepairList.rows[i].date.value);
      data.push(this.data.monthRepairList.rows[i].num.value);
    }

    for (var i = 0; i < this.data.eqptRepairInfoList.rows.length; i++) {
     
      RepairInfoData.push(this.data.eqptRepairInfoList.rows[i].num.value);
    }


    return {
      categories: categories,
      data: data,
      RepairInfoData: RepairInfoData
    }
  },



  createSimulationStopData: function () {

    var categories = [];
    var data = [];


    for (var i = 0; i < this.data.eqptStopList.rows.length; i++) {
      categories.push(this.data.eqptStopList.rows[i].date.value);
      data.push(this.data.eqptStopList.rows[i].num.value);
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