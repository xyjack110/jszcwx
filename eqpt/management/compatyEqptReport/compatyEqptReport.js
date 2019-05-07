var wxCharts = require('../../wxcharts.js');
var requestUrl = require('../../../config.js').requestUrl
var app = getApp();
var lineChart = null;
var pieChart = null; 
var columnChart = null;     
var columnChart1 = null;  
var chartData = {
  main: {
    title: '总成交量',
    data: [15, 20, 45, 37, 56, 67, 80, 24],
    categories: ['100次以下', '100-200之间', '200-300之间', '300-400之间', '400-500之间', '500-600之间', '600以上']
  }

};


Page({
  data: {
statusList:[],
monthRepairList:[],
    RepairRecordCountList:[],
    EqptHandNumList:[],
    showChar:false,
    showChar1: false,
    showChar2: false,
    showChar3: false,
    inputVal: ""
  },

  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {

        return category+  item.data + "次"
      }
    });
  },






  onLoad: function (options) {
    this.loadEqptGroupStatus();
    this.loadMonthRepairCountEcharts();
    this.loadRepairRecordCountEcharts();
    this.loadEqptHandNumEcharts();



  },


  userInput: function (e) {//获取组件中传回来的值


    this.setData({
      statusList: [],
      monthRepairList:[],
      RepairRecordCountList: [],
      EqptHandNumList: [],
      inputVal: e.detail.data
    })
    this.loadEqptGroupStatus();
    this.loadMonthRepairCountEcharts();
    this.loadRepairRecordCountEcharts();
    this.loadEqptHandNumEcharts();
 
  },


  loadEqptGroupStatus:function(){

  
    var me = this
    wx.request({
      url: requestUrl + '/queryEqptGroupStatus',
      method: "POST",
      data: {
        inputVal: this.data.inputVal,
        fEqpCmpyID: app.globalData.orgInfo.fCmpyID.value,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        if (res.data.eqptStatus.rows.length > 0) {
          me.setData({
            statusList: res.data.eqptStatus.rows,
            showChar: true
          })
          me.initChart()
        }


      }
    });


  },

  loadMonthRepairCountEcharts:function(){

    var me = this
    wx.request({
      url: requestUrl + '/queryMonthRepairCountEcharts',
      method: "POST",
      data: {
        inputVal: this.data.inputVal,
        fEqpCmpyID: app.globalData.orgInfo.fCmpyID.value,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        if (res.data.rows.length > 0) {
          me.setData({
            monthRepairList: res.data,
            showChar1: true
          })
          me.initChart1()
        }


      }
    });


  },
  loadRepairRecordCountEcharts:function(){
    var me = this

    wx.request({
      url: requestUrl + '/queryRepairRecordCountEcharts',
      method: "POST",
      data: {
        inputVal: this.data.inputVal,
        fEqpCmpyID: app.globalData.orgInfo.fCmpyID.value,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        if (res.data.rows.length > 0) {
          me.setData({
            RepairRecordCountList: res.data,
            showChar2: true
          })
          me.initChart2();
        }


      }
    });


  },



  loadEqptHandNumEcharts:function(){
    var me = this
    wx.request({
      url: requestUrl + '/queryEqptHandNumEcharts',
      method: "POST",
      data: {
        inputVal: this.data.inputVal,
        fEqpCmpyID: app.globalData.orgInfo.fCmpyID.value,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {


        if (res.data.rows.length > 0) {
          me.setData({
            EqptHandNumList: res.data,
            showChar3: true
          })
          me.initChart3();
        }


      }
    });

  },

  createSimulationRepairData: function () {

    var categories = [];
    var data = [];

    for (var i = 0; i < this.data.RepairRecordCountList.rows.length; i++) {
      categories.push(this.data.RepairRecordCountList.rows[i].repairGroup.value);
      data.push(this.data.RepairRecordCountList.rows[i].EqptNum.value);
    }

 
    return {
      categories: categories,
      data: data
    }
  },
  createSimulationEqptHandData:function(){

    var categories = [];
    var data = [];

    for (var i = 0; i < this.data.EqptHandNumList.rows.length; i++) {
      categories.push(this.data.EqptHandNumList.rows[i].repairGroup.value);
      data.push(this.data.EqptHandNumList.rows[i].EqptNum.value);
    }


    return {
      categories: categories,
      data: data
    }
  },


  createSimulationData: function () {

    var categories = [];
    var data = [];

    for (var i = 0; i < this.data.monthRepairList.rows.length; i++) {
      categories.push(this.data.monthRepairList.rows[i].month.value);
      data.push(this.data.monthRepairList.rows[i].num.value);
    }


    return {
      categories: categories,
      data: data
    }
  },

  initChart3: function () {

    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var createSimulationEqptHandData = this.createSimulationEqptHandData();
    columnChart1 = new wxCharts({
      canvasId: 'columnCanvas1',
      type: 'column',
      animation: true,
      categories: createSimulationEqptHandData.categories,
      series: [{
        name: '',
        data: createSimulationEqptHandData.data,
        format: function (val, name) {

          return val + '台';
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
initChart2:function(){

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
       
        return val + '台';
      }
    }],
    yAxis: {
   
      disabled: true,
min:0
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
    legend:false
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
        nameRotate: 0
      },
      legend: false,
      yAxis: {
        disabled: true,

        // format: function (val) {
        //   return val.toFixed(2);
        // },
 
      },
      width: windowWidth,
      height: 250,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });


  },

  initChart: function () {
var arr=[];
var me=this;
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    for (var i = this.data.statusList.length - 1; i >= 0; i--) {
      var temp =this.data.statusList[i].num.value;
      arr.push({
        name: this.data.statusList[i].fEqpStatus.value,
        data: Number(this.data.statusList[i].num.value),
        format: function (value) {

          return this.data+"个";
        },
      })


    }

    pieChart = new wxCharts({
      title: { name: 'rr',  titleFontColor: '#8085e9' },
      subtitle: { name: 'rr', fontColor: '#8085e9' },
      animation: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series:arr,
      width: windowWidth,
      height: 300,
      dataLabel: true,
      legend: true,
    });

  },
 
});