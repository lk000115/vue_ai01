<template>

    <div  class="scanner-container">
      <div v-if="!scanned" class="video-container"  >
        <video ref="videoElement" width="100%" autoplay playsinline></video>
      </div>

    <button @click="startScanner" :disabled="isScanning">开始扫描</button>
    <button @click="stopScanner" :disabled="!isScanning">停止扫描</button>
    <div v-if="error" class="error">{{ error }}</div>
     <!-- 新增显示原始数据的区域 -->
    <!-- <div v-if="rawData" class="raw-data">原始数据: {{ rawData }}</div> -->
    <div v-if="scanned">
      <h3>扫描结果:</h3>
      <p>发票号码: {{ invoiceData.invoiceNumber }}</p>
      <p>金额: {{ invoiceData.amount }}</p>
      <p>日期: {{ invoiceData.invoiceDate }}</p>
    </div>
    </div>


</template>


<script   setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { BrowserMultiFormatReader, Result } from '@zxing/library'
 
const videoElement = ref(null)
const scanned = ref(false)
const isScanning = ref(false)
const error = ref('')
const invoiceData = ref({
  invoiceNumber: '',
  amount: '',
  invoiceDate: ''
})
// 新增原始数据的响应式变量
// const rawData = ref('')

let codeReader = null
let videoStream = null
 
onMounted(() => {
  codeReader = new BrowserMultiFormatReader()
})
 
onBeforeUnmount(() => {
  stopScanner()
})
 
const startScanner = async () => {
  try {
    stopScanner()
    
    error.value = ''
    isScanning.value = true
    scanned.value = false
    
     // 检查摄像头权限
     // 检查浏览器是否支持 navigator.permissions API
    if (navigator.permissions && typeof navigator.permissions.query === 'function') {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' });
      if (permissionStatus.state === 'denied') {
        throw new Error('摄像头权限被拒绝，请在浏览器设置中重新授予权限');
      }
    }
    // 获取所有视频设备
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    let deviceId = null;

    // 尝试找到后置摄像头
    for (const device of videoDevices) {
      if (device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('rear')) {
        deviceId = device.deviceId;
        break;
      }
    }

    // 若未找到后置摄像头，使用第一个摄像头
    if (!deviceId && videoDevices.length > 0) {
      deviceId = videoDevices[0].deviceId;
    }

    if (!deviceId) {
      throw new Error('未找到可用的摄像头设备');
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: deviceId },
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    });
    
    videoStream = stream
    
    if (videoElement.value) {
      videoElement.value.srcObject = stream
      await videoElement.value.play()
    }
    
   

    // 调整解码器设置
 codeReader.decodeFromVideoDevice(
      deviceId, // 使用 facingMode 而不是设备 ID
      videoElement.value,
      (result, error) => {
        if (result) {
          console.log('解码成功:', result.text)
          onDecode(result.text)
        }
        if (error && !(error instanceof Result)) {
          console.error('解码错误:', error)
        }
      },
      {
        tryHarder: true,
        decodeInterval: 300,
        hints: {
          tryHarder: true,
          possibleFormats: ['QR_CODE', 'EAN_13', 'UPC_A', 'CODE_128', 'DATA_MATRIX']
        }
      }
    )
    
  } catch (err) {
    // console.error('启动扫描器失败:', err)
    error.value = '启动扫描器失败: ' + err.message
    isScanning.value = false
    
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop())
      videoStream = null
    }
    if (videoElement.value && videoElement.value.srcObject) {
      videoElement.value.srcObject = null
    }
  }
}
 
const stopScanner = () => {
  if (codeReader && isScanning.value) {
    codeReader.reset()
    isScanning.value = false
    
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop())
      videoStream = null
    }
    if (videoElement.value && videoElement.value.srcObject) {
      videoElement.value.srcObject = null
    }
  }
}
 
const onDecode = (result) => {
  // 存储原始数据
//   rawData.value = result
//   console.log('解码结果:', result)
  try {
    // 按逗号分割数据
    const parts = result.split(',');
    // 假设数据顺序为 发票号码, 未知字段 1, 未知字段 2, 金额, 日期, 未知字段 3, 未知字段 4
    invoiceData.value = {
      // 假设第 3 个字段为发票号码
      invoiceNumber: parts[3] || '',
      // 假设第 4 个字段为金额
      amount: parts[4] || '',
      // 假设第 5 个字段为日期
      invoiceDate: parts[5] || ''
    };
    scanned.value = true;
    isScanning.value = false;
  } catch (err) {
    // console.error('解析二维码失败，原始内容:', result, '错误信息:', err);
    error.value = `解析二维码失败: ${err.message}`;
  }
}

</script>
 
<style scoped>
.scanner-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  margin-top:40px ;
}
.error {
  color: red;
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}

.video-container {
  width: 100%;
  max-width: 400px;
  margin-bottom: 15px;
  border: 2px solid #42b983;
  border-radius: 8px;
  overflow: hidden;
}
</style> 
