<template>

    <div  class="scanner-container">
        <div v-if="!scanned" class="video-container"  >
            <video ref="videoElement" width="100%" autoplay playsinline></video>
        </div>

        <n-button @click="startScanner" :disabled="isScanning">开始扫描</n-button>
        <n-button @click="stopScanner" :disabled="!isScanning">停止扫描</n-button>
    <div v-if="error" class="error">{{ error }}</div>
     <!-- 新增显示原始数据的区域 -->
    <!-- <div v-if="rawData" class="raw-data">原始数据: {{ rawData }}</div> -->
    <div v-if="scanned">
      <h3>扫描结果:</h3>
      <p>发票号码: {{ invoiceData.invNumber }}</p>
      <p>金额: {{ invoiceData.invAmount }}</p>
      <p>日期: {{ invoiceData.invDate }}</p>
      
    </div>

    </div>


</template>


<script   setup>
import { ref, onMounted, onBeforeUnmount,inject } from 'vue'
import { BrowserMultiFormatReader, Result } from '@zxing/library'
 
const axios = inject('axios');
const message = inject('message');
const videoElement = ref(null)
const scanned = ref(false)
const isScanning = ref(false)
const error = ref('')
const invoiceData = ref({
  invNumber: '',
  invAmount: '',
  invDate: ''
})
// 新增原始数据的响应式变量
// const rawData = ref('')
const isDecoded = ref(false) // 新增解码成功标识

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
     // 重置状态
    resetScanState();

    error.value = ''
    isScanning.value = true
    scanned.value = false
    
     // 检查摄像头权限
     // 检查浏览器是否支持 navigator.permissions API
    if (navigator.permissions && typeof navigator.permissions.query === 'function') {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' });
      if (permissionStatus.state === 'denied') {
        // 提示用户手动开启权限
        message.error('摄像头权限被拒绝，请在浏览器设置中重新授予权限');
        throw new Error('摄像头权限被拒绝，请在浏览器设置中重新授予权限');
      }
    }

    // 获取摄像头视频流
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' }, // 优先使用后置摄像头
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
      // deviceId, // 使用 facingMode 而不是设备 ID
       undefined, // 不指定设备 ID，使用 stream
      videoElement.value,
      (result, error) => {
        if (isDecoded.value) return // 如果已经解码成功，直接返回
        if (result) {
          console.log('解码成功:', result.text)
          onDecode(result.text)
          isDecoded.value = true // 设置解码成功标识
          stopScanner()
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

// 重置扫描状态
const resetScanState = () => {
  scanned.value = false;
  isScanning.value = false;
  isDecoded.value = false;
  error.value = '';
  invoiceData.value = {
    invNumber: '',
    invAmount: '',
    invDate: ''
  };
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
 // 检查是否已经扫描成功，避免重复处理
  if (scanned.value) return;
  try {
    // 按逗号分割数据
    const parts = result.split(',');
    // 假设数据顺序为 发票号码, 未知字段 1, 未知字段 2, 金额, 日期, 未知字段 3, 未知字段 4
    invoiceData.value = {
      // 假设第 3 个字段为发票号码
      invNumber: parts[3] || '',
      // 假设第 4 个字段为金额
      invAmount: parts[4] || '',
      // 假设第 5 个字段为日期
      invDate: parts[5] || ''
    };
    scanned.value = true;
    isScanning.value = false;
    isDecoded.value = true // 设置解码成功标识
   
    console.log('解析后的发票数据:', invoiceData.value);
    
   
    // 调用插入数据函数
    insertInvoiceData(invoiceData.value); 
   
  } catch (err) {
    // console.error('解析二维码失败，原始内容:', result, '错误信息:', err);
    error.value = `解析二维码失败: ${err.message}`;
  }
}

// 处理扫码结果插入到数据库
const insertInvoiceData = async (result) => {
  try {
    console.log('准备插入发票数据:', result);
    const res = await axios.post('/inv/add', {invNumber: result.invNumber, invAmount: result.invAmount, invDate: result.invDate});
    console.log(res.data);
    if (res.data.code === 200) {
      message.info('发票信息录入成功');
    } else {
      message.error('发票信息录入失败: ' + res.data.msg);
      error.value = '发票重复,录入失败: ' + res.data.msg;
    }
  } catch (err) {
    message.error('发票重复录入或其他原因: ' + err.message);
    // 重置扫描状态
    resetScanState();
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

