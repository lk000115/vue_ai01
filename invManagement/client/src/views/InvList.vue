<template>
<div >
   <div class="header">
      <n-button class="nb" @click="search">搜索</n-button>
      <n-input
        v-model:value="keyword"
        class="ni"
        placeholder="请输入开票公司"
        type="text"
      />
      <!-- <n-input
        v-model:value="searchInvNumber"
        class="ni"
        placeholder="请输入发票号码"
        type="text"
      /> -->
    </div>
    <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>发票号码</th>
        <th>开票金额</th>
        <th>开票日期</th>
        <th>录入日期</th>
        <th>开票公司</th>
        <th>备注</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr  v-for="(inv, index) in invList" :key="index">
        <td>{{ inv.invNumber }}</td>
        <td>{{ inv.invAmount }}</td>
        <td>{{ inv.invDate }}</td>
        <td>{{ inv.createDate }}</td>
        <td>{{ inv.invCompany }}</td>
        <td>{{ truncateText(inv.notes) }}</td>
        <td>
            <n-space>
                <n-button @click="toUpdate(inv)">修改</n-button>
                <!-- <n-button @click="todelete(inv)">删除</n-button> -->
            </n-space>

        </td>
      </tr>

    </tbody>
  </n-table>
  
   <div class="pagination">
          <!-- 左下分页导航 -->
    <div class="pagination-left">
      <n-button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
        <
      </n-button>
      <div v-for="page in visiblePages" :key="page" @click="changePage(page)">
        <div :style="'color:' + (page === currentPage ? 'red' : '')"  
             style="cursor: pointer; display: inline-block; width: 30px; text-align: center;">
          {{ page }}
        </div>
      </div>
      <div v-if="pageCount > lastVisiblePage" @click="changePage(currentPage + 1)">
        ...
      </div>
      <n-button @click="changePage(currentPage + 1)" :disabled="currentPage === pageCount">
        > 
      </n-button>
    </div>
    <!-- 右下前往指定页和总页数信息 -->
    <div class="pagination-right">
      <span>前往</span>
      <n-input
        v-model:value="goToPageStr"
        type="number"
        :min="1"
        :max="pageCount"
        style="width: 50px; margin: 0 5px"
      />
      <n-button @click="goToSpecificPage">页</n-button>
      <span>共 {{ pageCount }} 页</span>
    </div>

   </div> 



  <!-- 修改模态框--弹出框 -->
   <n-modal v-model:show="showUpdateModal" preset="dialog" title="Dialog">
    <template #header>
      <div>修改分类</div>
    </template>
    <div>
        <h3>发票号码: {{ updateInv.invNumber }}</h3>
    </div>
    <div>
        <n-input v-model:value="updateInv.invCompany"  placeholder="请输入公司名称" type="text" /> 
        <n-input v-model:value="updateInv.notes"  placeholder="请输入备注信息" type="text"  />
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
import{ref,inject,onMounted,reactive,computed} from 'vue';
const axios = inject('axios');
const message = inject('message');
const dialog = inject('dialog');

const showUpdateModal = ref(false);
const updateInv = reactive({
    invNumber: '',
    invCompany: '',
    notes: ''
});

let invList = ref([]);
// const searchInvCompany = ref('');
// const searchInvNumber = ref('');
const keyword = ref(''); // 用于搜索开票公司
const currentPage = ref(1);
const pageSize = ref(10);
const pageCount = ref(0);
const goToPage = ref(1);

// 计算属性，将 goToPage 转换为字符串
const goToPageStr = computed({
  get: () => goToPage.value.toString(),
  set: (newValue) => {
    const num = parseInt(newValue, 10);
    if (!isNaN(num)) {
      goToPage.value = num;
    }
  }
});


// 计算可见的页码
const visiblePages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(currentPage.value - Math.floor(maxVisiblePages / 2), 1);
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > pageCount.value) {
    endPage = pageCount.value;
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

const lastVisiblePage = computed(() => visiblePages.value[visiblePages.value.length - 1]);

onMounted(() => {
    loadDatas();
});

const loadDatas = async () => {
  try {
    const res = await axios.get('/api/search', {
      params: {
        keyword: keyword.value,
        // invNumber: keyword.value, // 如果需要搜索发票号码，可以使用同一个输入框
        // notes:keyword.value,
        currentPage: currentPage.value,
        pageSize: pageSize.value
      }
    });
    console.log('响应数据:', res.data);
    const tempData = res.data.rows;
    // 格式化日期
    tempData.forEach(item => {
      item.createDate = new Date(item.createDate).toLocaleDateString();
    });
    invList.value = tempData;
    pageCount.value = res.data.pageCount;
  } catch (error) {
    console.error('获取数据失败:', error);
    message.error('获取数据失败，请检查网络连接');
  }
};

const search = () => {
  currentPage.value = 1;
  loadDatas();
};

const changePage = (page) => {
  if (page >= 1 && page <= pageCount.value) {
    currentPage.value = page;
    loadDatas();
  }
};

const goToSpecificPage = () => {
  const page = goToPage.value;
  if (page >= 1 && page <= pageCount.value) {
    currentPage.value = page;
    loadDatas();
  } else {
    message.warning('请输入有效的页码');
  }
};

const toUpdate = (inv) => {
    updateInv.invNumber = inv.invNumber;
    updateInv.invCompany = inv.invCompany;
    updateInv.notes = inv.notes;
    showUpdateModal.value = true;
};

const update = async () => {
    const res = await axios.put('/api/update', updateInv);
    if(res.data.code === 200) {
        loadDatas();
        message.info('修改成功');
    }else{
        message.error(res.data.msg);
    }
    showUpdateModal.value= false;
}

// 添加文本截断过滤器
const truncateText = (text, length = 20) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};


// const todelete = async (inv) => {
//     // console.log(inv);
//           dialog.warning({
//           title: "警告",
//           content: "确认删除吗？",
//           positiveText: "删除",
//           negativeText: "不删除",
//           draggable: true,
//           onPositiveClick: async() => {
//            const res = await axios.delete(`/inv/delete?invNumber=${inv.invNumber}`);
//              if(res.data.code === 200) {
//                loadDatas();
//                message.info('删除成功');
//              }
//            },
//               onNegativeClick: () => {
        
//               }
//         });
    
// }


</script>

<style  lang="scss"  scoped>
.header {
    padding:0 10px;
    display: flex;

    .nb{
       margin-right: 10px;
       flex-grow: 1; 
    }
    .ni {
      margin-right: 10px;
      width: 200px;
       flex-grow: 10;
    }
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .pagination-left {
    display: flex;
    align-items: center;
  }
}


</style> 
