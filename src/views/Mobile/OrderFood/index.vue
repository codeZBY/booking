<template>
  <div class="OrderFood">
    <div class="top">
      <!-- <input type="search" v-model="searchkey" placeholder="请输入搜索内容"> -->
      <el-input class="search" v-model="searchkey" size="small" clearable placeholder="请输入搜索内容"></el-input>
      <span class="name" @click="loginOut()">{{userName}}</span>
    </div>

    <div class="menu">
      <ul>
        <li
          v-for="(item,index) in menuData"
          :key="index"
          :class="menuVal === index ? 'active' : ''"
          @click="clickMenu(item,index)"
        >{{item.cfdItemClass}}</li>
      </ul>
    </div>

    <div class="list">
      <ul v-if="goodsList.length>0">
        <li v-for="(item,index) in goodsList" :key="index">
          <div class="add" @click="pickItem(item)">选规格</div>
            <!-- src="https://img.yzcdn.cn/upload_files/2017/02/21/FjKTOxjVgnUuPmHJRdunvYky9OHP.jpg!100x100.jpg" -->
          <img
            :src="item.ImageUrl1 || '/images/noImage.png'"
          >
          <dl>
            <dt>{{item.cfdItemName}}</dt>
            <dd>￥{{item.ffdUnitPrice}}</dd>
          </dl>
        </li>
      </ul>
      <div v-else class="text-center" style="color:#909399;padding:10px;">暂无数据</div>
    </div>

    <!-- 当前正在选择 -->
    <transition>
      <div class="slider" :style="{top:showSlider?'0': 'auto'}" @click="showSlider = false">
        <transition name="slider-down">
          <div class="box" v-if="showSlider && pickData.length>0" @click.stop>
            <div class="header">
              <em>{{pickData[0].list[0].cfdItemName}}</em>
              <span class="close" @click="showSlider = false">
                <i class="el-icon-close"></i>
              </span>
            </div>
            <div class="pick">
              <template v-for="(item,index) in pickData">
                <div :key="'a'+index" class="title">{{item.name}}</div>
                <ul :key="'b'+index">
                  <li v-for="(item2,index2) in item.list" :key="index2"
                   :class="item.val == index2 ? 'active' : ''" @click="item.val = index2">{{item2.cfdLabelName}}</li>
                </ul>
              </template>
              <div class="title">数量</div>
              <el-input-number style="width:122px" size="medium" v-model="pickNum" :min="1" :max="999"></el-input-number>

            </div>
            <div class="footer">
              <em>￥{{pickData[0].price * pickNum}}</em>
              <span class="addCart" @click="cartAdd()">加入购物车</span>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- 购物车 -->
    <transition>
      <div class="cartList" :style="{top:showCart?'0': 'auto'}" @click="showCart = false">
        <transition name="slider-down">
          <div class="box" v-if="showCart" @click.stop>
            <div class="title">
              <span class="clearCart" @click="cartDataArr = [];showCart=false">
                <i class="el-icon-delete"></i>清空购物车
              </span>
              已选商品
            </div>
            <ul>
              <li v-for="(item,index) in cartDataArr" :key="index">
                <div class="name">
                  <div>{{item.dataArr[0].cfdItemName}}</div>
                  <span>
                    <span v-for="(item2,index2) in item.dataArr" :key="index2">
                      {{item2.cfdLabelName}}
                    </span>
                  </span>
                </div>
                <div>
                  <span class="price">￥{{item.pickVal * item.price}}</span>
                  <el-input-number v-if="cartDataArr.length>0" @change="cartNumChange(index)" class="inputNum" size="medium" v-model="item.pickVal" :min="0" :max="99"></el-input-number>
                </div>
              </li>
            </ul>
          </div>
        </transition>

      </div>
    </transition>

    <div class="footCart">
      <span class="price" @click="showCart = !showCart">
        <i class="el-icon-goods"></i>
        <em v-if="cartDataArr.length>0">￥{{toComputer()}}</em>
        <span v-else style="color:#efefef">请选择商品</span>
      </span>
      <div class="submit" @click="submit()" v-if="cartDataArr.length>0">确定下单</div>
    </div>

    <DialogSubmit ref="DialogSubmit" :data="cartDataArr" @success="cartDataArr=[];showCart=false" />
  </div>
</template>

<script>
import { setTitle, getCookie, clearCookie } from "@/libs/utils.js";
import DialogSubmit from './DialogSubmit'
import { setTimeout } from 'timers';

export default {
  name: "OrderFood",
  data() {
    return {
      pageId: '',
      userName: getCookie('cfdEmployeeName'),
      showSlider: false,
      showCart: false,
      searchkey: "",
      menuVal: 0,
      menuData: [],
      goodsList: [],
      pickData: [], // 正在选择的 标签
      cartDataArr: [], // 已选择商品
      pickNum: 1,
    };
  },
  created() {},
  mounted() {
    setTitle("手机点单");
    this.getMenu();
  },
  methods: {
    cartNumChange(index) {
      // log(index)
      let currentObj = this.cartDataArr[index]
      // log(currentObj)
      let arr = this.cartDataArr.concat()
      if (currentObj.pickVal === 0) {
        arr.splice(index, 1)
      }
      // log(arr)
      this.cartDataArr = []
      setTimeout(() => {
        this.cartDataArr = arr
        if (this.cartDataArr.length === 0){
          this.showCart = false
        }
      }, 33)
    },
    // 算已选合计
    toComputer(){
      // console.log('jj ')
      // console.log(this.cartDataArr)
      let val = 0
      this.cartDataArr.forEach(item => {
        val += item.price * item.pickVal
      })
      return val
    },
    // 加入购物车
    cartAdd(){
      this.showSlider = false
      console.log(' aadd ---- ')
      // console.log(this.pickData)
      let pick = this.pickData.map(item => {
        return item.list[item.val]
      })
      // console.log(pick)
      // console.log(this.cartDataArr)
      let clearArr = pick.map(item => {
        return item.ifdID
      })
      // console.log(clearArr)
      let pickId = pick[0].cfdItemId
      // console.log(pick[0])
      let isTrue = true
      this.cartDataArr.forEach(item => {
        if (isTrue && item.dataArr[0].cfdItemId === pickId) {
          let checkedArr = item.dataArr.map(item22 => {
            return item22.ifdID
          })
          // log(checkedArr)
          if (clearArr.join(',') === checkedArr.join(',')) {
            item.pickVal += this.pickNum
            isTrue = false
          }
        }
      })

      if (isTrue) {
        this.cartDataArr.push({
          price: this.pickData[0].price,
          pickVal: this.pickNum,
          dataArr: pick
        })
      }

      // console.log(this.cartDataArr)
      this.showCart = true
    },
    clickMenu(item,index) {
      this.menuVal = index
      let id = item.ifdClassId
      this.pageId = id
      this.getDataMenu()
      // console.log(item)
    },
    // 选规格
    pickItem(itemData){
      // console.log(itemData)
      this.pickNum = 1
      this.showSlider = true
      this.pickData = []
      this.$axios
        .get(
          this.GLOBAL.baseURL + "MobOrderSheet/QueryItemLabel_PhoneOrder",
          {params: {cfdItemId: itemData.cfdItemId}}
        )
        .then(res => {
          if (Number(res.code) === 0) {
            if (res.data.length === 0) {
              this.$message('暂无规格')
              return
            }
            function uniq(array){
                var temp = []; //一个新的临时数组
                for(var i = 0; i < array.length; i++){
                    if(temp.indexOf(array[i]) == -1){
                        temp.push(array[i]);
                    }
                }
                return temp;
            }
            let backArr = res.data       
            let clearIdArr = backArr.map(item => {return item.ifdLabelClassID})
            // console.log(backArr)
            // log(uniq(clearIdArr))
            // return
            let newArr = []
            uniq(clearIdArr).forEach(item => {
              let obj = {
                val: 0,
                name: '',
                price: itemData.ffdUnitPrice,
                list:[]
              }
              backArr.forEach(item2 => {
                if (item == item2.ifdLabelClassID) {
                  obj.name = item2.cfdItemLabelClassName
                  obj.list.push(item2)
                }
              })
              newArr.push(obj)
            })
            // console.log(newArr)
            this.pickData = newArr

          } else {
            this.$message.error(res.msg);
          }
        });
    },
    getMenu() {
      this.$axios
        .get(
          this.GLOBAL.baseURL + "MobOrderSheet/QueryItemClassList_PhoneOrder",
          {}
        )
        .then(res => {
          if (Number(res.code) === 0) {
            this.menuData = res.data;
            let id = res.data[0].ifdClassId
            this.pageId = id
            this.getDataMenu();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    getDataMenu() {
      let id = ''
      if (this.searchkey === '') {
        id = this.pageId
      } else {
        id = ''
      }
      this.$axios
        .get(this.GLOBAL.baseURL + "MobOrderSheet/QueryItemList_PhoneOrder", {
          params: {ifdClassId: id, Keyword: this.searchkey}
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.goodsList = res.data;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    submit() {
      this.$refs.DialogSubmit.open()
    },
    loginOut() {
      let id = getCookie('POS')
      // log(id)
      // clearCookie()
      this.$router.push({ path: "/mobile/mobileLogin?POS=" + id });
    }
  },
  components: {
    DialogSubmit
  },
  watch: {
    searchkey: function(newVal, oldVal){
      // log(newVal)
      this.getDataMenu()
    }
  }
};
</script>

<style scoped lang="less">
@import "./less.less";
</style>
