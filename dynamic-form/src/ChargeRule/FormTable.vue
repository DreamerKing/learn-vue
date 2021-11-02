<template>
  <el-form :model="specialform" :rules="specialrules" ref="specialform">
    <el-table :data="specialform.chargeList">
      <el-table-column prop="startTime" label="起始时段（分钟）">
        <template slot-scope="scope">
          <div v-if="!isShowTableInput">
            {{ scope.row.startTime }}
          </div>
          <el-form-item
            :prop="`chargeList.${scope.$index}.startTime`"
            :rules="selfRules.startEndTime"
          >
            <el-input
              v-model="scope.row.startTime"
              v-if="isShowTableInput"
              placeholder="请输入起始时段"
            ></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时段（分钟）">
        <template slot-scope="scope">
          <div v-if="!isShowTableInput">
            {{ scope.row.endTime }}
          </div>
          <el-form-item
            :prop="`chargeList.${scope.$index}.endTime`"
            :rules="selfRules.startEndTime"
          >
            <el-input
              v-model="scope.row.endTime"
              v-if="isShowTableInput"
              placeholder="请输入结束时段"
            ></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="chargeAmount" label="收费金额（元）">
        <template slot-scope="scope">
          <div v-if="!isShowTableInput">
            {{ scope.row.chargeAmount }}
          </div>
          <el-form-item
            :prop="`chargeList.${scope.$index}.chargeAmount`"
            :rules="specialrules.chargeAmount"
          >
            <el-input
              v-model="scope.row.chargeAmount"
              v-if="isShowTableInput"
              placeholder="请输入收费金额"
            ></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column
        prop="minSpanTime"
        width="160"
        label="最小计费单位（分钟）"
      >
        <template slot-scope="scope">
          <div v-if="!isShowTableInput">
            {{ scope.row.minSpanTime }}
          </div>
          <el-form-item
            :prop="`chargeList.${scope.$index}.minSpanTime`"
            :rules="specialrules.minSpanTime"
          >
            <el-input
              v-model="scope.row.minSpanTime"
              v-if="isShowTableInput"
              placeholder="请输入最小计费单位"
            ></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-form-item>
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="handleRemoveRow(scope.$index)"
              >删除
            </el-button>
          </el-form-item>
        </template>
      </el-table-column>
    </el-table>
    <el-form-item>
      <el-button
        style="margin-top: 10px"
        icon="el-icon-add"
        @click="handleAddRow"
        >添加</el-button
      >
      <!-- <el-button
        type="submit"
        style="margin-top: 10px"
        icon="el-icon-add"
        @click="handleSubmit"
        >确定</el-button 
      >-->
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    specialform: {
      type: Object,
      default: () => ({ chargeList: [] }),
    },
  },
  data() {
    return {
      selfRules: {
        startEndTime: [
          {
            validator: this.validateStartEndTime,
          },
        ],
      },
      specialrules: {
        startTime: [
          {
            required: true,
            message: "请输入起始时段（分钟）",
            trigger: "blur",
          },
        ],
        endTime: [
          {
            required: true,
            message: "请输入结束时段（分钟）",
            trigger: "blur",
          },
        ],
        chargeAmount: [
          {
            required: true,
            message: "请输入收费金额（元）",
            trigger: "blur",
          },
        ],
        minSpanTime: [
          {
            required: true,
            message: "请输入最小计费单位（分钟）",
            trigger: "blur",
          },
        ],
      },
      //是否显示表格中的输入框
      isShowTableInput: false,
    };
  },
  methods: {
    async validateSpecialForm() {
      this.$emit("clear"); // 清除父表单的校验结果
      const allField = this.specialform.chargeList
        .map((_, index) => {
          return [
            `chargeList.${index}.startTime`,
            `chargeList.${index}.endTime`,
            `chargeList.${index}.chargeAmount`,
            `chargeList.${index}.minSpanTime`,
          ];
        })
        .reduce((pre, cur) => pre.concat(cur));
      const valid = await new Promise((resolve) => {
        this.$refs.specialform.validateField(allField, (err) => {
          if (err) {
            resolve(false);
          }
          resolve(true);
        });
      });
      return valid;
    },
    validateStartEndTime(rule, value, callback) {
      console.log("kkdkdkd");
      let [_, index, prop] = rule.field.split(".");
      let nindex = Number(index);
      if (!/\d+/gi.test(value)) {
        return callback(new Error("请输入数字"));
      }
      const nvalue = Number(value);
      if (prop === "startTime") {
        if (nindex === 0) {
          // 校验第一行的起始时间
          if (nvalue === 0) {
            return callback();
          } else {
            return callback(new Error("起始时间应填0"));
          }
        }
        if (nvalue < this.specialform?.chargeList?.[nindex - 1]?.endTime) {
          // 校验第一行之外的起始时间
          return callback(
            new Error(`第${nindex + 1}行的起始时间应大于第${index}行的结束时间`)
          );
        }
        return callback();
      }

      if (prop === "endTime") {
        if (nvalue < this.specialform?.chargeList?.[nindex]?.startTime) {
          return callback(
            new Error(`第${nindex}行的结束时间应大于第${index}行的起始时间`)
          );
        } else {
          return callback();
        }
      }
    },
    /** 添加表单中的表格 */
    handleAddRow() {
      this.isShowTableInput = true;
      const newItem = {
        startTime: undefined,
        endTime: undefined,
        chargeAmount: undefined,
        minSpanTime: undefined,
      };
      this.$emit("add", newItem);
    },
    // async handleSubmit() {
    //   const valid = await this.validateSpecialForm();
    //   if (valid) {
    //     // this.isShowTableInput = false;
    //   }
    //   console.log(valid, "valid");
    // },
    //删除表单中的表格
    handleRemoveRow(index) {
      this.$emit("remove", index);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-table {
  .el-table__row {
    .cell {
      overflow: visible;
      padding-top: 4px;
      padding-bottom: 12px;
    }
  }
}
</style>