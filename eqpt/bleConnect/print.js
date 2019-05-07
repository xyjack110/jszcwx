var tsc = require("../../util/tsc.js");
var requestUrl = require('../../config.js').requestUrl
var app = getApp()

class Print{

  static  printText(selectedEqptIDs) {

var me=this;


      if (selectedEqptIDs.length <= 0) {
        wx.showModal({
          title: '信息提示',
          content: '请长按要打印标签的设备！',
          showCancel: false,
          success: function (res) {

          }
        })
      return;
      }

      wx.request({
        url: requestUrl + '/queryEqp_equipment',
        method: "POST",
        data: {
          filter: "fEqpID in('" + selectedEqptIDs + "')",

        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {

          console.log(res.data.rows, "selectedList")
          var arrList = res.data.rows
          var i = 0;
          console.log(arrList.length, "selectedListlength")

          setTimeout(function x() {
            var command = tsc.jpPrinter.createNew()
            command.setDensity(14)
            command.setSize(60, 30)

            command.setGap(2)

            command.setCls()
            command.setBox(0, 0, 470, 160, 2)
            command.setBar(300, 0, 1, 160)
            command.setBar(0, 120, 300, 1)
            command.setBar(0, 80, 300, 1)
            command.setBar(0, 40, 300, 1)
            command.setText(360, 215, "TSS24.BF2", 2, 2, "九 商 资 产")
            command.setQR(308, 3, "L", 4, "A", "https://jtnsh.fishbear.com.cn/x5/UI2/eqptDetail?scene=" + arrList[i].fEqpID.value)
            command.setText(290, 150, "TSS24.BF2", 1, 1, "类别:")
            command.setText(220, 150, "TSS24.BF2", 1, 1, arrList[i].fEqpType.value)
            command.setText(290, 115, "TSS24.BF2", 1, 1, "名称:")
            command.setText(220, 115, "TSS24.BF2", 1, 1, arrList[i].fEqpSize.value)
            command.setText(290, 75, "TSS24.BF2", 1, 1, "编码:")
            command.setText(220, 75, "TSS24.BF2", 1, 1, arrList[i].fEqpNum.value) //
            // command.setText(290, 65, "TSS24.BF2", 1, 1, "供应商:")
            // command.setText(180, 65, "TSS24.BF2", 1, 1, arrList[i].fProducer.value)  
            command.setText(290, 35, "TSS24.BF2", 1, 1, "启用日期:")
            command.setText(180, 35, "TSS24.BF2", 1, 1, arrList[i].fEqptDate.value)

            command.setPagePrint()

            me.Send(command.getData())
            i++;
            if (i < arrList.length) setTimeout(x, 2000);
          }, 100);





        }
      })








    // if (app.BLEInformation.blueTooh) {

    //   if (selectedEqptIDs.length <= 0) {
    //     wx.showModal({
    //       title: '信息提示',
    //       content: '请长按要打印标签的设备！',
    //       showCancel: false,
    //       success: function (res) {

    //       }
    //     })
    //   return;
    //   }

    //   wx.request({
    //     url: requestUrl + '/queryEqp_equipment',
    //     method: "POST",
    //     data: {
    //       filter: "fEqpID in('" + selectedEqptIDs + "')",

    //     },
    //     header: {
    //       'content-type': 'application/json' // 默认值
    //     },
    //     success: function (res) {

    //       console.log(res.data.rows, "selectedList")
    //       var arrList = res.data.rows
    //       var i = 0;
    //       console.log(arrList.length, "selectedListlength")
      
    //       setTimeout(function x() {
    //         var command = tsc.jpPrinter.createNew()
    //         command.setDensity(14)
    //         command.setSize(60, 30)
           
    //         command.setGap(2)
        
    //         command.setCls()
    //         command.setBox(0, 0, 470, 160, 2)
    //         command.setBar(300, 0, 1, 160)
    //         command.setBar(0, 120, 300, 1)
    //         command.setBar(0, 80, 300, 1)
    //         command.setBar(0, 40, 300, 1)
    //         command.setText(360, 215, "TSS24.BF2", 2, 2, "九 商 资 产")
    //         command.setQR(308, 3, "L", 4, "A", "https://jtnsh.fishbear.com.cn/x5/UI2/eqptDetail?scene=" + arrList[i].fEqpID.value)
    //         command.setText(290, 150, "TSS24.BF2", 1, 1, "类别:")
    //         command.setText(220, 150, "TSS24.BF2", 1, 1, arrList[i].fEqpType.value)
    //         command.setText(290, 115, "TSS24.BF2", 1, 1, "名称:")
    //         command.setText(220, 115, "TSS24.BF2", 1, 1, arrList[i].fEqpSize.value)
    //         command.setText(290, 75, "TSS24.BF2", 1, 1, "编码:")
    //         command.setText(220, 75, "TSS24.BF2", 1, 1, arrList[i].fEqpNum.value) //
    //         // command.setText(290, 65, "TSS24.BF2", 1, 1, "供应商:")
    //         // command.setText(180, 65, "TSS24.BF2", 1, 1, arrList[i].fProducer.value)  
    //         command.setText(290, 35, "TSS24.BF2", 1, 1, "启用日期:")
    //         command.setText(180, 35, "TSS24.BF2", 1, 1, arrList[i].fEqptDate.value)

    //         command.setPagePrint()

    //         me.Send(command.getData())
    //         i++;
    //         if (i < arrList.length) setTimeout(x, 2000);
    //       }, 100);


       


    //     }
    //   })


    // } else {
 

    //   wx.navigateTo({
    //     url: '/eqpt/bleConnect/bleConnect',
    //   })

    // }

  }

  static  prepareSend(buff) {
  //准备发送，根据每次发送字节数来处理分包数量
    console.log(typeof (buff) , "prepareSendprepareSend")
  var that = this
  var time = data.oneTimeData//每次传送字节长度
  var looptime = parseInt(buff.length / time); //需要分多少次包发送
  var lastData = parseInt(buff.length % time);//剩余字符串长度
  console.log(looptime + "---" + lastData) 
  that.setData({
    looptime: looptime + 1,
    lastData: lastData,
    currentTime: 1,
  })
  that.Send(buff)
}

  static Send(buff){
var that=this;
    console.log("SEND")
    console.log(buff)
    var buf
    var dataView
    if (buff.length>20){
      var strLeft = buff.slice(0, 20)
      buff = buff.slice(20, buff.length+1)
      buf = new ArrayBuffer(strLeft.length)
      dataView = new DataView(buf)
      for (var i = 0; i < strLeft.length; ++i) {
        dataView.setUint8(i, strLeft[i])
      }

      wx.writeBLECharacteristicValue({
        deviceId: app.BLEInformation.deviceId,
        serviceId: app.BLEInformation.writeServiceId,
        characteristicId: app.BLEInformation.writeCharaterId,
        value: buf,
        success: function (res) {
          console.log(res, "write")
          //加延迟200
          setTimeout(that.Send(buff), 500);
         
        },
        fail: function (e) {
          console.log(e, "writeerro")
        }
      })
    }else{
    
      buf = new ArrayBuffer(buff.length)
      dataView = new DataView(buf)
      for (var i = 0; i < buff.length; ++i) {
        dataView.setUint8(i, buff[i])
      }

      wx.writeBLECharacteristicValue({
        deviceId: app.BLEInformation.deviceId,
        serviceId: app.BLEInformation.writeServiceId,
        characteristicId: app.BLEInformation.writeCharaterId,
        value: buf,
        success: function (res) {
          console.log(res, "finish")
        
        },
        fail: function (e) {
          console.log(e, "writeerro")
        }
      })

    }
 
}

 
}
module.exports.Print = Print