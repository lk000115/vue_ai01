<template>
 <n-card title="文章----" style="margin-bottom: 16px">

     <n-tabs default-value="add" justify-content="start" type="line">
        <n-tab-pane name="lx1" tab="类型1">
            类型1
        </n-tab-pane>

        <n-tab-pane name="add" tab="添加文章">
           <n-form>
                <n-form-item label="文章标题">
                    <n-input v-model:value="addArticle.title" placeholder="请输入标题" />
                </n-form-item>  
                <n-form-item label="文章内容">
                    <RichTextEditor v-model="addArticle.content" />
                </n-form-item>  
           </n-form>
           

        </n-tab-pane>

        <n-tab-pane name="lx3" tab="类型3">
            leixin3
        </n-tab-pane>
     </n-tabs>

</n-card>
 {{ addArticle.content }}
</template>

<script   setup>
import { AdminStore } from '../../stores/AdminStore';
import{ref,inject,reactive} from 'vue';
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


</script>


<style lang="scss" scoped>


</style> 
