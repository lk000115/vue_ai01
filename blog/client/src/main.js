import naive from 'naive-ui'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {router} from "./common/router.js" 
import {createPinia} from "pinia";
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000'

const app = createApp(App)
app.use(router)
app.use(naive)
app.use(createPinia())
app.mount('#app')
