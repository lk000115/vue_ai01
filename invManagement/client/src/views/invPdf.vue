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
import { PaddleOCR } from 'paddleocr-js';

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

onMounted(() => {
  invoiceInfo.value = invoiceStore.invoiceInfo;
  pdftext.value = invoiceStore.pdftext;
});

// 初始化 PaddleOCR
const ocr = new PaddleOCR({
  lang: 'ch' // 中文识别
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
      console.log('提取的 PDF 文本内容:', text); // 打印提取的文本
      pdftext.value = text;
      invoiceStore.setPdfText(pdftext.value);
      // 提取图片并解析二维码
      const images = await extractImagesFromPage(page);
      await parseQRCodeFromImages(images); 
      
      // 使用 OCR 识别图片中的文字
      const viewport = page.getViewport({ scale: 6 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport
      }).promise;

      const imageDataUrl = canvas.toDataURL('image/png');

      try {
        const result = await ocr.recognize(imageDataUrl);
        const ocrText = result.map(item => item.text).join(' ');
        console.log('OCR 提取的文本内容:', ocrText);
        // 处理识别结果
        parseInvoiceInfo(ocrText);
      } catch (err) {
        console.error('OCR 识别失败:', err);
        error.value = 'OCR 识别失败: ' + err.message;
      }


      parseInvoiceInfo(text);
      insertInvoiceData(invoiceInfo.value);
    }
  };
};


// 解析发票信息
const parseInvoiceInfo = (text) => {
//   // 匹配中间部分的正则表达式
//   const regex = /(\d{10,24})(.*)$/
//   const match = text.match(regex);
// //   console.log('正则表达式:', regex); // 打印正则表达式
//   console.log('匹配结果:', match[0]); // 打印匹配结果
//   const parts = match[0].split(/\s+/);
//   console.log('提取的发票信息:', parts); // 打印提取的发票信息
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

// 增强图片预处理函数
const preprocessImage = (imageData) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  context.putImageData(imageData, 0, 0);

  const imageDataCopy = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageDataCopy.data;

  // 灰度化处理
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }

  // 自适应二值化处理（简单实现）
  const width = canvas.width;
  const height = canvas.height;
  const blockSize = 16;
  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      let sum = 0;
      let count = 0;
      for (let dy = 0; dy < blockSize; dy++) {
        for (let dx = 0; dx < blockSize; dx++) {
          const px = x + dx;
          const py = y + dy;
          if (px < width && py < height) {
            const index = (py * width + px) * 4;
            sum += data[index];
            count++;
          }
        }
      }
      const threshold = sum / count;
      for (let dy = 0; dy < blockSize; dy++) {
        for (let dx = 0; dx < blockSize; dx++) {
          const px = x + dx;
          const py = y + dy;
          if (px < width && py < height) {
            const index = (py * width + px) * 4;
            data[index] = data[index] > threshold ? 255 : 0;
            data[index + 1] = data[index] > threshold ? 255 : 0;
            data[index + 2] = data[index] > threshold ? 255 : 0;
          }
        }
      }
    }
  }

  // 对比度调整
  const contrast = 30;
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
    data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
    data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
  }

  // 锐化处理
  const sharpenMatrix = [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ];
  const tempData = new Uint8ClampedArray(data);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const index = ((y + ky) * width + (x + kx)) * 4 + c;
            const kernelIndex = (ky + 1) * 3 + (kx + 1);
            sum += tempData[index] * sharpenMatrix[kernelIndex];
          }
        }
        data[(y * width + x) * 4 + c] = Math.min(255, Math.max(0, sum));
      }
    }
  }

  context.putImageData(imageDataCopy, 0, 0);
  return canvas.toDataURL('image/png');
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

   const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
   return preprocessImage(imageData);

  // return canvas.toDataURL('image/png');
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

// 使用 OCR 提取图片中的文字




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
