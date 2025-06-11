import naive from 'naive-ui'
import {createDiscreteApi} from 'naive-ui'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {router} from "./common/router.js" 
import {createPinia} from "pinia";
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000'

const { message, dialog,notification} = createDiscreteApi(["message", "dialog","notification"]);

//设置全局使用axios
const app = createApp(App)
app.provide('axios', axios)
app.provide('message', message)
app.provide('dialog', dialog)
app.provide('notification', notification)

app.use(router)
app.use(naive)
app.use(createPinia())
app.mount('#app')
