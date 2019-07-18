<template>
  <div class="Home">
    
    <div class="Header">
      <span class="pull-right">
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <span class="refresh" @click="refreshClick">
            <i class="el-icon-refresh-right"></i>
          </span>
        </el-tooltip>
        {{loginObj.cfdEmployeeName}}
      </span>
      <span class="name" v-if="loginObj.Cu_CompanyName">{{loginObj.Cu_CompanyName}}</span>
    </div>

    <el-row :gutter="2">
      <el-col :span="4">
        <el-form ref="form" :model="form" label-width="75px" label-position="left">
          <el-form-item label="门店选择">
            <el-select v-model="form.store" size="medium" @change="storeChange" placeholder="请选择分店">
              <el-option
                v-for="(item,index) in storeArr"
                :key="index"
                :label="item.FendianName"
                :value="item.FendianId+''"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="5">
        <!-- <el-input placeholder="请输入搜索" v-model="searchObj.value" size="medium" class="searchBox">
          <el-select v-model="searchObj.select" slot="prepend" placeholder="请选择" style="min-width:75px;">
            <el-option label="人员" value="1"></el-option>
            <el-option label="技师" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input> -->
        &nbsp;
      </el-col>

      <el-col :span="15" class="text-right">
        <el-radio-group
          v-model="form.servicePickVal"
          size="medium"
          @change="getOrder(); getDashboard();"
        >
          <el-radio-button label>全部</el-radio-button>
          <el-radio-button
            v-for="(item,index) in storeCurrent.ServiceTypeList"
            :key="index"
            :label="item.ifdId"
          >{{item.ServiceName}}</el-radio-button>
        </el-radio-group>

        <div class="pull-right" style="width:266px;">
          <el-radio-group v-model="form.radio" size="medium" @change="changeRadio">
            <el-radio-button label="0">房间维度</el-radio-button>
            <el-radio-button label="1">技师维度</el-radio-button>
          </el-radio-group>
        </div>
      </el-col>
    </el-row>

    <div
      class="tableWrap"
      v-loading="isLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <DragTable
        ref="DragTable"
        @loadingClose="isLoading = false"
        @updateAllData="allData()"
        @sliderChange="sliderFull = !sliderFull"
        :formData="form"
      />
    </div>

    <div class="rightMsg MXscroll" v-if="sliderFull">
      <div class="title">预约日历</div>
      <Calendar
        ref="Calendar"
        @choseDay="clickDay"
        :sundayStart="true"
        :textTop="[ '日','一', '二', '三', '四', '五', '六']"
      ></Calendar>
      <div style="height:15px; background:#f4f4f4;"></div>
      <div class="title">预约总览 {{bookingNum}}</div>
      <div v-if="isLoading" class="text-center" style="padding:15px; color:#909399;">加载中</div>
      <ul class="orderData">
        <li v-for="(item,index) in dashboardArr" :key="index">
          {{item.cfdTitleName}}：{{item.ifdNumber}}单
          <span
            class="arrow"
            v-if="item.ifdState == 2"
            @click="getCancelDashboard()"
          >
            <i :class="dashboardCancelOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </span>
        </li>
        <template v-if="dashboardCancelOpen && dashboardCancelArr.length>0">
          <li v-for="(item,index) in dashboardCancelArr" :key="'a'+index">
            <el-tooltip effect="dark" placement="left-start">
              <div slot="content">
                <div style="padding:2px;">取消人：{{item.cfdOperateUser}}</div>
                <div style="padding:2px;">取消时间：{{item.cfdOperateDate}}</div>
                <div style="padding:2px;">取消原因：{{item.cfdOperateReason || '无'}}</div>
              </div>
            <span class="down">{{item.cfdMemberName}} &nbsp;&nbsp;&nbsp;{{item.cfdMoTel}}</span>
            </el-tooltip>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { setCookie, getStore, setTitle } from "@/libs/utils.js";
import Calendar from "./Calendar/index";
import DragTable from "./DragTable/index";

export default {
  name: "home",
  data() {
    return {
      loginObj: getStore("loginObj"),
      isLoading: true,
      sliderFull: true,
      form: {
        storeIndex: 0, // 默认门店项
        store: getStore("loginObj").ifdFendianId,
        pickDate: new Date(),
        // pickDate: '2019-06-05',
        radio: 0,
        servicePickVal: ""
      },
      storeCurrent: {}, // 当前门店
      storeArr: [], // 门店下拉
      dashboardArr: [], // 数据总览
      dashboardCancelArr: [], // 已取消的
      dashboardCancelOpen: false,
      bookingNum: 0,
      searchObj: {
        value: '',
        select: '1'
      }
    };
  },
  created() {},
  mounted() {
    setTitle("预约");
    this.$refs.Calendar.ChoseMonth(this.form.pickDate, true);
  },
  methods: {
    refreshClick() {
      this.allData();
    },
    clickDay(val) {
      this.form.pickDate = moment(new Date(val)).format("YYYY-MM-DD");
      this.getFenDian();
    },
    changeRadio() {
      this.$refs.DragTable.initDataTable();
    },
    // 选门店时
    storeChange(val) {
      // log(val)
      this.isLoading = true;
      this.storeArr.forEach((item,index) => {
        if (item.FendianId + "" === val + "") {
          this.storeCurrent = item
          this.form.storeIndex = index
        }
      })
      this.allData();
    },
    allData() {
      this.getOrder();
      this.getDashboard();
    },
    // 查分店数据
    getFenDian() {
      this.isLoading = true;
      let data = {
        ifdLevel: getStore("loginObj").ifdLevel, // 大区ID，非维度
        ifdFendianId: Number(this.form.store),
        ChoiceDateTime: this.form.pickDate
      };

      this.$axios.post(this.GLOBAL.baseURL + "FenDian/FenDianList", data).then(
        res => {
          if (Number(res.code) === this.GLOBAL.status) {
            let backData = res.data;
            // 加未指定列
            backData.forEach(item => {
              item.RoomList.unshift({
                RoomName: "未指定房间",
                BerthNo: "",
                RoomId: "",
                ifdBerthId: ""
              });
              item.EmployeeList.unshift({
                EmployeeName: "未指定技师",
                EmployeeId: ""
              });
            });

            this.storeArr = backData;

            let query = this.$route.query
            if (query.FendianId && query.FendianId !== '') {
              // console.log(query.FendianId)
              let id = query.FendianId
              let reqStore = backData.filter(item => item.FendianId == id)
              // log(reqStore)
              this.storeCurrent = reqStore[0]
              this.form.store = id
            } else {
              let index = this.form.storeIndex;
              this.storeCurrent = backData[index]; // 默认展示第一家店数据
              this.form.store = backData[index].FendianId + ""; // 默认显示第一个门店
            }

            this.allData();
          } else {
            this.$message.error(res.msg);
          }
        },
        res => {
          console.log(res);
        }
      );
    },
    // 查询预约信息(预约)
    getOrder() {
      this.isLoading = true;
      let data = {
        ifdFendianId: Number(this.form.store),
        ChoiceDateTime: moment(this.form.pickDate).format("YYYY-MM-DD"),
        SericeTypeID: this.form.servicePickVal + ""
      };
      this.$axios
        .post(this.GLOBAL.baseURL + "AppointMent/AppointMentList", data)
        .then(
          res => {
            if (Number(res.code) === this.GLOBAL.status) {
              let dataList = res.data;
              this.$refs.DragTable.initTable(this.storeCurrent, dataList); // 第一家店传过去
              this.bookingNum = dataList.length
              if (dataList.length === 0) {
                // this.$message.warning(' 没有查到预约 ')
              }
            } else {
              this.$message.error(res.msg);
            }
          },
          res => {
            console.log(res);
          }
        );
    },
    // 查总览数据
    getDashboard() {
      let data = {
        ifdFendianId: Number(this.form.store),
        ChoiceDateTime: moment(this.form.pickDate).format("YYYY-MM-DD"),
        ifdSericeTypeID: this.form.servicePickVal + ""
      };
      this.$axios
        .post(this.GLOBAL.baseURL + "AppointMent/QueryAppointGather", data)
        .then(
          res => {
            if (Number(res.code) === this.GLOBAL.status) {
              this.dashboardArr = res.data;
            } else {
              this.$message.error(res.msg);
            }
          },
          res => {
            console.log(res);
          }
        );
    },
    // 查总览数据，查已取消
    getCancelDashboard() {
      this.dashboardCancelOpen = !this.dashboardCancelOpen;
      if (!this.dashboardCancelOpen) {
        this.dashboardCancelArr = [];
        return;
      }
      let data = {
        ifdFendianId: Number(this.form.store),
        ChoiceDateTime: moment(this.form.pickDate).format("YYYY-MM-DD"),
        ifdSericeTypeID: this.form.servicePickVal + ""
      };
      this.$axios
        .post(this.GLOBAL.baseURL + "AppointMent/QueryAppointCannel", data)
        .then(
          res => {
            if (Number(res.code) === this.GLOBAL.status) {
              let back = res.data
              back.forEach(item => {
                item.cfdOperateDate = moment(new Date(item.cfdOperateDate)).format("YYYY-MM-DD HH:mm");
              })
              this.dashboardCancelArr = back;
            } else {
              this.$message.error(res.msg);
            }
          },
          res => {
            console.log(res);
          }
        );
    }
  },
  components: {
    DragTable,
    Calendar
  }
};
</script>

<style scoped lang="less">
@import "./less.less";
</style>
