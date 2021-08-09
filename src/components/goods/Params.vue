<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" :closable="false" type="warning" show-icon></el-alert>
      <el-row class="prow">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedId"
            :options="cateList"
            :props="paramsProps"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="btnValid" @click="addpaClick">添加参数</el-button>
          <el-table border stripe :data="paramsTableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag @close="ptagclose(index,scope.row)" closable v-for="(item,index) in scope.row.attr_vals" :key="index">
                  {{item}}
                </el-tag>
                <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
              

            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="editClick(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteClick(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="btnValid" @click="addpaClick">添加属性</el-button>
          <el-table border stripe :data="paramsTableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag @close="ptagclose(index,scope.row)" closable v-for="(item,index) in scope.row.attr_vals" :key="index">
                  {{item}}
                </el-tag>
                <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="editClick(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteClick(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogAddVisible"
      width="50%"
      @close="dialogClose">
      <el-form ref="form" :model="addManyform" :rules="paramsRules" label-width="80px">
        <el-form-item prop="attr_name" :label="dialogTitle.substr(2,4)">
          <el-input v-model="addManyform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="addparams">确 定</el-button>
      </span>
</el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      :title="'编辑'+dialogTitle.substr(2,4)"
      :visible.sync="dialogeditVisible"
      width="50%"
      @close="editdialogClose">
      <el-form ref="editform" :model="editManyform" :rules="editRules" label-width="80px">
        <el-form-item prop="attr_name" :label="dialogTitle.substr(2,4)">
          <el-input v-model="editManyform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogeditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editparams">确 定</el-button>
      </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      cateList:[],
      paramsProps:{
        expandTrigger: 'hover',
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      selectedId:[],
      activeName:'many',
      paramsTableData:[],
      dialogAddVisible:false,
      addManyform:{
        attr_name:''
      },
      editManyform:{
        attr_name:''
      },
      paramsRules:{
        attr_name:[
          { required: true, message: '请填写内容', trigger: 'blur' }
        ]
      },
      editRules:{
        attr_name:[
          { required: true, message: '请填写内容', trigger: 'blur' }
        ]
      },
      dialogeditVisible:false,
      validForm:{},
    }
  },
  created(){
    this.getCateList()
  },
  computed:{
    btnValid(){
      if(this.selectedId.length!=3){
        return true
      }else{
        return false
      }
    },
    cateId(){
      if(this.selectedId.length==3)
      return this.selectedId[this.selectedId.length-1]
      else
      return null
    },
    dialogTitle(){
      if(this.activeName=='only')
      return '添加静态属性'
      else
      return '添加动态参数'
    }
  },
  methods:{
    getCateList(){
      this.$http.get('/categories').then(res=>{
        //console.log(res);
        this.cateList=res.data.data
      })
    },
    getParamsList(){
      this.$http.get('categories/'+this.cateId+'/attributes',{
        params:{
          sel:this.activeName
        }
      }).then(res=>{
        console.log(res.data.data);
        if(res.data.data){
        res.data.data.forEach(val=>{
          val.attr_vals=val.attr_vals==""?[]:val.attr_vals.split(' ')
          val.inputVisible=false
          val.inputValue=''
        })
        this.paramsTableData=res.data.data}
      })
    },
    handleChange(){
      if(this.selectedId.length!=3){
        this.$message.error('请选择三级分类')
        this.selectedId=[]
        this.paramsTableData=[]
        return 
      }
      this.getParamsList()
    },
    handleTabClick(){
      this.getParamsList()
      //console.log(this.activeName)
    },
    addpaClick(){
      this.dialogAddVisible=true
    },
    dialogClose(){
      this.$refs.form.resetFields()
    },
    addparams(){
      this.$refs.form.validate(valid=>{
        if(!valid) return this.$message.error('验证不通过')
        this.$http.post('categories/'+this.cateId+'/attributes',
        {
            attr_name:this.addManyform.attr_name,
            attr_sel:this.activeName,
        }).then(res=>{
          if(res.data.meta.status!=201) return this.$message.error('添加失败')
          this.$message.success('添加成功')
          this.getParamsList()
          this.dialogAddVisible=false
        })
      })
    },
    editClick(row){
      this.dialogeditVisible=true
      console.log(row);
      this.editManyform.attr_name=row.attr_name
      this.validForm=row
    },
    editdialogClose(){
      this.$refs.editform.resetFields()
    },
    editparams(){
      this.$refs.editform.validate(valid=>{
        if(!valid) return this.$message.error('验证不通过')
        this.$http.put(`categories/${this.cateId}/attributes/${this.validForm.attr_id}`,{
          attr_name:this.editManyform.attr_name,
          attr_sel:this.activeName
        }).then(res=>{
          if(res.data.meta.status!=200) return this.$message.error('修改失败')
          this.$message.success('修改成功')
          this.getParamsList()
          this.dialogeditVisible=false
        })
      })
    },
    deleteClick(row){
      this.$confirm('此操作将永久删除属性, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`categories/${this.cateId}/attributes/${row.attr_id}`).then(res=>{
            if(res.data.meta.status==200) this.$message.success('删除成功')
            this.getParamsList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    ptagclose(i,row){
      row.attr_vals.splice(i,1)
      this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      }).then(res=>{
        if(res.data.meta.status!=200) this.$message.error('删除错误')
        this.$message.success('删除成功')
      })
    },
    handleInputConfirm(row){
      row.attr_vals.push(row.inputValue)
      this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      }).then(res=>{
        if(res.data.meta.status!=200) this.$message.error('添加错误')
        this.$message.success('添加成功')
        row.inputVisible=false
      })
    },
    showInput(row){
      row.inputVisible=true
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    }
  }
}
</script>

<style type="text/css" scoped>
.prow{
  margin: 15px 0;
}
.prow .el-col span{
  margin-right: 10px;
}
.el-tag{
  margin-right: 10px;
}
.input-new-tag{
  width: 150px;
}
</style>
