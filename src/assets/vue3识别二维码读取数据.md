

### 步骤1 安装插件

npm install jsqr

### 步骤 2: 在Vue组件中引入jsQR



    import { onMounted, onUnmounted, ref } from 'vue';
    import jsQR from 'jsqr';
    
    export default {
      setup() {
        const video = ref(null);
        const canvas = ref(null);
        const ctx = ref(null);
        const qrResult = ref('');
    
    const startCamera = () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
          .then(stream => {
            video.value.srcObject = stream;
            video.value.play();
            scanQR();
          })
          .catch(error => console.error('Error accessing the camera:', error));
      } else {
        console.error('getUserMedia not supported');
      }
    };
     
    const scanQR = () => {
      if (video.value.readyState === 4) { // HAVE_ENOUGH_DATA (4) - metadata of the video is loaded
        ctx.value.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
        try {
          const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "rotate", // 如果二维码是旋转的，可以尝试不同的旋转角度来找到它
          });
          if (code) {
            qrResult.value = code.data; // 更新结果
          } else {
            requestAnimationFrame(scanQR); // 如果未找到二维码，则继续扫描
          }
        } catch (error) {
          console.error('Error scanning QR code:', error);
        }
      } else {
        requestAnimationFrame(scanQR); // 如果视频未准备好，则稍后重试
      }
    };
     
    onMounted(() => {
      ctx.value = canvas.value.getContext('2d');
      startCamera();
    });
     
    onUnmounted(() => {
      if (video.value.srcObject) {
        const tracks = video.value.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    });
     
    return { video, canvas, qrResult };
    
      }
    };


### 步骤 3: 在模板中使用摄像头和canvas元素

```

<template>
  <div>
    <video ref="video" width="640" height="480" autoplay></video>
    <canvas ref="canvas" width="640" height="480" style="display:none;"></canvas> <!-- Hidden for performance -->
    <p>QR Code Result: {{ qrResult }}</p> <!-- 显示扫描结果 -->
  </div>
</template>

```



