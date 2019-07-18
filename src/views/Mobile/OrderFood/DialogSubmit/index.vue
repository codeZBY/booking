<template>
  <div class="DialogSubmit" v-if="isShow">
   <div class="box">
     
     <!-- 
          :disabled="item.ifdState === 1" -->
      <el-select v-model="select" placeholder="请选择桌台号" style="width:100%; margin:15px 0;">
        <el-option
          v-for="item in deskArr"
          :key="item.ifdRoomId"
          :label="item.cfdBedNumber"
          :value="item.ifdRoomId">
        </el-option>
      </el-select>
      
     <div>
       <el-button size="medium" round type="primary" @click="submit()" style="background:#65D4BF;border:none;">确定下单</el-button>
       <el-button size="medium" round @click="isShow = false; select=''">暂不下单</el-button>
     </div>
   </div>
  </div>
</template>

<script>
import { getCookie } from "@/libs/utils.js";
export default {
  name: "DialogSubmit",
  props: ['data'],
  data() {
    return {
      isShow: false,
      deskArr: [],
      select: ''
    };
  },
  created() {},
  mounted() {
    
  },
  methods: {
    submit(){
      if (this.select === '') {
        this.$message('请选择桌台号！')
        return
      }
      let list = []
      this.data.forEach(item => {
        list.push({
          cfdItemId: item.dataArr[0].cfdItemId,
          ifdNumber: item.pickVal,
          ffdNowPrice: item.price,
          LabelClassList: item.dataArr
        })
      })
      let data = {
        ifdFendianId: getCookie('ifdFendianId'),
        ifdRoomId: this.select,
        cfdEmployeeId: getCookie('cfdEmployeeId'),
        ItemList: list
      }
      log(data)

      this.isShow = false
      this.$axios
        .post(
          this.GLOBAL.baseURL + "MobOrderSheet/AddBusList_PhoneOrder",data)
        .then(res => {
          if (Number(res.code) === 0) {
            this.$message.success('下单成功！')
            this.$emit('success')
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    open(){
      this.isShow = true
      this.getDesk();
      log(this.data)
    },
    getDesk(){
      this.$axios
        .get(
          this.GLOBAL.baseURL + "MobOrderSheet/QueryRoomList_PhoneOrder",
          {params: {ifdFendianId: getCookie('ifdFendianId')}}
        )
        .then(res => {
          if (Number(res.code) === 0) {
            // console.log(res.data)
            this.deskArr = res.data
          } else {
            this.$message.error(res.msg);
          }
        });
    },
  },
  components: {}
};
</script>

<style scoped lang="less">
@import "./less.less";
</style>
