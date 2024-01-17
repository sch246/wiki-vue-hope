<template>
  <div ref="rootElement">
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 定义接收的 prop
const props = defineProps({
  scriptContent: {
    type: String,
    default: ''
  },
  env: {
    type: String,
    default: ''
  }
});

const rootElement = ref(null);

onMounted(() => {
  if (rootElement.value && rootElement.value.children.length===0) {
    let script = document.createElement('script');
    script.type = 'py-editor';
    if (props.env){
      script.setAttribute('env', props.env)
    }
    script.textContent = props.scriptContent;  // 使用传入的 prop
    rootElement.value.appendChild(script);
  }
});
</script>
