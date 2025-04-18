<template>
    <div >
        <h1>事件处理</h1>
        {{ count }}
</div>
<div>
    <button @click="handleClick(100)">add</button>
</div>

<div>
    <input type="text" @input="handleInput">
</div>
</template>

<script   setup>
import { ref } from 'vue'
const count = ref(0)
const handleClick = (num) => {
    count.value += num
}
const handleInput = (e) => {
    console.log(e.target.value)
}

</script>


<style scoped>
</style> 
