<template>
    <div>
      <div id="editor"></div>
    </div>
  </template>

<script>
export default {
mounted() {
    // 创建script标签
    let script = document.createElement('script');
    script.type = 'py-editor';
    script.setAttribute('target', 'editor');
    script.textContent = `
import sys
print(sys.version)
`;

    // 将script标签添加到DOM中
    this.$el.appendChild(script);
}
}
</script>