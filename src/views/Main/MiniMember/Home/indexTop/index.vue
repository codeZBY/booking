<template>
<div class="indexTop">

  <el-carousel height="180px" indicator-position="outside" style="position:relative">
    <el-carousel-item v-for="(item,index) in bannerData" :key="index">
      <router-link tag="span" to="./activity" class="btnFly" style="">
        活动维护
      </router-link>
      <img :src="item.ImageUrl1" />
    </el-carousel-item>
  </el-carousel>

  <!-- 菜单 -->
  <ul class="indexNav flexLine" style="position:relative; margin-top: 38px;">
    <router-link tag="span" to="./shortcut" class="btnFly" style="top:-40px;">
      快捷方式维护
    </router-link>
    <li v-for="(item,index) in shortcutData" :key="index">
      <!-- <a :href="item.url"> -->
      <img mode="widthFix" :src="item.mImageUrl"/>
      <div class="text">{{item.ShowCaption}}</div>
      <!-- </a> -->
    </li>
  </ul>

  <!-- 分类 -->
  <ul class="marginTop10 productNav clearfix" style="position:relative;margin-top:33px;">
    <router-link tag="span" to="./serveType" class="btnFly" style="top:-35px;">
      项目维护
    </router-link>
    <li v-for="(item,index) in subjectData" :key="index">
    <a :href="'/pages/index/SPA/main?id='+item.ifdClassId">
      <img :src="item.cfdImgSrc" :title="item.cfdItemClass" />
    </a>
    </li>
    <!-- <li>
    <a href="/pages/index/SPA/main">
      <img mode="widthFix" src="http://file.chinaw.cc/jingdian/indexProduct02.png"/>
    </a>
    </li> -->
  </ul>
</div>
</template>

<script>
export default {
  data () {
    return {
      bannerData: [],
      shortcutData: [
        // {
        //   text: '会员卡',
        //   url: '/pages/index/member/main',
        //   icon: 'http://file.chinaw.cc/jingdian/index_menu01.png'
        // },
        // {
        //   text: '我的券',
        //   url: '/pages/index/coupon/main',
        //   icon: 'http://file.chinaw.cc/jingdian/index_menu02.png'
        // },
        // {
        //   text: '消费记录',
        //   url: '/pages/index/record/main',
        //   icon: 'http://file.chinaw.cc/jingdian/index_menu03.png'
        // }
      ],
      subjectData: []
    }
  },

  created () {
    this.getActive()
    this.getShortcutData()
    this.getSubject()
  },
  computed: {

  },
  methods: {
    getActive () {
      // this.$axios.get(this.GLOBAL.baseURL + 'Activity/ActivityList', { params: {} })
      this.$axios.get(this.GLOBAL.baseURL + 'Activity/ActivityList', { params: {} })
      .then(res => {
        // console.log(res)
        if (Number(res.code) === 0) {
          // res.data = res.data.filter(item => {
          //   return item.IsShow == true
          // })
          // log(res.data)
          this.bannerData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getShortcutData () {
      this.$axios.get(this.GLOBAL.baseURL + 'Activity/QueryFastBtnList', { params: {} })
      .then(res => {
        // console.log(res)
        if (Number(res.code) === 0) {
          // log(res.data)
          this.shortcutData = res.data.filter(item => {
            return item.BtnType == 1
          })
          let otherData = res.data.filter(item => {
            return item.BtnType != 1
          })
          this.$emit('back',otherData)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getSubject () {
      this.$axios.get(this.GLOBAL.baseURL + 'Item/QueryItemClassList', { params: {} })
      .then(res => {
        // console.log(res)
        if (Number(res.code) === 0) {
          res.data.forEach(element => {
            // console.log(element)
            if (element.ifdClassId === 13) {
              element.cfdImgSrc = 'http://file.chinaw.cc/jingdian/banner00.png'
            }
          })
          // res.data = res.data.filter(item => {
          //   return item.IsShow
          // })
          this.subjectData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "./less.less";
</style>