import {createRouter, createWebHashHistory} from 'vue-router';
let routes = [
   {path: '/test', component: () => import('../views/test.vue')},
   {path: '/login', component: () => import('../views/Login.vue')},
   {path: '/dashboard', component: () => import('../views/dashboard/Dashboard.vue'), 
       children:[
        {path: 'categary', component: () => import('../views/dashboard/Categary.vue')},
        {path: 'article', component: () => import('../views/dashboard/Article.vue')},

    
    ] 
}
]


const router =  createRouter({
    history: createWebHashHistory(),
    routes,

})


export {routes, router}