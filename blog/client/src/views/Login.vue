<template>
 <div class="login-panel">  
    <n-card title="卡片分段示例">
    <n-form  :model="admin" :rules="rules"> 

       <n-form-item path="account" label="帐号">
         <n-input v-model:value="admin.account" placeholder="请输入账号" />
       </n-form-item>
      <n-form-item path="password" label="密码">
         <n-input
         v-model:value="admin.password"
         type="password"
         placeholder="请输入密码"
         />
      </n-form-item>
 
    </n-form>    

        <template #footer>
           <n-checkbox v-model:checked="admin.rember"  label="记住我"/>
             <n-button  @click="login">登录</n-button>
        </template>

    </n-card>
  </div>
</template>

<script   setup>
import{ref} from 'vue';

const admin = ref({
    account: '',
    password: '',
    rember: false,
});
const rules = ref({
    account: [
      { required: true, message: '请输入账号', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
    ],
  });
  const login = () => {
    console.log('登录', admin.value);
  };


</script>

<style lang="scss" scoped>
.login-panel {
    width: 500px;
    margin:0 auto;
    margin-top: 130px;

}


</style> 

