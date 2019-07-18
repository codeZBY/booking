<template>
  <div class="Activity">
    <div class="top">
      <!-- <el-button
        @click="$refs.DialogEdit.toInsert()"
        class="pull-right"
        type="primary"
        icon="el-icon-circle-plus-outline"
      >添加美图</el-button> -->
      <!-- <el-input
        @keyup.enter.native="getActive()"
        v-model="searchValue"
        @clear="getActive()"
        placeholder="请输入关键字搜索"
        clearable
        style="width:220px;margin-right:10px;"
      ></el-input>
      <el-button @click="getActive()" type="primary" icon="el-icon-search">搜索</el-button> -->
      <el-checkbox v-model="isShowMP" @change="setButton()" style="margin-left:15px;">小程序是否启用预约功能</el-checkbox>
    </div>

    <div>
      <el-table :data="bannerData" style="width: 100%">
        <el-table-column prop="date" label="序号" type="index" align="center"></el-table-column>
        <el-table-column prop="ParamCaption" label="预约名称" align="center"></el-table-column>
         <el-table-column prop="img" label="图片" align="center">
           <template slot-scope="scope">
            <a :href="scope.row.ParamValue" data-lightbox="picture" data-title="picture" class="listPicWrap">
              <img :src="scope.row.ParamValue"></a>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="ParamValue" label="备注" align="center"></el-table-column> -->
<!--
        <el-table-column prop="IsUse" label="小程序是否显示" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.IsUse" @change="isShowItem(scope.row)"></el-checkbox>
          </template>
        </el-table-column> -->

        <el-table-column prop="name" label="操作" align="center">
          <template slot-scope="scope">
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
      isShowMP: false,
      bannerData: [
        // {
        //   img: 'http://file.chinaw.cc/jingdian_v2/order01.png',
        //   text: '优先选择技师'
        // },
        // {
        //   img: 'http://file.chinaw.cc/jingdian_v2/order02.png',
        //   text: '优先选择时间'
        // },
        // {
        //   img: 'http://file.chinaw.cc/jingdian_v2/order03.png',
        //   text: '一键待定'
        // }
      ]
    };
  },
  created() {
    this.getActive();
  },
  methods: {
    getActive() {
      this.$axios
        .get(this.GLOBAL.baseURL + "AppointMent/PCQueryAppointMentFirst", {
          Keyword: this.searchValue,
          IsShow: this.isShowMP ? true : ""
        })
        .then(res => {
          // console.log(res);
          if (Number(res.code) === 0) {
            let menu = res.data.filter(item => {
              return item.ParamID != "ShowAppointMent"
            })
            this.bannerData = menu;
            // 是否启用开关
            let buttonObj = res.data.filter(item => {
              return item.ParamID == "ShowAppointMent"
            })[0]
            // log(buttonObj)
            this.isShowMP = !!(Number(buttonObj.ParamValue) === 1)
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    setButton() {
      let isTrue = event.target.checked;
      // log(isTrue)
      this.$axios
        .post(this.GLOBAL.baseURL + "AppointMent/PCEditAppointMentByShow", {
          ParamID: 'ShowAppointMent',
          ParamValue: Number(isTrue) + ''
        })
        .then(res => {
          // console.log(res);
          if (Number(res.code) === 0) {
            this.$message.success(isTrue ? "已启用" : '已关闭');
            this.getActive();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    // 是否显示开关
    isShowItem(item) {
      let isTrue = event.target.checked;
      // log(item);
      // log(isTrue)
      // return
      this.$axios
        .post(this.GLOBAL.baseURL + "AppointMent/PCEditAppointMentByShow", {
          ifdId: item.ifdId,
          IsUse: isTrue
        })
        .then(res => {
          // console.log(res);
          if (Number(res.code) === 0) {
            this.$message.success("修改成功！");
            this.getActive();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    delItem(item) {
      log(item)
      this.$confirm("确定删除这条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .get(this.GLOBAL.baseURL + "Advertisement/PCDelAdvertise", {
              params: { ifdId: item.ifdId }
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
