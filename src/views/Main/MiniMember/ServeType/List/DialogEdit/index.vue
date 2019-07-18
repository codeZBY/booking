<template>
  <el-dialog :title="isAdd ? '添加项目类别' : '修改项目类别'" :visible.sync="dialogFormVisible" :modal-append-to-body="false" top="5%" width="700px" @close="resetForm('ruleForm')">
    <div class="DialogOrder">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">

        <el-row>
          <el-col :span="12">
            <el-form-item label="项目类别名称" prop="cfdItemClass">
              <el-input class="formInputWidth" v-model="ruleForm.cfdItemClass" placeholder="请输入项目名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="顺序号" prop="OrderNo" :required="true">
              <el-input-number
                class="formInputWidth"
                v-model="ruleForm.OrderNo"
                :min="0"
                :max="999"
                label="顺序号"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="时长" prop="NeedMinute" :required="true">
          <el-input-number class="formInputWidth" v-model="ruleForm.NeedMinute"
          :min="1" :max="999" label="时长"></el-input-number> &nbsp;分钟
        </el-form-item>

        <el-form-item label="图片" prop="cfdImgSrc" :required="true">
          <base64 v-model="ruleForm.cfdImgSrc"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="text-center">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </div>

    </div>
  </el-dialog>
</template>

<script>
// import {formatTime} from '@/libs/utils.js'
import base64 from '@/components/base64'
import { checkPicUrl } from '@/libs/utils.js'
export default {
  name: "DialogEdit",
  data() {
    return{
        // dialogFormVisible: true,
        dialogFormVisible: false,
        isAdd: true,
        ruleForm: {
          id: 0,
          NeedMinute: 30,
          cfdItemClass: '',
          cfdImgSrc: '',
          OrderNo: 0
        },
        rules: {
          cfdItemClass: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ]
        }
    }
  },
  created() {
  },
  methods: {
    pickPic(data){
      log(data)
      this.ruleForm.cfdImgSrc = data[0].substr(22, data[0].length - 22)
    },
    toEdit(item){
      this.isAdd = false
      this.dialogFormVisible = true
      log(item)
      this.ruleForm.id = item.ifdClassId
      this.ruleForm.cfdImgSrc = item.cfdImgSrc
      this.ruleForm.cfdItemClass = item.cfdItemClass

      this.ruleForm.NeedMinute = item.NeedMinute
      this.ruleForm.OrderNo = item.OrderNo
    },
    toInsert(){
      this.isAdd = true
      this.dialogFormVisible = true
    },
    insertData(){
      let data = {
        // cfdItemClass: this.ruleForm.cfdItemClass,
        // cfdImgSrc: this.ruleForm.cfdImgSrc,
        // NeedMinute: this.ruleForm.NeedMinute,
        // ifdSericeTypeID: 3,
        // OrderNo: this.ruleForm.OrderNo
      }
      log(data)
      this.$axios
        .post(this.GLOBAL.baseURL + "Item/PCAddItemClass", data)
        .then(res => {
          // console.log(res);
          if (Number(res.code) === 0) {
            this.$message.success('添加成功！');
             this.dialogFormVisible = false
             this.$emit('success')
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    editData(){
      let data = {
        ifdClassId: this.ruleForm.id,
        cfdItemClass: this.ruleForm.cfdItemClass,
        cfdImgSrc: checkPicUrl(this.ruleForm.cfdImgSrc),
        NeedMinute: this.ruleForm.NeedMinute,
        OrderNo: this.ruleForm.OrderNo
      }
      log(data)
      this.$axios
        .post(this.GLOBAL.baseURL + "Item/PCEditItemClass", data)
        .then(res => {
          console.log(res);
          if (Number(res.code) === 0) {
            this.$message.success('修改成功！');
             this.dialogFormVisible = false
             this.$emit('success')
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            this.insertData()
          } else {
            this.editData()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      log(' close ii ')
      this.$refs[formName].resetFields();
    }
  },
  components: {
    base64
  }
};
</script>

<style lang="less">
@import "./less.less";
</style>
