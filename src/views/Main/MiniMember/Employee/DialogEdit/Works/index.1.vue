<template>
  <ul class="workWrap clearfix">
    <li v-for="(item,index) in worksDataList" :key="index">
      <div class="show" v-if="editIndex !== index">
        <div class="btns">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            @click="editItem(item); editIndex = index"
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="delItem(item);"></el-button>
        </div>
        <a :href="item.ImageUrl" data-lightbox="picture" data-title="picture"><img :src="item.ImageUrl"></a>
        <dl>
          <dt>{{item.cfdWorksName}}</dt>
          <dd>{{item.cfdWorksSynopsis}}</dd>
          <dd v-if="item.dfdCreateTime">{{item.dfdCreateTime.split('T')[0]}}</dd>
        </dl>
      </div>

      <div class="edit" v-else>
        <base64 v-model="form.ImageUrl" style="margin:0 auto -5px;display:inline-block;"/>
        <el-input v-model="form.cfdWorksName" size="mini" placeholder="请输入作品名称"></el-input>
        <el-input type="textarea" size="mini" v-model="form.cfdWorksSynopsis" placeholder="请输入作品介绍"></el-input>
        <el-button size="mini" type="primary" round @click="editWork(item)">确定</el-button>
        <el-button size="mini" round @click="editIndex = -1">取消</el-button>
      </div>
    </li>

    <!-- 添加新作品 -->
    <li>
      <div class="edit" v-if="newFormIng">
        <base64 v-model="newForm.ImageUrl" style="margin:0 auto -5px;display:inline-block;"/>
        <el-input v-model="newForm.cfdWorksName" size="mini" placeholder="请输入作品名称"></el-input>
        <el-input
          type="textarea"
          size="mini"
          v-model="newForm.cfdWorksSynopsis"
          placeholder="请输入作品简介"
        ></el-input>
        <el-button size="mini" type="primary" round @click="addWork()">确定</el-button>
        <el-button size="mini" round @click="newFormIng = false">取消</el-button>
      </div>
      <span v-else class="editBtn" @click="newFormIng = true">
        <i class="el-icon-circle-plus-outline"></i>
      </span>
    </li>
  </ul>
</template>

<script>
import base64 from "@/components/base64";
import { checkPicUrl } from "@/libs/utils.js";
export default {
  props: {
    id: ""
  },
  data() {
    return {
      worksDataList: [],
      editIndex: -1,
      form: {
        ImageUrl: "",
        cfdWorksName: "",
        cfdWorksSynopsis: ""
      },
      newFormIng: false,
      newForm: {
        ImageUrl: "",
        cfdWorksName: "",
        cfdWorksSynopsis: ""
      }
    };
  },
  created() {
    // this.getDataList();
  },
  mounted() {},
  methods: {
    editItem(item) {
      log(item);
      this.form = item;
      log(this.form);
    },
    editWork(item) {
      // log(item)
      let data = {
        ifdID: item.ifdID,
        cfdWorksName: this.form.cfdWorksName,
        cfdWorksSynopsis: this.form.cfdWorksSynopsis,
        ImageUrl: checkPicUrl(this.form.ImageUrl)
      };
      this.$axios
        .post(this.GLOBAL.baseURL + "Employee/PCEditEmpWorks", data)
        .then(res => {
          // console.log(res);
          if (Number(res.code) === 0) {
            this.$message.success("修改成功！");
            this.editIndex = -1;
            this.getDataList();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    delItem(item) {
      this.$confirm("确定删除这条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delWorkItem(item);
        })
        .catch(() => {});
    },
    delWorkItem(item) {
      this.$axios
        .get(this.GLOBAL.baseURL + "Employee/PCDelEmpWorks", {
          params: {
            ifdID: item.ifdID
          }
        })
        .then(res => {
          // console.log(res);
          if (Number(res.code) === 0) {
            this.$message.success("删除成功！");
            this.editIndex = -1;
            this.getDataList();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    getDataList() {
      this.$axios
        .get(this.GLOBAL.baseURL + "Employee/PCQueryEmpWorksList", {
          params: {
            cfdEmployeeId: this.id
          }
        })
        .then(res => {
          console.log(res);
          if (Number(res.code) === 0) {
            this.worksDataList = res.data;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    addWork() {
      // if (this.newForm.ImageUrl === '') {
      //       this.$message.warning("请选择作品图片！");
      //       return
      // }
      if (this.newForm.cfdWorksName === '') {
            this.$message.warning("请输入作品名称！");
            return
      }
      // if (this.newForm.cfdWorksSynopsis === '') {
      //       this.$message.warning("请输入作品简介！");
      //       return
      // }
      let data = {
        cfdWorksName: this.newForm.cfdWorksName,
        cfdWorksSynopsis: this.newForm.cfdWorksSynopsis,
        // ImageUrl: checkPicUrl(this.newForm.ImageUrl),
        ImageUrlList: ['aaa'],
        cfdEmployeeId: this.id
      };
      this.$axios
        .post(this.GLOBAL.baseURL + "Employee/PCAddEmpWorks", data)
        .then(res => {
          if (Number(res.code) === 0) {
            this.$message.success("添加成功！");
            this.getDataList();
            this.newFormIng = false
            this.newForm = {
              ImageUrl: "",
              cfdWorksName: "",
              cfdWorksSynopsis: ""
            }
          } else {
            this.$message.error(res.msg);
          }
        });
    }
  },
  components: { base64 },
  watch: {}
};
</script>

<style lang="less" scoped>
@import "./less.less";
</style>