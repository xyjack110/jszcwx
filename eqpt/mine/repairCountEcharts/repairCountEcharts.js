var wxCharts = require('../../wxcharts.js');
var requestUrl = require('../../../config.js').requestUrl
var app = getApp();
var lineChart = null;
var timeLineChart=null;  
Page({
  data: {    
    dataList:[],   
    TimedataList:[],
    dateFlag:"",
    fPsnImg:""
  },

  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        var date = new Date;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        return year+"-"+month+"-"+category + '  '
        + item.data+"次"
      }
    });
  },
  touchHandlerTime: function (e) {
    console.log(timeLineChart.getCurrentDataIndex(e));
    timeLineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        var date = new Date;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        return year + "-" + month + "-" + category + '  '
          + item.data + "分钟"
      }
    });
  },
  createSimulationData: function () {

    var categories = [];
    var data = [];

    for (var i = 0; i < this.data.dataList.rows.length; i++) {
      categories.push(this.data.dataList.rows[i].fOperationDay.value);
      data.push(this.data.dataList.rows[i].fOperationCount.value);
    }

    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },

  createSimulationDataTime: function () {

    var categories = [];
    var data = [];

    for (var i = 0; i < this.data.TimedataList.rows.length; i++) {
      categories.push(this.data.TimedataList.rows[i].fOperationDay.value);
      data.push(this.data.TimedataList.rows[i].fProdCount.value);
    }

    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },
  //局部更新图表数据
  // updateData: function () {
  //   var simulationData = this.createSimulationData();
  //   var series = [{
  //     name: '成交量1',
  //     data: simulationData.data,
  //     format: function (val, name) {
  //       return val.toFixed(2) + '万';
  //     }
  //   }];
  //   lineChart.updateData({
  //     categories: simulationData.categories,
  //     series: series
  //   });
  // },
  onLoad: function (options) {
this.setData({
  dateFlag: options.dateFlag,
fPsnImg: options.fPsnImg,

})
wx.setNavigationBarTitle({
  title: options.fPsnName,
  success: function () {

  },
  fail: function (err) {

  }
})

    var me = this
    wx.request({
      url: requestUrl + '/queryRepairCounteEcharts',
      method: "POST",
      data: {
        fOpratorID: options.fPsnID,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
    
    me.setData({
      dataList:res.data
    })
    me.initChart()
      }
    });


    var me = this
    wx.request({
      url: requestUrl + '/queryRepairTimeEcharts',
      method: "POST",
      data: {
        fOpratorID: options.fPsnID,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        me.setData({
          TimedataList: res.data
        })
        me.TimeinitChart()
      }
    })
  },
  initChart:function(){

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
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
      }],
      xAxis: {
        disableGrid: true,
        nameRotate:0
      },
      legend :false,
      yAxis: {
        disabled :true,
        // format: function (val) {
        //   return val.toFixed(2);
        // },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });


  },
  TimeinitChart: function () {

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var simulationData = this.createSimulationDataTime();
  
    timeLineChart = new wxCharts({
      canvasId: 'TimelineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '维修时长',
        data: simulationData.data,
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
        disabled: true,
        // format: function (val) {
        //   return val.toFixed(2);
        // },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });


  }
});