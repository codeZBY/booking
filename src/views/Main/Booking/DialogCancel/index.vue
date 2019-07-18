<template>
  <el-dialog title="取消订单" custom-class="dialogForm" :visible.sync="dialogFormVisible" :center="true" :modal-append-to-body="false" @close="dialogClose" width="333px">
    <div class="DialogCancel">
      <div class="text-center">是否确定取消 {{itemObj.cfdMemberName}} {{itemObj.Menttime}} 的订单？</div>
      <div style="font-weight:bold;">取消原因：</div>
      <el-checkbox-group v-model="checkVal" style="margin:5px 20px 15px;">
        <el-checkbox v-for="(item,index) in checkList" :key="index" :label="item"></el-checkbox>
      </el-checkbox-group>

      <div slot="footer" class="text-center" style="margin-top:15px;">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submit" :disabled="checkVal.length===0">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "DialogCancel",
  data() {
    return {
      dialogFormVisible: false,
      itemObj: {},
      checkVal: [],
      checkList: ['客人自主取消', '客人迟到', '客人到店取消', '其他']
    };
  },
  created() {
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    submit(){
      if(this.checkVal.length === 0) {
        this.$message('请选择取消原因！')
        return
      }
      log(this.checkVal)
      let data = {
        AptNo: this.itemObj.AptNo,
        cfdCannelReason: this.checkVal.join(','),
        cfdCannelUser: 'admin'
      }
      this.$axios.post(this.GLOBAL.baseURL + 'AppointMent/CancelPCReserve', data).then(
        res => {
          if (Number(res.code) === this.GLOBAL.status) {
            this.dialogFormVisible = false
            this.$message.success('取消成功')      
            this.$emit('change')      
            this.checkVal = []
          } else {
            this.$message.error(res.msg)
          }
        },res => {
          console.log(res);
        }
      );
    },
    open(item) {
      log(item)
      this.dialogFormVisible = true
      this.itemObj = item
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
