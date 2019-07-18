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
        <a :href="item2" data-lightbox="picture" data-title="picture" 
        v-for="(item2,index2) in item.ImageUrlList" :key="index2">
          <!-- <img :src="item2 + '?x-oss-process=image/resize,m_lfit,h_40,w_40'"> -->
          <img :src="item2.url">
        </a>
        <dl>
          <dd>名称：{{item.cfdWorksName}}</dd>
          <dd>标签：{{item.cfdLabelName}}</dd>
          <dd>会员：{{item.cfdMemberName}}</dd>
          <dd>备注：{{item.cfdWorksSynopsis}}</dd>
          <dd v-if="item.dfdCreateTime">时间：{{item.dfdCreateTime.split('T')[0]}}</dd>
        </dl>
      </div>

      <div class="edit" v-else>
        <!-- <base64 v-model="form.ImageUrl" style="margin:0 auto -5px;display:inline-block;"/> -->
        <upload v-model="form.ImageUrlList" />
        <!-- <OSSuploadImages v-model="form.ImageUrlList" ref="OSSuploadImagesEdit" /> -->
        <el-input v-model="form.cfdWorksName" size="mini" placeholder="请输入作品名称" style="margin-bottom:10px;"></el-input>
        <el-select size="mini" v-model="form.ifdWorksLabelID" placeholder="请选择标签" style="margin-bottom:10px;">
          <el-option
            v-for="item in worksTags"
            :key="item.ifdID"
            :label="item.cfdLabelName"
            :value="item.ifdID">
          </el-option>
        </el-select>

        <el-select
          v-model="form.cfdMemberId"
          size="mini"
          clearable
          filterable
          remote
          reserve-keyword
          placeholder="请输入会员"
          :remote-method="getMember"
          @focus="getMember"
          :loading="downLoading">
          <el-option
            v-for="(item,index) in options4"
            :key="index"
            :label="item.cfdMemberName"
            :value="item.cfdMemberId">
          </el-option>
        </el-select>

        <el-input type="textarea" size="mini" v-model="form.cfdWorksSynopsis" placeholder="请输入作品介绍"></el-input>
        <el-button size="mini" type="primary" round @click="editWork(item)">确定</el-button>
        <el-button size="mini" round @click="editIndex = -1">取消</el-button>
      </div>
    </li>

    <!-- 添加新作品 -->
    <li>
      <div class="edit" v-if="newFormIng">
        <upload v-model="newForm.ImageUrlList" />
        <!-- <OSSuploadImages v-model="newForm.ImageUrlList" ref="OSSuploadImagesAdd" /> -->
        <!-- <base64 v-model="newForm.ImageUrl" style="margin:0 auto -5px;display:inline-block;"/> -->
        <el-input v-model="newForm.cfdWorksName" size="mini" placeholder="请输入作品名称" style="margin-bottom:10px;"></el-input>
        <el-select size="mini" v-model="newForm.ifdWorksLabelID" placeholder="请选择标签" style="margin-bottom:10px;">
          <el-option
            v-for="item in worksTags"
            :key="item.ifdID"
            :label="item.cfdLabelName"
            :value="item.ifdID">
          </el-option>
        </el-select>

        <el-select
          v-model="newForm.cfdMemberId"
          size="mini"
          clearable
          filterable
          remote
          reserve-keyword
          placeholder="请输入会员"
          :remote-method="getMember"
          @focus="getMember"
          :loading="downLoading">
          <el-option
            v-for="(item,index) in options4"
            :key="index"
            :label="item.cfdMemberName"
            :value="item.cfdMemberId">
          </el-option>
        </el-select>

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
import upload from "@/components/OSSupload/upload";
// import OSSuploadImages from "@/components/OSSupload/images";
// import base64 from "@/components/base64";
import { checkPicUrl, isString } from "@/libs/utils.js";

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
        cfdWorksSynopsis: "",
        ImageUrlList: [],
        ifdWorksLabelID: '',
        cfdMemberId: ''
      },
      newFormIng: false,
      newForm: {
        ImageUrl: "",
        cfdWorksName: "",
        cfdWorksSynopsis: "",
        ImageUrlList: [],
        ifdWorksLabelID: '',
        cfdMemberId: ''
      },
      worksTags: [],

      options4: [],
      downLoading: false

    };
  },
  created() {
    // this.getDataList();
  },
  mounted() {
    this.getTags()    
  },
  methods: {
    getMember(text){
      text = isString(text) ? text : ''
      this.downLoading = true;
      this.$axios
        .post(this.GLOBAL.baseURL + "Member/PCQueryMemberList", {Keyword: text || ''})
        .then(res => {
          this.downLoading = false;
          if (Number(res.code) === 0) {
            this.options4 = res.data
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    getTags(){
      this.$axios
        .get(this.GLOBAL.baseURL + "Employee/QueryWorksLabelList", {})
        .then(res => {
          console.log(res);
          if (Number(res.code) === 0) {
            res.data.unshift({
              cfdLabelName: '请选择'
            })
            this.worksTags = res.data
            // this.$message.success("修改成功！");
            // this.editIndex = -1;
            // this.getDataList();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    editItem(item) {
      log(item);
      this.form = item;
      log(this.form);
    },
    editWork(item) {
      if (this.form.ImageUrlList.length === 0) {
        this.$message.warning("请选择作品图片！");
        return
      }
      // log(this.form.ImageUrlList)
      if (this.form.cfdWorksName === '') {
        this.$message.warning("请输入作品名称！");
        return
      }
      // log(item)
      let data = {
        ifdID: item.ifdID,
        cfdWorksName: this.form.cfdWorksName,
        cfdWorksSynopsis: this.form.cfdWorksSynopsis,
        ImageUrlList: this.form.ImageUrlList.map(item => {return item.url}),
        ifdWorksLabelID: this.form.ifdWorksLabelID || '',
        cfdMemberId: this.form.cfdMemberId
        // ImageUrl: checkPicUrl(this.form.ImageUrl)
      };
      console.log(data)
      // return
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
            let back = res.data
            back.forEach(item => {
              item.ImageUrlList = item.ImageUrlList.map(item2 => {
                return {url: item2}
              })
            })
            console.log(back)
            this.worksDataList = back;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    addWork() {
      // let arr = await this.$refs.OSSuploadImagesAdd.getData2()
      // if (!arr || arr.length === 0) {
      //   this.$message.warning("请选择作品图片！");
      //   return
      // }
      // log(this.newForm.ImageUrlList)
      if (this.newForm.ImageUrlList.length === 0) {
        this.$message.warning("请选择作品图片！");
        return
      }

      if (this.newForm.cfdWorksName === '') {
            this.$message.warning("请输入作品名称！");
            return
      }
      let data = {
        cfdWorksName: this.newForm.cfdWorksName,
        cfdWorksSynopsis: this.newForm.cfdWorksSynopsis,
        // ImageUrl: checkPicUrl(this.newForm.ImageUrl),
        // ImageUrlList: this.newForm.ImageUrlList,
        ImageUrlList: this.newForm.ImageUrlList.map(item => {return item.url}),
        cfdEmployeeId: this.id,
        ifdWorksLabelID: this.newForm.ifdWorksLabelID || '',
        cfdMemberId: this.newForm.cfdMemberId
      };
      log(data)
      // return
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
  components: { 
    // base64, OSSuploadImages, 
  upload },
  watch: {}
};
</script>

<style lang="less" scoped>
@import "./less.less";
</style>