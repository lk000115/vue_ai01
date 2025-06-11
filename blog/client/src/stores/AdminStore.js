import {defineStore} from 'pinia'

export const AdminStore = defineStore('admin', {
    state: () => {
        return {
            token: "", // 登录token
            account: "", // 账号
            id: 0, // 用户ID 
        } 
    },
    actions: {
        
    },
    getters: {
        
    }    
})
