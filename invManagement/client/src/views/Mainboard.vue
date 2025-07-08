<template>
<div class="mainboard">
     <div  class="menus" >
          <div v-for="(menu, index) in menus" :key="index" @click="toPage(menu)" >
            {{ menu.name }}
        </div>         
     </div>
     <div  class="content"  style="padding: 20px; width:100%;">
          <router-view></router-view>
     </div>
</div>
</template>


<script   setup>
import {ref}  from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
let menus = [
    {name:'发票列表',href:'/mainboard/invlist'},
    {name:'发票扫描',href:'/mainboard/invscan'} 
]


const toPage = (menu)=>{
      router.push(menu.href);

}



</script>

<style  lang="scss"  scoped>
.mainboard{
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
