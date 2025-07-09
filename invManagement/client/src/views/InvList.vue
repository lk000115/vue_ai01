<template>
<div >
    发票明细
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

</div>
</template>


<script   setup>
import {ref}  from 'vue';
let invList = ref([
    {invNumber:1,invAmount:'发票1',invDate:'2023-01-01',createDate:123456,invCompany:'公司A',notes:'备注1'},
    {invNumber:2,invAmount:'发票2',invDate:'2023-01-01',createDate:123456,invCompany:'公司B',notes:'备注2'},
    {invNumber:3,invAmount:'发票3',invDate:'2023-01-01',createDate:123456,invCompany:'公司C',notes:'备注3'},
    
]);


</script>

<style    scoped>
</style> 
