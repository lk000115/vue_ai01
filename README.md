# Vue 3 + Vite

1. gitee上创建项目，名称vue_ai01
2. 打开vscode,克隆gitee项目仓库，选择电脑上存储仓库的目录
3. 进入电脑上刚刚存储的仓库目录的上级目录，执行命令 npm create vite@latest vue_ai01 
   选择vue-javascript，回车，等待安装完成
   安装完成后，进入vue_ai01目录，执行命令 npm install
   安装完成后，执行命令 npm run dev
4. 

静态资源目录：public, src/assets
1. public 
静态资源托管： 存放不需要处理的文件，如 favicon.ico、robots.txt 等。
绝对路径访问： 可以直接通过 / 开头的路径访问这些文件，无需担心路径转换问题。
示例：
  ```<!-- 直接引用 public 目录下的图片 -->
      <link rel="icon" href="/favicon.ico">
  ```    
2. assets  经过处理的资源，资源加工厂
与 public 文件夹不同，assets 文件夹用于存放那些需要经过 Vite 处理的资源文件。这包括样式表、JavaScript 文件
示例
假设你有一个项目 logo，你想对其进行压缩和优化。你可以将 logo.png 文件放在 assets 文件夹中，然后在 Vue 组件中这样引用它：
```  
   <script setup>
    import logo from '@/assets/logo.png';
   </script>

   <template>
      <img :src="logo" alt="Logo" />
   </template>
```






