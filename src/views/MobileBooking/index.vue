<template>
  <div class="MobileOrder">
    <div class="title clearfix">
      <span class="pull-right" @click="langToggle">{{$i18n.locale == 'zh_CN' ? 'EN' : '中文'}}</span>
    </div>
    <div class="spa">
      <div class="spa-before"></div>
      <div class="spa-spa">SUBCONSCIOUS DAY SPA</div>
      <div class="spa-after"></div>
    </div>
    <van-cell-group>
      <van-field
        v-model="form.tel"
        required
        clearable
        :label="$t('mBooking.phone')"
        :placeholder="$t('mBooking.phonePlace')"
      ></van-field>
      <van-field
        v-model="form.code"
        required
        center
        clearable
        :label="$t('mBooking.code')"
        :placeholder="$t('mBooking.codePlace')"
      >
        <van-button
          @click="getTelCode()"
          :disabled="second!==0"
          slot="button"
          size="small"
          type="primary"
          style="background:#AA942D; border:none;"
        >{{second===0 ? $t('mBooking.getCode') : $t('mBooking.surplus')+second+'S'}}</van-button>
      </van-field>
      <van-field
        v-model="form.name"
        required
        clearable
        :label="$t('mBooking.name')"
        :placeholder="$t('mBooking.namePlace')"
      ></van-field>
      <van-field v-model="form.sex" required clearable :label="$t('mBooking.gender')"></van-field>

      <van-cell
        :title="$t('mBooking.branch')"
        :value="columns[columnIndex]"
        required
        is-link
        @click="StorePickShow = true"
      />
      <van-cell :title="$t('mBooking.number')" value required>
        <template slot="default">
          <van-stepper v-model="stepVal" @change="stepChange" min="1" max="5" integer />
        </template>
      </van-cell>
    </van-cell-group>

    <div v-for="(item,index) in customerArr" :key="index">
      <div class="custom-spark">
        <span class="custom-before"></span>
        <div class="custom-middle">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="custom-after"></span>
      </div>
      <div class="title clearfix" style="margin-top:15px;">
        <span class>{{$t('mBooking.customer')}} {{index+1}}</span>
      </div>
      <van-cell-group>
        <van-cell
          :title="$t('mBooking.date')"
          :value="item.dfdStartTime"
          required
          is-link
          @click="datePickShow = true; custActIndex = index"
        />
        <van-cell
          :title="$t('mBooking.service')"
          :value="item.MentDtlList.length > 0 ? $t('mBooking.select')+item.MentDtlList.length+'' : $t('mBooking.servicePlace')"
          required
          is-link
          @click="pickItemShow(item, index)"
        />
      </van-cell-group>
    </div>

    <!-- 门店 -->
    <van-popup v-model="StorePickShow" position="bottom">
      <van-picker :columns="columns" @change="onChange" />
    </van-popup>

    <!-- 时间 -->
    <van-popup v-model="datePickShow" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        :min-date="new Date()"
        :max-date="new Date(2020, 10, 1)"
        @confirm="datePickSure"
        @cancel="datePickShow = false"
        :filter="filter2"
        :confirm-button-text="$t('mBooking.sure')"
        :cancel-button-text="$t('mBooking.cancel')"
      />
    </van-popup>

    <!-- 项目 -->
    <van-popup v-model="itemsPickShow" position="bottom">
      <div class="itemsPick">
        <div class="btns">
          <!-- <span @click="itemsPickShow = false">关闭</span> -->
          <span @click="itemsPickShow = false">{{$t('mBooking.sure')}}</span>
        </div>
        <div v-for="(item,index) in itemArr" :key="index">
          <div class="itemTitle">
            <span class="title-icon"></span>
            {{$i18n.locale == 'zh_CN' ? item.ServiceName : item.cfdServiceNameEn}}
          </div>
          <ul class="itemList">
            <li
              @click="itemClick(item, item2);"
              v-for="(item2,index2) in item.ItemClassList"
              :key="index2"
              :class="item2.active ? 'active' : ''"
            >{{$i18n.locale == 'zh_CN' ? item2.cfdItemClass : item2.cfdItemClassEn}}</li>
          </ul>
          <div class="item-spark"></div>
        </div>
      </div>
    </van-popup>

    <div class="submit" @click="submit()">{{$t('mBooking.submit')}}</div>

    <van-popup v-model="showPopup01" style=" border-radius: 8px;">
      <div v-if="$i18n.locale == 'zh_CN'" style="padding:20px 10px; text-align:center;">
        <div style="color:#AA942D; padding-bottom:8px;">预约提交成功！</div>预约确认信息将发送到【桑格水疗会所】
        <br />微信公众平台，请注意查收！
      </div>
      <div v-else style="padding:20px 10px; text-align:center;">
        <div style="color:#AA942D; padding-bottom:8px;">Thank you for submitting your reservation!</div>We will confirm your reservation in [Subconscious day spa] WeChat ASAP.
        please check your reservation status.
      </div>
    </van-popup>

    <!-- <van-popup v-model="showPopup02" style=" border-radius: 8px;">
      <div v-if="$i18n.locale == 'zh_CN'" style="padding:20px 10px; text-align:center;">
        <div style="color:#AA942D; padding-bottom:8px;">
          很遗憾预约未成功
        </div>
      </div>
      <div v-else style="padding:20px 10px; text-align:center;">
        <div style="color:#AA942D; padding-bottom:8px;">
          Sorry.Your reservation is not successful!
        </div>
      </div>
    </van-popup>-->
    <van-popup v-model="showPopup02" style=" border-radius: 8px; width:92%;">
      <div class="text-center dialogNotice">
        <div class="mainColor mainTitle">{{dialogDataObj.TitleName}}</div>
        <div>{{dialogDataObj.DateTitleName}}</div>
        <ul class="clearfix">
          <li
            style="width:50%;text-align:left;"
            v-for="(item,index) in dialogDataObj.TimeList"
            :key="index"
          >{{item}}</li>
        </ul>
        <div>{{dialogDataObj.FendianTitleName}}</div>
        <ul class="clearfix">
          <li v-for="(item,index) in dialogDataObj.FendianList" :key="index">
            <span>{{$i18n.locale == 'zh_CN' ? item.cfdFendianName : item.cfdFendianNameE}}</span>
            <span style="margin-left:20px;">{{item.cfdAddress}}</span>
            <span class="goMap" @click="goMap(item)">{{$t('mBooking.viewMap')}}</span>
          </li>
        </ul>
        <div style="text-align:center">
          <van-button
            @click="showPopup02 = false"
            size="small"
            type="primary"
            style="background:#AA942D; border:none;"
          >{{$t('mBooking.sure')}}</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<style scoped lang="less">
@import "./less.less";
</style>
<script>
import moment from "moment";
import { setTitle, setStore, getStore, checkPhone } from "@/libs/utils.js";
import {
  Button,
  CellGroup,
  Field,
  DatetimePicker,
  Popup,
  Picker,
  Cell,
  Stepper,
  Toast
} from "vant";
import "vant/lib/button/style";
import "vant/lib/cell-group/style";
import "vant/lib/field/style";
import "vant/lib/datetime-picker/style";
import "vant/lib/popup/style";
import "vant/lib/picker/style";
import "vant/lib/cell/style";
import "vant/lib/stepper/style";
import "vant/lib/toast/style";

export default {
  name: "MobileOrder",
  data() {
    return {
      StorePickShow: false,
      showPopup01: false,
      showPopup02: false,
      dialogDataObj: {},
      datePickShow: false,
      itemCustIndex: -1,
      itemsPickShow: false,
      stepVal: 1,
      form: {
        // tel: '15921812928',
        // code: '510311',
        // name: '小向',
        // sex: '男',
        tel: "",
        code: "",
        name: "",
        sex: "女"
      },
      minDate: new Date(),
      currentDate: "",
      columnIndex: 0,
      columns: [], // 门店选择
      columnArr: [],

      custActIndex: 0,
      customerArr: [],
      itemArr: [], // 项目
      second: 0
    };
  },
  created() {
    setTitle("booking");
  },
  mounted() {
    Toast.loading({
      mask: true,
      message: "loading..."
    });
    setTimeout(() => {
      this.getCode();
      Toast.clear();
    }, 2000);
  },
  methods: {
    goMap(item) {
      let url = "http://api.map.baidu.com/geocoder?address=上海市";
      url += item.cfdAddress;
      url += "&output=html&src=webapp.baidu.openAPIdemo";
      window.open(url);
    },
    langToggle() {
      log(this.$i18n.locale);
      this.$i18n.locale = this.$i18n.locale == "zh_CN" ? "en_US" : "zh_CN";
      this.form.sex = this.$i18n.locale == "zh_CN" ? "女" : "woman";
      this.getCode();
    },
    filter2(type, options) {
      if (type === "minute") {
        return options.filter(option => option % 10 === 0);
      }

      return options;
    },
    datePickSure(val) {
      this.datePickShow = false;
      let aa = JSON.parse(JSON.stringify(this.customerArr));
      aa[this.custActIndex].dfdStartTime = moment(val).format(
        "YYYY-MM-DD HH:mm"
      );
      this.customerArr = aa;
    },
    waitSecond() {
      this.second = 90;
      let t = setInterval(() => {
        this.second--;
        if (this.second === 0) {
          clearInterval(t);
        }
      }, 1000);
    },
    getTelCode() {
      if (this.form.tel === "" || !checkPhone(this.form.tel)) {
        Toast(this.$t("mBooking.checkTel"));
        return false;
      }

      this.$axios
        .get(this.GLOBAL.baseURL + "Common/GetValidHistoryCode", {
          params: {
            MoTel: this.form.tel,
            language: this.$i18n.locale == "zh_CN" ? 0 : 1
          }
        })
        .then(res => {
          if (Number(res.code) === 0) {
            this.waitSecond();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    // 选项目打开
    pickItemShow(data, index) {
      this.itemsPickShow = true;
      this.custActIndex = index;

      this.itemArr.forEach(item00 => {
        item00.ItemClassList.forEach(item11 => {
          item11.active = false;
        });
      });

      this.itemArr.forEach(item00 => {
        item00.ItemClassList.forEach(item11 => {
          data.MentDtlList.forEach(item22 => {
            if (item22.cfdItemClassId === item11.ifdClassId) {
              item11.active = true;
            }
          });
        });
      });
    },
    // 选项目
    itemClick(itemAll, item2) {
      item2.active = !item2.active;
      let custBakArr = JSON.parse(JSON.stringify(this.customerArr));
      let currentPickArr = custBakArr[this.custActIndex].MentDtlList;
      if (item2.active) {
        // 添加
        currentPickArr.push({
          cfdItemClassId: item2.ifdClassId,
          ifdUseMinutes: item2.NeedMinute
        });
      } else {
        currentPickArr.forEach((item0, index0, arr0) => {
          if (item2.ifdClassId == item0.cfdItemClassId) {
            arr0.splice(index0, 1);
          }
        });
      }

      this.customerArr = custBakArr;
    },
    stepChange(index) {
      // log(index)
      this.addCust();
    },
    onChange(picker, value, index) {
      log(`当前值：${value}, 当前索引：${index}`);
      this.columnIndex = index;
    },
    getCode() {
      this.getShops();
      this.addCust();
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
    addCust() {
      let obj = {
        dfdStartTime: moment(new Date()).format("YYYY-MM-DD HH:mm"),
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
      };
      this.customerArr = [];
      for (var i = 0; i < this.stepVal; i++) {
        this.customerArr.push(obj);
      }
    },
    getShops() {
      this.$axios
        .post(this.GLOBAL.baseURL + "SanggeWeChat/QuerySanggeFendianList", {
          Keyword: "",
          IsShow: true,
          language: this.$i18n.locale == "zh_CN" ? 0 : 1
        })
        .then(res => {
          if (Number(res.code) === 0) {
            // log(res.data)
            this.columnArr = res.data;
            this.columns = res.data.map(item => {
              if (this.$i18n.locale == "zh_CN") {
                return item.cfdFendianName;
              } else {
                return item.cfdFendianNameE;
              }
            });
            this.getItems();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    getItems() {
      this.$axios
        .post(this.GLOBAL.baseURL + "SanggeWeChat/QuerySanggeServiceTypeList", {
          ifdFendianId: this.columnArr[this.columnIndex].ifdFendianId,
          language: this.$i18n.locale == "zh_CN" ? 0 : 1
        })
        .then(res => {
          if (Number(res.code) === 0) {
            // log(res.data)
            this.itemArr = res.data;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    checkForm() {
      if (this.form.tel == "") {
        log(this.$i18n.locale);
        Toast(this.$t("mBooking.phonePlace"));
        return false;
      }
      if (this.form.code == "") {
        Toast(this.$t("mBooking.codePlace"));
        return false;
      }
      if (this.form.name == "") {
        Toast(this.$t("mBooking.namePlace"));
        return false;
      }
      if (this.form.sex == "") {
        Toast(this.$t("mBooking.genderPlace"));
        return false;
      }
      let itemNull = this.customerArr.filter(
        item => item.MentDtlList.length === 0
      );
      if (itemNull.length > 0) {
        Toast(this.$t("mBooking.servicePlace"));
        return false;
      }
      return true;
    },
    submit() {
      if (!this.checkForm()) {
        return;
      }
      Toast.loading({
        mask: true,
        message: "waiting..."
      });
      let data = {
        ifdFendianId: this.columnArr[this.columnIndex].ifdFendianId,
        cfdName: this.form.name,
        cfdTel: this.form.tel,
        TelCode: this.form.code,
        cfdSex: this.form.sex,
        cfdEmail: "",
        cfdWeixinOpenid: "",
        cfdMemberId: "",
        AppointMentNumber: this.stepVal,
        MentMstList: this.customerArr,
        language: this.$i18n.locale == "zh_CN" ? 0 : 1
      };
      log(data);
      // return
      this.$axios
        .post(this.GLOBAL.baseURL + "SanggeWeChat/AddSanggeWxReserve", data)
        .then(res => {
          Toast.clear();
          if (Number(res.code) === 0) {
            // this.$message.success('预约成功！')
            this.showPopup01 = true;

            (this.form = {
              tel: "",
              code: "",
              name: "",
              sex: "女"
            }),
              (this.customerArr = []);
            this.stepVal = 1;
          } else {
            if (res.data && res.data.TitleName) {
              this.showPopup02 = true;
              this.dialogDataObj = res.data;
            } else {
              this.$message.error(res.msg);
            }
          }
        });
    }
  },
  components: {
    "van-button": Button,
    "van-field": Field,
    "van-cell-group": CellGroup,
    "van-datetime-picker": DatetimePicker,
    "van-popup": Popup,
    "van-picker": Picker,
    "van-cell": Cell,
    "van-stepper": Stepper,
    Toast: Toast
  }
};
</script>


