import {createRouter, createWebHashHistory} from 'vue-router';
let routes = [
    {path: '/', redirect: '/zxscan'},
   {path: '/test', component: () => import('../views/test.vue')},
   {path: '/login', component: () => import('../views/Login.vue')},
   {path: '/scan', component: () => import('../views/scan/H5vidoe.vue')},
   {path: '/zxscan', component: () => import('../views/scan/Zxvideo.vue')},
   {path: '/dashboard', component: () => import('../views/dashboard/Dashboard.vue'), 
       children:[
        {path: 'category', component: () => import('../views/dashboard/Category.vue')},
        {path: 'article', component: () => import('../views/dashboard/Article.vue')},
        {path: 'bill', component: () => import('../views/dashboard/Bill.vue')},
    
    ] 
}
]


const router =  createRouter({
    history: createWebHashHistory(),
    routes,

})


export {routes, router}