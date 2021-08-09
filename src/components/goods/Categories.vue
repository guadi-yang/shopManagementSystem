<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addCate">商品分类</el-button>
      <tree-table :data="goodsTableData"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      show-index
      index-text="#"
      border
      :class="['mp']">
          <template slot="isValid" slot-scope="scope">
            <i style="color:lightgreen" v-if="!scope.row.cat_deleted" class="el-icon-success"></i>
            <i style="color:red" v-else class="el-icon-error"></i>
          </template>
          <template slot="isSort" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
          <template slot="opt" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editCateClick(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteCateClick(scope.row)">删除</el-button>
          </template>
      </tree-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 5, 10, 15]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
    title="添加分类"
    :visible.sync="addCateVisible"
    width="50%"
    @close="dialogClose">
      <el-form :rules="addCateRules" ref="addCateRef" :model="addForm" label-width="80px">
        <el-form-item prop="cat_name" label="分类名称">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentList"
            :props="cascaderProps"
            @change="handleChange"
            clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="addCateVisible = false">取 消</el-button>
      <el-button type="primary" @click="addCateadd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
    title="编辑分类"
    :visible.sync="editCateVisible"
    width="50%">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="editCateVisible = false">取 消</el-button>
      <el-button type="primary" @click="editCateRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      goodsTableData:[],
      total:0,
      columns:[
        {
          label:"分类名称",
          prop:"cat_name"
        },
        {
          label:"是否有效",
          type:"template",
          template:"isValid"
        },
        {
          label:"排序",
          type:"template",
          template:"isSort"
        },
        {
          label:"操作",
          type:"template",
          template:"opt"
        }
      ],
      addCateVisible:false,
      addForm:{
        cat_pid:0,
        cat_name:'',
        cat_level:0
      },
      addCateRules:{
        cat_name:[
          { required:'true', message: '请输入名称', trigger: 'blur' }
        ]
      },
      parentList:[],
      cascaderProps:{
        expandTrigger: 'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children',
        checkStrictly: true,
      },
      selectedKeys:[],
      editForm:{
        cat_id:'',
        cat_name:''
      },
      editCateVisible:false
    }
  },
  created(){
    this.getGoodsList()
  },
  methods:{
    getGoodsList(){
      this.$http.get('/categories',{
        params:this.queryInfo
      }).then(res=>{
        console.log(res);
        this.goodsTableData=res.data.data.result
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
    addCate(){
      this.getParentList()
      this.addCateVisible=true
    },
    getParentList(){
      this.$http.get('/categories',{
        params:{
          type:2
        }
      }).then(res=>{
        this.parentList=res.data.data
      })
    },
    handleChange(){
      console.log(this.selectedKeys);
      if(this.selectedKeys.length>0){
        this.addForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
        this.addForm.cat_level=this.selectedKeys.length
        return 
      }else{
        this.addForm.cat_pid=0
        this.addForm.cat_level=0
      }
      
    },
    addCateadd(){
      console.log(this.addForm);
      this.$refs.addCateRef.validate(valid=>{
        console.log(valid);
        if(!valid) return this.$message.error("添加失败")
        this.$http.post('/categories',this.addForm).then(res=>{
          if(res.data.meta.status==201) this.$message.success('添加成功')
          this.getGoodsList()
          this.addCateVisible=false

        })
      })
    },
    dialogClose(){
      this.$refs.addCateRef.resetFields()
      this.selectedKeys=[]
      this.addForm.cat_pid=0
      this.addForm.cat_level=0
    },
    editCateClick(row){
      this.editCateVisible=true
      this.editForm.cat_id=row.cat_id
      this.editForm.cat_name=row.cat_name
      console.log(row);
    },
    editCateRight(){
      this.$http.put('categories/'+this.editForm.cat_id,{
        cat_name:this.editForm.cat_name
      }).then(res=>{
        if(res.data.meta.status!=200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.editCateVisible=false
        this.getGoodsList()
      })
    },
    deleteCateClick(row){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('categories/'+row.cat_id).then(res=>{
            if(res.data.meta.status!=200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getGoodsList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  }
}
</script>

<style type="text/css" scoped>
.mp{
  margin-top: 10px;
}
.el-cascader{
  width: 100%;
}
</style>
