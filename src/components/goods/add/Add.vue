<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <el-steps :space="200" :active="parseInt(activeIndex)" finish-status="success" align-center>
       <el-step title="基本信息"></el-step>
       <el-step title="商品参数"></el-step>
       <el-step title="商品属性"></el-step>
       <el-step title="商品图片"></el-step>
       <el-step title="商品内容"></el-step>
       <el-step title="完成"></el-step>
      </el-steps>
      <el-form label-position="top" :model="addForm" :rules="addFormRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-tabs @tab-click="tabClick" :before-leave="tabsLeave" v-model="activeIndex" tab-position="left">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader v-model="addForm.goods_cat" :options="typeList" :props="cascaderProps" @change="handleChange"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item :label="item.attr_name" v-for="item in typeMany" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox border :label="itemx" v-for="(itemx,index) in item.attr_vals" :key="index"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in typeOnly" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
          action="http://timemeetyou.com:8889/api/private/v1/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          multiple
          list-type="picture"
          :headers="appHeaders"
          :on-success="uploadSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor  
          v-model="addForm.goods_introduce">
          </quill-editor>
          <el-button class="btn" type="primary" @click="addGoodsClick">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
    title="图片预览"
    :visible.sync="pictureVisible"
    width="50%">
    <img :src="previewPicture" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      activeIndex:'0',
      addForm:{
        goods_name:'',
        goods_price:0,
        goods_weight:0,
        goods_number:0,
        goods_cat:[],
        pics:[],
        goods_introduce:'',
        attrs:[]
      },
      addFormRules:{
        goods_name:[
          { required: true, message: '请填写商品名称', trigger: 'blur' }
        ],
        goods_price:[
          { required: true, message: '请填写商品价格', trigger: 'blur' }
        ],
        goods_weight:[
          { required: true, message: '请填写商品重量', trigger: 'blur' }
        ],
        goods_number:[
          { required: true, message: '请填写商品数量', trigger: 'blur' }
        ],
        goods_cat:[
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ]
      },
      typeList:[],
      cascaderProps:{
        expandTrigger: 'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children',
        checkStrictly: true,
      },
      typeMany:[],
      typeOnly:[],
      appHeaders:{
        Authorization:window.sessionStorage.getItem("token")
      },
      previewPicture:'',
      pictureVisible:false
    }
  },
  created(){
    this.getTypeList()
  },
  methods:{
    getTypeList(){
      this.$http.get('/categories').then(res=>{
        console.log(res.data.data);
        this.typeList=res.data.data
      })
    },
    handleChange(){
      if(this.addForm.goods_cat.length!=3){
        this.addForm.goods_cat=[]
        return this.$message.error('只能选择三级分类')
      }
    },
    tabsLeave(activeName,oldActiveName){
      if(oldActiveName=='0'&& this.addForm.goods_cat.length!=3){
        this.$message.error('选择三级分类后可以进入下一阶段')
        return false
      }
    },
    tabClick(){
      if(this.activeIndex==1){
        this.$http.get('categories/'+this.addForm.goods_cat[2]+'/attributes',{
          params:{
            sel:'many'
          }
        }).then(res=>{
          res.data.data.forEach(element => {
            element.attr_vals=element.attr_vals.length==0?[]:element.attr_vals.split(' ')
          });
          //console.log(res);
          this.typeMany=res.data.data
        })
      }else if(this.activeIndex==2){
        this.$http.get('categories/'+this.addForm.goods_cat[2]+'/attributes',{
          params:{
            sel:'only'
          }
        }).then(res=>{
          //console.log(res);
          this.typeOnly=res.data.data
        })
      }
    },
    handlePreview(file){
      //console.log(file);
      this.previewPicture=file.response.data.url
      this.pictureVisible=true
    },
    handleRemove(file){
      //console.log(file);
      let path=file.response.data.tmp_path
      let index=this.addForm.pics.findIndex(v=>{
        v.pic=path
      })
      this.addForm.pics.splice(index,1)
      //console.log(this.addForm);
    },
    uploadSuccess(response){
      //console.log(response);
      let successpath={'pic':response.data.tmp_path}
      this.addForm.pics.push(successpath)
      //console.log(this.addForm);
    },
    addGoodsClick(){
      function deepClone(obj) {
	    if (typeof obj !== 'object' || obj == null) {
		    // 如果是null，或者不是object，就直接返回
		  return obj;
	    }

	    // 初始化返回结果
	    let result;
	    if (obj instanceof Array) {
	    	result = []
	    } else {
	    	result = {}
	    }

	    for (let key in obj) {
	    	// 保证 key 不是原型的属性
	    	if (obj.hasOwnProperty(key)) {
	    		// 递归
	    		result[key] = deepClone(obj[key]);
	    	}
	    }
	    // 返回结果
	    return result;
    }
      this.$refs.ruleForm.validate(valid=>{
        if(!valid) return this.$message.error('表单验证失败')
        let form =deepClone(this.addForm)
        form.goods_cat=form.goods_cat.join(',')
        //console.log(this.typeMany);
        this.typeMany.forEach(item=>{
          let newInfo={attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')}
          this.addForm.attrs.push(newInfo)
        })
        form.attrs=this.addForm.attrs
        console.log(form);
        this.$http.post('goods',form).then(res=>{
          //console.log(res);
          //if(res.data.meta.status!=201) return this.$message.error('添加失败');
          this.$message.success('添加成功')
          this.$router.push('/goods')
        })
      })
    }
  }
}
</script>

<style type="text/css" scoped>
.el-card{
  background-color: #fff;
}
.el-steps{
  margin: 20px 0 40px 0;
}
.el-checkbox{
  margin: 0 5px 5px 0!important;
}
.el-dialog img{
  width: 100%;
}
.btn{
  margin-top: 10px;
}
</style>
