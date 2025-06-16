<!-- 富文本编辑器组件 -->
 <template>
 <div >
    <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
        style="border-bottom: 1px solid #ccc"
      />
      <Editor
        :defaultConfig="editorConfig"
        :mode="mode"
        v-model="valueHtml"
        style="height: 400px; overflow-y: hidden"
        @onCreated="handleCreated"
        @onChange="handleChange"
      />
 </div>
 </template>



 <script   setup>
import '@wangeditor/editor/dist/css/style.css';
import { onBeforeUnmount, ref, shallowRef, onMounted,inject } from 'vue';
import { Editor, Toolbar } from  '@wangeditor/editor-for-vue';


const server_url = inject('server_url'); // 从父组件注入 serverUrl
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
   // 内容 HTML
const valueHtml = ref('文章内容');

 const toolbarConfig = {};
 const editorConfig = { placeholder: '请输入内容...' };
 //配置上传文件
 editorConfig.MENU_CONF = {}
 
 editorConfig.MENU_CONF['uploadImage'] = {
   base64LimitSize: 10 * 1024, 
   server: server_url + '/upload/refile',
  }
  
  editorConfig.MENU_CONF['insertImage'] = {
    parseImageSrc: (src) => {
      // 处理图片 src，返回一个 Promise
      if(src.indexOf('http') !==0 ) {
        
        return `${server_url}${src}`; // 如果是完整的 URL，直接返回
      }
      return src ;
    }}
    
const mode = ref('default'); // 或者 'simple'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'heihei',}
  })

 const emit = defineEmits(['update:modelValue']); 

    let initFinished = false; // 初始化完成的标志
    // 模拟 ajax 异步获取内容
    onMounted(() => {
      setTimeout(() => {
        valueHtml.value = props.modelValue || '文章内容----';
        initFinished = true; // 标记初始化完成
      }, 30);
    });

       // 组件销毁时，也及时销毁编辑器，重要！
    onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor == null) return;

      editor.destroy();
    });

    // 编辑器回调函数
   const handleCreated = (editor) => {
      // console.log('created', editor);
      editorRef.value = editor; // 记录 editor 实例，重要！
    };
    const handleChange = (editor) => {
      // console.log('change:', editor.getHtml());
      emit('update:modelValue', valueHtml.value);
    };

 </script>

 
 <style scoped>
 </style> 
 