<template>
  <div id="app" v-if="isShow">
    <div id="navAPP" v-if="showMainMenu">
      <!-- <div class="logo">管理中心</div> -->
      <router-link :to="item.url" v-for="(item,index) in menu" :key="index"><i :class="item.icon"></i>{{item.text}}</router-link>
    </div>
    <div id="rightAPP" :style="{'margin-left': showMainMenu ? '150px' : '0'}">
      <!-- <div id="top">
      </div> -->
      <div class="viewZone MXscroll" ref="viewZone">
        <div class="viewWrap">
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setStore, getStore } from '@/libs/utils.js'
export default {
  name: "app",
  data() {
    return {
      menu: [
        {
          url: '/main/miniMember',
          text: '小程序会员端',
          icon: 'el-icon-mobile-phone'
        },
        {
          url: '/main/order',
          text: '预约',
          icon: 'el-icon-menu'
        }
      ],
      isShow: false,
      showMainMenu: false
    };
  },
  created() {
    // this.checkBeautifulPic()
    document.body.removeChild(document.getElementById('Loading'))
  },
  mounted() {
    // $(window).resize(() => {
    //   this.autoStyle() // 自适应        
    // })
  },
  methods: {  
    getToken(id) {
      // log(id)
      // return
      this.$axios
      .post(this.GLOBAL.baseURL + "User/PCUserLogin", {CuCode: id })
      .then(res => {
        if (Number(res.code) === 0) {
          this.isShow = true
          setStore('loginObj', res.data)
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getCode(id){
      // log(' cccode ')
      // log(id)
      this.$axios
      .post(this.GLOBAL.baseURL + "User/PCCodeSessionLogin", {CuCode: id })
      .then(res => {
        if (Number(res.code) === 0) {
          this.isShow = true
          setStore('loginObj', res.data)
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    checkBeautifulPic() {
      this.$axios
      .get(this.GLOBAL.baseURL + "Advertisement/QueryShowAdvertise", {
        params: { 
          // ifdId: item.ifdId 
        }
      })
      .then(res => {
        // console.log(res);
        if (Number(res.code) === 0) {
          this.isShow = true
            setCookie('config', res.data)
          // this.getActive();
          if (res.data.Value.toString() == '1') {
            this.menu.push({
              url: '/beautifulPic',
              text: '公司美图',
              icon: 'el-icon-menu'
            })
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },  
    autoStyle(){
      this.$refs.viewZone.style.height = ($(window).height() - 42) + 'px'
    },
    getWxToken(){
      // log(' jjj--- ')
      this.$axios
        .post(
          this.GLOBAL.baseURL + "SanggeWeChat/WxLogin",
          {
            Code: 'abc'
          }
        )
        .then(res => {
          // log(' eee ')
          if (Number(res.code) === 0) {
            setStore('loginObj', res.data)  
            // this.getShops()          
            // this.addCust()       
          } else {
            this.$message.error(res.msg);
          }
        });
    }
  },
  components: {

  },
  watch: {
    '$route': function (val, old) {

      let query = this.$route.query

      if (!query) {
        return
      }
      // console.log(this.$route.matched)
      // console.log(this.$route.matched[0].name)
      // console.log(query)
      if (this.$route.matched[0].name == 'Mobile' || 
      this.$route.matched[0].name == 'MobileOrder' ||
      this.$route.matched[0].name == 'MobileBooking' ||
      this.$route.matched[0].name == 'WebBooking'
      ) {
          this.isShow = true
      }

      // 传过来就走新的，没有就走老的
      if (query.POS && query.POS !== '') {
        // this.autoStyle() // 自适应
        this.getToken(query.POS)
        // if (query.FendianId && query.FendianId !== '') {
        //   console.log(query.FendianId)
        //   setStore('storeId', query.FendianId)
        //     getStore('storeId')

        // }
      } else if (query.code && query.code !== ''){
        this.getCode(query.code)
      }  else if (query.token && query.token !== ''){
        this.getWxToken(query.token)
      } else {
        // this.$message.error('商户ID有误！请检查！');
        let token = getStore('loginObj').Ticket;
        if (token && token !== '') {
          this.isShow = true
        }
      }
      
    }
  }
};
</script>

<style lang="less">
@import "./reset.less";
</style>
