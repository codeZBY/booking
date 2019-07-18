<template>
  <el-dialog title="预约详情" custom-class="dialogForm" :visible.sync="dialogFormVisible"
  :center="true" :modal-append-to-body="true" @close="dialogClose" width="555px">
    <ul class="DialogDetail">
      <li>
        <div>
          <span style="color:#AA942D;font-size:16px;">{{itemObj.cfdMemberName}}</span>
          <!-- <span>{{itemObj.cfdMoTel}}</span> -->
        </div>
        <table>
          <tr>
            <td>{{itemObj.cfdMoTel}}</td>
            <td>持卡：{{itemObj.CardNumber}} 张</td>
            <td>卡内余额：￥{{itemObj.ffdBalance}}</td>
            <td>本月到店：{{itemObj.BusNumber}}</td>
          </tr>
        </table>
      </li>
      <li>
        <div>诚信情况</div>
        <table>
          <tr>
            <td>如约：{{itemObj.OnTimeNumber}}</td>
            <td>迟到：{{itemObj.LaterNumber}}</td>
            <td>取消：{{itemObj.CannelNumber}}</td>
            <td>爽约：{{itemObj.MissNumber}}</td>
          </tr>
        </table>
      </li>
      <li>
        <div>预约信息</div>
        <table>
          <tr>
            <td>时间：{{itemObj.Menttime}}</td>
            <td>人数：{{itemObj.PeopleNumber}}人</td>
          </tr>
          <tr>
            <td>房间：{{itemObj.RoomName || '未指定'}}</td>
            <td>技师：{{itemObj.cfdEmployeeNameA}}</td>
          </tr>
          <tr>
            <td>预约来源：{{itemObj.cfdSource}}</td>
            <td>项目：{{itemObj.cfdItemClass}}</td>
          </tr>
          <tr>
            <td>备注：{{itemObj.cfdRemark && itemObj.cfdRemark !== '' ? itemObj.cfdRemark : '无'}}</td>
            <td></td>
          </tr>
        </table>
      </li>
    </ul>
  </el-dialog>
</template>

<script>
export default {
  name: "DialogDetail",
  data() {
    return {
      dialogFormVisible: false,
      itemObj: {}
    };
  },
  created() {
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    open(item) {
      // log(item)
      this.dialogFormVisible = true
      this.itemObj = item
      this.getData()
    },
    getData(){
      if (!this.itemObj.cfdMoTel || this.itemObj.cfdMoTel === '') {
        return
      }
      this.$axios.post(this.GLOBAL.baseURL + 'AppointMent/AppointMentMemberInfo', {cfdMoTel: this.itemObj.cfdMoTel}).then(
        res => {
          if (Number(res.code) === this.GLOBAL.status) {
            let backData = res.data[0]
            // log(backData)
            let all = Object.assign(this.itemObj, backData)
            this.itemObj = {}
            this.itemObj = all
          } else {
            this.$message.error(res.msg)
          }
        },res => {
          console.log(res);
        }
      );
    },
    dialogClose() {
      this.itemObj = {}
    }
  },
  components: {}
};
</script>

<style lang="less">
@import "./less.less";
</style>
