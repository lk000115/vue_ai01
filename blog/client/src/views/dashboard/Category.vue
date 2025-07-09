<template>
<div >
   <n-button @click="showAddModal=true">新增</n-button> 
  <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>编号</th>
        <th>名称</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr  v-for="(category, index) in categoryList" :key="index">
        <td>{{ category.id }}</td>
        <td>{{ category.name }}</td>
          
        <td>
            <n-space>
                <n-button @click="toUpdate(category)">修改</n-button>
                <n-button @click="catedelete(category)">删除</n-button>
            </n-space>

        </td>
      </tr>

    </tbody>
  </n-table>
<!-- 添加分类模态框  -->
   <n-modal v-model:show="showAddModal" preset="dialog" title="Dialog">
    <template #header>
      <div>添加分类</div>
    </template>
    <div>
      <n-input  v-model:value="addCategory.name"    placeholder="请输入分类名称" type="text" />
    </div>
    <template #action>
      <div>
        <n-button type="primary" @click="add"> 提交</n-button>
      </div>
    </template>
  </n-modal> 

<!-- 修改分类模态框--弹出框 -->
   <n-modal v-model:show="showUpdateModal" preset="dialog" title="Dialog">
    <template #header>
      <div>修改分类</div>
    </template>
    <div>
      <n-input v-model:value="updateCategory.name"  placeholder="请输入分类名称" type="text"  />
    </div>
    <template #action>
      <div>
        <n-button type="primary" @click="update"> 提交</n-button>
      </div>
    </template>
  </n-modal> 


</div>

</template>
<script   setup>
import { AdminStore } from '../../stores/AdminStore';
import{ref,inject,onMounted,reactive} from 'vue';
import { useRouter,useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const adminStore = AdminStore();
const axios = inject('axios');
const message = inject('message');
const dialog = inject('dialog');

const categoryList = ref([]);
const showAddModal = ref(false);
const showUpdateModal = ref(false);
const addCategory = reactive({
    name: ''
});

const updateCategory = reactive({
    id: 0,
    name: '' 
})

onMounted(() => {
 // 这里可以获取数据库数据   
    loadDatas();
 
});

const loadDatas = async () => {
    const res = await axios.get('/category/list');
    categoryList.value = res.data.data;
    // console.log(res.data);
}

const add = async () => {
    //在全局AXIOS设定的拦截器,添加了token,所以这里不需要再添加
    // const res = await axios.post('/category/_token/add', {name:addCategory.name},{headers:{token:adminStore.token}});
    const res = await axios.post('/category/_token/add', {name:addCategory.name});
    if(res.data.code === 200) {
        loadDatas();
        message.info('添加成功');
    }else{
        message.error(res.data.msg);
    }
    
    showAddModal.value = false;
}

const toUpdate = async (category) => {
    showUpdateModal.value = true;
    updateCategory.id = category.id;
    updateCategory.name = category.name;
    // console.log(updateCategory);
    
}



const update = async () => {
    const res = await axios.put('/category/_token/update', {name:updateCategory.name,id:updateCategory.id});
    if(res.data.code === 200) {
        loadDatas();
        message.info('修改成功');
    }else{
        message.error(res.data.msg);
    }
    showUpdateModal.value= false;
}


const catedelete = async (category) => {

      dialog.warning({
          title: "警告",
          content: "你删除？",
          positiveText: "删除",
          negativeText: "不删除",
          draggable: true,
          onPositiveClick: async() => {
           const res = await axios.delete(`/category/_token/delete?id=${category.id}`);
             if(res.data.code === 200) {
               loadDatas();
               message.info('删除成功');
             }
           },
              onNegativeClick: () => {
        
              }
        });

}


</script>


<style lang="scss"  scoped>


</style> 
