<template>
<div >
    <h1>class 和 style绑定</h1>
</div>
<div>

<h1 :class="{aa:hasColor}" >child</h1>

</div>

<div>
<button @click="changeColor">点击</button>
</div>
</template>

<script   setup>
import { ref } from 'vue';
const hasColor = ref(false);
const changeColor = () => {
  hasColor.value = !hasColor.value;
};

</script>

<style scoped>
.aa {
  color: #e811b2;
}

</style> 
