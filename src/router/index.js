import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import LoadFile from '../views/UploadFile';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/load-file',
    name: 'Load File',
    component: LoadFile
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
