<template>
  <el-dialog
    :title="isAdd ? '添加活动' : '修改活动'"
    :visible.sync="dialogFormVisible"
    :modal-append-to-body="false"
    top="5%"
    width="700px"
    @close="resetForm('ruleForm')"
  >
    <div class="DialogOrder">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="90px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动名称" prop="cfdActivity">
              <el-input class="formInputWidth" v-model="ruleForm.cfdActivity" placeholder="请输入活动名称"></el-input>
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

        <el-form-item label="活动时间" prop="value3" :required="true">
          <el-date-picker
            v-model="ruleForm.value3"
            @change="timeZone"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="false"
          ></el-date-picker>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="活动主图" prop="ImageUrl1" :required="true">
              <base64 v-model="ruleForm.ImageUrl1"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动辅图" prop="ImageUrl2" :required="true">
              <base64 v-model="ruleForm.ImageUrl2"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="活动介绍" prop="cfdRemarks" :required="true">
          <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 20}" v-model="ruleForm.cfdRemarks" placeholder="请输入活动介绍"></el-input>
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
import { formatTime } from "@/libs/utils.js";
import base64 from "@/components/base64";
import { checkPicUrl } from "@/libs/utils.js";
export default {
  name: "DialogEdit",
  data() {
    return {
      // dialogFormVisible: true,
      dialogFormVisible: false,
      isAdd: true,
      ruleForm: {
        id: 0,
        value3: [],
        cfdActivity: "",
        ffdItemDis: 8,
        ifdType: 3,
        ifdIfUse: true,
        dfdStarDatetime: "",
        dfdEndDatetime: "",
        ImageUrl1: "",
        ImageUrl2: "",
        cfdRemarks: "",
        OrderNo: ""
      },
      rules: {
        cfdActivity: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" }
        ]
        // value3: [
        //   { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        // ],
        // dfdEndDatetime: [
        //   { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }
        // ]
      }
    };
  },
  created() {},
  methods: {
    timeZone(val) {
      log(val);
      log(this.ruleForm);
      if (val.length > 0) {
        this.ruleForm.dfdStarDatetime = formatTime("yyyy-MM-dd hh:mm:ss", val[0]);
        this.ruleForm.dfdEndDatetime = formatTime("yyyy-MM-dd hh:mm:ss", val[1]);
      }
      log(formatTime("yyyy-MM-dd hh:mm:ss", val[0]));
    },
    toEdit(item) {
      this.isAdd = false;
      this.dialogFormVisible = true;
      log(item);
      this.ruleForm.id = item.ifdActivityId;
      this.ruleForm.cfdActivity = item.cfdActivity;
      this.ruleForm.cfdRemarks = item.cfdRemarks;
      this.ruleForm.dfdStarDatetime = item.dfdStarDatetime;
      this.ruleForm.dfdEndDatetime = item.dfdEndDatetime;
      this.ruleForm.OrderNo = item.OrderNo;
      this.ruleForm.ImageUrl1 = item.ImageUrl1;
      this.ruleForm.ImageUrl2 = item.ImageUrl2;
      this.ruleForm.value3 = [item.dfdStarDatetime, item.dfdEndDatetime];
      // log(item.dfdStarDatetime)
      // log(formatTime('yyyy-MM-dd', new Date(item.dfdStarDatetime)))
      // log(this.ruleForm);
    },
    toInsert() {
      this.isAdd = true;
      this.dialogFormVisible = true;
    },
    insertData() {
      let data = {
        // cfdActivity: this.ruleForm.cfdActivity,
        // ffdItemDis: this.ruleForm.ffdItemDis,
        // ifdType: this.ruleForm.ifdType,
        // ifdIfUse: this.ruleForm.ifdIfUse ? 1 : 0,
        // dfdStarDatetime: this.ruleForm.dfdStarDatetime,
        // dfdEndDatetime: this.ruleForm.dfdEndDatetime,
        // ImageUrl1: checkPicUrl(this.ruleForm.ImageUrl1),
        // ImageUrl2: checkPicUrl(this.ruleForm.ImageUrl2),
        // cfdRemarks: this.ruleForm.cfdRemarks,
        // OrderNo: this.ruleForm.OrderNo
      };
      log(data);
      // return
      this.$axios
        .post(this.GLOBAL.baseURL + "Activity/PCAddActivity", data)
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
        ifdActivityId: this.ruleForm.id,
        cfdActivity: this.ruleForm.cfdActivity,
        dfdStarDatetime: this.ruleForm.dfdStarDatetime,
        dfdEndDatetime: this.ruleForm.dfdEndDatetime,
        ImageUrl1: checkPicUrl(this.ruleForm.ImageUrl1),
        ImageUrl2: checkPicUrl(this.ruleForm.ImageUrl2),
        cfdRemarks: this.ruleForm.cfdRemarks,
        OrderNo: this.ruleForm.OrderNo
      };
      log(data);
      this.$axios
        .post(this.GLOBAL.baseURL + "Activity/PCEditActivity", data)
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
      this.clear();
    },
    clear() {
      this.isAdd = true;
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
