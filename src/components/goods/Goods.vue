<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-input @clear="searchClear" clearable placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
      <el-button @click="searchClick" slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="primary" @click="addGoodsClick">添加商品</el-button>
      <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="goods_name" label="商品名称">
      </el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)">
      </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量">
      </el-table-column>
      <el-table-column prop="add_time" label="创建时间">
        <template slot-scope="scope">
          {{scope.row.add_time | Sumtime}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removeClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 3, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:5,
    },
      tableData:[],
      total:0
    }
  },
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
  created(){
    this.getGoodsList()
  },
  methods:{
    getGoodsList(){
      this.$http.get('/goods',{
        params:this.queryInfo
      }).then(res=>{
        console.log(res);
        this.tableData=res.data.data.goods
        this.total=res.data.data.total
      })
    },
    handleSizeChange(size){
      this.queryInfo.pagesize=size
      this.getGoodsList()
    },
    handleCurrentChange(size){
      this.queryInfo.pagenum=size
      this.getGoodsList()
    },
    searchClick(){
      this.getGoodsList()
    },
    searchClear(){
      this.getGoodsList()
    },
    removeClick(row){
      console.log(row);
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/goods/'+ row.goods_id ).then(res=>{
            if(res.data.meta.status!=200) return this.$message.error('删除错误')
            this.$message.success('删除成功')
            this.getGoodsList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    addGoodsClick(){
      this.$router.push('/goods/add')
    }
  },

}
</script>

<style type="text/css" scoped>
.input-with-select{
  width: 50%;
  margin-right: 20px;
}
</style>
