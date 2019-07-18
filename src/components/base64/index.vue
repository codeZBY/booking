<template>
  <ul class="base64 clearfix" v-if="hackReset">
    <li v-if="url && url !== ''">
       <a :href="url" data-lightbox="picture" data-title="picture">
         <img :src="url">
       </a>
       <div class="btns">
         <a :href="url" data-lightbox="picture" data-title="picture" class="icon el-icon-zoom-in"></a>
         <i class="icon el-icon-edit-outline" @click="editItem"></i>
       </div>
    </li>
    <li v-show="!url || url == ''">
      <i class="el-icon-plus"></i>
      <input type="file" ref="inputFile" @change="getCode" accept="image/png, image/gif, image/jpeg">
    </li>
  </ul>
</template>

<script>
export default {
  model: {
      prop: 'msg',
      event: 'ee'
  },
  props: {
      msg: ''
  },
  data() {
    return {
      hackReset: true,
      url: this.msg || ''
    };
  },
  created(){
     
  },
  mounted(){

  },
  methods: {
    editItem(){
      this.$refs.inputFile.click()
    },
    getCode(e) {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file); // 读出 base64
      reader.onloadend = () => {
        let dataURL = reader.result; // 得到base64
        this.url = dataURL
        this.$emit("ee", dataURL);
      };
    }
  },
  watch: {
    msg() {
      // log(' jj ')
      this.url = this.msg
    }
  }
};
</script>

<style lang="less" scoped>
@import "./less.less";
</style>