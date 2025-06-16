<template>
 

     <n-tabs default-value="add"  justify-content="start" type="line">
        <n-tab-pane name="list" tab="博客列表">
            类型1
        </n-tab-pane>

        <n-tab-pane name="add" tab="添加文章">
           <n-form>
                <n-form-item label="文章标题">
                    <n-input v-model:value="addArticle.title" placeholder="请输入标题" />
                </n-form-item>
                <n-form-item label="文章分类">
                    <n-select v-model:value="addArticle.categoryid" :options="categoryOptions" />
                </n-form-item>    
                <n-form-item label="文章内容">
                    <RichTextEditor v-model="addArticle.content" />
                </n-form-item>

                <n-form-item>
                    <n-button type="primary" @click="add">提交</n-button>
                </n-form-item>
               
           </n-form>
           

        </n-tab-pane>

        <n-tab-pane name="lx3" tab="类型3">
            leixin3
        </n-tab-pane>
     </n-tabs>

 <!-- {{ addArticle.content }} -->
</template>

<script   setup>
import { AdminStore } from '../../stores/AdminStore';
import{ref,inject,reactive, onMounted} from 'vue';
import { useRouter,useRoute } from 'vue-router';
import RichTextEditor from '../../components/RichTextEdit.vue';


const router = useRouter();
const route = useRoute();

const adminStore = AdminStore();
const axios = inject('axios');
const message = inject('message');
const dialog = inject('dialog');

const addArticle = reactive({
    categoryid: 0,
    title: '',
    content: ''
});

const categoryOptions = ref([]);

const add =  async ()=>{
    console.log(addArticle);
  const res = await axios.post('/blog/_token/add',addArticle );
    if(res.data.code === 200) {
        message.info('添加成功');
    }else{
        message.error(res.data.msg);
    }
   
}


onMounted(() => {
    // 获取文章分类
    loadCategorys();
});

const loadCategorys = async () => {
  
   const res = await axios.get('/category/list');
   if(res.data.code === 200) {
        categoryOptions.value = res.data.data.map(item => {
        return {
            label: item.name,
            value: item.id
        }
    });
   }
//    console.log(res.data);
   
};


</script>


<style lang="scss" scoped>


</style> 
