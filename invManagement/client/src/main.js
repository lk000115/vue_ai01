import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import {router} from "./common/router.js" 
import naive from 'naive-ui'
import {createDiscreteApi} from 'naive-ui'
import axios from 'axios';

// 引入 vconsole 进行手机端调试
// import VConsole from 'vconsole';
// const vConsole = new VConsole();

//全局设置axios的基地址
// axios.defaults.baseURL = 'http://192.168.1.190:3000'
// 全局引入 naive-ui 消息组件,对话框组件
const { message, dialog,notification} = createDiscreteApi(["message", "dialog","notification"]);



const app = createApp(App)
app.provide('axios', axios)
app.provide('message', message)
app.provide('dialog', dialog)
app.provide('notification', notification)
app.provide('server_url', axios.defaults.baseURL)
app.use(router)
app.use(naive)

app.mount('#app')
