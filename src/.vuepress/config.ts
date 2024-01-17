import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchProPlugin } from "vuepress-plugin-search-pro";

export default defineUserConfig({
  base: "/",

  head: [
    ["link", { rel: "icon", href: "/logo.svg" }],
    ['link', { rel: 'stylesheet', href: 'https://pyscript.net/releases/2024.1.1/core.css' }],
    ['script', { type: 'module', src: 'https://pyscript.net/releases/2024.1.1/core.js' }],

    // [
    //   "script",{
    //     src:"https://cdn.geogebra.org/apps/deployggb.js"
    //   }
    // ],
    // [
    //   "script",{
    //     src:"https://kz16.top/geogebra/ggbmd.js"
    //   }
    // ],
  ],

  lang: "zh-CN",

  theme,

  shouldPrefetch: false,
  plugins: [
    searchProPlugin({
      // 索引全部内容
      indexContent: true,
      // 为分类和标签添加索引
      customFields: [
        {
          getter: (page) => page.frontmatter.category,
          formatter: "分类：$content",
        },
        {
          getter: (page) => page.frontmatter.tag,
          formatter: "标签：$content",
        },
      ],
    }),
  ],
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
  },
});
