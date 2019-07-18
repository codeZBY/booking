<template>
  <el-dialog :title="isAdd ? '添加员工' : '修改员工信息'" :visible.sync="dialogFormVisible" :modal-append-to-body="false" top="5%" width="980px" @close="resetForm('ruleForm')">
    <div class="DialogOrder">
      <div class="box MXscroll">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" class="demo-ruleForm">

          <el-row>
            <el-col :span="8">
              <el-form-item label="员工编号" prop="cfdEmployeeId">
                <el-input class="formInputWidth" v-model="ruleForm.cfdEmployeeId" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="员工名字" prop="cfdEmployeeName">
                <el-input class="formInputWidth" v-model="ruleForm.cfdEmployeeName" placeholder="请输入员工名字" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="员工简称" prop="cfdRealName">
                <el-input class="formInputWidth" v-model="ruleForm.cfdRealName" placeholder="请输入员工简称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="职位" prop="cfdLevel">
                <el-input class="formInputWidth" v-model="ruleForm.cfdLevel" placeholder="职位" :disabled="!isAdd"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="门店" prop="cfdFendianName">
                <el-input class="formInputWidth" v-model="ruleForm.cfdFendianName" :disabled="!isAdd"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="顺序号" prop="OrderNo" :required="true">
                <el-input-number class="formInputWidth" v-model="ruleForm.OrderNo"
                :min="0" :max="999" label="顺序号"></el-input-number>
              </el-form-item>            
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="图片" prop="ImageUrl">
                <base64 v-model="ruleForm.ImageUrl" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="" prop="IsShow">
                <el-checkbox v-model="ruleForm.IsShow">小程序里是否作为优秀员工展示</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="" prop="IsShopShow">
                  <el-checkbox v-model="ruleForm.IsShopShow">门店展示时是否显示该员工</el-checkbox>
                </el-form-item>
            </el-col>
          </el-row>
          
        </el-form>

        <el-tabs v-model="activeName2" type="border-card" @tab-click="handleClick">
          <el-tab-pane label="员工作品" name="first">
            <Works ref="Works" :id="ruleForm.cfdEmployeeId" />
          </el-tab-pane>
          <el-tab-pane label="客户评价" name="second">
            <Evaluate ref="Evaluate" :id="ruleForm.cfdEmployeeId" />
          </el-tab-pane>
        </el-tabs>
      </div>

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
import Works from './Works'
import Evaluate from './Evaluate'
export default {
  name: "DialogEdit",
  data() {
    return{
        // dialogFormVisible: true,
        dialogFormVisible: false,
        isAdd: true,
        ruleForm: {
          cfdEmployeeId: '',
          ifdFendianId: '',
          cfdEmployeeName: '',
          cfdRealName: '',
          ifdLevelID: '',
          cfdSynopsis: '',
          ImageUrl: '',
          IsShow: true,
          IsShopShow: true,
          OrderNo: 0,
          cfdFendianName: '',
          cfdLevel: '',
        },
        rules: {
          cfdEmployeeName: [
            { required: true, message: '请输入员工名字', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 30 个字符', trigger: 'blur' }
          ],
          cfdRealName: [
            { required: true, message: '请输入员工简称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 30 个字符', trigger: 'blur' }
          ],
        },
        activeName2: 'first',
        // activeName2: 'second',
    }
  },
  created() {
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
      console.log(tab.index);
      if (tab.index == 0) {
        this.$refs.Works.getDataList()
      }
      if (tab.index == 1) {
        this.$refs.Evaluate.getDataList()
      }
    },
    toEdit(item){
      this.isAdd = false
      this.dialogFormVisible = true
      log(item)
      this.ruleForm.cfdEmployeeId = item.cfdEmployeeId
      this.ruleForm.ifdFenDianId = item.ifdFenDianId

      this.ruleForm.cfdEmployeeName = item.cfdEmployeeName
      this.ruleForm.cfdRealName = item.cfdRealName

      this.ruleForm.ifdLevelID = item.ifdLevelID
      this.ruleForm.cfdSynopsis = item.cfdSynopsis
      this.ruleForm.ImageUrl = item.ImageUrl
      this.ruleForm.IsShow = item.IsShow
      this.ruleForm.IsShopShow = item.IsShopShow
      this.ruleForm.OrderNo = item.OrderNo
      this.ruleForm.cfdLevel = item.cfdLevel
      this.ruleForm.cfdFendianName = item.cfdFendianName
      this.$nextTick(() => {
        this.$refs.Works.getDataList()
      })
    },
    toInsert(){
      this.isAdd = true
      this.dialogFormVisible = true
    },
    insertData(){
      let data = {

      }
      log(data)
      this.$axios
        .post(this.GLOBAL.baseURL + "Employee/PCAddEmployee", data)
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
        cfdEmployeeId: this.ruleForm.cfdEmployeeId,
        ifdFendianId: this.ruleForm.ifdFendianId,

        cfdEmployeeName: this.ruleForm.cfdEmployeeName,
        cfdRealName: this.ruleForm.cfdRealName,
        ifdLevelID: this.ruleForm.ifdLevelID,
        cfdSynopsis: this.ruleForm.cfdSynopsis || '',
        ImageUrl: checkPicUrl(this.ruleForm.ImageUrl),
        IsShow: this.ruleForm.IsShow ? 1 : 0,
        IsShopShow: this.ruleForm.IsShopShow ? 1 : 0,

        OrderNo: this.ruleForm.OrderNo || '',
        WorksList: [
          // {
          //   cfdWorksName: "abac123",
          //   cfdWorksSynopsis: "sample string 2dd",
          //   ImageUrl: "",
          //   cfdEmployeeId: this.ruleForm.cfdEmployeeId
          // }
        ]
      }
      log(data)
      this.$axios
        .post(this.GLOBAL.baseURL + "Employee/PCEditEmployee", data)
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

      this.ruleForm = {
          cfdEmployeeId: '',
          ifdFendianId: '',
          cfdEmployeeName: '',
          cfdRealName: '',
          ifdLevelID: '',
          cfdSynopsis: '',
          ImageUrl: '',
          IsShow: true,
          IsShopShow: true,
          OrderNo: 0,
          cfdFendianName: '',
          cfdLevel: '',
        }
      this.activeName2 = 'first'
    }
  },
  components: {
    base64,
    Works,
    Evaluate
  }
};
</script>

<style lang="less">
@import "./less.less";
</style>
