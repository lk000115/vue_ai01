<template>
<div class="invoice-scanner">
    <h2>发票二维码扫描</h2>
    
    <div v-if="!scanned" class="scanner-container">
      <qrcode-stream
        v-if="hasCameraAccess"
        @decode="onDecode"
        @init="onInit"
        :camera="camera"
        class="qrcode-stream"
      />
      
      <div v-else class="camera-error">
        <p>无法访问摄像头，请确保已授予摄像头权限。</p>
        <button @click="requestCameraAccess" class="retry-button">重试</button>
      </div>
      
      <p class="instructions">将发票二维码对准扫描框</p>
    </div>
    
    <div v-else class="invoice-info">
      <h3>发票信息</h3>
      <div class="info-item">
        <label>发票号码:</label>
        <span>{{ invoiceData.invoiceNumber }}</span>
      </div>
      <div class="info-item">
        <label>金额:</label>
        <span>{{ invoiceData.amount }} 元</span>
      </div>
      <div class="info-item">
        <label>开票日期:</label>
        <span>{{ invoiceData.invoiceDate }}</span>
      </div>
      
      <button @click="resetScanner" class="scan-again-button">重新扫描</button>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>


</template>

<script   setup>
import { ref } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'
 
const scanned = ref(false)
const hasCameraAccess = ref(false)
const camera = ref('auto')
const error = ref('')
const invoiceData = ref({
  invoiceNumber: '',
  amount: '',
  invoiceDate: ''
})
 
const onInit = async (promise) => {
  try {
    await promise
    hasCameraAccess.value = true
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      error.value = "ERROR: 您需要授予摄像头访问权限才能扫描二维码。"
    } else if (err.name === 'NotFoundError') {
      error.value = "ERROR: 未检测到可用的摄像头设备。"
    } else if (err.name === 'NotSupportedError') {
      error.value = "ERROR: 当前环境不支持摄像头访问。"
    } else if (err.name === 'NotReadableError') {
      error.value = "ERROR: 摄像头被占用，无法访问。"
    } else if (err.name === 'OverconstrainedError') {
      error.value = "ERROR: 安装的摄像头不合适。"
    } else if (err.name === 'StreamApiNotSupportedError') {
      error.value = "ERROR: 浏览器不支持流API。"
    }
    hasCameraAccess.value = false
  }
}
 
const onDecode = (result) => {
  try {
    // 解析二维码内容（假设是JSON格式）
    const invoiceInfo = JSON.parse(result)
    
    // 验证必要字段
    if (!invoiceInfo.invoiceNumber || !invoiceInfo.amount || !invoiceInfo.invoiceDate) {
      throw new Error('二维码内容不完整或格式不正确')
    }
    
    // 更新数据
    invoiceData.value = {
      invoiceNumber: invoiceInfo.invoiceNumber,
      amount: invoiceInfo.amount,
      invoiceDate: formatDate(invoiceInfo.invoiceDate)
    }
    
    scanned.value = true
  } catch (err) {
    error.value = `解析二维码失败: ${err.message}`
    console.error('解析二维码失败:', err)
  }
}
 
const formatDate = (dateString) => {
  // 假设日期格式为 YYYY-MM-DD 或 YYYYMMDD
  if (!dateString) return ''
  
  // 尝试解析 YYYY-MM-DD 格式
  if (dateString.includes('-')) {
    const [year, month, day] = dateString.split('-')
    return `${year}年${month}月${day}日`
  }
  
  // 尝试解析 YYYYMMDD 格式
  if (dateString.length === 8) {
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)
    return `${year}年${month}月${day}日`
  }
  
  return dateString
}
 
const resetScanner = () => {
  scanned.value = false
  error.value = ''
}
 
const requestCameraAccess = async () => {
  try {
    // 尝试重新初始化摄像头
    hasCameraAccess.value = false
    await new Promise(resolve => setTimeout(resolve, 500))
    hasCameraAccess.value = true
  } catch (err) {
    console.error('请求摄像头访问失败:', err)
  }
}



</script>


<style scoped>
.invoice-scanner {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}
 
.scanner-container {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
 
.qrcode-stream {
  width: 100%;
  max-width: 400px;
  border: 2px solid #42b983;
  border-radius: 8px;
  margin-bottom: 15px;
}
 
.instructions {
  margin-top: 10px;
  color: #666;
  font-style: italic;
}
 
.invoice-info {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f9f9f9;
}
 
.info-item {
  margin: 10px 0;
  display: flex;
}
 
.info-item label {
  font-weight: bold;
  width: 100px;
  color: #555;
}
 
.info-item span {
  flex: 1;
}
 
button {
  padding: 8px 16px;
  margin-top: 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}
 
button:hover {
  background-color: #3aa876;
}
 
.retry-button {
  background-color: #ff9800;
}
 
.retry-button:hover {
  background-color: #e68a00;
}
 
.scan-again-button {
  background-color: #2196f3;
}
 
.scan-again-button:hover {
  background-color: #0b7dda;
}
 
.error-message {
  color: #f44336;
  margin-top: 15px;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
}
 
.camera-error {
  text-align: center;
  margin-bottom: 15px;
}
</style> 

