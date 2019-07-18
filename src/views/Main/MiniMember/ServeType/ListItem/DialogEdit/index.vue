<template>
  <el-dialog :title="isAdd ? '添加项目信息' : '修改项目信息'" :visible.sync="dialogFormVisible" :modal-append-to-body="false" top="5%" width="800px" @close="resetForm('ruleForm')">
    <div class="DialogOrder">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">

        <el-row>
          <el-col :span="12">
            <el-form-item label="项目信息名称" prop="cfdItemName">
              <el-input class="formInputWidth" v-model="ruleForm.cfdItemName" placeholder="请输入" disabled=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="顺序号" prop="OrderNo" :required="true">
              <el-input-number class="formInputWidth" 
              v-model="ruleForm.OrderNo" 
              :min="0" :max="999" label="顺序号"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="工时" prop="ifdTimes" :required="true">
              <el-input-number class="formInputWidth" v-model="ruleForm.ifdTimes"
              :min="0" :max="999999" label="工时"></el-input-number> 
              &nbsp;分钟
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格" prop="ffdUnitPrice" :required="true">
              <el-input-number class="formInputWidth" v-model="ruleForm.ffdUnitPrice"
              :min="0" :max="999999" label="价格"></el-input-number> 
              &nbsp;元
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="小程序是否显示" prop="IsShow">
              <el-checkbox v-model="ruleForm.IsShow"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="大图" prop="ImageUrl1">
              <base64 v-model="ruleForm.ImageUrl1"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="ImageUrl2" label-width="58px">
              <base64 v-model="ruleForm.ImageUrl2"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="缩略图" prop="mImageUrl1">
              <base64 v-model="ruleForm.mImageUrl1"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="mImageUrl2" label-width="58px">
              <base64 v-model="ruleForm.mImageUrl2"/>
            </el-form-item>
          </el-col>
        </el-row>    
        
        <el-form-item label="简要说明" prop="ShortDesc">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 8}" v-model="ruleForm.ShortDesc" placeholder="简要说明"></el-input>
        </el-form-item>
        <el-form-item label="详细介绍" prop="cfdRemarks">
          <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 12}" v-model="ruleForm.cfdRemarks" placeholder="详细介绍"></el-input>
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
import base64 from "@/components/base64";
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
          cfdItemName: '',
          ffdUnitPrice: '',
          ifdTimes: '',
          ImageUrl1: '',
          ImageUrl2: '',
          mImageUrl1: '',
          mImageUrl2: '',
          cfdRemarks: '',
          ShortDesc: '',
          OrderNo: 0,
          IsShow: true,
        },
        rules: {
          cfdActivity: [
            { required: true, message: '请输入项目信息名称', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
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
      this.ruleForm.id = item.cfdItemId
      this.ruleForm.cfdItemName = item.cfdItemName
      this.ruleForm.ffdUnitPrice = item.ffdUnitPrice
      this.ruleForm.ifdTimes = item.ifdTimes

      this.ruleForm.ImageUrl1 = item.ImageUrl1
      this.ruleForm.ImageUrl2 = item.ImageUrl2
      this.ruleForm.mImageUrl1 = item.mImageUrl1
      this.ruleForm.mImageUrl2 = item.mImageUrl2
      
      this.ruleForm.cfdRemarks = item.cfdRemarks
      this.ruleForm.ShortDesc = item.ShortDesc

      this.ruleForm.OrderNo = item.OrderNo
      this.ruleForm.IsShow = !!item.IsShow
    },
    toInsert(){
      this.dialogFormVisible = true
    },
    insertData(){
      let data = {
        // cfdActivity: this.ruleForm.cfdActivity,
        // ffdItemDis: this.ruleForm.ffdItemDis,
        // ifdType: this.ruleForm.ifdType,
        // ifdIfUse: this.ruleForm.ifdIfUse ? 1 : 0,
        // dfdStarDatetime: this.ruleForm.dfdStarDatetime,
        // dfdEndDatetime: this.ruleForm.dfdEndDatetime,
        // ImageUrl1: '',
        // ImageUrl2: '',
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
        cfdItemId: this.ruleForm.id + '',
        cfdItemName: this.ruleForm.cfdItemName || '',
        ffdUnitPrice: this.ruleForm.ffdUnitPrice || '',

        ifdTimes: this.ruleForm.ifdTimes || '',
        ImageUrl1: checkPicUrl(this.ruleForm.ImageUrl1) || '',
        ImageUrl2: checkPicUrl(this.ruleForm.ImageUrl2) || '',
        mImageUrl1: checkPicUrl(this.ruleForm.mImageUrl1) || '',
        mImageUrl2: checkPicUrl(this.ruleForm.mImageUrl2) || '',
        cfdRemarks: this.ruleForm.cfdRemarks || '',
        ShortDesc: this.ruleForm.ShortDesc || '',
        OrderNo: this.ruleForm.OrderNo || 0,
        IsShow: this.ruleForm.IsShow ? 1 : 0
      }
      log(data)
      this.$axios
        .post(this.GLOBAL.baseURL + "Item/PCEditItem", data)
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
