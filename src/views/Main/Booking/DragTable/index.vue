<template>
  <div class="DragTable">
    <div class="zoneWrap">

      <div id="leftBox">
        <div>
          <table>
            <tr>
              <th>
                <!-- {{formData.radio}} -->
              </th>
            </tr>
          </table>
        </div>
        <div id="leftDown" :style="tableHeight">
          <table id="left_tableBox">
            <tr v-for="(item,index) in tableLeftTimeNum" :key="index">
              <td :style="leftTDheight(index)">{{index+tableTimeStart}}<i>30</i></td>
            </tr>
          </table>
        </div>
      </div>

      <div id="rightBox" :style="tableRightWidth">
        <span class="sliderOpen trans" :class="sliderFull ? 'isFull' : ''" @click="sliderClick"><i :class="sliderFull ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i></span>
        <div id="rightTop">
          <table id="right_tableTop">
            <tr>
              <!-- 表头：房间维度 -->
              <template v-if="formData.radio == 0">
                <th v-for="(item,index) in shopSelectObj.RoomList" :key="index">
                  <div>{{item.RoomName || '/'}} </div>
                  <div style="font-size:12px;color:#eee;">{{item.BerthNo}}</div>
                </th>
              </template>
              <!-- 表头：技师维度 -->
              <template v-else>
                <th v-for="(item,index) in shopSelectObj.EmployeeList" :key="index">{{item.EmployeeName || '/'}}</th>
              </template>
            </tr>
          </table>
        </div>

        <div id="rightDown" class="MXscroll" :style="tableHeight">
          <table id="right_tableBox">
            <tr v-for="(item,index) in tableData" :key="index">
              <td v-for="(item2,index2) in item" :key="index2" 
               :style="{'height': tableRightTDheight+'px'}"
               @mousedown="TDmousedown($event,item2)"
               @click="TDclick(item2)"
               :class="item2.TDdisabled ? 'disabled' : ''"
              >
              <!-- {{index+1}} -- {{index2+1}} -- {{item2.TDtime}} -->
              <!-- {{item2.TDdisabled}} -->
                
                <draggable
                  v-model="item2.TDcustomer"
                  handle=".header"
                  group="people"
                  :disabled="item2.TDdisabled"
                  @change="datadragEnd"
                >
                  <transition-group tag="div">
                    <div class="customer" :class="stateReturn(item3)" @click.stop @mousedown.stop v-for="(item3,index3) in item2.TDcustomer" :key="index3" :style="{'height':item3.TDline * (tableRightTDheight + 3) + 'px'}">
                        <div class="header">
                          <span>{{item3.cfdMemberName}}</span>
                        </div>
                        <div class="custBody MXscroll" @click="$refs.DialogDetail.open(item3)">
                          电话：{{item3.cfdMoTel}}<br>
                          项目：{{item3.cfdItemClass}}<br>
                          技师：{{item3.cfdEmployeeNameA}}<br>
                          时间：{{item3.Menttime.split(' ')[1]}}<br>
                          房间：{{item3.RoomName}}<br>
                          床位：{{item3.BerthNo}}<br>
                          <template v-if="item3.ifdState === 7">
                            支付方式：{{item3.cfdPayMethod}}<br>
                            支付金额：{{item3.BusAmont}}<br>
                          </template>
                          备注： {{item3.cfdRemark || '暂无'}}
                        </div>
                        <div class="operaBtns" 
                        v-if="item3.ifdState === 0 || item3.ifdState === 1 || item3.ifdState === 5 || item3.ifdState === 6">
                          <div @click="$refs.DialogCancel.open(item3)">取消</div>
                          <div @click="openDialog(item2, item3)">修改</div>
                          <div v-if="item3.ifdState === 6" @click="orderSure(item3,'money')">开单</div>
                          <div v-else @click="orderSure(item3)" :class="item3.ifdState === 5 ? 'disabled': ''">确认</div>
                        </div>
                    </div>
                  </transition-group>
                </draggable>

              </td>
            </tr>

          </table>
        </div>
      </div>
    </div>

    <DialogOrder ref="DialogOrder" @change="$emit('updateAllData')" />
    <DialogDetail ref="DialogDetail" />
    <DialogCancel ref="DialogCancel" @change="$emit('updateAllData')" />
  </div>
</template>

<script>
import $ from "jquery";
import moment from 'moment'
import { getNumTime, getEndTime } from "@/libs/utils.js";
import DialogOrder from "../DialogOrder/index";
import DialogDetail from "../DialogDetail/index";
import DialogCancel from "../DialogCancel/index";
import draggable from 'vuedraggable'

export default {
  name: "DragTable",
  props: {
    formData: { // 所选参数
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      shopSelectObj: {}, // 当前门店
      tableTimeStart: 0, // 开始几点
      tableRightWidth: {},
      tableHeight: {},
      tableRightTDheight: 20,
      tableData: [], // 表格格子
      orderDataArr: [],
      sliderFull: false // 抽屉是否展开
    };
  },
  created() {},
  mounted() {
    //滚动
    $("#rightDown").on("scroll", function() {
      let top = $(this).scrollTop();
      let left = $(this).scrollLeft();
      $("#leftDown").scrollTop(top);
      $("#rightTop").scrollLeft(left);
    });
    this.tableSize(); // 自适应
    $(window).resize(() => {
      this.tableSize(); // 自适应
    });
  },
  computed: {
    tableLeftTimeNum: function() {
      let num = 1;
      let pickObj = this.shopSelectObj
      log(pickObj)
      if (pickObj.EndTime && pickObj.EndTime!=='') {
        let endArr = pickObj.EndTime.split(':')
        let end = Number(endArr[1])>0 ? Number(endArr[0]) + 1 : endArr[0]
        end = Number(end) === 0 ? 24 : Number(end)
        let start = pickObj.StartTime.split(':')[0]
        this.tableTimeStart = Number(start)
        num = end - Number(start)
      }
      return num;
    }
  },
  methods: {
    leftTDheight(index){
      let height = this.tableRightTDheight*6+15
      if (index === this.tableLeftTimeNum - 1) {
        height += 10
      }
      return {
        height: height+'px'
      }
    },
    sliderClick(){
      this.sliderFull = !this.sliderFull
      this.tableSize(); // 自适应
      this.$emit('sliderChange')
    },
    stateReturn(itemData) {
      let style = ''
      switch(itemData.ifdState) {
        case 0:
          style = 'A' // 紫棕色，待确认
          break;
        case 1:
          style = 'B' // 黄色，前台已确认
          break;
        case 6:
          style = 'C' // 青色，已到店
          break;
        case 3:
        case 7:
          style = 'D' // 灰色，已开单，已付款
          break;
        case 5:
          style = 'E' // 红色，迟到
          break;
        default:
      }
      return 'status' + style
    },
    goPayPage(itemData){
      // var host = null;
      // if (parent !== window) { 
      //     try {
      //       host = parent.location.host; 
      //     }catch (e) { 
      //       host = document.referrer; 
      //     } 
      // }
      // log(host)
      // window.location.href = host + "/business/businessEnter/business.aspx?AptNo=" + itemData.AptNo;  
      // window.location.href = "http://sanggecs.feicuisoft.com/business/businessEnter/business.aspx?AptNo=" + itemData.AptNo;  
      window.location.href = "http://sangge.feicuisoft.com/business/businessEnter/business.aspx?AptNo=" + itemData.AptNo;  
    },
    // 确认到店？
    orderSure(itemData, todo){
      let code = itemData.ifdState
      // log(code)
      let msg = ''
      let state = 0
      if (code === 0) {
        msg = '是否将此订单改为已确认？'
        state = 1
      }
      if (code === 1) {
        msg = '确认已到店？'
        state = 6
      }
      if (todo === 'money') {
        msg = '是否去开单？'
        // state = 3
      }
      if (msg === '') {
        return
      }
      
      this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          if (todo === 'money') {
            this.goPayPage(itemData)                
            return
          }
          
          let data = {
            AptNo: itemData.AptNo,
            ifdState: state,
            cfdCheckUser: 'admin'
          }
          this.$axios.post(this.GLOBAL.baseURL + 'AppointMent/CheckPCReserve', data).then(
            res => {
              if (Number(res.code) === this.GLOBAL.status) {
                this.$message.success('确认成功！')
              } else {
                this.$message.error(res.msg)
              }
              this.$emit('updateAllData')
            },res => {
              console.log(res);
            }
          );
          
        }).catch(() => {});
    },
    dragUpdate(itemData){
      // log(itemData)
      let dataObj = itemData.TDcustomer[0]

      let start = moment(dataObj.dfdStartTime).format('HH:mm')
      let end = moment(dataObj.dfdEndTime).format('HH:mm')
      let startNew = itemData.TDtime
      let endNew = getEndTime(startNew, getNumTime(start,end))

      let pickDate = this.formData.pickDate

      dataObj.ChoiceDateTime = pickDate
      dataObj.ifdFendianId = this.formData.store
      dataObj.cfdEmployeeName = dataObj.cfdEmployeeNameA
      dataObj.cfdRoomName = ''
      dataObj.BerthNo = ''

      // 老时间换新时间
      dataObj.dfdStartTime = pickDate + ' ' + startNew
      dataObj.dfdEndTime = pickDate + ' ' + endNew
      // log(dataObj)
      if (this.formData.radio === 0){
        dataObj.ifdRoomId = itemData.TDdata.RoomId
        dataObj.ifdBerthId = itemData.TDdata.ifdBerthId
        dataObj.cfdRoomName = itemData.TDdata.RoomName
        dataObj.BerthNo = itemData.TDdata.BerthNo
      } else {
        dataObj.cfdEmployeeId = itemData.TDdata.EmployeeId
        dataObj.cfdEmployeeName = itemData.TDdata.EmployeeName
      }
      // log(dataObj)
      // return
      this.$axios.post(this.GLOBAL.baseURL + 'AppointMent/UpdateEmployeeTime', dataObj).then(
        res => {
          if (Number(res.code) === this.GLOBAL.status) {
            this.$message.success('修改成功！')
          } else {
            this.$message.error(res.msg)
          }
          this.$emit('updateAllData')
        },res => {
          console.log(res);
        }
      );

    },
    datadragEnd (evt) {
      // log(evt)
      try {
        if (!evt.added) {return}
        // log(evt.added)
        let itemObj = evt.added.element
        let newIndex = evt.added.newIndex
        let endObj = {}
        let flag = true
        this.tableData.forEach((item,index) => {
          item.forEach(item2 => {
            if (flag && item2.TDcustomer.length>0 && item2.TDcustomer[newIndex].AptNo && item2.TDcustomer[newIndex].AptNo == itemObj.AptNo){
              endObj = item2
              flag = false
            }
          })
        })
        // log(endObj)
        this.dragUpdate(endObj)
      } catch(e) {
        // log(e)
      }
    },
    tableSize() {
      let windowWidth = this.sliderFull ? 97 : 358
      this.tableRightWidth = {
        width: $(window).width() - windowWidth + 'px'
      };
      this.tableHeight = {
        height: $(window).height() - 151 + "px"
      };
    },
    TDclick(itemData) {
      
      itemData.TDnum = 1
      this.openDialog(itemData) // 调弹窗

      // log(' click TD ')
      log(itemData)
      // window.parent.childToParent();
      // window.parent.document.childToParent()
      // window.parent.document.getElementById("myEle").innerHTML = ' jj ';
      // window.location.href="http://feicui.manmanti.com/main/miniMember/?POS=1003&aaa=000";
    },
    // 调弹窗
    openDialog(itemData, custObj) {
      let _this = this
      itemData.formData = _this.formData
      
      itemData.SericeTypeIDs = _this.shopSelectObj.SericeTypeIDs
      itemData.StartTime = _this.shopSelectObj.StartTime
      itemData.EndTime = _this.shopSelectObj.EndTime
      itemData.FendianName = _this.shopSelectObj.FendianName
      // 是否新增 还是修改
      if (!custObj) {
        // 不可预约
        if (itemData.TDdisabled) {
          this.$message('此时间段不可预约！')
          return
        }
        _this.$refs.DialogOrder.addOrder(itemData); // 选完后，调弹窗
      } else {
        this.$refs.DialogOrder.editOrder(itemData, custObj); // 选完后，调弹窗
      }
    },
    TDmousedown(event, itemData) {
      // log(' ddd*** ')
      $(".grayColor").removeClass("grayColor");

      let _this = this;
      let _thisTD = $(event.target);
      var startLeft = event.clientX;
      var startTop = event.clientY;
      var thisL = _thisTD.offset().left;
      var thisW = _thisTD.innerWidth();
      $(document)
        .on("mousemove", function(e) {
          var moveLeft = e.clientX;
          var moveTop = e.clientY;
          // console.log("111");

          // 动态生成选择区域时占位的碰撞检测块
          _this.crashPlaceholder(
            moveLeft,
            moveTop,
            startLeft,
            startTop,
            thisL,
            thisW
          );
          // 元素碰撞检测
          _this.elementCrash(_thisTD);
          e.stopPropagation();
        })
        .on("mouseup", function(e) {
          $("#showDOM").remove();

          var num = $(".grayColor").length;
          if (num > 0) {
            itemData.TDnum = num
            _this.openDialog(itemData) // 选完后，调弹窗
            $(".grayColor").removeClass("grayColor");
            // console.log("j222");
          }
          $(document).unbind("mousemove");
          $(document).unbind("mouseup");
          e.stopPropagation();
        });
    },
    // 加载表格数据，N行N列
    initDataTable() {
      let newArr = []
      // log(this.formData)
      // log(this.shopSelectObj)
      let currentDate = moment(new Date()).format('YYYY-MM-DD')
      let currentTime = moment(new Date()).format('HH:mm')

      let startHour = Number(this.shopSelectObj.StartTime.split(':')[0]) - 1
      for (var j = 0; j<this.tableLeftTimeNum * 6; j++){

        let itemArr = []
        let tableHeaderArr = []

        // 维度条件 ********************
        let roomArr = this.shopSelectObj.RoomList
        let peopleArr = this.shopSelectObj.EmployeeList
        
        if (this.formData.radio+'' === '0' && roomArr && roomArr.length > 0) {
          tableHeaderArr = roomArr
        } else if (this.formData.radio+'' === '1' && peopleArr && peopleArr.length > 0) {
          tableHeaderArr = peopleArr
        }
        
        let fflag = true
        let isAdd = true
        let isNoDis = true
        tableHeaderArr.forEach(item2 => {

          let newton = j%6
          if (newton === 0 && isAdd) {
            startHour++
            isAdd = false
          }
          let HHour = String(startHour).length > 1 ? startHour : ('0'+startHour)
          let TDgetTime = HHour + ':' + newton + '0'
          let TDcustomer = []

          // 已预约的放上
          if (fflag && this.orderDataArr.length>0) {
            this.orderDataArr.forEach(item3 => {
              let region = item3.Menttime.split(' ')[1] // "2019-05-29 10:00-11:00" 取到时间区间
              let start = region.split('-')[0]
              let end = region.split('-')[1]

              function inCust(){ // 放入客户
                item3.TDline = getNumTime(start, end) || 2 // 开始到结束算几个10分
                TDcustomer.push(item3)
              }

              // 维度条件 ********************
              if (this.formData.radio+'' === '0') {
                if (TDgetTime == start) {
                  // if(item2.RoomId == item3.ifdRoomId){
                  //   log(' uuu ')
                  // }
                  if(item2.RoomId == item3.ifdRoomId && item2.ifdBerthId == item3.ifdBerthId) {
                    // log(' ppp ')
                    inCust()
                    // fflag = false
                  } else if (!item3.ifdRoomId && !item3.ifdBerthId && !item2.RoomId) {  // 处理未指定房间，
                    // log(' ppp ')
                    inCust()
                    // fflag = false
                  }
                }
              } else if (this.formData.radio+'' === '1') {
                if (TDgetTime == start) {
                  if (item2.EmployeeId == item3.cfdEmployeeId) {
                    // log(' uuu ')
                    inCust()
                    // fflag = false
                  } else if (!item3.cfdEmployeeId && !item2.EmployeeId) {
                    // log(item3.cfdEmployeeId)
                    // log(item2.EmployeeId)
                    // log(item3.cfdEmployeeId)
                    inCust()
                    // fflag = false
                  }
                }
              }
              
            })
          }

          // 是否禁用(时间段/维度)
          let TDisDisabled = false
          if (this.formData.pickDate < currentDate) { // 昨天及之前时
            TDisDisabled = true
          } else {

            let _this = this
            function room2Emp() {
              // 房间维度
              if (_this.formData.radio+'' === '0') {
                // 占用
                if (item2.ifdState == 1) { 
                  TDisDisabled = true
                }
              }
              // 技师维度
              if (_this.formData.radio+'' === '1') {
                let time = TDgetTime + ':00'
                // 早班还是晚班，加没排班
                if (item2.EmployeeId !== '') {
                  if (!item2.OnDuty || !item2.OffDuty || time < item2.OnDuty || time >= item2.OffDuty) {
                    TDisDisabled = true
                  }
                }
                
                // 请假
                if (item2.AlCircumstancesList && item2.AlCircumstancesList.length>0) {
                  let empObj = item2.AlCircumstancesList[0]
                  if (time >= empObj.dfdStarDate && time < empObj.dfdEndDate) {
                    TDisDisabled = true
                  }
                }

                // 离职
                if (item2.ifdState === 0) {
                  TDisDisabled = true
                }

              }
            }

            if (this.formData.pickDate == currentDate) { // 今天时
                
              if (TDgetTime < currentTime) { // 今天已过
                // log(TDgetTime)
                // log(currentTime)
                TDisDisabled = true
              } else {
                room2Emp()
              }
            } else {
              room2Emp()
            }

          }

          // 按时间区间每格
          itemArr.push({
            TDcustomer: TDcustomer,
            TDtime: TDgetTime,
            TDdisabled: TDisDisabled,
            TDdata: item2
          })

        })
        newArr.push(itemArr)
      }
      
      this.tableData = newArr
      // console.log(newArr)
      // log(this.formData)
    },
    // father used
    initTable(shopData, orderData) {
      // log(' iii ')
      this.shopSelectObj = shopData
      this.orderDataArr = orderData

      this.initDataTable()  // 加载表格

      this.$nextTick(() => {
        this.$emit("loadingClose");
      });
    },
    crashPlaceholder(A, B, C, D, E, F) {
      // 开始的行列
      var a = 0;
      var b = B > D ? D : B;
      var c = 0;

      if (A > E) {
        a = A > C ? C : A;
      } else {
        a = E;
      }

      if (A - C > 0) {
        c = A - C > F - (C - E) ? F - (C - E) : A - C;
      } else {
        c = A > E ? Math.abs(A - C) : Math.abs(E - C);
      }

      $("#showDOM").remove();
      $("body").append('<div id="showDOM"></div>');
      $("#showDOM").css({
        position: "fixed",
        width: c,
        height: Math.abs(B - D),
        left: a,
        top: b,
        border: "1px dotted black"
      });
    },
    elementCrash(target) {
      // log(target)
      let targetIndex = target[0].cellIndex + 1;
      var el = $("#right_tableBox tr td:nth-child(" + targetIndex + ")").not(
        ".noSelect"
      );

      el.each(function() {
        $(this).removeClass("grayColor");
        // 碰撞检测
        var t1 = $(this).offset().top;
        var l1 = $(this).offset().left;
        var r1 = $(this).offset().left + $(this).innerWidth();
        var b1 = $(this).offset().top + $(this).innerHeight();

        var t2 = $("#showDOM").offset().top;
        var l2 = $("#showDOM").offset().left;
        var r2 = $("#showDOM").offset().left + $("#showDOM").innerWidth();
        var b2 = $("#showDOM").offset().top + $("#showDOM").innerHeight();

        if (b1 < t2 || l1 > r2 || t1 > b2 || r1 < l2) {
          $(this).removeClass("grayColor");
        } else {
          $(this).addClass("grayColor");
        }
      });
    },
  },
  components: {
    draggable,
    DialogOrder,
    DialogDetail,
    DialogCancel
  }
};
</script>

<style lang="less">
@import "./less.less";
</style>
