var regeneratorRuntime = require('runtime.js');


import {
  promisify
} from './promisify'

var XYLoginUrl = require('../config.js').XYLoginUrl


//替换emoji表情方法
function replaceEmoji(res) {
  var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
  if (regStr.test(res)) {
    res = res.replace(regStr, "");
  }
  return res;
}


class XY {

  static async XYLogin(options) {
    var data = {}
    var result = {}
    console.log(options.openid, "openid")
    if (options && options.openid) {
      data = {
        openid: options.openid
      }
    } else {
      //获取code
      let loginResult = await promisify(wx.login)()
      data = {
        code: loginResult.code,

      }
    }



    //通过code去后台换取openID
    let openIDResult = await promisify(wx.request)({
      url: XYLoginUrl + '/code2UserInfo',
      method: "POST",
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
    })


    var status = "err"

    if (openIDResult.data.openid) {
      status = "openidOK"
      Object.assign(result, {
        "unionid": openIDResult.data.unionid,
        "openid": openIDResult.data.openid
      })
    }

    if (openIDResult.data.table && openIDResult.data.table.rows.length > 0) {
      status = "UserInfoOK"
      Object.assign(result, {
        "userInfo": openIDResult.data.table.rows[0]
      })
    }

    if (openIDResult.data.orgTable && openIDResult.data.orgTable.rows.length > 0) {
      status = "OrgInfoOK"
      Object.assign(result, {
        "orgInfo": openIDResult.data.orgTable.rows[0]
      })
      Object.assign(result, {
        "cmpyInfo": openIDResult.data.cmpyTable.rows[0]
      })
    }


    Object.assign(result, {
      "status": status,
      "errmsg": openIDResult.data.errmsg
    })

    if (options && options.callback) {
      options.callback(result);
    }

  }

  static async saveUserInfo(userInfo, callback) {
    if (userInfo.nickName) {
      userInfo.nickName = replaceEmoji(userInfo.nickName)
    }
    if (userInfo.psnName) {
      userInfo.psnName = replaceEmoji(userInfo.psnName)
    }


    let openIDResult = await promisify(wx.request)({
      url: XYLoginUrl + '/saveUserInfo',
      method: "POST",
      data: {
        userInfo: userInfo,
      },

      header: {
        'content-type': 'application/json' // 默认值
      },
    })



    if (callback) {
      callback(openIDResult);
    }

  }


  static async creatCmpy(openID, fCmpyName, callback) {




    let creatCmpyResult = await promisify(wx.request)({
      url: XYLoginUrl + '/creatCmpy',
      method: "POST",
      data: {
        openID: openID,
        fCmpyName: fCmpyName

      },



      header: {
        'content-type': 'application/json' // 默认值
      },
    })




    if (callback) {
      callback(creatCmpyResult);
    }

  }
  static async getYanCode(fCellphone, callback) {


    let getYanCode = await promisify(wx.request)({
      url: XYLoginUrl + '/getYanCode',
      method: "POST",
      data: {
        fCellphone: fCellphone,

      },



      header: {
        'content-type': 'application/json' // 默认值
      },
    })







    if (callback) {
      callback(getYanCode);
    }

  }


  static async querySonByPath(fPath, callback) {




    let res = await promisify(wx.request)({
      url: XYLoginUrl + '/querySonByPath',
      method: "POST",
      data: {
        fPath: fPath,

      },



      header: {
        'content-type': 'application/json' // 默认值
      },
    })

    if (callback) {
      callback(res);
    }

  }

  static async queryCuurentfName(deptID, callback) {




    let res = await promisify(wx.request)({
      url: XYLoginUrl + '/queryCuurentfName',
      method: "POST",
      data: {
        deptID: deptID,

      },



      header: {
        'content-type': 'application/json' // 默认值
      },
    })

    if (callback) {
      callback(res);
    }

  }


  static async creatDept(operatorID, currentDeptID,deptName, callback) {




    let res = await promisify(wx.request)({
      url: XYLoginUrl + '/creatDept',
      method: "POST",
      data: {
        operatorID: operatorID,
        currentDeptID: currentDeptID,
        deptName: deptName
      },



      header: {
        'content-type': 'application/json' // 默认值
      },
    })







    if (callback) {
      callback(res);
    }

  }


  static async updateDept(operatorID, currentDeptID, deptName, callback) {




    let res = await promisify(wx.request)({
      url: XYLoginUrl + '/updateDept',
      method: "POST",
      data: {
        operatorID: operatorID,
        currentDeptID: currentDeptID,
        deptName: deptName
      },



      header: {
        'content-type': 'application/json' // 默认值
      },
    })







    if (callback) {
      callback(res);
    }

  }


  static async deleteDept(operaterID, currentDeptID, callback) {




    let res = await promisify(wx.request)({
      url: XYLoginUrl + '/deleteDept',
      method: "POST",
      data: {
        operaterID: operaterID,
        currentDeptID: currentDeptID,
      
      },



      header: {
        'content-type': 'application/json' // 默认值
      },
    })







    if (callback) {
      callback(res);
    }

  }


  static async deleteCmpy(openID, cmpyID, callback) {




    let res = await promisify(wx.request)({
      url: XYLoginUrl + '/deleteCmpy',
      method: "POST",
      data: {
        openID: openID,
        cmpyID: cmpyID,

      },



      header: {
        'content-type': 'application/json' // 默认值
      },
    })







    if (callback) {
      callback(res);
    }

  }


  static async updataCmpy(openID, fCmpyID, fCmpyName, callback) {




    let res = await promisify(wx.request)({
      url: XYLoginUrl + '/updataCmpy',
      method: "POST",
      data: {
        openID: openID,
        fCmpyID: fCmpyID,
        fCmpyName: fCmpyName
      },



      header: {
        'content-type': 'application/json' // 默认值
      },
    })







    if (callback) {
      callback(res);
    }

  }


  static async orgMove(operaterID, currentDeptID, clipID, callback) {




    let res = await promisify(wx.request)({
      url: XYLoginUrl + '/orgMove',
      method: "POST",
      data: {
        operaterID: operaterID, 
        currentDeptID: currentDeptID,
        clipID: clipID,
      
      },



      header: {
        'content-type': 'application/json' // 默认值
      },
    })







    if (callback) {
      callback(res);
    }

  }


  static async orgOrder(operaterID, orgAID, orgBID, callback) {




    let res = await promisify(wx.request)({
      url: XYLoginUrl + '/orgOrder',
      method: "POST",
      data: {
        operaterID: operaterID,
        orgAID: orgAID,
        orgBID: orgBID
      },



      header: {
        'content-type': 'application/json' // 默认值
      },
    })







    if (callback) {
      callback(res);
    }

  }


  static async addPsn(managerID, orgID, userOpenID,fName, callback) {




    let res = await promisify(wx.request)({
      url: XYLoginUrl + '/addPsn',
      method: "POST",
      data: {
        managerID: managerID,
        orgID: orgID,
        userOpenID: userOpenID,
        fName: fName
      },



      header: {
        'content-type': 'application/json' // 默认值
      },
    })







    if (callback) {
      callback(res);
    }

  }


  static async managerChange(managerID, orgID,  callback) {




    let res = await promisify(wx.request)({
      url: XYLoginUrl + '/managerChange',
      method: "POST",
      data: {
        managerID: managerID,
        orgID: orgID,
    
      },



      header: {
        'content-type': 'application/json' // 默认值
      },
    })







    if (callback) {
      callback(res);
    }

  }


  static async checkPsnInDept(orgID, userOpenID, callback) {




    let res = await promisify(wx.request)({
      url: XYLoginUrl + '/checkPsnInDept',
      method: "POST",
      data: {
   
        orgID: orgID,
        userOpenID: userOpenID
      },



      header: {
        'content-type': 'application/json' // 默认值
      },
    })







    if (callback) {
      callback(res);
    }

  }


  static async changeAuth(managerID, userOrgID,fAuth, callback) {




    let res = await promisify(wx.request)({
      url: XYLoginUrl + '/changeAuth',
      method: "POST",
      data: {

        managerID: managerID,
        userOrgID: userOrgID,
        fAuth: fAuth,
       
      },



      header: {
        'content-type': 'application/json' // 默认值
      },
    })







    if (callback) {
      callback(res);
    }

  }


  static async queryOrgByPsnID(psnID,callback) {




    let res = await promisify(wx.request)({
      url: XYLoginUrl + '/queryOrgByPsnID',
      method: "POST",
      data: {

        psnID: psnID,
      
      },



      header: {
        'content-type': 'application/json' // 默认值
      },
    })







    if (callback) {
      callback(res);
    }

  }


  static async CreatPsnExcel(fCmpyID, callback) {




    let res = await promisify(wx.request)({
      url: XYLoginUrl + '/creatPsnExcel',
      method: "POST",
      data: {

        fCmpyID: fCmpyID,

      },



      header: {
        'content-type': 'application/json' // 默认值
      },
    })







    if (callback) {
      callback(res);
    }

  }


  static async changePost(orgID, callback) {




    let res = await promisify(wx.request)({
      url: XYLoginUrl + '/changePost',
      method: "POST",
      data: {

        orgID: orgID,

      },



      header: {
        'content-type': 'application/json' // 默认值
      },
    })







    if (callback) {
      callback(res);
    }

  }



}
module.exports.XY = XY