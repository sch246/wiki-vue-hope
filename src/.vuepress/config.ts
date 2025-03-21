import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "sch246's wiki",
  description: "sch246的wiki",

  head: [
  ],

  theme,

  // 和 PWA 一起启用
  shouldPrefetch: false,

  // 代码超过6行才显示行号
  markdown: {
    code: {
      lineNumbers: 6,
    },
  },
  extendsMarkdown: (md) => {
    const f = md.renderer.rules.text ?? ((tokens, idx) => tokens[idx].content);
    md.renderer.rules.text = (...args) =>
        f(...args).replace(
          /##(.+)##/g,
          '<span title="你知道的太多了" class="cover">$1</span>'
        );
    let a = md.renderer.rules.fence
    md.renderer.rules.fence = function(tokens, idx, options, env, self) {
      const token = tokens[idx];
      const info = token.info.trim()
      // 检查语言是否为 "py edit"
      if (info.startsWith('py edit') || info.startsWith('python edit')) {
        // 转义单引号，并替换换行符
        const scriptContent = token.content
                              .replace(/'/g, "\\'")
                              .replace(/\n/g, '\\n');

        // 返回定制的 PyScriptEditor 组件
        const infos = info.split(/\s+/)
        if (infos.length>2){
          return `<pre type="py-editor" env="${infos[2]}">${token.content}</pre>`
        } else {
          return `<pre type="py-editor">${token.content}</pre>`
        }
        // if (infos.length>2){
        //   return `<PyScriptEditor :scriptContent="'${scriptContent}'" env="${infos[2]}" />`;
        // } else {
        //   return `<PyScriptEditor :scriptContent="'${scriptContent}'" />`;
        // }
      }
      // 默认渲染方式
      let b = a ?? self.renderToken
      return b(tokens, idx, options, env, self);
    };
  },

  plugins: [
  ],
});
