<template>
  <div class="recommend">
      <div class="head">
        <img :src="itemData.EmpImageUrl" />
        <span>{{itemData.cfdEmployeeName}}<em>{{itemData.cfdWorksName}}</em></span>
      </div>
      <div class="time">{{itemData.dfdCreateTime}}
        <!-- <span>好评</span> -->
      </div>

      <div class="descript">
        {{itemData.cfdWorksSynopsis}}
        <!-- 今天终于来啦，店员的服务态度特别好，理发师技术很好，边聊天不会很无聊，头发做的很好看，很值得赞扬！ -->
      </div>

      <div class="images">
        <img mode="widthFix" :src="itemData.ImageUrl"/>
        <!-- <img mode="widthFix" src="http://file.chinaw.cc/jingdian/banner00.png"/>         -->
      </div>

      <!-- <div class="position">
        <span class="name">{{itemData.cfdEmployeeName}}</span>
        {{itemData.cfdEmployeeId}}
      </div> -->
  </div>
</template>

<script>

export default {
  props: ['itemData'],
  data () {
    return {
    }
  },

  components: {
  },

  methods: {
  },

  created () {
  }
}
</script>

<style lang="less" scoped>
@import './less.less';
</style>