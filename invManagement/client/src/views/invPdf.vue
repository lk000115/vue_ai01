<template>
<div >
   <h3>读取pdf电子发票</h3>
      <n-button @click="selectPdf">选择 PDF 文件</n-button>
    <div v-if="error" class="error">{{ error }}</div> 
    <div v-if="invoiceInfo">
      <p>发票号码: {{ invoiceInfo.invNumber }}</p>
      <p>开票金额: {{ invoiceInfo.invAmount }}</p>
      <p>开票日期: {{ invoiceInfo.invDate }}</p>
      <p>发票内容信息: {{ pdftext }}</p>
    </div>
  </div>


</template>


<script   setup>
import { ref,inject,onMounted } from 'vue';
import * as pdfjs from 'pdfjs-dist/webpack';
import { BrowserQRCodeReader } from '@zxing/library';
import { useInvoiceStore } from '../common/invoiceStore';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/webpack/pdf.worker.js',
  import.meta.url
).toString();

const invoiceStore = useInvoiceStore();
const axios = inject('axios');
const message = inject('message');

const invoiceInfo = ref(invoiceStore.invoiceInfo);
const pdftext = ref(invoiceStore.pdftext);
const qrCodeData = ref('');
const error = ref('')
// 替换为你自己的 AppCode
const appCode = '3d82fe6e725741589a2ef77b88bcfffe'; 


onMounted(() => {
   invoiceInfo.value = invoiceStore.invoiceInfo;
  pdftext.value = invoiceStore.pdftext;
});




// 选择 PDF 文件
const selectPdf = async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.pdf';
  input.click();

  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);

      const textContent = await page.getTextContent();
      const text = textContent.items.map(item => item.str).join(' ');
      // console.log('提取的 PDF 文本内容:', text); // 打印提取的文本
      pdftext.value = text;
      invoiceStore.setPdfText(pdftext.value);
      // 提取图片并解析二维码
      const images = await extractImagesFromPage(page);
      await parseQRCodeFromImages(images); 
    
    //阿里云接口  
      try {
        // 将pdf文件转换为 Base64 编码
         const pdfBase64 = await convertFileToBase64(file);
        
        // 调用阿里云接口
          const result = await callAliyunOCR(pdfBase64);
        // 打印接口返回结果
        console.log('阿里云 OCR 接口返回结果:', result.data); 
        // processOCRResult(result);
      } catch (err) {
        error.value = '处理文件失败: ' + err.message;
      }


      parseInvoiceInfo(text);
      insertInvoiceData(invoiceInfo.value);
    }
  };
};

// 将文件转换为 Base64 编码
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      // console.log('PDF Base64 编码长度:', base64.length);
      // console.log('PDF Base64 编码前 100 个字符:', base64.substring(0, 100));
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};


// 调用阿里云 OCR 接口
const callAliyunOCR = async (base64) => {
  const requestData = {
    // 将参数名从 image 改为 img
    img: base64,
    configure: JSON.stringify({ side: "face" })
  };
  const requestHeaders = {
    'Authorization': `APPCODE ${appCode}`,
    'Content-Type': 'application/json; charset=UTF-8'
  };

  try {
   
    const response = await axios.post(
      'https://dgfp.market.alicloudapi.com/ocrservice/invoice',
      requestData,
      {
        headers: requestHeaders
      }
    );

    return response.data;
  } catch (err) {
    if (err.response) {
      console.error('服务器返回的错误响应数据:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('请求发生错误:', err.message);
    }
    throw new Error('调用阿里云 OCR 接口失败: ' + err.message);
  }
};



// 解析发票信息
const parseInvoiceInfo = (text) => {

  if (qrCodeData.value) {
    invoiceInfo.value = {
      invNumber: qrCodeData.value[3],
      invDate: qrCodeData.value[5],
      invAmount: qrCodeData.value[4],
    };
    invoiceStore.setInvoiceInfo(invoiceInfo.value);
  } else {
    invoiceInfo.value = {
      invNumber: '未找到',
      invDate: '未找到',
      invAmount: '未找到',
    };
  }
};



// 从页面提取图片
const extractImagesFromPage = async (page) => {
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await page.render({
    canvasContext: context,
    viewport
  }).promise;


  return canvas.toDataURL('image/png');
};

// 从图片解析二维码
const parseQRCodeFromImages = async (images) => {
  const codeReader = new BrowserQRCodeReader();
  try {
    const result = await codeReader.decodeFromImageUrl(images);
    qrCodeData.value = result.text.split(',');
    // console.log('二维码解析结果:', result.text);
  } catch (err) {
    // console.error('二维码解析失败:', err);
    error.value = '二维码解析失败'+ err;
    qrCodeData.value = '未找到二维码或解析失败';
  }
};



// 处理扫码结果插入到数据库
const insertInvoiceData = async (result) => {
  try {
    // console.log('准备插入发票数据:', result);
    const res = await axios.post('/api/add', result);
    // console.log(res.data);
    if (res.data.code === 200) {
      message.info('发票信息录入成功');
    } else {
      message.error('发票信息录入失败: ' + res.data.msg);
      error.value = '发票重复,录入失败: ' + res.data.msg;
    }
  } catch (err) {
    message.error('发票重复录入或其他原因: ' + err.message);

  }
}



</script>

<style    scoped>
.error {
  color: red;
  margin: 10px 0;
}

</style> 
