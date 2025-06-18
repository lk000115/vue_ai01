<template>
 

     <n-tabs v-model:value="tableValue"  justify-content="start" type="line">
        <n-tab-pane name="list" tab="博客列表">
            <div v-for="(blog, index) in blogListInfo" style="margin-bottom: 15px;">
                <n-card :title="blog.title">
                    {{ blog.content }}
                    <template #footer>
                        <n-space align="center">
                            <div>发布时间：{{ blog.create_time }}</div>
                            <n-button @click="toUpdate(blog)">修改</n-button>
                            <n-button @click="toDelete(blog)">删除</n-button>
                        </n-space>
                    </template>
                </n-card>
            </div> 
            <n-space>
                <div @click="toPage(pageNum)" v-for="pageNum in pageInfo.pageCount">
                    <div :style="'color:' + (pageNum == pageInfo.page ? 'red' : '')">
                        {{ pageNum }}
                    </div>
                </div>
            </n-space>

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

        <n-tab-pane name="update" tab="修改文章">
            <n-form :model="updateArticle">
                <n-form-item label="标题">
                    <n-input v-model:value="updateArticle.title" placeholder="请输入标题" />
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="updateArticle.categoryId" :options="categoryOptions" />
                </n-form-item>
                <n-form-item label="内容">
                    <RichTextEditor v-model="updateArticle.content" />
                </n-form-item>
                <n-form-item label="">
                    <n-button @click="update">提交</n-button>
                </n-form-item>
            </n-form>
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

const blogListInfo = ref([])

// 添加文章的数据
const addArticle = reactive({
    categoryid: 0,
    title: '',
    content: ''
});

// 要修改的数据
const updateArticle = reactive({
    id: 0,
    categoryId: 0,
    title: "",
    content: ""
})

const categoryOptions = ref([]);
const tableValue = ref("list");

const add =  async ()=>{
    console.log(addArticle);
  const res = await axios.post('/blog/_token/add',addArticle );
    if(res.data.code === 200) {
        message.info('添加成功');
    }else{
        message.error(res.data.msg);
    }
   
}

// 分页 列表个数
const pageInfo = reactive({
    page: 1,
    pageSize: 3,
    pageCount: 0,
    count: 0
});

onMounted(() => {
    // 获取文章列表
    loadBlogs();
    // 获取文章分类
    loadCategorys();
});

const loadBlogs =  async ()=>{
    console.log(pageInfo);
    const res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`);
    let temp_rows = res.data.data.rows;
        for(let row of temp_rows) {
        row.content += '...';
        let d = new Date(row.create_time);
        row.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    }  
    blogListInfo.value = temp_rows;
    pageInfo.count = res.data.data.total // 列表总条数
    pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0) // 总页数
    console.log(res);
}

// 转至另一页
const toPage = async (pageNum) => {
    pageInfo.page = pageNum
    loadBlogs()
}

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

const toUpdate = async (blog) => {
    tableValue.value = "update"
    let res = await axios.get("/blog/detail?id=" + blog.id)
    // console.log(res)
    updateArticle.id = blog.id
    updateArticle.title = res.data.rows[0].title
    updateArticle.content = res.data.rows[0].content
    updateArticle.categoryId = res.data.rows[0].category_id
}

// 修改操作
const update = async () => {
    let res = await axios.put("/blog/_token/update", updateArticle)
    if (res.data.code == 200) {
        message.info(res.data.msg)
        loadBlogs()
        tableValue.value = "list"
    } else {
        message.error(res.data.msg)
    }
}


const toDelete = async (blog) => {
    let res = await axios.delete("/blog/_token/delete?id=" + blog.id)
    if (res.data.code == 200) {
        message.info(res.data.msg)
        loadBlogs()
    } else {
        message.error(res.data.msg)
    }
}


</script>


<style lang="scss" scoped>


</style> 
