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
import{ref,inject} from 'vue';
import { AdminStore } from '../stores/AdminStore';
import { useRouter,useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const adminStore = AdminStore();
const axios = inject('axios');
const message = inject('message');

const admin = ref({
    account: localStorage.getItem('account') || '',
    password: localStorage.getItem('password') || '',
    rember: localStorage.getItem('rember') == 1 || false,
});
const rules = ref({
    account: [
      { required: true, message: '请输入账号', trigger: 'blur' },
      { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
    ],
  });
  const login = async () => {
     let res = await axios.post('/admin/login', {
      account: admin.value.account,
      password: admin.value.password,});
      // console.log(res.data);
      if (res.data.code === 200) {
          adminStore.token = res.data.data.token;
          adminStore.account = res.data.data.account;
          adminStore.id = res.data.data.id;  
          if(admin.value.rember){
              localStorage.setItem('account', admin.value.account);
              localStorage.setItem('password', admin.value.password);
              localStorage.setItem('rember', admin.value.rember?1:0);
            
          }
          router.push({ path: '/dashboard' });
          message.info('登录成功');
      }else{
          message.error("登录失败，请检查账号或密码");  
      }
  };





</script>

<style lang="scss" scoped>
.login-panel {
    width: 500px;
    margin:0 auto;
    margin-top: 130px;

}


</style> 

