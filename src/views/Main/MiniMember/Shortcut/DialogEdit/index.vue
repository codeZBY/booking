<template>
  <el-dialog :title="isAdd ? '添加快捷方式' : '修改快捷方式'" :visible.sync="dialogFormVisible" :modal-append-to-body="false" top="5%" width="700px" @close="resetForm('ruleForm')">
    <div class="DialogOrder">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">

        <el-form-item label="快捷方式名称" prop="BtnCaption">
          <el-input class="formInputWidth" v-model="ruleForm.BtnCaption"></el-input>
        </el-form-item>

        <!-- <el-form-item label="URL" prop="URL">
          <el-input class="formInputWidth" v-model="ruleForm.URL"></el-input>
        </el-form-item> -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="缩略图" prop="cfdRemarks">
              <base64 v-model="ruleForm.mImageUrl" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="大图" prop="cfdRemarks">
              <base64 v-model="ruleForm.ImageUrl" />
            </el-form-item>
          </el-col>
        </el-row>
        <div style="height:33px;"></div>

      </el-form>

      <div slot="footer" class="text-center">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </div>

    </div>
  </el-dialog>
</template>

<script>
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
          BtnCaption: '',
          URL: '',
          ImageUrl: '',
          mImageUrl: ''
        },
        rules: {
          BtnCaption: [
            { required: true, message: '请输入快捷方式名称', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ]
        }
    }
  },
  created() {
  },
  methods: {
    toEdit(item){
      this.isAdd = false
      this.dialogFormVisible = true
      log(item)
      this.ruleForm.id = item.ifdId
      this.ruleForm.BtnCaption = item.BtnCaption
      this.ruleForm.URL = item.URL
      this.ruleForm.ImageUrl = item.ImageUrl
      this.ruleForm.mImageUrl = item.mImageUrl
    },
    toInsert(){
      this.isAdd = true
      this.dialogFormVisible = true
    },
    insertData(){
      let data = {
        // BtnCaption: this.ruleForm.BtnCaption,
        // ffdItemDis: this.ruleForm.ffdItemDis,
        // ifdType: this.ruleForm.ifdType,
        // ifdIfUse: this.ruleForm.ifdIfUse ? 1 : 0,
        // dfdStarDatetime: this.ruleForm.dfdStarDatetime,
        // dfdEndDatetime: this.ruleForm.dfdEndDatetime,
        // ImageUrl: '',
        // mImageUrl: '',
        // cfdRemarks: this.ruleForm.cfdRemarks,
        // OrderNo: this.ruleForm.OrderNo
      }
      // log(data)
      this.$axios
        .post(this.GLOBAL.baseURL + "Activity/PCAddActivity", data)
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
        ifdId: this.ruleForm.id,
        BtnCaption: this.ruleForm.BtnCaption,
        URL: this.ruleForm.URL || '',
        ImageUrl: checkPicUrl(this.ruleForm.ImageUrl),
        mImageUrl: checkPicUrl(this.ruleForm.mImageUrl)
      }
      log(data)
      this.$axios
        .post(this.GLOBAL.baseURL + "Activity/PCEditFastBtn", data)
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
      // this.isAdd = true
      // this.ruleForm = {
      //   id: 0,
      //   BtnCaption: '',
      //   URL: '',
      //   ImageUrl: '',
      //   mImageUrl: ''
      // }
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
