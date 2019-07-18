<template>
  <div class="imgUpload" ref="imgUpload">

    <ul class="clearfix">
      <draggable v-model="dataArr" @change="$emit('ee', dataArr)">
        <li class="item" v-for="(item,index) in dataArr" :key="index">
          <img :src="checkUrl(item.url)">

          <span class="close trans" @click="removeItem(index)"><i class="el-icon-close"></i></span>
          <span class="pro" v-if="item.pro">
            <i v-if="item.pro == 100" class="el-icon-check"></i>
            <el-progress v-else :width="40"
            type="circle" :percentage="item.pro" :show-text="false"></el-progress>
          </span>

        </li>
      </draggable>
      <li class="item addItem trans" ref="selectfiles"><i class="trans el-icon-plus"></i></li>
    </ul>

  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { getTimestamp, getSuffix } from "@/libs/utils.js";
import plupload from "plupload";

var accessid = "";
var accesskey = "";
var host = "";
var policyBase64 = "";
var signature = "";
var callbackbody = "";
var filename = "";
var key = "";
var expire = 0;
var g_object_name = "";
var now = Date.parse(new Date()) / 1000;
var timestamp = Date.parse(new Date()) / 1000;
let serverUrl = ''
if (process.env.NODE_ENV === 'development') { // 开发阶段
  serverUrl = 'http://api.chinaw.cc/oss/upTest/'
} else if (process.env.NODE_ENV === 'production') { // 生成各阶段
  serverUrl = 'http://api.chinaw.cc/oss/up/'
}

function send_request() {
  var xmlhttp = null;
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  if (xmlhttp != null) {
    // serverUrl是 用户获取 '签名和Policy' 等信息的应用服务器的URL，请将下面的IP和Port配置为您自己的真实信息。
    // serverUrl = 'http://88.88.88.88:8888/aliyun-oss-appserver-php/php/get.php'

    xmlhttp.open("GET", serverUrl, false);
    xmlhttp.send(null);
    return xmlhttp.responseText;
  } else {
    alert("Your browser does not support XMLHTTP.");
  }
}

function get_signature() {
  // 可以判断当前expire是否超过了当前时间， 如果超过了当前时间， 就重新取一下，3s 作为缓冲。
  now = timestamp = Date.parse(new Date()) / 1000;
  if (expire < now + 3) {
    let body = send_request();
    // console.log(body)
    var obj = eval("(" + body + ")");
    host = obj["host"];
    policyBase64 = obj["policy"];
    accessid = obj["accessid"];
    signature = obj["signature"];
    expire = parseInt(obj["expire"]);
    callbackbody = obj["callback"];
    key = obj["dir"];
    return true;
  }
  return false;
}

function calculate_object_name(filename) {
  let suffix = getSuffix(filename);
  g_object_name = key + getTimestamp('mini') + suffix;
  return "";
}

// 上传
function set_upload_param(up, filename, ret) {
  if (ret == false) {
    ret = get_signature();
  }
  g_object_name = key;
  if (filename != "") {
    let suffix = getSuffix(filename);
    calculate_object_name(filename);
  }
  let new_multipart_params = {
    key: g_object_name,
    policy: policyBase64,
    OSSAccessKeyId: accessid,
    success_action_status: "200", //让服务端返回200,不然，默认会返回204
    callback: callbackbody,
    signature: signature
  };

  up.setOption({
    url: host,
    multipart_params: new_multipart_params
  });

  up.start();
}

export default {
  model: {
    prop: "msg",
    event: "ee"
  },
  props: {
    msg: "",
    accept: {
      type: String,
      default: function(){
        return "jpg,gif,png"
      }
    }
  },
  data() {
    return {
      dataArr: this.msg || []
    };
  },
  created() {},
  mounted() {
    this.initPlUploader();
  },
  methods: {
    checkUrl(url) {
      if (url.indexOf('aliyuncs.com') > -1) {
        url = url + '?x-oss-process=image/resize,w_80'
      }    
      return url
    },
    removeItem(index) {
      this.dataArr.splice(index, 1)
      // let current = this.dataArr[index]
      // console.log(current)
    },
    /**
     * 初始化上传插件
     */
    initPlUploader() {
      let _this = this
      var uploader = new plupload.Uploader({
        runtimes: "html5,flash,silverlight,html4",
        browse_button: this.$refs.selectfiles,
        //multi_selection: false,
        container: this.$refs.imgUpload,
        // flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
        // silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
        url: "http://oss.aliyuncs.com",

        filters: {
          mime_types: [
            //只允许上传图片和zip文件
            // { title: "Image files", extensions: "jpg,gif,png,bmp, ipa" },
            { title: "select files", extensions: _this.accept }
          ],
          max_file_size: "20mb", //最大只能上传10mb的文件
          prevent_duplicates: true //不允许选取重复文件
        },

        init: {
          PostInit: function() {
            // document.getElementById("ossfile").innerHTML = "";
            // _this.dataArr = []
            // document.getElementById("postfiles").onclick = function() {
            //   set_upload_param(uploader, "", false);
            //   return false;
            // };
          },
          // 添加文件
          FilesAdded: function(up, files) {

            plupload.each(files, function(file) {
              // console.log(file)

              var reader = new FileReader();
              let base = ''
              //通过文件流将文件转换成Base64字符串
              reader.readAsDataURL(file.getNative());
              //转换成功后
              reader.onloadend = function () 
              {
                  // console.log(reader.result); 
                  base = reader.result
                  _this.dataArr.push({
                    url: base,
                    id: file.id,
                    name: file.name,
                    size: file.size,
                    origSize: file.origSize,
                    type: file.type,
                    pro: 5
                  })
              }
              
              // console.log(_this.dataArr)
              // document.getElementById("ossfile").innerHTML +=
              //   '<div style="border:1px solid red" id="' +
              //   file.id +
              //   '">' +
              //   file.name +
              //   " (" +
              //   plupload.formatSize(file.size) +
              //   ")<b style='border:1px solid blue;'></b>" +
              //   '<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>' +
              //   "</div>";

            });
            set_upload_param(uploader, "", false);
            
          },

          BeforeUpload: function(up, file) {
            set_upload_param(up, file.name, true);
          },
          // 上传进度
          UploadProgress: function(up, file) {
            // console.log(file.percent)
            _this.dataArr.forEach(item => {
              if (item.id === file.id) {
                item.pro = file.percent
              }
            })
          },
          // 上传成功
          FileUploaded: function(up, file, info) {
            if (info.status == 200) {
              _this.dataArr.forEach(item => {
                if (item.id === file.id) {
                  item.url = host + '/' + g_object_name
                }
              })
            } else if (info.status == 203) {
              let msg = "上传到OSS成功，但上传回调服务器失败:" + info.response;
              _this.$message(msg)
            } else {
              _this.$message(info.response)
            }
          },
          // 错误返回
          Error: function(up, err) {
            if (err.code == -600) {
              _this.$message('选择的文件太大了')
            } else if (err.code == -601) {
              _this.$message('选择的文件后缀不允许')
            } else if (err.code == -602) {
              _this.$message('选择的文件有已经选过了')
            } else {
              _this.$message('Error xml:' + err.response)
            }
          }
        }
      });
      uploader.init();
    }
  },
  components: {
    draggable
  }
};
</script>

<style lang="less" scoped>
@import "./less.less";
</style>