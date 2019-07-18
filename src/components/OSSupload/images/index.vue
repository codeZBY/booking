<template>
  <div class="vue-uploader">
    <div class="file-list">
      <section v-for="(file, index) of urlArr" class="file-item draggable-item" :key="file.name">
        <img :src="file" alt ondragstart="return false;">
        <span class="file-remove" @click="remove(index)">+</span>
      </section>
      <section v-if="urlArr.length < 9" class="file-item">
        <div @click="add" class="add">
          <i class="el-icon-plus"></i>
        </div>
      </section>
    </div>
    <!-- <section v-if="files.length != 0" class="upload-func">
            <div class="progress-bar">
                <section v-if="uploading" :width="(percent * 100) + '%'">{{(percent * 100) + '%'}}</section>
            </div>
            <div class="operation-box">
                <button v-if="status == 'ready'" @click="getData">上传</button>
                <button v-if="status == 'finished'" @click="finished">完成</button>
            </div>
    </section>-->
    <input
      type="file"
      @change="fileChanged"
      ref="file"
      multiple="multiple"
      accept="image/jpg, image/jpeg, image/png, image/bmp"
    >
  </div>
</template>
<script>
import { setTimeout } from "timers";
export default {
  model: {
    prop: "msg",
    event: "ee"
  },
  props: {
    msg: ""
  },
  data() {
    return {
      status: "ready",
      files: [],
      point: {},
      uploading: false,
      percent: 0,
      urlArr: this.msg || []
    };
  },
  methods: {
    add() {
      this.$refs.file.click();
    },
    getData() {
      console.log(' jj ')
      console.log(this.files)
      if (this.files.length === 0) {
        console.warn("no file!");
        return;
      }
      var that = this;

      const client = new OSS.Wrapper({
        region: "oss-cn-shanghai",
        accessKeyId: "",
        accessKeySecret: "",
        bucket: "feicuisoft"
      });
      const fNum = this.files;
      const pre = "https://feicuisoft.oss-cn-shanghai.aliyuncs.com/";

      for (var i = 0; i < fNum.length; i++) {
        var f = fNum[i].file;
        // console.log(f)
        const Name = f.name;
        // console.log(Name)
        const suffix = Name.substr(Name.indexOf("."));
        const obj = this.timestamp();
        const storeAs = "images/" + obj + suffix; //  路径+时间戳+后缀名
        // console.log(storeAs)
        client.multipartUpload(storeAs, f).then(result => {
          let url = pre + storeAs;
          this.urlArr.push(url);
          this.$emit("ee", this.urlArr);
        });
        // log(this.urlArr)
      }
      // setTimeout(() => {}, 1000)
    },
    //  时间戳
    timestamp: function() {
      const time = new Date();
      const y = time.getFullYear();
      const m = time.getMonth() + 1;
      const d = time.getDate();
      const h = time.getHours();
      const mm = time.getMinutes();
      const s = time.getSeconds();
      const ms = time.getMilliseconds();
      return (
        "" +
        y +
        this.Add0(m) +
        this.Add0(d) +
        this.Add0(h) +
        this.Add0(mm) +
        this.Add0(s) +
        this.Add0(ms)
      );
    },
    Add0: function(m) {
      return m < 10 ? "0" + m : m;
    },
    finished() {
      this.files = [];
      this.status = "ready";
    },
    remove(index) {
      this.urlArr.splice(index, 1);
      // console.log(this.urlArr)
    },
    fileChanged() {
      const list = this.$refs.file.files;
      console.log(' uu ')
      console.log(list)
      let isTrue = true;
      for (let i = 0; i < list.length; i++) {
        if (list.length > 9) {
          this.$message("最多只能选9个文件！");
          isTrue = false;
        }

        if (isTrue && !this.isContain(list[i])) {
          const item = {
            name: list[i].name,
            size: list[i].size,
            file: list[i]
          };
          this.html5Reader(list[i], item);
          this.files.push(item);
        }
      }
      if (isTrue) {
        this.$refs.file.value = "";
        this.getData(); // 上传
      }
    },
    // 将图片文件转成BASE64格式
    html5Reader(file, item) {
      const reader = new FileReader();
      reader.onload = e => {
        this.$set(item, "src", e.target.result);
      };
      reader.readAsDataURL(file);
    },
    isContain(file) {
      return this.files.find(
        item => item.name === file.name && item.size === file.size
      );
    }
  }
};
</script>

<style scoped lang="less">
@import "./less.less";
</style>