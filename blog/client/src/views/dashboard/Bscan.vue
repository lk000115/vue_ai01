<template>
  <div class="content">
        <!-- 按钮，点击触发扫描事件 -->
    <button @click="startScanning">扫描电子发票二维码</button>
    <!-- 用于显示摄像头实时画面 -->
    <video v-if="isCameraActive" ref="video" autoplay></video>
    <!-- 用于显示扫描结果 -->
    <div v-if="scanResult">
      <p>发票号: {{ invoiceData.invoiceNumber }}</p>
      <p>发票金额: {{ invoiceData.invoiceAmount }}</p>
      <p>开票日期: {{ invoiceData.invoiceDate }}</p>
    </div>

  </div>
</template>
<script   setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { BrowserMultiFormatReader } from '@zxing/library';

// 定义引用和状态变量
const video = ref(null);
const isCameraActive = ref(false);
const scanResult = ref(null);
const invoiceData = ref({
  invoiceNumber: '',
  invoiceAmount: '',
  invoiceDate: ''
});

// 初始化二维码解码器
const codeReader = new BrowserMultiFormatReader();

// 打开摄像头
const openCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    console.log(stream);
    video.value.srcObject = stream;
    video.value.play();
    isCameraActive.value = true;
  } catch (err) {
    console.error('无法打开摄像头: ', err);
  }
};

// 开始扫描二维码
const startScanning = async () => {
  if (!isCameraActive.value) {
    await openCamera();
  }
  try {
    const result = await codeReader.decodeFromVideoElement(video.value);
    if (result) {
      const qrCodeText = result.text;
      const data = qrCodeText.split(',');
      if (data.length >= 7) {
        invoiceData.value.invoiceNumber = data[3]; // 发票号码
        invoiceData.value.invoiceAmount = data[4]; // 发票金额
        invoiceData.value.invoiceDate = data[5]; // 开票日期
        scanResult.value = true;
      }
    }
  } catch (err) {
    console.error('扫描二维码出错: ', err);
  }
};

// 停止摄像头
const stopCamera = () => {
  if (isCameraActive.value) {
    video.value.pause();
    video.value.srcObject.getTracks().forEach(track => track.stop());
    isCameraActive.value = false;
  }
};

onMounted(async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (video.value) {
      video.value.srcObject = stream;
    } else {
      console.error('未找到video元素');
    }
  } catch (err) {
    console.error('无法打开摄像头: ', err);
  }
});


// 组件卸载时停止摄像头
onUnmounted(() => {
  stopCamera();
});
 
</script>
<style scoped>
</style> 
