<template>
  <div class="MobileLogin">
    <div class="box">
      
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-position="top"
        label-width="100px"
      >
        <el-form-item label="" prop="username">
          <div>用户名</div>
          <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="" prop="pwd">
          <div>密码</div>
          <el-input v-model="ruleForm.pwd" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <!-- <el-form-item label="" prop="name">
          <div>验证码</div>
          <el-input v-model="ruleForm.code" placeholder="请输入验证码" style="width:150px;"></el-input>
          <el-button class="pull-right" round size="mini" style="margin-top:5px;">获取验证码</el-button>
        </el-form-item> -->
        <!-- <el-form-item label="" prop="name">
          <div>门店</div>
          <el-select v-model="ruleForm.select" placeholder="请选择门店" style="width:100%;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.a"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <div class="text-center">
        <el-button class="submit" type="primary" round @click="login('ruleForm')">登录</el-button>
        </div>
      </el-form>

    </div>
    <div class="footer">
      版权所有：上海翡粹信息科技有限公司
      <br>联系电话：13601637516
    </div>
  </div>
</template>

<script>
import { setTitle, setCookie, getCookie, setStore } from "@/libs/utils.js";
export default {
  name: "MobileLogin",
  data() {
    return {
      // options: [
      //   {a:1},
      //   {a:1}
      // ],
      POS: '',
      ruleForm: {
        username: getCookie('username') || '',
        pwd: ""
        // username: 'system',
        // pwd: "#456123*"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 50, message: "长度在 3 到 50 个字符", trigger: "blur" }
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 50, message: "长度在 3 到 50 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  mounted() {
    setTitle("员工登录");
    let POS = this.$route.query.POS
    // console.log('query111')
    // console.log(query)
    if (POS) {
      this.POS = POS
      setCookie('POS', POS)
      if (getCookie('cfdEmployeeId') && getCookie('cfdEmployeeId') !== '') {
        log(' ooo ')
        // this.$router.push({ path: "/mobile/orderFood" });
      }
    } else {
      this.$message('请传入商户号')
    }
  },
  methods: {
    getShopId(id){
      this.$axios
      .post(this.GLOBAL.baseURL + "User/PCCodeSessionLogin", {CuCode: id })
      .then(res => {
        if (Number(res.code) === 0) {
          setCookie('token', res.data.Ticket)
          setCookie('ifdFendianId', res.data.ifdFendianId)
          setCookie('cfdEmployeeId', res.data.cfdEmployeeId)
          setCookie('cfdEmployeeName', res.data.cfdEmployeeName)
          setCookie('username', this.ruleForm.username)
          // setStore('userObj', 'abc')
          this.$router.push({ path: "/mobile/orderFood" });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    toLogin(){
      this.$axios
        .post(
          this.GLOBAL.baseURL + "User/CuCodeSession",
          {
            CuCode: this.POS,
            UserAccount: this.ruleForm.username,
            UserPassWord: this.ruleForm.pwd,
          }
        )
        .then(res => {
          if (Number(res.code) === 0) {
            this.getShopId(res.data.code)
            // this.menuData = res.data;
            // let id = res.data[0].ifdClassId
            // this.getDataMenu(id);
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    login(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            // alert('submit!');
            this.toLogin()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    }
  },
  components: {},
  // watch: {
  //   '$route': function (val, old) {

  //     let query = this.$route.query
  //     console.log('query')
  //     console.log(query)

  //     if (!query) {
  //       return
  //     }

  //   }
  // }
};
</script>

<style scoped lang="less">
@import "./less.less";
</style>
