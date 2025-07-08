import {createRouter, createWebHashHistory} from 'vue-router';


let routes = [
   {path:"/", redirect:"/mainboard"},
   {path:"/mainboard", component:()=>import("../views/Mainboard.vue"),
      children:[
         {path:"invlist", component:()=>import("../views/Invlist.vue")},
         {path:"invscan", component:()=>import("../views/InvScan.vue")},
      ]
   }

]


const router = createRouter({
     routes,
     history: createWebHashHistory(),
})


export  {router}