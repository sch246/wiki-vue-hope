<template>
  <div ref="rootElement">
    <!-- 组件的内容 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 定义接收的 prop
const props = defineProps({
  scriptContent: {
    type: String,
    default: ''
  }
});

const rootElement = ref(null);

onMounted(() => {
  if (rootElement.value) {
    let script = document.createElement('script');
    script.type = 'py-editor';
    script.textContent = props.scriptContent;  // 使用传入的 prop
    rootElement.value.appendChild(script);
  }
});
</script>
