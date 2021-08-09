<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
      :data="tableData"
      stripe
      border>
      <el-table-column type="index" label="#">
      </el-table-column>
      <el-table-column prop="authName" label="权限名称">
      </el-table-column>
      <el-table-column prop="path" label="路径">
      </el-table-column>
      <el-table-column prop="level" label="权限等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level == 0">一级权限</el-tag>
          <el-tag v-else-if="scope.row.level == 1" type='success'>二级权限</el-tag>
          <el-tag v-else type='warning'>三级权限</el-tag>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
  </div>
</template>

<script>
export default{
  data(){
    return {
      tableData:[]
    }
  },
  created(){
    this.getDataList()
  },
  methods:{
    getDataList(){
      this.$http.get('/rights/list').then(res=>{
        console.log(res)
        this.tableData=res.data.data
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>