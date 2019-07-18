<template>
  <div class="Home">
    <indexTop @back="getTitleData" />

    <!-- 优秀员工推荐 -->
    <!-- <el-carousel height="180px" indicator-position="outside" style="position:relative">
      <el-carousel-item v-for="(item,index) in bannerData" :key="index">
        <img :src="item.ImageUrl1" />
      </el-carousel-item>
    </el-carousel> -->

    <div class="peopleBox marginTop" style="position:relative">
      <router-link tag="span" to="./employee" class="btnFly" style="top: -2px;">
        优秀员工维护
      </router-link>
      <div class="title" v-if="titleData.length>1">{{titleData[0].BtnCaption}}</div>
      <ul class="peopleUL MXscroll clearfix">
        <li v-for="(item,index) in bestPeopleData" :key="index">

          <div class="pic"><img mode="widthFix" :src="item.ImageUrl"/> 
          </div>
          <div class="name">{{item.cfdEmployeeName}}</div>         
          <div class="position">{{item.cfdLevel}}</div>         
          <div class="store"><span>{{item.cfdFendianName}}</span></div>         

        </li>
      </ul>
    </div>

    <div class="imageShow">
      <!-- <div class="title">公司美图</div> -->
      <!-- <div class="descript">图片展描述信息展示</div> -->
      <ul>
        <li v-for="(item,index) in getBeautifulPicData" :key="index">
          <img mode="widthFix" :src="item.ImageUrl" />
          <!-- <div class="tipTop"><span>自然款</span></div> -->
          <div class="tip"><span>
            {{item.AdvDesc}}
          </span></div>
        </li>
      </ul>
    </div>

    <div class="peopleBox marginTop" style="position:relative; margin-top: 13px;">
      <router-link tag="span" to="./recommend" class="btnFly" style="top:-2px;">
        为您推荐维护
      </router-link>
      <div class="title" v-if="titleData.length>2">{{titleData[1].BtnCaption}}</div>

      <recommend v-for="(item,index) in workList" :key="index" :itemData="item" />

    </div>
    <div style="position:relative; width:520px; height: 66px;">
      <router-link tag="span" to="./stores" class="btnFly" style="right:50%;margin-right:-50px;">
        门店维护
      </router-link>
    </div>

  </div>
</template>

<script>
import { getCookie } from '@/libs/utils.js'
import indexTop from "./indexTop"
import recommend from '@/components/recommend/index'
export default {
  name: "home",
  data() {
    return {
      bestPeopleData: [], // 优秀员工推荐
      workList: [], // 查员工推荐作品
      getBeautifulPicData: [],
      titleData: []
    };
  },
  created() {
    
  },
  mounted() {
    this.getData()
    this.getWorkData()
    if (getCookie('config') && JSON.parse(getCookie('config')).Value == '1') {
      this.getBeautifulPic()
    }
  },
  methods: {    
    getTitleData(data) {
      this.titleData = data
    },
    getBeautifulPic() {
      this.$axios.get(this.GLOBAL.baseURL + 'Advertisement/QueryAdvertiseList', { params: {} })
      .then(res => {
        if (Number(res.code) === 0) {
          // log(res.data)
          this.getBeautifulPicData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 优秀员工
    getData () {
      this.$axios.post(this.GLOBAL.baseURL + 'Employee/PCQueryEmployeeList', { params: {} })
      .then(res => {
        // log(res.data)
        if (Number(res.code) === 0) {
          res.data = res.data.filter(item => {
            return item.IsShow
          })
          this.bestPeopleData = res.data
        } else {
          wx.showToast({ title: res.msg, icon: 'none', duration: 5000, mask: true })
        }
      })
    },
    // 查员工推荐作品
    getWorkData () {
      this.$axios.post(this.GLOBAL.baseURL + 'Employee/QueryEmpWorksReList', { params: {} })
        .then(res => {
        if (Number(res.code) === 0) {
          if (res.data.length > 0) {
            // res.data.forEach(item => {
            //   item.dfdCreateTime = formatTime('yyyy-MM-dd', new Date(item.dfdCreateTime))
            // })
            this.workList = res.data
          }
        } else {
          wx.showToast({ title: res.msg, icon: 'none', duration: 5000, mask: true })
        }
      })
    }
  },
  components: {
    indexTop,
    recommend
  }
};
</script>

<style scoped lang="less">
@import "./less.less";
</style>
