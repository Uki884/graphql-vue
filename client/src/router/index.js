import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import AddPost from '../components/Posts/AddPost.vue'
import Posts from '../components/Posts/Posts.vue'
import Post from '../components/Posts/Post.vue'
import Profile from '../components/Auth/Profile.vue'
import Signin from '../components/Auth/Signin.vue'
import Signup from '../components/Auth/Signup.vue'

import AuthGuard from '@/router/AuthGuard'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/posts',
    name: 'Posts',
    component: Posts
  },
  {
    path: "/posts/:postId",
    name: 'Post',
    component: Post,
    props: true
  },
  {
    path: '/post/add',
    name: 'AddPost',
    component: AddPost,
    beforeEnter: AuthGuard
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter: AuthGuard
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/signin',
    name: 'Signin',
    component: Signin
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
