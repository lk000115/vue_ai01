import {createRouter, createWebHashHistory} from 'vue-router';
let routes = [
   {path: '/test', component: () => import('../views/test.vue')},
   {path: '/login', component: () => import('../views/Login.vue')},
]


const router =  createRouter({
    history: createWebHashHistory(),
    routes,

})


export {routes, router}