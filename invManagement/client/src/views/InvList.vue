<template>
<div >
   <div class="header"  >
    <n-button class="nb">搜索</n-button>
    <n-input class="ni"  placeholder="请输入搜索关键字" type="text" />
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
        <td>{{ inv.notes }}</td>
        <td>
            <n-space>
                <n-button @click="toUpdate(inv)">修改</n-button>
                <n-button @click="todelete(inv)">删除</n-button>
            </n-space>

        </td>
      </tr>

    </tbody>
  </n-table>

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
import{ref,inject,onMounted,reactive} from 'vue';
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

onMounted(() => {
    loadDatas();
});

const loadDatas = async () => {
    let res = await axios.get("/inv/list");
    //  console.log(res.data.data);
    let temp_date = res.data.data;
    // 格式化日期
    temp_date.forEach(item => {
        item.createDate = new Date(item.createDate).toLocaleDateString();
    });
    invList.value = temp_date;
     
}

const toUpdate = (inv) => {
    updateInv.invNumber = inv.invNumber;
    updateInv.invCompany = inv.invCompany;
    updateInv.notes = inv.notes;
    showUpdateModal.value = true;
};

const update = async () => {
    const res = await axios.put('/inv/update', updateInv);
    if(res.data.code === 200) {
        loadDatas();
        message.info('修改成功');
    }else{
        message.error(res.data.msg);
    }
    showUpdateModal.value= false;
}

const todelete = async (inv) => {
    // console.log(inv);
          dialog.warning({
          title: "警告",
          content: "确认删除吗？",
          positiveText: "删除",
          negativeText: "不删除",
          draggable: true,
          onPositiveClick: async() => {
           const res = await axios.delete(`/inv/delete?invNumber=${inv.invNumber}`);
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

<style  lang="scss"  scoped>
.header {
    padding:0 10px;
    display: flex;

    .nb{
       margin-right: 10px;
       flex-grow: 1; 
    }
    .ni {
      width: 400px;
       flex-grow: 10;
    }
}


</style> 
