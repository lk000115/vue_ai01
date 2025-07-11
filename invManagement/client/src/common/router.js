import {createRouter,createWebHistory} from 'vue-router';


let routes = [
   {path:"/", redirect:"/mainboard"},
   {path:"/add", component:()=>import("../views/invAdd.vue")},
   {path:"/mainboard", component:()=>import("../views/Mainboard.vue"),
      children:[
         {path:"invlist", component:()=>import("../views/Invlist.vue")},
         {path:"invscan", component:()=>import("../views/InvScan.vue")},
      ]
   }

]


const router = createRouter({
     routes,
     history: createWebHistory(),
})


export  {router}