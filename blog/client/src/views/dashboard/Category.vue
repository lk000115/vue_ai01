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
                <n-button >编辑</n-button>
                <n-button >删除</n-button>
            </n-space>

        </td>
      </tr>

    </tbody>
  </n-table>

   <n-modal v-model:show="showAddModal" preset="dialog" title="Dialog">
    <template #header>
      <div>添加分类</div>
    </template>
    <div>
      <n-input placeholder="请输入分类名称" type="text" v-model:value="addCategory.name" />
    </div>
    <template #action>
      <div>
        <n-button type="primary" @click="add"> 提交</n-button>
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

const categoryList = ref([]);
const showAddModal = ref(false);
const addCategory = reactive({
    name: ''
});

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
    const res = await axios.post('/category/_token/add', {name:addCategory.name},{headers:{token:adminStore.token}});
    console.log(res.data); 
    if(res.data.code === 200) {
        loadDatas();
        message.info('添加成功');
    }else{
        message.error(res.data.msg);
    }
    
    showAddModal.value = false;
}

</script>


<style lang="scss"  scoped>


</style> 
