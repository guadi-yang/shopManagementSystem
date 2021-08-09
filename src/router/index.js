import Vue from 'vue'
import VueRouter from 'vue-router'



Vue.use(VueRouter)

const Login=()=>import('../components/Login.vue')
const Home=()=>import('../components/Home.vue')
const Welcome=()=>import('../components/Welcome.vue')
const User=()=>import('../components/user/User.vue')
const Rights=()=>import('../components/power/Rights.vue')
const Roles=()=>import('../components/power/Roles.vue')
const Categories=()=>import('../components/goods/Categories.vue')
const Params=()=>import('../components/goods/Params.vue')
const Goods=()=>import('../components/goods/Goods.vue')
const Add=()=>import('../components/goods/add/Add.vue')
const Orders=()=>import('../components/orders/Orders.vue')
const Reports=()=>import('../components/reports/Reports.vue')
const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome
      },
      {
        path:'/users',
        component:User
      },
      {
        path:'/rights',
        component:Rights
      },
      {
        path:'/roles',
        component:Roles
      },
      {
        path:'/categories',
        component:Categories
      },
      {
        path:'/params',
        component:Params
      },
      {
        path:'/goods',
        component:Goods,
      },
      {
        path:'/goods/add',
        component:Add
      },
      {
        path:'/orders',
        component:Orders
      },
      {
        path:'/reports',
        component:Reports
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode:'history'
})
router.beforeEach((to,from,next)=>{
  if(to.path=='/login') return next()
  let tokenStr=window.sessionStorage.getItem("token")
  if(!tokenStr) return next('/login')
  next()
})
export default router
