<template>
<el-form :model="innerTableForm" ref="innerTableForm" :rules="innerRules">
  <el-table v-loading="loading" :data="innerTableForm.innerChargeList">
    <el-table-column prop="startTime" width="130" label="起始时段（分钟）">
      <template slot-scope="scope">
        <div v-if="!isShowTableInput">{{ scope.row.startTime }}</div>
        <el-form-item
          :prop="'innerChargeList.' + scope.$index + '.startTime'"
          :rules="innerRules.startTime"
        >
          <el-input
            v-model="scope.row.startTime"
            v-if="isShowTableInput"
            placeholder="请输入起始时段"
          ></el-input>
        </el-form-item>
      </template>
    </el-table-column>
    <el-table-column prop="endTime" width="130" label="结束时段（分钟）">
      <template slot-scope="scope">
        <div v-if="!isShowTableInput">{{ scope.row.endTime }}</div>
        <el-form-item
          :prop="'innerChargeList.' + scope.$index + '.endTime'"
          :rules="innerRules.endTime"
        >
          <el-input
            v-model="scope.row.endTime"
            v-if="isShowTableInput"
            placeholder="请输入结束时段"
          ></el-input>
        </el-form-item>
      </template>
    </el-table-column>
    <el-table-column prop="chargeAmount" width="120" label="收费金额（元）">
      <template slot-scope="scope">
        <div v-if="!isShowTableInput">{{ scope.row.chargeAmount }}</div>
        <el-form-item
          :prop="'innerChargeList.' + scope.$index + '.chargeAmount'"
          :rules="innerRules.chargeAmount"
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
      width="150"
      label="最小计费单位（分钟）"
    >
      <template slot-scope="scope">
        <div v-if="!isShowTableInput">{{ scope.row.minSpanTime }}</div>
        <el-form-item
          :prop="'innerChargeList.' + scope.$index + '.minSpanTime'"
          :rules="innerRules.minSpanTime"
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
        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click="handleFormDelete(scope.row.index)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</el-form>
</template>
<script>
export default {
  props: {
    innerChargeList: {
      default: [],
      type:Array
    },
    isShowTableInput: {
      default: false,
      type: Boolean
    },
  },
  watch: {
    "innerChargeList": function(val) {
      this.innerTableForm.innerChargeList = val;
      let index = this.innerTableForm.innerChargeList.length - 2;
      if( !this.validateField('innerTableForm', index) ) return;
    }
  },
  data() {
    return {
      loading:false,
      innerTableForm: {
        innerChargeList: [

        ],
      },
      innerRules: {
        startTime: [
          {required: true, message: '请输入起始时段（分钟）', trigger: 'blur' },
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
      }
    }
  },
  methods: {
    //对部分表单字段进行校验
    validateField(form,index){
      let result = true;
      for (let item of this.$refs[form].fields) {
        console.log(item.prop.split(".")[1],index,"item")
        if(item.prop.split(".")[1] == index){
          this.$refs[form].validateField(item.prop,(error)=>{
            console.log(item,error,"err")
            if(error!=""){
              result = false;
            }
          });
        }
        if(!result) break;
      }
      return result;
    },
  }
}
</script>

