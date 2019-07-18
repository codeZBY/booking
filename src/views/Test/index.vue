<template>
  <div class="MiniMember">
    <div style="border:1px solid red;">
      <div style="width:333px; margin:55px auto p;">
        <OSSuploadImages v-model="picArr"/>
      </div>

      <el-button @click="submit">提交测试</el-button>
    </div>
    <br>
    <br>
    <br>
    <div style="border:1px solid red;">
      {{$t("login.title")}}
      <el-button @click="langToggle">语言切换</el-button>
    </div>
  </div>
</template>

<script>
import OSSuploadImages from "@/components/OSSupload/upload";

export default {
  name: "MiniMember",
  data() {
    return {
      picArr: [
        {
          name: "comeon",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg"
        }
      ],
      images: { url: "", name: "缩略图" }
    };
  },
  created() {},
  mounted() {
    // this.oss()
    // this.$axios
    //     .get(this.GLOBAL.baseURL + "MobOrderSheet/QueryItemClassList_PhoneOrder", {
    //       // Keyword: this.searchValue,
    //       // IsShow: this.isShowMP ? true : ''
    //     })
    //     .then(res => {
    //       console.log(res);
    //       console.log(res);
    //       console.log(res);
    //       if (Number(res.code) === 0) {
    //         // this.bannerData = res.data;
    //       } else {
    //         this.$message.error(res.msg);
    //       }
    //     });
  },
  methods: {
    langToggle() {
      log(this.$i18n.locale)
      if(this.$i18n.locale == 'zh_CN'){
        this.$i18n.locale = 'en_US';
      }else{
        this.$i18n.locale = 'zh_CN';
      }
    },
    del_img(index) {
      this.images.url = "";
    },
    add_img(type, url, index, fileType) {
      this.images.url = url;
    },

    abc() {
      return new Promise((resolve, reject) => {
        // console.log("111");
        let arr = ["a"];
        setTimeout(() => {
          resolve(arr);
        }, 1000);
      });
    },
    async submit() {
      log(" yui ");
      log(this.picArr);
      // let arr = await this.$refs.OSSuploadImages.getData()
      // // let arr = await this.abc()
      // log(arr)
      // log(' iiindex ')
    },
    oss() {
      this.$axios
        .get("http://api.chinaw.cc/abc-oss/php/get.php", {
          // Keyword: this.searchValue
        })
        .then(res => {
          console.log(res);
          if (Number(res.code) === 0) {
          } else {
            this.$message.error(res.msg);
          }
        });
    }
  },
  components: {
    OSSuploadImages
  }
};
</script>

<style scoped lang="less">
// @import "./less.less";
</style>
