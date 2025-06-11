```vue:d:\code\vue_ai01\blog\client\src\views\test.vue
<template>
<div >
    <h2>
        test页面----------------
    </h2>
    <qrcode-reader @decode="onDecode" @init="onInit" />
    <div v-if="result">扫描结果: {{ result }}</div>
</div>
</template>
<script   setup>
import { ref } from 'vue';
import { QrcodeReader } from 'vue-qrcode-reader';

const result = ref('');

const onDecode = (decodedString) => {
  result.value = decodedString;
};

const onInit = (err) => {
  if (err) {
    console.error('二维码扫描器初始化失败:', err);
  } else {
    console.log('二维码扫描器初始化成功');
  }
};
</script>
<style scoped>
</style>
