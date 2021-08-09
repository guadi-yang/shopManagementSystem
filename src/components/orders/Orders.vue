<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-input clearable placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-table border stripe :data="tableData" style="width: 100%">
        <el-table-column type="index">
        </el-table-column>
        <el-table-column width="200px" prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status==0" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_send=='否'" type="danger">未发货</el-tag>
            <el-tag v-else type="success">已发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | Sumtime}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230px">
           <el-button type="primary" size="medium" plain @click="modifyAddClick">修改地址</el-button>
            <el-button type="success" size="medium" plain @click="deliveryClick">物流进度</el-button>
        </el-table-column>
      </el-table>
       <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressClose">
      <el-form ref="addressRef" :model="addressForm" label-width="80px">
        <el-form-item  prop="address1" label="省市区/县">
          <el-cascader v-model="addressForm.address1" :options="addressData" :props="{ expandTrigger: 'hover' }"></el-cascader>
        </el-form-item>
        <el-form-item prop="address2" label="详细地址">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
       <span slot="footer" class="dialog-footer">
      <el-button @click="addressVisible = false">取 消</el-button>
      <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="deliveryVisible"
      width="50%">
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in deliveryData"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}></el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import addressData from './citydata'
import deliveryData from './delivery'
export default {
  filters:{
    Sumtime(time){
      let date=new Date(time)
      let y=date.getFullYear()
      let m=date.getMonth()+1
      m=m.toString().length==2?m:'0'+m
      let d=date.getDate()
      d=d.toString().length==2?d:'0'+d
      let h=date.getHours()
      h=h.toString().length==2?h:'0'+h
      let min=date.getMinutes()
      min=min.toString().length==2?min:'0'+min
      let s=date.getSeconds()
      s=s.toString().length==2?s:'0'+s
      return `${y}-${m}-${d} ${h}:${min}:${s}`
    }
  },
  data(){
    return {
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:5
      },
      tableData:[],
      total:0,
      addressVisible:false,
      addressForm:{
        address1:[],
        address2:'',
      },
      addressData,
      deliveryVisible:false,
      deliveryData:deliveryData.data
    }
  },
  created(){
    this.getOrdersList()
  },
  methods:{
    getOrdersList(){
      this.$http.get('/orders',{params:this.queryInfo}).then(res=>{
        //console.log(res);
        this.tableData=res.data.data.goods
        this.total=res.data.data.total
      })
    },
    handleSizeChange(size){
      this.queryInfo.pagesize=size
      this.getOrdersList()
    },
    handleCurrentChange(size){
      this.queryInfo.pagenum=size
      this.getOrdersList()
    },
    modifyAddClick(){
      this.addressVisible=true
    },
    addressClose(){
      this.$refs.addressRef.resetFields()
    },
    deliveryClick(){
      this.deliveryVisible=true
    }
  }
}
</script>

<style type="text/css" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
.el-input{
  width: 50%;
}
.el-cascader{
  width: 50%;
}
</style>
