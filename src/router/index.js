import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

const Home = () => import('@/views/home/Index')
const Question = () => import('@/views/question/Index')
const Video = () => import('@/views/video/Index')
const User = () => import('@/views/user/Index')
const Profile = () => import('@/views/user/Profile')
const Chat = () => import('@/views/user/Chat')
const Login = () => import('@/views/user/Login')
const Search = () => import('@/views/search/Index')
const Result = () => import('@/views/search/Result')
const Article = () => import('@/views/home/Article')
const Layout = () => import('@/views/Layout')

Vue.use(VueRouter)

const routes = [
  { path: '/',
    component: Layout,
    children: [
      { path: '/', name: 'home', component: Home },
      {
        path: '/question',
        name: 'question',
        component: Question
      },
      {
        path: '/video',
        name: 'video',
        component: Video
      },
      {
        path: '/user',
        name: 'user',
        component: User
      }
    ]
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: Profile
  },
  { path: '/user/chat',
    name: 'user-chat',
    component: Chat },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/search',
    name: 'search',
    component: Search
  },
  { path: '/search/result',
    name: 'search-result',
    component: Result },
  {
    path: '/article',
    name: 'article',
    component: Article
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  const user = store.state.user
  if (!user.token && to.path.startsWith('/user')) {
    return next({ path: '/login', query: { redirectUrl: to.path } })
  }
  next()
})

export default router
