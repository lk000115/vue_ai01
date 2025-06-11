<template>
<div class="main-panel">
     <div class="menus">
        <div v-for="(menu, index) in menus" :key="index" @click="router.push(menu.href)">
            {{ menu.name }}
            
        </div>
         
     </div> 
</div>
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
    {name:'退出',href:'/dashboard/logout'},
]

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
</style> 
