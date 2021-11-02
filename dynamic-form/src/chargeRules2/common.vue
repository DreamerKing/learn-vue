<template>
  <div class="app-container">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="130px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="收费规则名称" prop="ruleName">
            <el-input
              v-model="form.ruleName"
              placeholder="请输入收费规则名称"
              clearable
              size="small"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="免费时长" prop="freeTime">
            <el-input
              v-model="form.freeTime"
              placeholder="请输入免费时长"
              clearable
              size="small"
            >
            <template slot="append">分钟</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="免费时长是否收费" prop="freeTimeChargeFlag" label-width="140px">
            <el-radio-group v-model="form.freeTimeChargeFlag">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="计费循环模式" prop="dayChargeRuleTime">
            <el-select v-model="form.dayChargeRuleTime" placeholder="请选择计费循环模式">
              <el-option
                v-for="(item, index) in billModeOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <div class="tips-item">请选择计费循环模式。</div>
            <div class="tips-item">0点循环：车辆停入，不满24小时按0点重新计费。</div>
            <div class="tips-item">24小时循环：车辆停入，24小时后重新计费。</div>
          </el-form-item>
        </el-col>
      </el-row>
      <h3>收费标准</h3>
      <div class="basic">1、需要分别配置每种车辆类型工作日和非工作日的收费标准；</div>
      <div class="basic">2、没有配置的时段默认为免费；</div>
      <div class="basic">3、收费时段若跨00:00点，则请分为两段配置，如19:00-07:00，则请分别配置19:00-23:59和00:00-07:00”。</div>
      <!-- 外部表格 -->
      <el-table v-loading="loading" :data="chargeList">
        <el-table-column prop="dateType" label="日期类型">
          <template slot-scope="scope">{{ scope.row.dateType == 1 ? '工作日' : '非工作日'}}</template>
        </el-table-column>
        <el-table-column prop="carType" label="车辆类型">
          <template slot-scope="scope">{{ scope.row.carType == 1 ? '小型车' : (scope.row.carType == 2 ? '大型车' : '公务车')}}</template>
        </el-table-column>
        <el-table-column
          prop="startTime"
          label="开始时间"
        ></el-table-column>
        <el-table-column prop="endTime" label="结束时间"></el-table-column>
        <el-table-column prop="chargeType" label="计费规则">
          <template slot-scope="scope">{{ scope.row.chargeType == 1 ? '按时间' : '按次' }}</template>
        </el-table-column>
        <el-table-column prop="maxAmount" label="封顶金额"></el-table-column>
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
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row.index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-button
        style="margin-top:10px"
        icon="el-icon-plus"
        @click="handleAdd()"
        >添加</el-button>

      <el-form-item style="float: right; margin-top:30px">
        <el-button @click="save"
          >提交</el-button
        > 
        <el-button @click="handleCancel"
          >取消</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 添加时段模态框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      append-to-body
      :before-close="handleClose"
    >
      <el-form ref="innerForm" :model="innerForm" :rules="innerRules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="日期类型" prop="dateType">
              <el-radio-group v-model="innerForm.dateType">
                <el-radio v-for="(item, index) in dateRadios" :key="index" :label="item.label">{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆类型" prop="carType">
              <el-radio-group v-model="innerForm.carType">
                <el-radio v-for="(item, index) in carRadios" :key="index" :label="item.label">{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收费类型" prop="chargeType">
              <el-radio-group v-model="innerForm.chargeType">
                <el-radio v-for="(item, index) in chargeRadios" :key="index" :label="item.label">{{item.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> 
          <el-col :span="6">
            <el-form-item label="开始时间" prop="startTime">
              <el-time-picker
                style="width:100px"
                v-model="innerForm.startTime"
                value-format="HH:mm:ss"
                placeholder="请选择开始时间">
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结束时间" prop="endTime">
              <el-time-picker
                style="width:100px"
                v-model="innerForm.endTime"
                value-format="HH:mm:ss"
                placeholder="请选择开始时间">
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="封顶金额" prop="maxAmount">
              <el-input v-model="innerForm.maxAmount" placeholder="请输入封顶金额">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="innerForm.chargeType == 2">
            <el-form-item label="固定金额" prop="fixedAmount">
              <el-input v-model="innerForm.fixedAmount" placeholder="请输入固定金额">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="innerForm.chargeType == 1">
            <div class="charge-time" >
              <h5>收费时段：</h5>
              <!-- 内部表格 -->
              <div>
              <ChargeTable class="charge-innertable" :isShowTableInput="isShowTableInput" :innerChargeList="this.innerForm.innerChargeList"/>
              <el-button
                style="margin-top:10px"
                icon="el-icon-add"
                @click="handleFormAdd()"
                >添加</el-button
              >
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { insideChargeAdd, insideChargeDetail, insideChargeEdit } from "@/api/base/parkLotRule";
import ChargeTable from './components/chargeTable.vue'
export default {
  name: "MemberList",
  components: {
    ChargeTable
  },
  data() {
    return {
      //是否显示表格中的输入框
      isShowTableInput: false,
      title: "",
      open: false,
      // 遮罩层
      loading: false,
      //计费模式列表
      billModeOptions: [
        {
          label: "0点循环：车辆停入，不满24小时按0点重新计费",
          value: 1
        },
        {
          label: "24小时循环：车辆停入，24小时后重新计费",
          value: 2
        }
      ],
      form: {
        id: 0,
        ruleTypeList: []
      },
      rules: {
        ruleName: [
          { required: true, message: '请输入收费规则名称', trigger: 'blur' }
        ],
        freeTime: [
          { required: true, message: '请输入免费时长', trigger: 'blur' }
        ],
        freeTimeChargeFlag: [
          { required: true, message: '请选择免费时长是否收费', trigger: 'blur' }
        ],
        dayChargeRuleTime: [
          { required: true, message: '请选择计费循环模式', trigger: 'blur' },
        ],
      },
      innerForm:{
        innerChargeList: []
      },
      innerRules: {
        dateType: [
          { required: true, message: '请选择日期类型', trigger: 'blur' },
        ],
        carType: [
          { required: true, message: '请选择车辆类型', trigger: 'blur' },
        ],
        chargeType: [
          { required: true, message: '请选择收费类型', trigger: 'blur' },
        ],
        startTime: [
          { required: true, message: '请输入起始时段', trigger: 'blur' },
        ],
        endTime: [
          { required: true, message: '请输入结束时段', trigger: 'blur' },
        ],
        maxAmount:[
          { required: true, message: '请输入封顶金额', trigger: 'blur' },
        ],
        fixedAmount: [
          { required: true, message: '请输入固定金额', trigger: 'blur' },
        ],


         startTime: [
          { required: true, message: '请输入起始时段（分钟）', trigger: 'blur' },
        ],
        endTime: [
          { required: true, message: '请输入结束时段（分钟）', trigger: 'blur' },
        ],
        chargeAmount: [
          { required: true, message: '请输入收费金额（元）', trigger: 'blur' },
        ],
        minSpanTime: [
          { required: true, message: '请输入最小计费单位（分钟）', trigger: 'blur' },
        ],
      },
      //外部表格
      chargeList: [],
      //日期类型
      dateRadios: [{
        label: 1,
        value: '工作日'
      },
      {
        label: 2,
        value: '非工作日'
      }],
      carRadios: [
        {
          label: 1,
          value: '大型车'
        },
        {
          label: 2,
          value: '小型车'
        },
        {
          label: 5,
          value: '公务车'
        }
      ],
      chargeRadios: [
        {
          label: 1,
          value: '按时间',
        },
        {
          label: 2,
          value: '按次',
        }
      ]
    };
  },
  created() {
    if(this.$route.query.id > 0) {
      this.getInsideChargeDetail();
    }
  },
  methods: {
    //对部分表单字段进行校验
    validateField(form,index){
      let result = true;
        console.log(this.$refs[form],index,"pppppp")
      for (let item of this.$refs[form].fields) {
        console.log(item,"item")
        if(item.prop.split(".")[1] == index){
          this.$refs[form].validateField(item.prop,(error)=>{
            if(error!=""){
              result = false;
            }
          });
        }
        if(!result) break;
      }
      return result;
    },
    //对部分表单字段进行重置
    resetField(form,index){
      this.$refs[form].fields.forEach(item=>{
        if(item.prop.split(".")[1] == index){
          item.resetField();
        }
      })
    },
    /** 添加 */
    handleAdd() {
      this.open = true;
      this.title = '添加收费标准'
    },
    /** 添加表单中的表格 */
    handleFormAdd() {
      this.isShowTableInput = true;
      this.innerForm.innerChargeList.push({
        startTime: undefined,
        endTime: undefined,
        chargeAmount: undefined,
        minSpanTime: undefined
      });
    },
    /** 提交 */
    save() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          //编辑
          if (this.form.id > 0) {
            this.editParkRule();
          } else {
            //新增
            this.addParkRule();
          }
        }
      });
    },
    /** 新增 */
    addParkRule() {
      insideChargeAdd(this.form).then(res => {
        if(res.code == 200) {
          this.$message.success('新增成功');
          this.$router.push("/inner_park_lot");
        }
      })
    },
    /** 编辑 */
    editParkRule() {
      insideChargeEdit(this.form).then(res => {
        if(res.code == 200) {
          this.$message.success('编辑成功');
          this.$router.push("/inner_park_lot");
        }
      })
    },
    /** 获取详情 */
    getInsideChargeDetail() {
      let args = {
        id: this.$route.query.id
      }
      insideChargeDetail(args).then(res => {
        this.form = res.data;
      })
    },
    /** 取消 */
    handleCancel() {
      this.open = false;
    },
    //关闭添加/编辑时段小叉
    handleClose() {
      this.open = false;
    },
    //确定关闭添加、编辑时段事件
    submitForm() {
      this.open = false;
      if(this.title == '添加收费标准'){
        this.chargeList.push({
          dateType: this.innerForm.dateType,
          carType: this.innerForm.carType,
          chargeType:  this.innerForm.chargeType,
          startTime: this.innerForm.startTime,
          endTime: this.innerForm.endTime,
          fixedAmount: this.innerForm.fixedAmount,
          maxAmount: this.innerForm.maxAmount,
          ruleTypeInfoList: this.innerForm.innerChargeList
        })
        this.form.ruleTypeList = this.chargeList
        let index = this.chargeList.length;
        this.resetField('innerForm',index);
      }
    },
    //取消添加、关闭时段事件
    cancel() {
      this.open = false;
    },
    // 编辑
    handleEdit() {
      this.open = true;
      this.title = "编辑收费标准";
      this.$refs.innerForm.resetFields();
    },
    //删除
    handleDelete(i) {
      this.chargeList.splice(i, 1);
    },
    //删除表单中的表格
    handleFormDelete(i) {
      this.innerForm.innerChargeList.splice(i, 1);
    }
  }
};
</script>
<style lang="scss" scoped>
.charge-time {
  display: flex;
  flex-direction: row;
  padding: 0 30px;
  h5 {
    font-size: 14px;
    color: #606266;
  }
  .charge-innertable {
    width: 630px;
  }
}
.app-container {
  .add-btn {
    margin: 10px 0;
  }
  .teshu-fenge ::v-deep .el-form-item__content {
    margin-left: 20px !important;
  }
  .fenge-wrapper {
    display: flex;
    flex-direction: row;
    .fenge ::v-deep .el-form-item__content {
      margin-left: 20px !important;
    }
    .title {
      height: 36px;
      line-height: 36px;
      margin-right: -20px;
      margin-left: 20px;
      padding-right: 10px;
      font-size: 14px;
      color: #606266;
    }
  }
  .tips-item {
    line-height: 20px;
  }
  .basic {
    line-height: 30px;
    font-size: 14px;
  }
}
</style>
