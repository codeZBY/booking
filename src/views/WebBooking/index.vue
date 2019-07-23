<template>
  <div class="WebOrder">
    <div class="webTop">
      <el-button class="language" size="small" type="primary" @click="langToggle" style="background:#AA942D;border:none;">{{$i18n.locale == 'zh_CN' ? 'EN' : '中文'}}</el-button>
      <span>预约服务</span>
      <div><span>SUBCONSCIOUS DAY SPA</span></div>
    </div>
    <el-form :model="form" :rules="rules" ref="ruleForm" 
    label-width="70px" class="demo-ruleForm">

    <el-row :gutter="20">
      <el-col :span="8">
      <el-form-item :label="$t('mBooking.phone')" prop="tel">
        <el-input v-model="form.tel" :placeholder="$t('mBooking.phonePlace')"></el-input>
      </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('mBooking.name')" prop="name">
          <el-input v-model="form.name" :placeholder="$t('mBooking.namePlace')"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('mBooking.gender')" prop="gender" required>
          <!-- <el-input v-model="form.sex" placeholder="请输入性别"></el-input> -->
          <el-select v-model="form.sex" placeholder="">
            <el-option :label="$t('mBooking.woman')" :value="$t('mBooking.woman')"> </el-option>
            <el-option :label="$t('mBooking.man')" :value="$t('mBooking.man')"> </el-option>
            <el-option :label="$t('mBooking.unknow')" :value="$t('mBooking.unknow')"> </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
      <el-form-item :label="$t('mBooking.email')" prop="mail">
        <el-input v-model="form.mail" :placeholder="$t('mBooking.emailPlace')"></el-input>
      </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('mBooking.code')" prop="code">
          <el-input v-model="form.code" style="width:150px;margin-right:10px;" :placeholder="$t('mBooking.codePlace')"></el-input>
          <el-button @click="getMailCode()" :disabled="second!==0" type="text" style="color:#AA942D;">
            {{second===0 ? $t('mBooking.getCode') : $t('mBooking.surplus')+second+'S'}}
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
      <el-form-item :label="$t('mBooking.branch')" prop="branch" required >
        <el-select v-model="form.branch" placeholder="请选择" style="width: 100%;">
          <el-option
            v-for="item in columnArr"
            :key="item.ifdFendianId"
            :label="$i18n.locale == 'zh_CN' ? item.cfdFendianName : item.cfdFendianNameE"
            :value="item.ifdFendianId">
          </el-option>
        </el-select>
      </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('mBooking.number')" prop="number">
          <el-input-number v-model="stepVal" controls-position="right" style="width: calc(100% - 7px);"
          size="mini"
          @change="handleChange" :min="1" :max="5"></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>

    <div class="customerBox" v-for="(item,index) in customerArr" :key="index">
      <div class="name"><span>{{$t('mBooking.customer')}} {{index+1}}</span></div>
      <el-form-item :label="$t('mBooking.date')" prop="date" required>
        <el-date-picker
      v-model="item.dfdStartTime"
      type="datetime"
      format="yyyy-MM-dd HH:mm"
      :picker-options="pickerOptions"
      placeholder="">
    </el-date-picker>
      </el-form-item>
      <div class="custItem">
        <!-- <el-form-item label="预约项目" prop="" required style="width: auto !important;"></el-form-item> -->
        {{$t('mBooking.service')}}
      </div>

      <el-row class="itemLine" v-for="(item22, index22) in itemArr" :key="index22">
        <el-col :span="4">
          {{$i18n.locale == 'zh_CN' ? item22.ServiceName : item22.cfdServiceNameEn}}
        </el-col>
        <el-col :span="20">
          <el-checkbox-group v-model="item.MentDtlList">
            <el-checkbox style="margin:0 15px 5px 0;" v-for="(item2,index2) in item22.ItemClassList" :key="index2" :label="item2.ifdClassId">
              {{$i18n.locale == 'zh_CN' ? item2.cfdItemClass : item2.cfdItemClassEn}}
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>

    </div>

    <div class="text-center">
      <el-button :loading="isLoading" type="primary" @click="submitForm('ruleForm')" style="background:#AA942D;border:none;margin-top:15px;">
        {{$t('mBooking.submit')}}
      </el-button>
    </div>
    </el-form>

    <!--  -->
    <el-dialog
      title="提示"
      center
      :visible.sync="dialogVisible"
      width="666px;">
        <div class="text-center dialogNotice">
          <div class="mainColor mainTitle">{{dialogDataObj.TitleName}}</div>
          <div>{{dialogDataObj.DateTitleName}}</div>
          <ul class="clearfix">
            <li style="width:50%;" v-for="(item,index) in dialogDataObj.TimeList" :key="index">{{item}}</li>
          </ul>
          <div>{{dialogDataObj.FendianTitleName}}</div>
          <ul class="clearfix">
            <li v-for="(item,index) in dialogDataObj.FendianList" :key="index">
              <span>{{item.cfdFendianName}}</span>
              <span style="margin-left:20px;">{{item.cfdAddress}}</span>
              <span class="goMap" @click="goMap(item)">{{$t('mBooking.viewMap')}}</span>
            </li>
          </ul>
        </div>
      <div style="text-align:center;margin-bottom:-15px;">
        <el-button type="primary" @click="dialogVisible = false" style="background:#AA942D;border:none;margin-top:15px;">{{$t('mBooking.sure')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import moment from "moment";
import { setTitle, setStore, getStore, checkPhone, checkEmail } from "@/libs/utils.js";
export default {
  name: "WebBooking",
  data() {
    return {
      dialogVisible: false,
      dialogDataObj: {},
      isLoading: false,
      datePickShow: false,
      itemCustIndex: -1,
      itemsPickShow: false,
      stepVal: 1,
      // username: "ttt",
      form: {
        // tel: '15921812928',
        // code: '524590',
        // name: '小向',
        // sex: '男',
        // mail: 'sh.james@qq.com',
        tel: '',
        code: '',
        name: '',
        // sex: this.$i18n.locale == 'zh_CN' ? '女' : 'woman',
        sex: '女',
        mail: ''
      },
      columnVal: 1002, // 门店选择
      columnArr: [],

      customerArr: [],
      itemArr: [], // 项目
      second: 0,
      checkList: ['选中且禁用','复选框 A'],
      rules: {
          name: [
            // { required: true, message: this.$t('mBooking.namePlace'), trigger: 'blur' },
            { required: true, message: this.$t('mBooking.namePlace'), trigger: 'blur' },
            // { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
          ],
          mail: [
            // { required: true, message: this.$t('mBooking.emailPlace'), trigger: 'blur' },
            { required: true, message: this.$t('mBooking.emailPlace'), trigger: 'blur' },
            // { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
          ],
          code: [
            // { required: true, message: this.$t('mBooking.codePlace'), trigger: 'blur' },
            { required: true, message: this.$t('mBooking.codePlace'), trigger: 'blur' },
            // { min: 4, max: 6, message: '长度在 4 到 6 个字符', trigger: 'blur' }
          ],
          branch: [{
            required: true
          }],
          gender: [{
            required: true
          }],
          number: [{
            required: true
          }]
        
      },
      pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          },
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date());
              }
            }, {
              text: '明天',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000 * 24);
                picker.$emit('pick', date);
              }
            }, {
              text: '后天',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
                picker.$emit('pick', date);
              }
            }
          ],
        },
    };
  },
  created() {
    setTitle("booking");
  },
  mounted() {
    debugger
    // Toast.loading({
    //   mask: true,
    //   message: '加载中...'
    // });
    // setTimeout(() => {
      this.getCode()
      // Toast.clear()
    // }, 2000)

    // this.dialogVisible = true
    // let back = '{"TitleName":"很遗憾您的预约未成功！","DateTitleName":"该门店可选择以下时间进行预约","FendianTitleName":"该时间可选择以下门店进行预约","TimeList":["2019-07-04 09:31", "2019-07-04 09:31"],"FendianList":[{"ifdFendianId":1002,"cfdFendianName":"大沽店","cfdFendianNameE":"Dagu Road Branch","cfdAddress":"浦西，大沽路458号（近南京西路）","cfdSynopsis":"","cfdTel":"021-63271193","ImageUrl1":"","ImageUrl2":"","dfdDateTime":"2008-05-11T00:00:00","dfdOperateStartTime":"1900-01-01T09:00:00","dfdOperateEndTime":"1900-01-01T23:59:59","OrderNo":"","ifdType":2,"TypeName":"门店","mImageUrl1":null,"mImageUrl2":null},{"ifdFendianId":1003,"cfdFendianName":"南丰店","cfdFendianNameE":"Zunyi Road New Shop","cfdAddress":"长宁区，遵义路150号 ","cfdSynopsis":"","cfdTel":"021-62730161","ImageUrl1":"","ImageUrl2":"","dfdDateTime":"2008-05-11T00:00:00","dfdOperateStartTime":"1900-01-01T09:00:00","dfdOperateEndTime":"1900-01-01T23:00:00","OrderNo":"","ifdType":2,"TypeName":"门店","mImageUrl1":null,"mImageUrl2":null}]}'
    // log(JSON.parse(back))
    // this.dialogDataObj = JSON.parse(back)

            
    // let msg = ''
    // let backObj = res.data
    // if (this.$i18n.locale == 'zh_CN'){
    //   msg = '很遗憾预约未成功'
    // } else {
    //   msg = 'Sorry.Your reservation is not successful!'
    // }
    // this.$confirm(msg, '', {
    //   confirmButtonText: this.$t('mBooking.sure'),
    //   cancelButtonText: this.$t('mBooking.cancel'),
    //   center: true
    // }).then(() => {}).catch(() => {});
    
  },
  methods: {
    goMap(item){
      // log(item)
      let url = 'http://api.map.baidu.com/geocoder?address=上海市'
      url += item.cfdAddress
      url += '&output=html&src=webapp.baidu.openAPIdemo'
      window.open(url)
    },
    langToggle() {
      log(this.$i18n.locale)
      this.$i18n.locale = this.$i18n.locale == 'zh_CN' ? 'en_US' : 'zh_CN'
      this.form.sex = this.$i18n.locale == 'zh_CN' ? '女' : 'Woman'
      // this.getCode()
    },
    handleChange(val){
      this.addCust()       
    },
    submitData(){
      
      let subArr = this.itemArr.map(item => item.ItemClassList)
      let custArr = []
      let flag = true

      this.customerArr.forEach(item => {
        let pickArr = []
        if (item.MentDtlList.length === 0) {
        flag = false
        }
        item.MentDtlList.forEach(item2 => {
          subArr.forEach(item3 => {
            item3.forEach(item4 => {
              if (item2 == item4.ifdClassId){
                pickArr.push({
                  cfdItemClassId: item4.ifdClassId,
                  ifdUseMinutes: item4.NeedMinute
                })
              }
            })
            
          })
        })
        
        custArr.push({
          dfdStartTime: moment(item.dfdStartTime).format("YYYY-MM-DD HH:mm"),
          MentDtlList: pickArr
        })
      })
      if (!flag) {
        this.$message(this.$t('mBooking.checkOrder'))
        return
      }

      let data = {
        ifdFendianId: this.columnVal,
        cfdName: this.form.name,
        cfdTel: this.form.tel,
        TelCode: this.form.code,
        cfdSex: this.form.sex,
        cfdEmail: this.form.mail,
        cfdWeixinOpenid: '',
        cfdMemberId: '',
        AppointMentNumber: this.stepVal,
        MentMstList: custArr,
        language: this.$i18n.locale == 'zh_CN' ? 0 : 1        
      }
      // log(this.customerArr)
      // log(data)
      this.isLoading = true
      this.$axios
        .post(
          this.GLOBAL.baseURL + "SanggeWeChat/AddSanggeEmailReserve",data)
        .then(res => {
          this.isLoading = false
          if (Number(res.code) === 0) {

            let msgBig = ''
            let msg = ''
            if (this.$i18n.locale == 'zh_CN'){
              msgBig = '预约提交成功！'
              msg = '预约确认信息将发送到你的邮箱，请注意查收！'
            } else {
              msgBig = 'Thank you for submitting your reservation!'
              msg = 'We will confirm your reservation in your mailbox, please check your reservation status.'
            }
            this.$alert(msg, msgBig, {
              confirmButtonText: 'SURE',
              callback: action => {
                this.$message({
                  type: 'info',
                  message: `action: ${ action }`
                });
              }
            });
            // this.$message.success('预约成功！')        
            // window.location.reload()
            this.stepVal = 1
            this.addCust()   
            this.form = {
              tel: '',
              code: '',
              name: '',
              sex: '女',
              mail: ''
            }
          } else {
            if (res.data && res.data.TitleName) {

            // log(' iiuu ')
              this.dialogVisible = true
              this.dialogDataObj = res.data
            } else {
              this.$message.error(res.msg);
            }
            
          }
        });
    },
    submitForm(formName) {
      if (this.form.tel !== '') {
        if (!checkPhone(this.form.tel)) {
          this.$message(this.$t('mBooking.phonePlace'))
          return
        }
      }
      
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.submitData()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    waitSecond () {
      this.second = 90
      let t = setInterval(() => {
        this.second--
        if (this.second === 0) {
          clearInterval(t)
        }
      }, 1000)
      // 15921812928
    },
    getMailCode(){
      if (this.form.mail === '' || !checkEmail(this.form.mail)) {
        this.$message(this.$t('mBooking.checkMail'));
        return false
      }
      // this.waitSecond()
      this.$axios
        .get(
          this.GLOBAL.baseURL + "Common/GetSendEmailCode",
          {
            params: {
              Email: this.form.mail,
              language: this.$i18n.locale == 'zh_CN' ? 0 : 1
            }
          }
        )
        .then(res => {
          if (Number(res.code) === 0) {
            // this.$message('发送成功！注意查收！')
            this.waitSecond()
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    getCode(){
      this.getShops()          
            this.addCust()   
      // this.$axios
      //   .post(
      //     this.GLOBAL.baseURL + "SanggeWeChat/WxLogin",
      //     {
      //       Code: 'abc'
      //     }
      //   )
      //   .then(res => {
      //     if (Number(res.code) === 0) {
      //       setStore('loginObj', res.data)  
      //       this.getShops()          
      //       this.addCust()       
      //     } else {
      //       this.$message.error(res.msg);
      //     }
      //   });
    },
    addCust(){
      let obj = {
        // dfdStartTime: moment(new Date()).format("YYYY-MM-DD HH:mm"),
        dfdStartTime: new Date(),
        MentDtlList: [
          // {
          //   cfdItemClassId: 1007,
          //   ifdUseMinutes: 90
          // },
          // {
          //   cfdItemClassId: 1012,
          //   ifdUseMinutes: 120
          // },
        ]
      }
      this.customerArr = []
      let arr = []
      for(var i=0;i<this.stepVal;i++){
        arr.push(obj)
      }
      this.customerArr = JSON.parse(JSON.stringify(arr))
    },
    getShops(){
      this.$axios
        .post(
          this.GLOBAL.baseURL + "SanggeWeChat/QuerySanggeFendianList",
          {
            Keyword: '',
            IsShow: true,
            language: this.$i18n.locale == 'zh_CN' ? 0 : 1
          }
        )
        .then(res => {
          if (Number(res.code) === 0) {
            // log(res.data)
            this.columnArr = res.data
            if (res.data.length>0){
              this.columnVal = res.data[0].ifdFendianId
            }
            // this.columns = res.data.map(item => item.cfdFendianName)
            this.getItems()              
          } else {
            this.$message.error(res.msg);
            if (Number(res.code) === 301) {
              window.location.reload();
            }
          }
        });
    },
    getItems(){
      this.$axios
        .post(
          this.GLOBAL.baseURL + "SanggeWeChat/QuerySanggeServiceTypeList",
          {
            ifdFendianId: this.columnVal,
            language: this.$i18n.locale == 'zh_CN' ? 0 : 1
          }
        )
        .then(res => {
          if (Number(res.code) === 0) {
            this.itemArr = res.data
          } else {
            this.$message.error(res.msg);
            if (Number(res.code) === 301) {
              window.location.reload();
            }
          }
        });
    }
  }
};
</script>

<style scoped lang="less">
@import "./less.less";
</style>
