/**
 * 小程序配置文件121212121212ddfff
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

var host = "14592619.qcloud.la"
//var host1 ="https://fish.fishbear.com.cn"
var host1 = "http://192.168.1.26:8080"
//var host1 = "http://172.34.3.14:8080"
//var host1 = "https://jtnsh.fishbear.com.cn"
var config = {

  // 下面的地址配合云端 Server 工作
  host,
  host1,
  // 登录地址，用于建立会话
  loginUrl: `https://${host}/login`,

  // 测试的请求地址，用于测试会话
  requestUrl: `${host1}/baas/eqpt/eqpt`,
  XYLoginUrl: `${host1}/baas/XY/XYLogin`,
  homePage: `/eqpt/mine/mine`,
  AuthArr: ["资产管理员","资产入库"],
  downloadExcelUrl: `${host1}/x5/resouce/exportExcel/`,
  //total_fee:800000,
  //creatCompyTotal_fee:5000000,
  // total_fee:1,
  // creatCompyTotal_fee:1,
  requestMiniCodeUrl: `http://192.168.31.195:8080/baas/visitor/visitorinfo`,
  // 用code换取openId
  openIdUrl: `https://${host}/openid`,

  // 测试的信道服务接口
  tunnelUrl: `https://${host}/tunnel`,

  // 生成支付订单的接口
  paymentUrl: `https://${host}/payment`,

  // 发送模板消息接口
  templateMessageUrl: `https://${host}/templateMessage`,

  // 上传文件接口
  uploadFileUrl: `https://${host}/upload`,

 
  // 下载示例图片接口
  downloadExampleUrl: `https://${host}/static/weapp.jpg`,
  SECRETID: "AKIDY1KYbXeO9j9OJ8sKg8R4iEYkcN0UeslH",
  SECRETKEY: "iWEpDTGxXzFJB0e5KNRfkDj9MNCqdJqH",
  BUCKET: "fishbear-1256082024",
  REGION: "ap-beijing",
  REQUESTCOSURL: "https://xy-1256082024.cos.ap-beijing.myqcloud.com/",

  // 下载资产报表接口

  downloadExampleUrl: `${host1}/x5/resouce`
};

module.exports = config
