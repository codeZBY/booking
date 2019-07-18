<template>
  <div class="Activity">
    <div class="top">
      <!-- <el-button
        @click="$refs.DialogEdit.toInsert()"
        class="pull-right"
        type="primary"
        icon="el-icon-circle-plus-outline"
      >添加活动</el-button> -->
      <el-input
        @keyup.enter.native="getActive()"
        v-model="searchValue"
        @clear="getActive()"
        placeholder="请输入关键字搜索"
        clearable
        style="width:220px;margin-right:10px;"
      ></el-input>
      <el-button @click="getActive()" type="primary" icon="el-icon-search">搜索</el-button>
      <el-checkbox v-model="isShowMP" @change="getActive()" style="margin-left:15px;">仅显示小程序</el-checkbox>
    </div>

    <div>
      <el-table :data="bannerData" class="widthFull">
        <el-table-column prop="date" label="序号" type="index" align="center"></el-table-column>
        <el-table-column prop="OrderNo" label="显示顺序" align="center"></el-table-column>
        <el-table-column prop="cfdActivity" label="活动名称">
          <template slot-scope="scope">
            <!-- <span class="text-link"  @click="$refs.DialogEdit.toEdit(scope.row)">{{scope.row.cfdActivity}}</span> -->
            <span>{{scope.row.cfdActivity}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dfdStarDatetime" label="开始时间" align="center">
          <template slot-scope="scope" v-if="scope.row.dfdStarDatetime">{{scope.row.dfdStarDatetime.split('T')[0]}}</template>
        </el-table-column>
        <el-table-column prop="dfdEndDatetime" label="结束时间" align="center">
          <template slot-scope="scope" v-if="scope.row.dfdEndDatetime">{{scope.row.dfdEndDatetime.split('T')[0]}}</template>
        </el-table-column>
        <el-table-column prop="name" label="小程序是否显示" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.IsShow" @change="isShowItem(scope.row)"></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="操作" align="center">
          <template slot-scope="scope">
            <!-- {{ scope.row.date }} -->
            <el-button type="text" @click="$refs.DialogEdit.toEdit(scope.row)">修改</el-button>
            <!-- <el-button type="text" @click="delItem(scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <DialogEdit ref="DialogEdit" @success="getActive()"/>
  </div>
</template>

<script>
import DialogEdit from "./DialogEdit";
export default {
  name: "home",
  data() {
    return {
      // isLoading: true,
      searchValue: "",
      isShowMP: false,
      bannerData: []
    };
  },
  created() {
    this.getActive();
  },
  methods: {
    getActive() {
      this.$axios
        .post(this.GLOBAL.baseURL + "Activity/PCActivityList", {
          Keyword: this.searchValue,
          IsShow: this.isShowMP ? true : ''
        })
        .then(res => {
          // console.log(res);
          if (Number(res.code) === 0) {
            this.bannerData = res.data;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    // 是否显示开关
    isShowItem(item) {
      let isTrue = event.target.checked
      log(item)
      // log(isTrue)
      // return
      this.$axios
        .post(this.GLOBAL.baseURL + "Activity/PCEditActivityByShow", {
          ifdActivityId: item.ifdActivityId,
          IsShow: isTrue
        })
        .then(res => {
          // console.log(res);
          if (Number(res.code) === 0) {
            this.$message.success('修改成功！'); 
            this.getActive();            
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    delItem(item) {
      // log(item)
      this.$confirm("确定删除这条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .get(this.GLOBAL.baseURL + "Activity/PCDelActivity", {
              params: { ifdActivityId: item.ifdActivityId }
            })
            .then(res => {
              // console.log(res);
              if (Number(res.code) === 0) {
                this.getActive();
              } else {
                this.$message.error(res.msg);
              }
            });
        })
        .catch(() => {});
    }
  },
  components: {
    DialogEdit
  }
};
</script>

<style lang="less">
@import "./less.less";
</style>
