function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}
function randString() {

  return Math.random().toString(36).substr(2, 15);
}
function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

 

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}


//保存数据
function conWx2Table(rows, tableName, relationTypes) {

  var resultRows = [];
  var TableUserData = {};
  var RealationStr = "";
  for (var i = 0; i < rows.length; i++) {
    var jsonObject = rows[i];
    var recordJson = {};
    var userData = {};

    for (var field in jsonObject) {
      if (field == "fID") {

        userData.id = { value: jsonObject[field] };
      } else if (field == "recordState") {
        userData[field] = jsonObject[field];
      } else {
        recordJson[field] = { value: jsonObject[field] }
        if (i == 0) { RealationStr = RealationStr + "," + field; }

      }


    }
    recordJson.userdata = userData;
    resultRows.push(recordJson);

  }
  RealationStr = RealationStr.substring(1);
  TableUserData.idColumnDefine = "fID";
  TableUserData.idColumnName = "fID";
  TableUserData.idColumnType = "String";
  TableUserData.tableName = tableName;
  TableUserData.relationAlias = RealationStr;
  TableUserData.relationTypes = relationTypes;
  TableUserData.relations = RealationStr;
  var result = [];
  result.push({
    "@type": "table",
    "rows": resultRows,
    "userdata": TableUserData
  })


  return result;
}
//判断字符是否为空的方法
function isEmpty(obj) {
  if (typeof obj == "undefined" || obj == null || obj == "") {
    return true;
  } else {
    return false;
  }
}

function dateToString(now) {
  var year = now.getFullYear();
  var month = (now.getMonth() + 1).toString();
  var day = (now.getDate()).toString();
  var hour = (now.getHours()).toString();
  var minute = (now.getMinutes()).toString();
  var second = (now.getSeconds()).toString();
  if (month.length == 1) {
    month = "0" + month;
  }
  if (day.length == 1) {
    day = "0" + day;
  }
  if (hour.length == 1) {
    hour = "0" + hour;
  }
  if (minute.length == 1) {
    minute = "0" + minute;
  }
  if (second.length == 1) {
    second = "0" + second;
  }
  var dateTime = year + "-" + month + "-" + day ;
 // + " " + hour + ":" + minute + ":" + second;
  return dateTime;
} 


function dateTimeToString(now) {
  var year = now.getFullYear();
  var month = (now.getMonth() + 1).toString();
  var day = (now.getDate()).toString();
  var hour = (now.getHours()).toString();
  var minute = (now.getMinutes()).toString();
  var second = (now.getSeconds()).toString();
  if (month.length == 1) {
    month = "0" + month;
  }
  if (day.length == 1) {
    day = "0" + day;
  }
  if (hour.length == 1) {
    hour = "0" + hour;
  }
  if (minute.length == 1) {
    minute = "0" + minute;
  }
  if (second.length == 1) {
    second = "0" + second;
  }
  var dateTime = year + "-" + month + "-" + day+ " " + hour + ":" + minute + ":" + second;
  return dateTime;
} 
//获取当前时间，格式YYYY-MM-DD
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

//替换emoji表情方法
function replaceEmoji(res) {  var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
if (regStr.test(res)) { res = res.replace(regStr, ""); } return res;}

module.exports = {
  formatTime: formatTime,
  formatLocation: formatLocation,
    randString: randString,
    conWx2Table: conWx2Table,
    dateToString: dateToString,
    dateTimeToString: dateTimeToString,
  getNowFormatDate: getNowFormatDate,
    isEmpty: isEmpty,
  replaceEmoji: replaceEmoji
}
