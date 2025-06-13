import naive from 'naive-ui'
import {createDiscreteApi} from 'naive-ui'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {router} from "./common/router.js" 
import {createPinia} from "pinia";
import axios from 'axios';
import { AdminStore } from './stores/AdminStore.js';

axios.defaults.baseURL = 'http://localhost:3000'



const { message, dialog,notification} = createDiscreteApi(["message", "dialog","notification"]);

//设置全局使用axios
const app = createApp(App)
app.provide('axios', axios)
app.provide('message', message)
app.provide('dialog', dialog)
app.provide('notification', notification)
app.provide('server_url', axios.defaults.baseURL)

app.use(router)
app.use(naive)
app.use(createPinia())

//需要在pinia加载后方能使用store
const adminStore = AdminStore()
//axios 请求拦截器
axios.interceptors.request.use((config)=> {
    // 在发送请求之前做些什么
    config.headers.token = adminStore.token; // 设置token      
    return config;
  });


app.mount('#app')
