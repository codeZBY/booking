<template>
  <ul class="Evaluate">
    <template v-if="dataList.length>0">
    <li v-for="(item,index) in dataList" :key="index">
      <!-- {{item}} -->
      <div class="descript">
        <span class="pull-right">
          <i class="el-icon-star-off"></i>
          {{item.ifdType}}</span>
        <span class="name">{{item.cfdMemberName}}</span>
        <span class="time" v-if="item.dfdCreateDate">{{item.dfdCreateDate.split('T')[0]}}</span>
        <div class="content">
          {{item.cfdComment}}
        </div>
      </div>
      <div class="pic">
        <span v-for="(item,index) in item.ImageList" :key="index">
          <img :src="item" />
        </span>
        <!-- <span><img src="http://file.chinaw.cc/jingdian/banner00.png" /></span> -->
      </div>
    </li>
    </template>
    <li v-else style="padding:33px 0;text-align:center;">
      暂无评价
    </li>
  </ul>
</template>

<script>
export default {
  props: {
      id: ''
  },
  data() {
    return {
      dataList: []
    };
  },
  created(){
    // this.getDataList()     
  },
  mounted(){

  },
  methods: {
    getDataList(id) {
      this.$axios
        .get(this.GLOBAL.baseURL + "Employee/PCQueryOpeCommentListByEmp", {params: {
          cfdEmployeeId: this.id
        }})
        .then(res => {
          console.log(res.data);
          if (Number(res.code) === 0) {
            this.dataList = res.data
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    
  },
  watch: {

  }
};
</script>

<style lang="less" scoped>
@import "./less.less";
</style>