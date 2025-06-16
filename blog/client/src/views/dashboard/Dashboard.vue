<template>
<div class="main-panel">
     <div class="menus">
        <div v-for="(menu, index) in menus" :key="index" @click="toPage(menu)" >
            {{ menu.name }}

        </div>     
     </div> 
     <div style="padding: 20px; width:100%;">
         <router-view></router-view>

     </div>
</div>
<div class="title">后台管理系统</div>
</template>


<script   setup>
import { AdminStore } from '../../stores/AdminStore';
import{ref,inject} from 'vue';
import { useRouter,useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const adminStore = AdminStore();
const axios = inject('axios');
const message = inject('message');

let menus = [
    {name:'文章管理',href:'/dashboard/article'},
    {name:'分类管理',href:'/dashboard/category'},
    {name:'退出',href:'logout'},
]

const toPage = (menu) => {
    if(menu.href === 'logout') {
        router.push('/login');
    } else {
        router.push(menu.href);

    }
}

</script>



<style lang="scss" scoped>
.main-panel {
    display: flex;
    color:#64676a;
    max-width: 1500px;
    margin: 0 auto;
}

.menus {
    width: 100px;
    height: 95vh;
    padding: 20px, 0;
    box-sizing:border-box;
    border-right: 1px solid #dadada;
    text-align: center;
    line-height: 55px;

    div {
        cursor: pointer;
        &:hover {
            color: #fd760e;}  
           
    }

}

.title {
    font-size: 65px;
    font-weight: bold;
    text-align:  center;
    position: fixed;
    color:rgba(0,0,0,.205);
    bottom:20px;
    z-index:-1
}
</style> 
