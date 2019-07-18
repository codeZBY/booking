<template>
  <div class="Activity">
    <div class="top">
      <!-- <el-button
        @click="$refs.DialogEdit.toInsert()"
        class="pull-right"
        type="primary"
        icon="el-icon-circle-plus-outline"
      >添加快捷方式</el-button> -->
      <el-input
        @keyup.enter.native="getActive()"
        v-model="searchValue"
        @clear="getActive()"
        placeholder="请输入关键字搜索"
        clearable
        style="width:220px;margin-right:10px;"
      ></el-input>
      <el-button @click="getActive()" type="primary" icon="el-icon-search">搜索</el-button>
    </div>

    <div>
      <el-table :data="bannerData" style="width: 100%">
        <el-table-column prop="date" label="序号" type="index" align="center"></el-table-column>
        <!-- <el-table-column prop="OrderNo" label="显示顺序" align="center"></el-table-column> -->
        <el-table-column prop="BtnCaption" label="快捷方式名称" align="center"></el-table-column>

        <el-table-column prop="dfdStarDatetime" label="图标" align="center">
          <template slot-scope="scope">
            <a :href="scope.row.mImageUrl" data-lightbox="picture" data-title="picture" class="listPicWrap"><img :src="scope.row.mImageUrl"></a>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="URL" label="跳转到URL" align="center"></el-table-column> -->

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
      searchValue: "",
      bannerData: []
    };
  },
  created() {
    this.getActive();
  },
  methods: {
    getActive() {
      this.$axios
        .post(this.GLOBAL.baseURL + "Activity/PCQueryFastBtnList", {
          Keyword: this.searchValue,
          IsShow: ""
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
    delItem(item) {
      log(item);
      // this.$confirm("确定删除这条数据吗?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
      //     this.$axios
      //       .get(this.GLOBAL.baseURL + "Activity/PCDelActivity", {
      //         params: { ifdActivityId: item.ifdActivityId }
      //       })
      //       .then(res => {
      //         // console.log(res);
      //         if (Number(res.code) === 0) {
      //           this.getActive();
      //         } else {
      //           this.$message.error(res.msg);
      //         }
      //       });
      //   })
      //   .catch(() => {});
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
