var COS = require('cos-wx-sdk-v5')
var SECRETID = "AKIDY1KYbXeO9j9OJ8sKg8R4iEYkcN0UeslH"

var SECRETKEY = "iWEpDTGxXzFJB0e5KNRfkDj9MNCqdJqH"

var BUCKET = "xy-1256082024"
var REGION = "ap-beijing"

var REQUESTCOSURL = "https://xy-1256082024.cos.ap-beijing.myqcloud.com/"
var cos = new COS({

  getAuthorization: function(params, callback) { //获取签名 必填参数


    var authorization = COS.getAuthorization({
      SecretId: SECRETID,
      SecretKey: SECRETKEY,
      Method: params.Method,
      Key: params.Key
    });

    callback(authorization);


  }
});
Component({

  properties: {

    fileList: {
      type: Array,
      value: []
    },
    maxCount: {
      type: Number,
      value: 9
    },
    subPath: {
      type: String,
      value: "fishbear"
    },
    title: {
      type: String,
      value: "相关图片"

    },
    edit: {
      type: Boolean,
      value: false
    }


  },
  data: {
    deleteShow: false,

  },
  ready: function() {

    console.log(this.data)
    if (this.data.fileList.length == 0) {
      this.setData({
        fileList: []
      })

    }

  },
  methods: {
    /*
     * 公有方法
     */

    getFileList() {
      return this.data.fileList.join("@") /* 将数组用@分割，拼接成字符串                               */
    },

    //预览图片
    _previewImage(e) {
      var current = e.target.dataset.src


      wx.previewImage({
        current: current,
        urls: this.data.fileList
      })
    },

    _deletImg() {

      this.setData({
        deleteShow: true
      })

    },
    //点击蒙版事件
    _clearDelete: function() {

      this.setData({
        deleteShow: false
      })
    },
    //删除图片
    _deleteObject: function(e) {

      var me = this;
      cos.deleteObject({
        Bucket: BUCKET,
        Region: REGION,
        Key: this.data.fileList[e.currentTarget.dataset.index]
      }, function(err, data) {
        console.log(err || data);





        if (err && err.error) {
          wx.showModal({
            title: '返回错误',
            content: '请求失败：' + err.error.Message + '；状态码：' + err.statusCode,
            showCancel: false
          });
        } else if (err) {
          wx.showModal({
            title: '请求出错',
            content: '请求出错：' + err + '；状态码：' + err.statusCode,
            showCancel: false
          });
        } else {

          if (me.data.fileList.length == 1) {
            me.setData({
              deleteShow: false
            })
          }

          var arr = me.data.fileList
          arr.splice(e.currentTarget.dataset.index, 1) //删除数组元素
          me.setData({
            fileList: arr
          })

          ;
        }
      });
    },
    //上传图片
    _simpleUpload() {

      var me = this;

      console.log(this.data.fileList.length + "ddd")

      wx.chooseImage({ // 选择文件
        count: me.data.maxCount - me.data.fileList.length, // 默认9，最多可以选择9张图片
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {

          for (var i = 0; i < res.tempFilePaths.length; i++) {
            var filePath = res.tempFilePaths[i]; //选择本地的文件路径
            var Key = filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名

            console.log(me.data.subPath + "/" + Date.parse(new Date()) + Key)


            //将文件上传至服务器
            cos.postObject({
              Bucket: BUCKET, //cos存储的桶名
              Region: REGION, //cos 存储的地域名
              Key: me.data.subPath + "/" + Date.parse(new Date()) + Key,
              FilePath: filePath,
              onProgress: function(info) {
                console.log(JSON.stringify(info));
              }

            }, function(err, data) {


              if (err && err.error) {
                wx.showModal({
                  title: '返回错误',
                  content: '请求失败：' + err.error.Message + '；状态码：' + err.statusCode,
                  showCancel: false
                });
              } else if (err) {
                wx.showModal({
                  title: '请求出错',
                  content: '请求出错：' + err + '；状态码：' + err.statusCode,
                  showCancel: false
                });
              } else {

                //将请求该文件的路径，存至KeyList数组里，以供wxml渲染。
                me.setData({
                  [`fileList[${me.data.fileList.length}]`]: REQUESTCOSURL + this.Key
                })




              }
            });
          }



        }
      })

    },



  }

})