<template>
      <el-container class="home-container" >
        <!-- 头部区域 -->
        <el-header>
          <div>
            <img src="../assets/logo.png">
            <span>电商后台管理系统</span>
          </div>
           <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区 -->
        <el-container>
          <!-- 页面侧边栏 -->
          <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF"
          unique-opened :collapse="isCollapse"
           :collapse-transition="false" router :default-active="activePath">
      <!-- 一级菜单 -->
      <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
        <!-- 一级菜单的模板区域 -->
        <template slot="title">
          <i :class="iconObj[item.id]"></i>
          <span>{{ item.authName }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/'+ subItem.path + '' " v-for="subItem in item.children"
        :key="subItem.id" @click="saveNavstate('/' + subItem.path)">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{ subItem.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
          <!-- 右侧内容 -->
          <el-main>
            <!-- 路由占位符 -->
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
</template>

<script>
export default {
  data() {
    return {
// 左侧表单数据
      menulist:[],
      iconObj:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',
      },
      isCollapse:false,
      // 是否折叠
      activePath:''
    };
  },
  created(){
    this.getMenuList(),
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods:{
    logout(){
      window.sessionStorage.clear();
      this.$router.push('/login')
    },
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status !==200) return this.$message.error(res.meta.msg)
      this.menulist =res.data
      console.log(res);
    },
    Collapes(){
       this.isCollapse=! this.isCollapse
    },
    // 保存链接的激活状态
    saveNavstate(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
  }
 }
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.iconfont{
  margin-right: 10px;
}
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    >div{
      display: flex;
      align-items: center;
    }
}
.el-aside{
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color: #eaedf1;
}
img {
      width: 10%;
      height: 10%;
      border-radius: 50%;
      background-color: #eee;
    }
    .toggle-button{
      background-color: #4a5064;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }

</style>