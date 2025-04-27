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
## 启动node后台服务模块
   有modemon  node-dev等工具

## js的模块化
1 node环境模块化 commonjs
  最开始,js文件导出时,export和module.exports都指向一个空对象,
  导出时以module.exports = {} 为准,
  ```
    例: exports.变量名 = 值;
        module.exports = {变量名:值,变量名:值} 即  module.exports = {变量1,变量2}
        导入 const {变量名1,变量名2} = require('路径');   
    
  ```
2 浏览器环境模块化 es6
  node版本12.20.0 以上,可以使用import和export,需要编辑package.json文件,添加type:module,
  三种导出方式:
       默认导出: export default xxx;
       命名导出: export const xxx = xxx;
       批量导出: export {xxx,xxx,xxx} 

3 art-template模板引擎
  html和数据拼接在服务器段,用npm安装art-template
  htmp和数据拼接在客户端,安装浏览器端template-web.js

