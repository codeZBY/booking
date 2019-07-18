<template>
  <el-dialog :title="formStatus !== 'edit' ? '新增预约' : '修改预约'" custom-class="dialogForm" :close-on-click-modal="false"
  :visible.sync="dialogFormVisible" :center="true" :modal-append-to-body="false" @close="reset" width="1088px">
    <div class="DialogOrder">

      <!-- <div class="title"><i class="el-icon-mobile-phone"></i>开始预约</div> -->
      <el-row>
        <el-col :span="8">
          <el-date-picker class="itemEl1" v-model="form.pickDate" type="date" :clearable="false"
            :editable="false" placeholder="选择预约日期"> </el-date-picker>
        </el-col>
        <el-col :span="8">
          <el-input-number :disabled="formStatus === 'edit'" class="itemEl1" v-model="form.peopleNum" controls-position="right" :step="1" :min="1" :max="5" @change="changePeopleNum"
            style="width:190px;"></el-input-number>
          <span class="marginLeft10">位</span>
        </el-col>
        <el-col :span="8">
          <el-checkbox v-model="form.isAutoRoom" @change="isRoomAuto" style="margin-top:12px;">自动分配房间</el-checkbox>
        </el-col>
      </el-row>

      <!--------------------------------- tabs ----------------------------------->
      <el-tabs v-model="editableTabsValue3" v-if="editableTabs3.length>0" type="border-card">
        <el-tab-pane v-for="(item0, index0) in editableTabs3" :key="index0" :label="'预约人' + (index0+1)" :name="index0+''">
          <div class="tabContent">

            <!-- 客人信息 -->
            <div class="title"><i class="el-icon-service"></i>客人信息</div>
            <el-row>
              <el-col :span="8">
                  <el-autocomplete
                    class="itemEl1"
                    v-model="item0.cfdName"
                    clearable
                    prefix-icon="el-icon-search"
                    :fetch-suggestions="querySearchAsyncName"
                    placeholder="请输入客户名称"
                    @select="handleSelectName"
                  >
                  <template slot-scope="{ item }">
                    <div class="name">
                      {{ item.cfdMemberName }}
                      <!-- <span style="color:#909399;padding-left:8px;">({{item.cfdSex}})</span> -->
                    </div>
                  </template>
                  </el-autocomplete>
              </el-col>
              <el-col :span="8">
                <!-- <el-input class="itemEl1" v-model="item0.cfdTel" clearable placeholder="请输入客户电话"
                  autocomplete="off" prefix-icon="el-icon-search"></el-input> -->
                  <el-autocomplete
                    class="itemEl1"
                    v-model="item0.cfdTel"
                    clearable
                    prefix-icon="el-icon-search"
                    :fetch-suggestions="querySearchAsyncTel"
                    placeholder="请输入客户电话"
                    @select="handleSelectName"
                  >
                  <template slot-scope="{ item }">
                    <div class="name">
                      {{ item.cfdMoTel }}
                    </div>
                  </template>
                  </el-autocomplete>
              </el-col>
              <el-col :span="8">
                <el-select class="itemEl1" v-model="item0.cfdSex" placeholder="客户性别">
                  <el-option label="女" value="女"></el-option>
                  <el-option label="男" value="男"></el-option>
                  <el-option label="未知" value="未知"></el-option>
                </el-select>
              </el-col>
            </el-row>

            <!-- 预约内容 -->
            <div class="title"><i class="el-icon-tickets"></i>预约内容</div>
            <template v-if="orderCustData.length>0 && item0.ItemClassList && item0.ItemClassList.length>0">
            <div class="contentItem" v-for="(item1,index1) in orderCustData" :key="index1">
              <!-- <div class="category">{{item1.ServiceName}}</div> -->
              <el-row>
                <el-col :span="2">
                  <span style="color:#222;font-size:15px;">{{item1.ServiceName}}</span>
                </el-col>
                <el-col :span="22">
                  <span>{{orderDownData(index1)}}</span>
                  <el-checkbox-group size="mini" v-model="item0.ItemClassList[index1].cfdItemClassId" @change="(()=>{changeSubject(index1)})">
                    <el-checkbox v-for="(item2,index2) in item1.ItemClassList" :key="index2" :label="item2.ifdClassId" style="margin-right:12px;">{{item2.cfdItemClass}}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-row>
              <el-row style="margin-top: 8px;">
                <el-col :span="2">&nbsp;</el-col>
                <el-col :span="3">
                  <el-time-select class="itemEl2" v-model="item0.ItemClassList[index1].dfdStartTime" :picker-options="{
                      start: dragObj.StartTime,
                      step: '00:10',
                      end: dragObj.EndTime
                    }"
                    placeholder="开始时间" @change="(()=>{changeSubject(index1)})">
                  </el-time-select>
                </el-col>
                <el-col :span="3">
                  <el-time-select class="itemEl2" v-model="item0.ItemClassList[index1].dfdEndTime" :picker-options="{
                      start: item0.ItemClassList[index1].dfdStartTime,
                      step: '00:10',
                      end: dragObj.EndTime,
                      minTime: item0.ItemClassList[index1].dfdStartTime
                    }"
                    placeholder="结束时间" @change="(()=>{changeSubject(index1, 'end')})">
                  </el-time-select>
                </el-col>
                <el-col :span="3">
                  <el-select class="itemEl2" v-model="item0.ItemClassList[index1].cfdSex"
                   placeholder="技师性别" style="width:88px;" @change="(()=>{changeSubject(index1)})">
                    <el-option label="女" value="女"></el-option>
                    <el-option label="男" value="男"></el-option>
                    <el-option label="不限" value=""></el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-select class="itemEl2" v-model="item0.ItemClassList[index1].ifdAllotType" placeholder="是否点钟" style="width:110px;">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-select class="itemEl2" v-model="item0.ItemClassList[index1].cfdEmployeeIdA" 
                  filterable placeholder="请选择技师">
                    <el-option v-for="(item10,index10) in item1.downPeoples" :key="index10" :label="item10.EmployeeName" :value="item10.EmployeeId"></el-option>
                  </el-select>                  
                  <i style="margin-left:5px;"></i>

                  <el-popover
                    popper-class="popperBg"
                    :visible-arrow="false"
                    placement="right"
                    width="200"
                    trigger="click">
                    <div class="poperBox">
                      <div class="title">技师详情</div>
                      <ul v-if="peopleListDetail.length>0">
                        <template v-for="(item20,index20) in peopleListDetail">
                        <li class="item" :key="index20" v-if="index20<peopleListNum">{{item20.cfdItemName}}</li>
                        </template>
                        <li v-if="peopleListDetail.length>peopleListNum && peopleListNum !== 999" class="text-center text-hover trans" @click="peopleListNum = 999">查看全部</li>
                        <li v-else class="text-center">没有更多了</li>
                      </ul>
                      <div v-else class="text-center">没有查到数据</div>
                    </div>
                    <el-button slot="reference" @click="peopleDetail(item1, item0.ItemClassList[index1].cfdEmployeeIdA)" type="text" size="mini" icon="el-icon-tickets">详情</el-button>
                  </el-popover>

                </el-col>
                <el-col :span="4">
                  <el-select class="itemEl2" v-model="item0.ItemClassList[index1].ifdBerthId" placeholder="房间号" :disabled="item0.ItemClassList[index1].disabledRoom">
                    <el-option v-for="(item10,index10) in item1.downRooms" :key="index10" 
                    :label="item10.RoomName+' - '+item10.BerthNo" :value="item10.ifdBerthId"></el-option>
                  </el-select>
                </el-col>
              </el-row>

            </div>
            </template>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="添加备注" v-model="item0.cfdRemark">
            </el-input>

          </div>

        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="text-center" style="margin-top:15px;">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="committing" v-if="formStatus !== 'edit'">确 定</el-button>
        <el-button type="primary" @click="modify" :loading="committing" v-else>提 交</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import moment from 'moment'
import { getEndTime, checkPhone, trim } from "@/libs/utils.js";
import { setTimeout } from 'timers';

export default {
  name: "home",
  data() {
    return {
      dialogFormVisible: false,
      dragObj: {}, // 已选传进来
      form: {
        pickDate: "",
        peopleNum: 1,
        peopleNumBak: 1,
        isAutoRoom: true
      },

      editableTabsValue3: "0", // 当前高亮主tab
      editableTabs3: [], // 所有TAB数据

      orderCustData: [], // 业务形态，有哪些项目，可选择
      orderDataCustVal: 0, // 正在活动的预约内容项目
      orderDownData2: [' ', ' ', '', ''], // 业务形态选择的项目，查的下拉
      restaurants: [], // 远程会员搜索
      peopleListDetail: [], // 技师详情
      peopleListNum: 10, // 技师详情默认显示条数
      formStatus: '', // 表单状态
      committing: false, // 是否提交中ing
    };
  },
  created() {
  },
  mounted() {
    // let testaa = {
    //   EndTime: "14:00",
    //   FendianName: "富民店",
    //   SericeTypeIDs: "1",
    //   StartTime: "08:00",
    //   TDcustomer: [],
    //   TDdata: {},
    //   TDnum: 5,
    //   TDtime: "09:20",
    //   formData: {
    //     pickDate: "2019-05-23",
    //     radio: 0,
    //     store: "1001",
    //   }
    // }
    // this.addOrder(testaa)
  },
  computed: {
  },
  methods: {
    peopleDetail(item1, id) {
      // 清零
      this.peopleListDetail = []
      this.peopleListNum = 10
      if (!id || id === '') {
        this.$message('请选择技师')
        return
      }
      this.$axios
      .post(this.GLOBAL.baseURL + "Employee/QueryEmployeeItemList", {
        cfdEmployeeId: id,
        ifdSericeTypeID: item1.ifdId+''
      })
      .then(
        res => {
          if (Number(res.code) === this.GLOBAL.status) {
            this.peopleListDetail = res.data
          } else {
            this.$message.error(res.msg);
          }
        },
        res => {
          console.log(res);
        }
      );
    },
    // 会员搜索
    searchMember(type, val) {
      if (trim(val) === '') {return}
      let data = {}
      if (type === 'name') {
        data = {
          MemberName: val,
          MemberTel: ''
        }
      } else if (type === 'tel') {
        data = {
          MemberName: '',
          MemberTel: val
        }
      }
      return new Promise((resolve,reject)=>{
        this.$axios
          .post(this.GLOBAL.baseURL + "Member/QueryMemberInfo", data)
          .then(
            res => {
              if (Number(res.code) === this.GLOBAL.status) {
                resolve(res.data)
              } else {
                this.$message.error(res.msg);
              }
            },
            res => {
              console.log(res);
            }
          );
      })
    },
    async querySearchAsyncName(queryString, cb) {
      if (!queryString) { 
        cb([]);      
        return 
      }
      this.restaurants = await this.searchMember('name', queryString) || []
      cb(this.restaurants);      
    },
    async querySearchAsyncTel(queryString, cb) {
      if (!queryString) { 
        cb([]);      
        return 
      }
      this.restaurants = await this.searchMember('tel', queryString) || []
      cb(this.restaurants);      
    },
    otherAuto(itemData){
      let tabsArr = this.editableTabs3
      if (tabsArr.length > 1) {
        tabsArr.forEach((item, index) => {
          if (item.cfdName === '') {
            let num = index + 1
            item.cfdName = itemData.cfdMemberName + '-' + num
            item.cfdTel = itemData.cfdMoTel
            item.cfdSex = itemData.cfdSex
          }
        })
      }
      // console.log(itemData)
    },
    handleSelectName(item) {
      // console.log(item)
      let currentDataClassObj = this.editableTabs3[this.editableTabsValue3]
      // log(currentDataClassObj)
      currentDataClassObj.cfdName = item.cfdMemberName
      currentDataClassObj.cfdMemberId = item.cfdMemberId
      currentDataClassObj.cfdTel = item.cfdMoTel
      currentDataClassObj.cfdSex = item.cfdSex
      this.otherAuto(item) // 其他项自动填充（如有的话）
    },
    orderDownData(index) {
      return this.orderDownData2[index]
    },
    changePeopleNum(index) {
      let bak = this.form.peopleNumBak
      if (index > bak) {
        // log(" +++ ");
        this.initFormData('+', index - bak);
      } else {
        // log(" ------- ");
        this.initFormData('-', bak - index);
      }
      this.form.peopleNumBak = index
    },
    // 有选项后，时间顺延
    doTime(arr){
      let currentClass = this.orderCustData[this.orderDataCustVal].ItemClassList
      // log(currentClass)
      // log(arr)
      let newData = []
      currentClass.forEach(item => {
        arr.forEach(item2 => {
          if (item2 === item.ifdClassId) {
            newData.push(item)
          }
        })
      })
      // log(newData)
      let minusArr = newData.map(item => {
        return item.NeedMinute
      })
      // log(minusArr)
      let sum = minusArr.reduce(function(prev,cur){
          return prev + cur
      });

      let num = parseInt(sum/10)
      let currentDataClassObj = this.editableTabs3[this.editableTabsValue3].ItemClassList[this.orderDataCustVal]
      // log(currentDataClassObj)
      let end = getEndTime(currentDataClassObj.dfdStartTime, num)
      currentDataClassObj.dfdEndTime = end
    },
    // 多选，根据预约项目查询服务人员以及房间列表(预约)
    changeSubject(index1, name) {
      this.orderDataCustVal = index1 // 在操作第几个项目
      let currentObj = this.editableTabs3[this.editableTabsValue3].ItemClassList[index1]
      let arr = currentObj.cfdItemClassId
      // log(' ___ ')
      // log(arr)      
      // 清零
      if (arr.length === 0) {
        // log(this.orderCustData[index1])
        this.orderCustData[index1].downPeoples = []
        this.orderCustData[index1].downRooms = []
        return
      }
      // 有选项后，时间顺延
      if (name !== 'end') {
      this.doTime(arr)
      }

      // 非空
      let start = currentObj.dfdStartTime
      let end = currentObj.dfdEndTime
      if (!start || start === '' || !end || end === '') {
        return
      }

      let data = {
        // ClassId: "6,10,13,24", // 预约项目类别多选已逗号分隔
        ClassId: arr.join(','), // 预约项目类别多选已逗号分隔
        ifdFendianId: this.dragObj.formData.store, // 门店编号
        ChoiceDateTime: this.dragObj.formData.pickDate,
        cfdSex: currentObj.cfdSex, // 性别
        dfdStartTime: this.dragObj.formData.pickDate + ' ' + start,
        dfdEndTime: this.dragObj.formData.pickDate + ' ' + end
      }
      // log(data)
      this.getRoomEmp(data, index1) // 传查接口
    },
    getRoomEmp(data, index1) {
      this.$axios
      .post(this.GLOBAL.baseURL + "Employee/ServiceEmployeeRoomList", data)
      .then(
        res => {
          if (Number(res.code) === this.GLOBAL.status) {
            let back = res.data
            // console.log(back);
            this.orderCustData[index1].downPeoples = back.EmployeeList
            this.orderCustData[index1].downRooms = back.RoomList
            // console.log(this.orderCustData);
            
            this.orderDownData2 = []
            if (back.EmployeeList.length === 0){
              this.$message.warning('没有查到相关技师')
            }
            if (back.RoomList.length === 0){
              this.$message.warning('没有查到相关房间')
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
    // (业务形态)
    getServiceType(id) {
      let itemIds = this.dragObj.SericeTypeIDs
      if (itemIds === '') {
        this.$message.warning('此门店没有业务形态');
        return
      }
      this.$axios
        .post(this.GLOBAL.baseURL + "ServiceType/ServiceTypeList", {
          // SericeTypeID: "1,2,3,4"
          SericeTypeID: itemIds
        })
        .then(
          res => {
            if (Number(res.code) === this.GLOBAL.status && res.data.length>0) {
              this.orderCustData = res.data;

              if (this.formStatus !== 'edit') {
                this.initFormData() // 计算并放入值
              } else {
                this.getEditData(id);
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
    checkForm() {
      if (this.form.pickDate === '') {
        this.$message('请选择预约时间！')
        return false
      }
      let isTrue = true
      this.editableTabs3.forEach(item => {
        if (item.cfdName === '') {
          this.$message('请输入客人名称！')
          isTrue = false
          return false
        }
        if (item.cfdTel === '') {
          this.$message('请输入客人电话！')
          isTrue = false
          return false
        }
        if (!checkPhone(item.cfdTel)) {
          this.$message('电话/手机格式不正确！')
          isTrue = false
          return false
        }
      })
      return isTrue
    },
    formInData(){
      if(!this.checkForm()) { return }

      let currentSelectDate = moment(this.form.pickDate).format('YYYY-MM-DD')
      let data = {
        ifdFendianId: this.dragObj.formData.store,
        ChoiceDateTime: currentSelectDate,
        AppointMentNumber: this.form.peopleNum, // 预约人数
        Automatic: Number(this.form.isAutoRoom), // 是否 自动 0、1
        AppointMentList: JSON.parse(JSON.stringify(this.editableTabs3))
      };

      // 数据处理 ================================================================================================
      if (data.AppointMentList.length>0) {
        // 遍历人
        let checkRepetEmp = []
        data.AppointMentList.forEach(item => {
          // log(item)
          if (item.ItemClassList.length>0) {
            // 过滤空项目
            let itemArr = item.ItemClassList.filter(item2 => item2.cfdItemClassId.length>0)
            if (itemArr.length === 0) {
              this.$message.warning('请选择预约项目')
              data = false
            }
            itemArr.forEach(item2 => {
              if (item2.cfdEmployeeIdA === '') {
                // this.$message.warning('请选择项目下的技师') // 放开了，不必填
                // data = false
              } else {
                // checkRepetEmp.push(item2.cfdEmployeeIdA)
                checkRepetEmp.push(item2)
              }
              if (!this.form.isAutoRoom && item2.ifdBerthId === ''){
                this.$message.warning('请选择项目下的房间')
                data = false
              } else {
                // 匹配房间及床位ID
                let rooms = this.orderCustData[this.orderDataCustVal].downRooms
                // log(rooms)
                if (rooms && rooms.length>0){
                  let selectRoomArr = rooms.filter(item => item.ifdBerthId == item2.ifdBerthId)
                  if (selectRoomArr.length>0){
                    item2.ifdRoomId = selectRoomArr[0].RoomId
                  }
                }
              }
              item2.dfdStartTime = currentSelectDate + ' ' + item2.dfdStartTime
              item2.dfdEndTime = currentSelectDate + ' ' + item2.dfdEndTime

              item2.cfdItemClassId = item2.cfdItemClassId.join(',')
              item2.cfdItemClassIdName = item2.cfdItemClassIdName ? item2.cfdItemClassIdName.join(',') : ''
            })
            item.ItemClassList = itemArr
          } else {
            this.$message.warning("没有预约项目");
          }
        })
        if (checkRepetEmp.length > 1) {
          let check = this.checkEmpRepeat(checkRepetEmp) // 查重，大于1个时
          if (!check) {
            data = false
          }
        }
      } else {
        this.$message.warning("没有人可预约");
        data = false
      }
      return data
      // return false
    },
    // 查重
    checkEmpRepeat(checkRepetEmp) {
      let arr = []
      let repeat = {}
      checkRepetEmp.forEach(item => {
        if (arr.indexOf(item.cfdEmployeeIdA) === -1) {
          arr.push(item.cfdEmployeeIdA)
        } else {
          repeat = item
        }
      })
      let repArr = checkRepetEmp.filter(item => {
        return item.cfdEmployeeIdA == repeat.cfdEmployeeIdA
      })
      // log(repArr)
      if (repArr.length > 1) {
        let time1Star = repArr[0].dfdStartTime
        let time1End = repArr[0].dfdEndTime
        let time2Star = repArr[1].dfdStartTime
        let time2End = repArr[1].dfdEndTime
        // log(time2Star)
        // log(time1End)
        // 时间不能重叠
        if (time2Star < time1End && time2Star >= time1Star || time2End < time1End && time2End > time1Star) {
          this.$message('相同技师预约时间不可重叠')
          return false
        }
      }
      return true
    },
    modify() {
      let data = this.formInData()
      // log(data)
      // return
      if (!data) { return }
      
      this.committing = true
      this.$axios
        .post(this.GLOBAL.baseURL + "AppointMent/UpdateAppointMent", data)
        .then(
          res => {
            if (Number(res.code) === this.GLOBAL.status) {
              this.$message.success('修改成功！')
              this.dialogFormVisible = false;
              this.$emit("change");
            } else {
              this.$message.error(res.msg);
            }
            this.committing = false
          },
          res => {
            console.log(res);
          }
        );
    },
    // 提交
    submit() {
      let data = this.formInData()
      log(data)
      // log(data.AppointMentList[0])
      // return
      if (!data) { return }

      this.committing = true
      this.$axios
        .post(this.GLOBAL.baseURL + "AppointMent/AddAppointMent", data)
        .then(
          res => {
            if (Number(res.code) === this.GLOBAL.status) {
              this.dialogFormVisible = false;
              this.$emit("change");
              if (this.form.isAutoRoom) {
                this.$notify({
                  title: '预约成功！',
                  message: '注意：此订单为自动分配房间哦！',
                  type: 'success',
                  duration: 5555
                });
              } else {
                this.$message.success("预约成功！");
              }
            } else {
              this.$message.error(res.msg);
            }
            this.committing = false
          },
          res => {
            console.log(res);
          }
        );
    },
    // 重置
    reset(){
      this.dragObj = {}
      this.form = {
        pickDate: "",
        peopleNum: 1,
        peopleNumBak: 1,
        isAutoRoom: true
      },

      this.editableTabsValue3 = "0"
      this.editableTabs3 = []

      this.orderCustData = []
      this.orderDataCustVal = 0
      this.orderDownData2 = [' ', ' ', '', '']
      
      this.restaurants = []
      this.peopleListDetail = []
      this.peopleListNum = 10
      this.formStatus = ''
      this.committing = false
    },
    // 房间自动分配
    isRoomAuto (e) {
      this.editableTabs3.forEach(item => {
        item.ItemClassList.forEach(item2 => {
          item2.ifdRoomId = ''
          item2.disabledRoom = e
        })
      })
    },
    // 来新增
    addOrder(itemData) {
      this.dialogFormVisible = true;
      this.dragObj = itemData
      this.form.pickDate = itemData.formData.pickDate
      // log(this.dragObj)
      // log(this.dragObj.TDtime)
      this.getServiceType(); // 查业务形态，选项
    },
    // 来修改
    editOrder(itemData, custObj) {
      this.formStatus = 'edit' // 做个标识

      this.dialogFormVisible = true;
      // log(itemData)
      // log(custObj)
      this.dragObj = itemData
      this.form.pickDate = itemData.formData.pickDate
      this.form.isAutoRoom = false
      let id = custObj.AptNo
      this.getServiceType(id); // 查业务形态，选项
    },
    bookingToDown(itemData) {
      let allType = this.orderCustData.map(item => item.ifdId)
      let index1 = allType.indexOf(itemData.ifdId)
      if (index1 < 0) {
        log('index1 有误 请查检')
        return
      }
      // log(itemData)
      // log(allType)
      // this.changeSubject(1)
      let data = {
        // ClassId: "6,10,13,24", // 预约项目类别多选已逗号分隔
        ClassId: itemData.cfdItemClassId.join(','), // 预约项目类别多选已逗号分隔
        ifdFendianId: this.dragObj.formData.store, // 门店编号
        ChoiceDateTime: this.dragObj.formData.pickDate,
        cfdSex: itemData.cfdSex, // 性别
        dfdStartTime: this.dragObj.formData.pickDate + ' ' + itemData.dfdStartTime,
        dfdEndTime: this.dragObj.formData.pickDate + ' ' + itemData.dfdEndTime
      }
      // log(data)
      // return
      // let index1 = 0
      this.getRoomEmp(data, index1) // 传查接口
    },
    // 修改时，查到的数据转成表单格式
    editDataConver(backData){
      let newArr = []
      this.orderCustData.forEach(item1 => {
        let obj = {}
        let flag = true
        backData[0].ItemClassList.forEach((item2, index2) => {
          if (flag) {
            if (item1.ifdId+'' === item2.ifdId+''){
              item2.cfdItemClassId = item2.cfdItemClassId.split(',').map(Number) // 字符串转数字数组
              item2.dfdStartTime = moment(item2.dfdStartTime).format('HH:mm') // 只要时分
              item2.dfdEndTime = moment(item2.dfdEndTime).format('HH:mm') // 只要时分
              obj = item2
              // log(index2)
              this.bookingToDown(obj)
              // log(obj)
              flag = false
            } else {
              obj = {
                cfdItemClassId: [],
                cfdItemClassIdName: [],
                cfdEmployeeIdA: '',
                cfdEmployeeIdAName: '',
                cfdEmployeeIdB: "",
                cfdEmployeeIdBName: "",
                cfdSex: "",
                ifdRoomId: '',
                cfdRoomName: "",
                ifdBerthId: '', // 床位
                cfdBerthName: "", // 床位名称
                IsNeedRoom: 1, // 是否需要床位
                ifdUseMinutes: 0, // 预计时长
                OrderNo: 0,
                dfdStartTime: '8:00',
                dfdEndTime: '',
                cfdItem: "",
                cfdRemark: ""
              }
            }
          }
        })
        newArr.push(obj)
      })
      // log(newArr)
      backData[0].ItemClassList = newArr
      this.editableTabs3 = backData
    },
    getEditData(id){
      if (!id) {return}
      this.$axios
        .post(this.GLOBAL.baseURL + "AppointMent/QueryAppointMent", {AptNo: id})
        .then(
          res => {
            if (Number(res.code) === this.GLOBAL.status) {
              this.editDataConver(res.data) // 查到的数据转成表单格式
            } else {
              this.$message.error(res.msg);
            }
          },
          res => {
            console.log(res);
          }
        );
    },
    // 
    initFormData(to = '+', num=1) {
      if (to === '-') {
        for (let i=0; i<num; i++) {
          this.editableTabs3.splice(this.editableTabs3.length - 1, 1)
        }
        this.editableTabsValue3 = this.editableTabs3.length - 1 + '' // 最后一个高亮
      }

      if (to === '+') {
        let timeStart = this.dragObj.TDtime // 选区开始时间
        let endTime = getEndTime(timeStart, this.dragObj.TDnum) // 选区结束时间
        let selectIdRoom = Number(this.dragObj.TDdata.RoomId) || '' // 所选房间
        let selectNameRoom = Number(this.dragObj.TDdata.RoomName) || '' // 所选房间
        let selectIdBerth = Number(this.dragObj.TDdata.ifdBerthId) || '' // 所选床位
        let selectNameBerth = Number(this.dragObj.TDdata.BerthNo) || '' // 所选床位
        // 技师时：
        let peopleId = this.dragObj.TDdata.EmployeeId || '' // 所选技师ID
        let peopleName = this.dragObj.TDdata.EmployeeName || '' // 所选技师namd

        for (let i=0; i<num; i++) {
          // orderClassArr 必须长度同业务形态一样，项目
          let orderClassArr = []
          for (let i=0; i<this.orderCustData.length; i++) {
            orderClassArr.push({
              cfdItemClassId: [],
              cfdItemClassIdName: [],
              cfdEmployeeIdA: peopleId,
              cfdEmployeeIdAName: peopleName,
              // cfdEmployeeIdA: '000594',
              // cfdEmployeeIdAName: '',
              cfdEmployeeIdB: "",
              cfdEmployeeIdBName: "",
              cfdSex: "",
              // ifdRoomId: selectIdRoom,
              ifdRoomId: '',
              cfdRoomName: "",
              // ifdBerthId: selectIdBerth, // 床位
              ifdBerthId: '', // 床位
              cfdBerthName: "", // 床位名称
              IsNeedRoom: 1, // 是否需要床位
              ifdUseMinutes: 0, // 预计时长
              OrderNo: 0,
              dfdStartTime: timeStart,
              dfdEndTime: endTime,
              cfdItem: "",
              cfdRemark: "",
              ifdAllotType: '' // 是否点钟
            })
          }
          let itemData = {
            cfdSource: "电话",
            cfdName: "", // 宋小宝
            cfdTel: "", // 18899990000
            cfdAliasName: "",
            cfdSex: "", // 男
            cfdEmail: "",
            cfdWeixinOpenid: "",
            cfdUnionId: "",
            cfdMemberId: "",
            cfdRemark: "",
            OrderNo: 0,
            ItemClassList: orderClassArr
          }
          this.editableTabs3.push(itemData)
          // this.editableTabsValue3 = this.editableTabs3.length - 1 + '' // 最后一个高亮
          // this.editableTabsValue3 = this.editableTabs3.length - num + '' // 最后加的首个高亮
        }
        // log(this.editableTabs3)
        this.isRoomAuto(this.form.isAutoRoom)

        // 所选技师、房间放上
        this.orderCustData.forEach(item1 => {
          item1.downPeoples = [{
            EmployeeId: peopleId,
            EmployeeName: peopleName
          }]
          // item1.downRooms = [{
          //   RoomId: selectIdRoom,
          //   RoomName: selectNameRoom,
          //   ifdBerthId: selectIdBerth,
          //   BerthNo: selectNameBerth
          // }]
        })
        // log(this.dragObj.TDdata)
      }
    }
  },
  components: {}
};
</script>

<style lang="less">
@import "./less.less";
</style>
