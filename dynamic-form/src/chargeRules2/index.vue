<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="收费规则名称" prop="ruleName">
        <el-input
          v-model="queryParams.ruleName"
          placeholder="请输入收费规则名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="handleDelete"
          >批量删除</el-button
        >
      </el-col>
    </el-row>

    <div class="tips" v-if="isShow">
      <i class="el-message__icon el-icon-info"></i>已选择<span>{{
        this.term
      }}</span
      >项
    </div>

    <el-table
      v-loading="loading"
      :data="chargeRuleList"
      :span-method="objectSpanMethod"
      @selection-change="handleSelectionChange"
      :header-cell-style="handerMethod"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        prop="ruleName"
        width="150"
        label="收费策略"
      ></el-table-column>
      <el-table-column prop="freeTime" label="免费时长"></el-table-column>
      <el-table-column prop="date1" label="日期类型">
        <template slot-scope="scope">{{
          scope.row.date1 == 1 ? "工作日" : "非工作日"
        }}</template>
      </el-table-column>
      <el-table-column prop="type" label="车辆类型">
        <template slot-scope="scope">{{
          scope.row.type == 1 ? "小型车" : "大型车"
        }}</template>
      </el-table-column>
      <el-table-column label="收费标准">
        <el-table-column prop="rule"></el-table-column>
        <el-table-column prop="rule1">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.rule1" :key="index">
              {{ item.startTime }}-{{ item.startTime }}分钟，{{
                item.chargeAmount
              }}元/{{ item.startTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rule2">
          <template slot-scope="scope">
            <div>
              <div v-if="scope.row.rule2">{{ scope.row.rule2 }}元封顶</div>
              <div v-if="!scope.row.rule2">不封顶</div>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row.id)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { Pagination } from "element-ui";
// import { insideChargeList, insideChargeDelete } from "@/api/base/parkLotRule";
import test from "./test.json";
console.log(test, "test");
export default {
  name: "Berth",
  components: {
    Pagination,
  },
  data() {
    return {
      //是否显示提示信息
      isShow: false,
      // 遮罩层
      loading: false,
      // 收费规则表格数据
      chargeRuleList: [],
      rowIndex: "-1",
      orderIndexArr: [],
      hoverOrderArr: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isAsc: undefined,
        orderBy: undefined,
        orderByColumn: undefined,
        ruleName: undefined,
      },
      // 总条数
      total: 0,
      //选中表格数
      term: 0,
      ids: "", //选中表格id
      spanFiled: {
        // 要合并的列
        id: [],
        freeTime: [],
        ruleName: [],
        date1: [],
        type: [],
      },
      pos: 0,
    };
  },
  mounted() {
    this.getList();
    this.getOrderNumber();
  },
  methods: {
    handerMethod({ rowIndex }) {
      if (rowIndex == 1) {
        return { display: "none" };
      }
    },
    getSpanArr(data) {
      Object.keys(this.spanFiled).forEach((key) => {
        this.spanFiled[key] = [];
        this.pos = 0;
        data.forEach((item, index) => {
          console.log(this.spanFiled[key], key, item, index);
          //判断是否是第一项
          if (index === 0) {
            this.spanFiled[key].push(1);
            this.pos = 0;
          } else {
            //不是第一项时，就根据标识去存储
            if (data[index].id == data[index - 1].id) {
              if (key == "type") {
                if (data[index].date1 == data[index - 1].date1) {
                  if (data[index][key] == data[index - 1][key]) {
                    // 查找到符合条件的数据时每次要把之前存储的数据+1
                    this.spanFiled[key][this.pos] += 1;
                    this.spanFiled[key].push(0);
                  } else {
                    // 没有符合的数据时，要记住当前的index
                    this.spanFiled[key].push(1);
                    this.pos = index;
                  }
                } else {
                  this.spanFiled[key].push(1);
                  this.pos = index;
                }
              } else {
                if (data[index][key] == data[index - 1][key]) {
                  // 查找到符合条件的数据时每次要把之前存储的数据+1
                  this.spanFiled[key][this.pos] += 1;
                  this.spanFiled[key].push(0);
                } else {
                  // 没有符合的数据时，要记住当前的index
                  this.spanFiled[key].push(1);
                  this.pos = index;
                }
              }
            } else {
              this.spanFiled[key].push(1);
              this.pos = index;
            }
          }
        });
      });
    },
    // 获取相同编号的数组
    getOrderNumber() {
      const orderObj = {};
      this.chargeRuleList.forEach((item, index) => {
        item.rowIndex = index;
        if (orderObj[item.id]) {
          orderObj[item.id].push(index);
        } else {
          orderObj[item.id] = [];
          orderObj[item.id].push(index);
        }
      });
      // 将数组长度大于1的值 存储到this.orderIndexArr（也就是需要合并的项）
      Object.keys(orderObj).forEach((key) => {
        if (orderObj[key].length > 1) {
          this.orderIndexArr.push(orderObj[key]);
        }
      });
      this.getSpanArr(this.chargeRuleList);
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 8) {
        const _row = this.spanFiled.id[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }

      if (columnIndex == 1) {
        const _row = this.spanFiled.ruleName[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }

      if (columnIndex == 2) {
        const _row = this.spanFiled.freeTime[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }

      if (columnIndex == 3) {
        const _row = this.spanFiled.date1[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }

      if (columnIndex == 4) {
        const _row = this.spanFiled.type[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },

    /** 选择项发生变化时会触发该事件 */
    handleSelectionChange(e) {
      this.term = e.length;
      if (e.length) {
        this.isShow = true;
        let arr = [];
        e.forEach((item) => {
          arr.push(item.id);
        });
        this.ids = arr.join(",");
      } else {
        this.isShow = false;
      }
    },
    /** 查询停车场列表 */
    getList() {
      this.loading = true;
      // insideChargeList(this.queryParams).then(response => {
      test.data.records.forEach((item) => {
        for (const key in item.ruleTypeMap) {
          let date1 = key;
          for (const key1 in item.ruleTypeMap[key]) {
            let newArr = [...item.ruleTypeMap[key][key1]];
            // console.log(newArr,"newArr")
            newArr.forEach((i) => {
              i.chargeType = i.chargeType == 1 ? "按时" : "按次";
              this.chargeRuleList.push({
                id: item.id,
                ruleName: item.ruleName,
                freeTime: item.freeTime,
                date1: date1,
                type: i.carType,
                rule: `${i.startTime}-${i.endTime}(${i.chargeType})`,
                rule1: i.ruleTypeInfoList,
                rule2: i.maxAmount,
              });
            });
          }
        }
      });
      this.total = test.data.total;
      this.loading = false;
      // })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: "/inner_park_lot/edit_charge_rules",
      });
    },
    /** 编辑按钮操作 */
    handleUpdate(id) {
      this.$router.push({
        path: "/inner_park_lot/edit_charge_rules",
        query: {
          id,
        },
      });
    },

    /** 删除按钮操作 */
    handleDelete() {
      if (this.term) {
        this.$confirm("是否确认删除选中的数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.delselect();
          })
          .catch(() => {});
      } else {
        this.$message.info("请先选择要删除的行");
      }
    },
    //删除选中表格行
    delselect() {
      let args = {
        ruleIdList: JSON.stringify(this.ids),
      };
      /*  insideChargeDelete(args).then((response) => {
        this.getList();
        this.msgSuccess("删除成功");
      }); */
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  .tips {
    height: 36px;
    display: flex;
    align-items: center;
    background: #e8f4ff;
    // color: #1890ff;
    font-size: 12px;
    padding-left: 20px;
    margin-bottom: 10px;
    border-radius: 5px;
    span {
      color: #1890ff;
      margin: 0 5px;
    }
    i {
      font-size: 18px;
      color: #1890ff;
    }
  }
}
</style>