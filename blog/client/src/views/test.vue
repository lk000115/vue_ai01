
<template>
  <div class="scanner-container">
    <video ref="videoElement" class="video-stream"></video>
    <!-- 自定义扫描框 -->
    <div class="scan-overlay">
      <div class="scan-frame"></div>
    </div>
  </div>
</template>
<script   setup>
import { BrowserMultiFormatReader } from '@zxing/library';
import { ref, onMounted, onUnmounted } from 'vue';

const videoElement = ref(null);
let codeReader = new BrowserMultiFormatReader();

// 启动扫描
const startScan = async () => {
  try {
    const devices = await codeReader.listVideoInputDevices();
    await codeReader.decodeFromVideoDevice(
      devices[0].deviceId,
      videoElement.value,
      (result) => {
        if (result) {
          console.log('解码结果:', result.text);
          stopScan(); // 获取结果后关闭摄像头
        }
      }
    );
  } catch (error) {
    console.error('摄像头访问失败:', error);
  }
};

// 关闭摄像头
const stopScan = () => {
  codeReader.reset();
};

onMounted(startScan);
onUnmounted(stopScan);
</script>

<style scoped>

.scanner-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}
.video-stream {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.scan-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.scan-frame {
  width: 250px;
  height: 250px;
  border: 2px solid #ff0000;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
