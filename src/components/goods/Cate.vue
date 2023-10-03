<template>
  <div>
<!-- 面包屑导航区 -->
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
</el-breadcrumb>

<!-- 卡片视图区域 -->
<el-card>
  <el-row>
    <el-button type="primary"  class="card" @click="showAddCateDialog">添加分类</el-button>
  </el-row>

  <!-- 表格 -->
  <tree-table :data="catelist" :columns="columns" border :show-row-hover="false"
  :selection-type="false" :expand-type="false" show-index index-text="#">
  <template slot="isok" slot-scope="scope">
    <i class="el-icon-success"
    v-if="scope.row.cat_deleted===false" style="color:rgb(7, 110, 7);"></i>
    <i class="el-icon-error" v-else style="color:red;"></i>
  </template>
  <!-- 排序 -->
  <template slot="order" slot-scope="scope">
    <el-tag size="mini"
    v-if="scope.row.cat_level===0">一级</el-tag>
    <el-tag type="success" size="mini"
    v-else-if="scope.row.cat_level===1">二级</el-tag>
    <el-tag type="warning" size="mini" v-else>三级</el-tag>
  </template>

  <!-- 操作 -->
   <template slot="opt" slot-scope="scope">
    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCate(scope.row.cat_id)">编辑</el-button>
    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row.cat_id)">删除</el-button>
  </template>
  </tree-table>

  <!-- 分页区域 -->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3,5,10,15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>

<!-- 添加分类的对话框 -->
<el-dialog
  title="添加分类"
  :visible.sync="addCateDialogVisible"
  @close="addCateDialogClosed"
  width="50%">
  <!-- 添加分类的表单 -->
 <el-form :model="addCateForm" :rules="addCateFormRules"
 ref="addCateFormRef" label-width="100px">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
   <el-form-item label="父级分类">
     <!-- options指定数据源 -->
     <!-- props用来指定配置对象 -->
    <el-cascader
    expand-trigger="hover"
    :options="parentCateList"
    :append-to-body="false"
    :props="cascaderProps"
    v-model="selectKeys"
    @change="parentCateChanged"
    clearable change-on-select></el-cascader>
  </el-form-item>

  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>

<!-- 修改分类对话框 -->
<el-dialog
  title="修改分类"
  :visible.sync="editCateVisible"
  width="50%" @close="editCateClosed">
  <el-form :model="editCateForm" :rules="editCateFormRules"
   ref="editCateFormRef" label-width="70px">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="editCateForm.cat_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editCateVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCateInfo">确 定</el-button>
  </span>
</el-dialog>


  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      // 商品分类的数据列表
      catelist:[],
      // 总数据条数
      total:0,
      // 为table指定列的定义
      columns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },{
          label:'是否有效',
          // 表示，将当前列定义为模板列
          type:'template',
          // 表示当前这一列使用模板名称
          template:'isok'
        },{
          label:'排序',
          // 表示，将当前列定义为模板列
          type:'template',
          // 表示当前这一列使用模板名称
          template:'order'
        },{
          label:'操作',
          // 表示，将当前列定义为模板列
          type:'template',
          // 表示当前这一列使用模板名称
          template:'opt'
        }
      ],
      // 控制添加分类对话框的显示和隐藏
      addCateDialogVisible:false,
      // 添加分类的表单数据对象
      addCateForm:{
        // 将要添加的分类名称
        cat_name:'',
        // 父级分类的ID
        cat_pid:0,
        // 父类的等级，默认要添加的是一级分类
        cat_level:0
      },

      // 添加分类表单的验证规则对象
      addCateFormRules:{
        cat_name:[
           { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      },
      // 父级分类的列表
      parentCateList:[],
      // 指定级联选择器的配置对象
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      // 选中的父级分类的ID数组
      selectKeys:[],
      // 查询到的分类信息对象
      editCateForm:{},
// 控制修改分类对话框的显示和隐藏
      editCateVisible:false,
      // 修改表单的验证规则对象
      editCateFormRules:{
       cat_name:[
          { required: true, message: '请输入分类名', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
       ]

      }
    }
  },
    created(){
      this.getCateList()
    },
    methods:{
      // 获取商品分类数据
      async getCateList(){
       const{data:res}=await this.$http.get('categories',{params:this.queryInfo})

         if(res.meta.status!==200){
          return this.$message.error('获取商品分类失败！')
        }

        console.log(res.data);
        // 把数据列表，赋值给 catelist
        this.catelist=res.data.result
        // 为总数据条数赋值
        this.total=res.data.total
      },
      // 监听pagesize改变
      handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize
        this.getCateList()
      },
      // 监听pagenum改变
      handleCurrentChange(newpage){
        this.queryInfo.pagenum=newpage
        this.getCateList()
      },
      // 点击按钮显示添加分类的对话框
      showAddCateDialog(){
        // 先获取父级分类的数据列表
        this.getParentCateList()
        // 再展示对话框
        this.addCateDialogVisible=true
      },
      //获取父级分类的数据列表
      async  getParentCateList(){
        const {data:res }= await this.$http.get('categories',{
          params:{type:2}
        })
          if(res.meta.status!==200){
          return this.$message.error('获取父级分类失败！')
        }
        console.log(res.data);
        this.parentCateList=res.data

      },
      // 选择项发生变化触发这个函数
      parentCateChanged(){
        // 如果selectKeys数组中的length大于0，证明选中的父级分类
        // 反之，就说明没有选中任何父级分类
        if(this.selectKeys.length >0){
          // 父级分类的ID
          this.addCateForm.cat_pid= this.selectKeys[
            this.selectKeys.length-1
          ]
          // 为当前分类的等级赋值
          this.addCateForm.cat_level=this.selectKeys.length
          return
        }else{
           // 父级分类的ID
          this.addCateForm.cat_pid= 0
          // 为当前分类的等级赋值
          this.addCateForm.cat_level= 0
        }
        console.log(this.selectKeys);
      },
      // 点击确定按钮，添加新的分类
      addCate(){
        this.$refs.addCateFormRef.validate(async valid=>{
          // console.log(valid);
          if(!valid) return
          // 可以发起添加用户的网络请求
         const {data:res} = await this.$http.post
         ('categories',this.addCateForm)

         if(res.meta.status!==201){
          this.$message.error('添加分类失败！')
         }

         this.$message.success('添加分类成功！')

        //  隐藏添加分类的对话框
        this.addCateDialogVisible =false
        // 重新获取分类列表
        this.getCateList()

        })

      },
      // 监听对话框的关闭事件，重置表单数据
      addCateDialogClosed(){
        this.$refs.addCateFormRef.resetFields()
        this.selectKeys=[]
        this.addCateForm.cat_level=0
        this.addCateForm.cat_pid=0
      },
      // 编辑分类列表
      async showEditCate(id){
        //  console.log(id);
        const {data:res }= await this.$http.get('categories/'+ id);

        if(res.meta.status !==200){
          return this.$message.error('查询分类信息失败!')
        }
        // console.log(res.data);
        this.editCateForm=res.data
        this.editCateVisible=true;

      },
      // 监听修改分类对话框的关闭事件
      editCateClosed(){
          this.$refs.editCateFormRef.resetFields()
      },
       // 修改分类信息并提交
      editCateInfo(){
        this.$refs.editCateFormRef.validate(async valid=>{
         if(!valid)return
        //  发起修改用户信息的数据请求
        const {data:res} = await this.$http.put('categories/'+ this.editCateForm.cat_id,{
          cat_name:this.editCateForm.cat_name
        })
        // console.log(res.meta.status);

        if(res.meta.status!==200){
          return this.$message.error('更新分类信息失败！')
        }
        // 关闭对话框
        this.editCateVisible =false
        // 刷新数据列表
        this.getCateList()
        // 提示修改成功
        this.$message.success('更新分类信息成功！')
        })


      },
       // 根据ID删除用户信息
      async removeCateById(id){
      // 弹框询问用户是否删除信息
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).catch(err=>err)
              // 如果用户确认删除，则返会字符串confirm
              // 如果用户取消了删除，则返回值为字符串cancel
              if(confirmResult !=='confirm'){
                return this.$message.info('已取消删除')
              }
              const {data:res} =await this.$http.delete('categories/' + id)
              if(res.meta.status!==200){
                return this.$message.error("删除分类失败")
              }
              this.$message.success('删除分类成功！')
              this.getCateList()
      }
    }

 }
</script>

<style lang="less" scoped>
.treeTable{
  margin-top: 15px;
}
.card{
  margin-bottom: 15px;
}
.el-cascader{
  width: 100%;
}

</style>