<template>
  <el-dialog :title="isAdd ? '添加门店' : '修改门店信息'" :visible.sync="dialogFormVisible" :modal-append-to-body="false" top="5%"
    width="700px" @close="resetForm('ruleForm')">
    <div class="DialogOrder" v-if="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="titleType + '名称'" prop="cfdFendianName" :required="true">
              <el-input class="formInputWidth" v-model="ruleForm.cfdFendianName" placeholder="请输入门店名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="titleType + '电话'" prop="cfdTel" :required="true">
              <el-input class="formInputWidth" v-model="ruleForm.cfdTel" placeholder="请输入电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item :label="titleType + '地址'" prop="cfdAddress">
              <el-input type="textarea" v-model="ruleForm.cfdAddress" placeholder="请输入门店地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item :label="titleType + '开业日期'" prop="dfdDateTime" :required="true">
              <el-date-picker v-model="ruleForm.dfdDateTime" type="date" placeholder="门店开业日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="顺序号" prop="OrderNo" :required="true">
              <el-input-number class="formInputWidth" v-model="ruleForm.OrderNo" :min="0" :max="999" label="顺序号"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item :label="'营业开始时间'" prop="dfdOperateStartTime" :required="true">
              <el-time-select v-model="ruleForm.dfdOperateStartTime" :picker-options="{
                  start: '06:00',
                  step: '00:30',
                  end: '24:00'
                }"
                placeholder="开始时间">
              </el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="'营业结束时间'" prop="dfdOperateEndTime" :required="true">
              <el-time-select v-model="ruleForm.dfdOperateEndTime" :picker-options="{
                  start: '06:00',
                  step: '00:30',
                  end: '24:00',
                  minTime: ruleForm.dfdOperateStartTime
                }"
                placeholder="结束时间">
              </el-time-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item :label="titleType + '缩略图'" prop="mImageUrl1">
              <base64 v-model="ruleForm.mImageUrl1" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="mImageUrl2" label-width="50px">
              <base64 v-model="ruleForm.mImageUrl2" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="titleType + '大图'" prop="ImageUrl1">
              <base64 v-model="ruleForm.ImageUrl1" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="ImageUrl2" label-width="50px">
              <base64 v-model="ruleForm.ImageUrl2" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="titleType + '详细介绍'" prop="cfdSynopsis">
          <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 12}" v-model="ruleForm.cfdSynopsis" placeholder="门店详细介绍"></el-input>
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
import { formatTime, checkPicUrl } from "@/libs/utils.js";
import base64 from "@/components/base64";
export default {
  name: "DialogEdit",
  data() {
    return {
      // dialogFormVisible: true,
      dialogFormVisible: false,
      isAdd: true,
      titleType: "",
      ruleForm: {
        ifdType: 0,
        id: 0,

        cfdFendianName: "",
        cfdTel: "",
        cfdAddress: "",
        ImageUrl1: "",
        ImageUrl2: "",
        mImageUrl1: "",
        mImageUrl2: "",
        dfdDateTime: "",
        dfdOperateStartTime: "",
        dfdOperateEndTime: "",
        cfdSynopsis: "",
        OrderNo: "",

        // value3: ""
      },
      rules: {
        cfdEmployeeName: [
          { required: true, message: "请输入门店名字", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 30 个字符", trigger: "blur" }
        ]
        // dfdStarDatetime: [
        //   { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }
        // ],
        // dfdEndDatetime: [
        //   { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }
        // ]
      }
    };
  },
  created() {},
  methods: {
    toEdit(item) {
      this.isAdd = false;
      this.dialogFormVisible = true;
      log(item);
      log(formatTime("yyyy-MM-dd hh:mm:ss", item.dfdOperateStartTime))
      this.titleType = item.ifdType == 0 ? "公司" : "门店";

      this.ruleForm.ifdType = item.ifdType;
      this.ruleForm.id = item.ifdFendianId;
      this.ruleForm.cfdFendianName = item.cfdFendianName || "";
      this.ruleForm.cfdTel = item.cfdTel || "";
      this.ruleForm.cfdAddress = item.cfdAddress || "";
      this.ruleForm.cfdSynopsis = item.cfdSynopsis || "";
      this.ruleForm.ImageUrl1 = item.ImageUrl1 || "";
      this.ruleForm.ImageUrl2 = item.ImageUrl2 || "";
      this.ruleForm.mImageUrl1 = item.mImageUrl1 || "";
      this.ruleForm.mImageUrl2 = item.mImageUrl2 || "";
      this.ruleForm.dfdDateTime = item.dfdDateTime || "";
      this.ruleForm.dfdOperateStartTime = formatTime("hh:mm", item.dfdOperateStartTime);
      this.ruleForm.dfdOperateEndTime = formatTime("hh:mm", item.dfdOperateEndTime);
      this.ruleForm.OrderNo = item.OrderNo;
    },
    toInsert() {
      this.isAdd = true;
      this.dialogFormVisible = true;
    },
    insertData() {
      let data = {
        // cfdEmployeeName: this.ruleForm.cfdEmployeeName,
        // OrderNo: this.ruleForm.OrderNo,
        // IsShow: this.ruleForm.IsShow ? 1 : 0,
        // ifdFendianId: this.ruleForm.ifdFendianId,
        // cfdEmployeeId: this.ruleForm.cfdEmployeeId + "",
        // cfdRealName: this.ruleForm.cfdRealName,
        // ifdLevelID: this.ruleForm.ifdLevelID,
        // ImageUrl: "",
        // cfdSynopsis: this.ruleForm.cfdSynopsis
      };
      log(data);
      this.$axios
        .post(this.GLOBAL.baseURL + "Employee/PCAddEmployee", data)
        .then(res => {
          // console.log(res);
          if (Number(res.code) === 0) {
            this.$message.success("添加成功！");
            this.dialogFormVisible = false;
            this.$emit("success");
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    editData() {
      let data = {
        ifdFendianId: this.ruleForm.id,
        cfdFendianName: this.ruleForm.cfdFendianName,
        cfdTel: this.ruleForm.cfdTel,
        cfdAddress: this.ruleForm.cfdAddress,
        ImageUrl1: checkPicUrl(this.ruleForm.ImageUrl1),
        ImageUrl2: checkPicUrl(this.ruleForm.ImageUrl2),
        mImageUrl1: checkPicUrl(this.ruleForm.mImageUrl1),
        mImageUrl2: checkPicUrl(this.ruleForm.mImageUrl2),
        dfdDateTime: this.ruleForm.dfdDateTime,
        dfdOperateStartTime: this.ruleForm.dfdOperateStartTime,
        dfdOperateEndTime: this.ruleForm.dfdOperateEndTime,
        cfdSynopsis: this.ruleForm.cfdSynopsis,
        OrderNo: this.ruleForm.OrderNo
      };
      // log(data);
      // log(this.ruleForm.value3)

      // return
      this.$axios
        .post(this.GLOBAL.baseURL + "FenDian/PCEditFendian", data)
        .then(res => {
          console.log(res);
          if (Number(res.code) === 0) {
            this.$message.success("修改成功！");
            this.dialogFormVisible = false;
            this.$emit("success");
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isAdd) {
            this.insertData();
          } else {
            this.editData();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      log(" close ii ");
      this.$refs[formName].resetFields();
      this.ruleForm.dfdOperateStartTime = ''
      this.ruleForm.dfdOperateEndTime = ''
      log(this.ruleForm)
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
