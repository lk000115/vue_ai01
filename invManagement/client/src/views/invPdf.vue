<template>
<div >
   <h3>读取pdf电子发票</h3>
      <n-button @click="selectPdf">选择 PDF 文件</n-button>
    <div v-if="invoiceInfo">
      <p>发票号码: {{ invoiceInfo.invNumber }}</p>
      <p>开票金额: {{ invoiceInfo.invAmount }}</p>
      <p>开票日期: {{ invoiceInfo.invDate }}</p>
      <p>开票公司: {{ invoiceInfo.invCompany }}</p>
    </div>
  </div>


</template>


<script   setup>
import { ref } from 'vue';
import * as pdfjs from 'pdfjs-dist/webpack';
import { BrowserQRCodeReader } from '@zxing/library';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/webpack/pdf.worker.js',
  import.meta.url
).toString();

const invoiceInfo = ref(null);
const qrCodeData = ref(null);

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
      parseInvoiceInfo(text);
     
      // 提取图片并解析二维码
      const images = await extractImagesFromPage(page);
      await parseQRCodeFromImages(images); 

    }
  };
};


// 解析发票信息
const parseInvoiceInfo = (text) => {
  // 匹配中间部分的正则表达式
  const regex = /(\d{10,24})(.*)$/
  const match = text.match(regex);
//   console.log('正则表达式:', regex); // 打印正则表达式
  console.log('匹配结果:', match[0]); // 打印匹配结果
  const parts = match[0].split(/\s+/);
  console.log('提取的发票信息:', parts); // 打印提取的发票信息
  if (match) {
    invoiceInfo.value = {
      invNumber: parts[0],
      invDate: `${parts[1]}-${parts[3]}-${parts[5]}`,
      invCompany: parts[9],
      invAmount: parts[17]
    };
  } else {
    invoiceInfo.value = {
      invNumber: '未找到',
      invDate: '未找到',
      invCompany: '未找到',
      invAmount: '未找到'
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
    qrCodeData.value = result.text;
    console.log('二维码解析结果:', result.text);
  } catch (err) {
    console.error('二维码解析失败:', err);
    qrCodeData.value = '未找到二维码或解析失败';
  }
};


</script>

<style    scoped>
</style> 
