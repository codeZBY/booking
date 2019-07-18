<template>
  <el-dialog
    :title="isAdd ? '添加美图' : '修改美图'"
    :visible.sync="dialogFormVisible"
    :modal-append-to-body="false"
    top="5%"
    width="800px"
    @close="resetForm('ruleForm')"
  >
    <div class="DialogOrder">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
        class="demo-ruleForm"
      >
        
        <el-row>
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
          <el-col :span="12">
            <el-form-item label="是否显示" prop="IsUse">
              <el-checkbox v-model="ruleForm.IsUse"></el-checkbox>
            </el-form-item> 
          </el-col>
        </el-row>
        
        <el-form-item label="图片" prop :required="true">
          <base64 v-model="ruleForm.ImageUrl"/>
        </el-form-item>

        <el-form-item label="备注" prop="AdvDesc" :required="true">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 12}"
            v-model="ruleForm.AdvDesc"
            placeholder="请输入备注"
          ></el-input>
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
        OrderNo: "",
        ImageUrl: "",
        AdvDesc: "",
        IsUse: true
      },
      rules: {
        cfdWorksName: [
          { required: true, message: "请输入推荐名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 30 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  methods: {
    toEdit(item) {
      this.isAdd = false;
      this.dialogFormVisible = true;
      log(item);
      this.ruleForm.id = item.ifdId;
      this.ruleForm.OrderNo = item.OrderNo
      this.ruleForm.ImageUrl = item.ImageUrl
      this.ruleForm.AdvDesc = item.AdvDesc
      this.ruleForm.IsUse = item.IsUse
    },
    toInsert() {
      this.isAdd = true;
      this.dialogFormVisible = true;
    },
    insertData() {
      let data = {
        OrderNo: this.ruleForm.OrderNo + '',
        ImageUrl: checkPicUrl(this.ruleForm.ImageUrl),
        AdvDesc: this.ruleForm.AdvDesc,
        IsUse: this.ruleForm.IsUse
      };
      // log(data);
      this.$axios
        .post(this.GLOBAL.baseURL + "Advertisement/PCAddAdvertise", data)
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
        ifdID: this.ruleForm.id,
      //   this.ruleForm.id = item.ifdID;
      // this.ruleForm.OrderNo = item.OrderNo
      // this.ruleForm.ImageUrl = item.ImageUrl
      // this.ruleForm.AdvDesc = item.AdvDesc
      // this.ruleForm.IsUse = item.IsUse

        // OrderNo: this.ruleForm.OrderNo,
        // IsRecommend: this.ruleForm.IsRecommend ? 1 : 0,
        // RecommendEndDate: this.ruleForm.RecommendEndDate || "",
        // ImageUrl: checkPicUrl(this.ruleForm.ImageUrl),
        // cfdWorksSynopsis: this.ruleForm.cfdWorksSynopsis,
        // OrderNo: this.ruleForm.OrderNo
      };
      log(data);
      this.$axios
        .post(this.GLOBAL.baseURL + "Employee/PCEditEmpWorks", data)
        .then(res => {
          // console.log(res);
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
