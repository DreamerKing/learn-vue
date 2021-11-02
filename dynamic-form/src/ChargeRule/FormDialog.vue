<template>
  <el-dialog
    :title="title"
    :visible.sync="open"
    width="860px"
    append-to-body
    :before-close="handleClose"
  >
    <el-form
      ref="innerForm"
      :model="innerForm"
      :rules="innerRules"
      label-width="100px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="日期类型" prop="dateType">
            <el-radio-group v-model="innerForm.dateType">
              <el-radio
                v-for="(item, index) in dateRadios"
                :key="index"
                :label="item.label"
                >{{ item.value }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆类型" prop="carType">
            <el-radio-group v-model="innerForm.carType">
              <el-radio
                v-for="(item, index) in carRadios"
                :key="index"
                :label="item.label"
                >{{ item.value }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收费类型" prop="chargeType">
            <el-radio-group v-model="innerForm.chargeType">
              <el-radio
                v-for="(item, index) in chargeRadios"
                :key="index"
                :label="item.label"
                >{{ item.value }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开始时间" prop="startTime">
            <el-time-picker
              style="width: 120px"
              v-model="innerForm.startTime"
              value-format="HH:mm:ss"
              :picker-options="{
                selectableRange: '18:30:00 - 20:30:00',
              }"
              placeholder="请选择开始时间"
            >
            </el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="结束时间" prop="endTime">
            <el-time-picker
              style="width: 120px"
              v-model="innerForm.endTime"
              value-format="HH:mm:ss"
              :picker-options="{
                selectableRange: '18:30:00 - 20:30:00',
              }"
              placeholder="请选择开始时间"
            >
            </el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="封顶金额" prop="maxAmount">
            <el-input
              v-model="innerForm.maxAmount"
              placeholder="请输入封顶金额"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="innerForm.chargeType == 2">
          <el-form-item label="固定金额" prop="fixedAmount">
            <el-input
              v-model="innerForm.fixedAmount"
              placeholder="请输入固定金额"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="innerForm.chargeType == 1">
          <el-form-item
            label="收费时段"
            prop="specialform"
            :show-message="false"
          >
            <!-- 内部表格 -->
            <form-table
              ref="formTable"
              :specialform="innerForm.specialform"
              v-if="open"
              @add="handleAdd"
              @remove="handleRemove"
              @clear="clearParentValidate"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import FormTable from "./FormTable";
export default {
  components: {
    FormTable,
  },
  data() {
    return {
      title: "",
      open: true,
      //计费模式列表
      innerForm: {
        dateType: 1,
        carType: 1,
        chargeType: 1,
        startTime: "2:30:00",
        endTime: "12:30:00",
        maxAmount: 1000,
        specialform: { chargeList: [] },
      },
      innerRules: {
        dateType: [
          { required: true, message: "请选择日期类型", trigger: "blur" },
        ],
        carType: [
          { required: true, message: "请选择车辆类型", trigger: "blur" },
        ],
        chargeType: [
          { required: true, message: "请选择收费类型", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "请输入起始时段", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "请输入结束时段", trigger: "blur" },
        ],
        maxAmount: [
          { required: true, message: "请输入封顶金额", trigger: "blur" },
        ],
        fixedAmount: [
          { required: true, message: "请输入固定金额", trigger: "blur" },
        ],
        specialform: [
          {
            required: false,
            validator: this.validateSpecialForm,
            trigger: "blur",
          },
        ],
      },
      //日期类型
      dateRadios: [
        {
          label: 1,
          value: "工作日",
        },
        {
          label: 2,
          value: "非工作日",
        },
      ],
      carRadios: [
        {
          label: 1,
          value: "大型车",
        },
        {
          label: 2,
          value: "小型车",
        },
        {
          label: 5,
          value: "公务车",
        },
      ],
      chargeRadios: [
        {
          label: 1,
          value: "按时间",
        },
        {
          label: 2,
          value: "按次",
        },
      ],
    };
  },
  methods: {
    validateSpecialForm(rule, value, callback) {
      this.$refs.formTable.$refs.specialform.validate((valid) => {
        if (valid) {
          callback();
        }
        callback(new Error("收费时段填写有误!"));
      });
    },
    handleAdd(item) {
      let index = this.innerForm.specialform.chargeList.length;
      this.innerForm.specialform.chargeList.splice(index, 0, item);
    },
    handleRemove(index) {
      this.innerForm.specialform.chargeList.splice(index, 1);
    },
    //关闭添加/编辑时段小叉
    handleClose() {
      this.open = false;
    },
    clearParentValidate() {
      this.$refs.innerForm.clearValidate();
    },
    //确定关闭添加、编辑时段事件
    submitForm() {
      this.$refs.innerForm.clearValidate("specialform");
      this.$refs.innerForm.validate((valid) => {
        console.log(valid, "valid");
      });

      /*  this.open = false;
      if (this.title == "添加收费标准") {
        this.chargeList.push({
          dateType: this.innerForm.dateType,
          carType: this.innerForm.carType,
          chargeType: this.innerForm.chargeType,
          startTime: this.innerForm.startTime,
          endTime: this.innerForm.endTime,
          fixedAmount: this.innerForm.fixedAmount,
          maxAmount: this.innerForm.maxAmount,
          ruleTypeInfoList: this.innerForm.innerChargeList,
        });
        this.form.ruleTypeList = this.chargeList;
        let index = this.chargeList.length;
        this.resetField("specialform", index);
      } */
    },
    //取消添加、关闭时段事件
    cancel() {
      this.open = false;
    },
  },
};
</script>
