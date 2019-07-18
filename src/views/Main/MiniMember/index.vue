<template>
  <div class="MiniMember">
    <div class="leftNav">
      <router-link :to="item.url" v-for="(item,index) in menu" :key="index"><i :class="item.icon"></i>{{item.text}}</router-link>
    </div>
    <div class="rightBox">
      <router-view />
    </div>
  </div>
</template>

<script>
let url = '/main/miniMember'
export default {
  name: "MiniMember",
  data() {
    return {
      menu: [
        {
          url: url + '/home',
          text: '小程序首页',
          icon: 'el-icon-mobile-phone'
        },
        {
          url: url + '/activity',
          text: '活动',
          icon: 'el-icon-menu'
        },
        {
          url: url + '/shortcut',
          text: '快捷方式',
          icon: 'el-icon-menu'
        },
        {
          url: url + '/serveType',
          text: '项目',
          icon: 'el-icon-menu'
        },
        {
          url: url + '/employee',
          text: '员工设置',
          icon: 'el-icon-menu'
        },
        {
          url: url + '/recommend',
          text: '为您推荐',
          icon: 'el-icon-menu'
        },
        {
          url: url + '/stores',
          text: '门店',
          icon: 'el-icon-menu'
        },
        {
          url: url + '/orderSet',
          text: '预约设置',
          icon: 'el-icon-menu'
        },
      ]
    };
  },
  created() {
    
  },
  mounted() {

  },
  methods: {    
    
  },
  components: {
  }
};
</script>

<style scoped lang="less">
@import "./less.less";
</style>
