import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

// import { cut } from 'nodejs-jieba'

export default hopeTheme({
  hostname: "https://sch246.com",

  author: {
    name: "sch246",
    url: "https://sch246.com",
  },

  logo: "/logo.svg",

  repo: "sch246/wiki-vue-hope",

  darkmode:"toggle",

  docsBranch: "master",

  pageInfo: ["Original", "Date", "Category", "Tag", "ReadingTime"],

  docsDir: "src",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 页脚
  footer: "",
  displayFooter: true,

  // // 加密配置
  // encrypt: {
  //   config: {
  //     "/demo/encrypt.html": {
  //       hint: "Password: 1234",
  //       password: "1234",
  //     },
  //   },
  // },

  // 多语言配置
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 此处开启了很多功能用于演示，你应仅保留用到的功能。
  markdown: {
    align: true,//居中和靠右
    attrs: true,// 启用属性
    codeTabs: true,//代码块分组
    component: true,//插入vue组件
    // demo: true,
    figure: true,// 启用 figure(图片)
    // gfm: true,
    imgLazyload: true,// 启用图片懒加载
    imgSize: true,// 启用图片大小
    include: true,//文件导入
    // mark: true,//使用 ==进行标记==
    // plantuml: true,//也是绘制图表的
    // spoiler: true,//剧透文字(!!内容!!)
    // stylize: [
    //   {
    //     matcher: "Recommended",
    //     replacer: ({ tag }) => {
    //       if (tag === "em")
    //         return {
    //           tag: "Badge",
    //           attrs: { type: "tip" },
    //           content: "Recommended",
    //         };
    //     },
    //   },
    // ],
    sub: true,// 启用下角标
    sup: true,// 启用上角标
    tabs: true,//选项卡
    // tasklist: true,//任务列表
    // vPre: true,

    // 取消注释它们如果你需要 TeX 支持
    math: {
      // 启用前安装 katex
      type: "katex",
      // 或者安装 mathjax-full
      // type: "mathjax",
    },

    // 如果你需要幻灯片，安装 @vuepress/plugin-revealjs 并取消下方注释
    // revealjs: {
    //   plugins: ["highlight", "math", "search", "notes", "zoom"],
    // },

    // 在启用之前安装 chart.js
    // chartjs: true,

    // insert component easily

    // 在启用之前安装 echarts
    // echarts: true,

    // 在启用之前安装 flowchart.ts
    // flowchart: true,

    // 在启用之前安装 mermaid
    mermaid: true,

    // playground: {
    //   presets: ["ts", "vue"],
    // },

    // 在启用之前安装 @vue/repl
    // vuePlayground: true,

    // 在启用之前安装 sandpack-vue3
    // sandpack: true,

    highlighter: {
      type: "shiki", // or "prismjs"

      
    },
  },

  // 在这里配置主题提供的插件
  plugins: {

    // slimsearch: {
    //   indexContent: false,
    //   suggestion: true,
    //   searchDelay: 500,
    //   indexOptions: {
    //     // 使用 nodejs-jieba 进行分词
    //     tokenize: (text, fieldName) =>
    //       fieldName === 'id' ? [text] : cut(text, true),
    //   },
    // },

    comment: {
      provider: "Waline",
      serverURL: "https://waline.sch246.com",
    },

    components: {
      components: ["Badge", "VPCard"],
    },

    icon: {
      assets: "iconify",
      // prefix: "fa6-solid:",
    },

    notice: [
      {
        path: "/", // 设置为 "/" 表示仅在首页路径触发弹窗
        title: "警告", // 弹窗标题
        content: `
          <div class="hint-container warning">
            <p class="hint-container-title">警告</p>
            <p>本站点不是严谨的学术论文，也不是成熟的技术教程。</p>
            <p>它是我个人的自留输出地，纯粹为了满足我“装逼”与“表达”的私欲而生。</p>
            <p>里面充满了 ENTP 式的直觉跳跃、未经严密考证的跨学科缝合、以及不可避免的虚饰与傲慢。</p>
            <p>我没有精力也不会去把它打磨成完美的闭环。</p>
            <p>如果你在这里看到了逻辑漏洞且感到虚伪，恭喜你，你是对的；如果你在这里看到了启发，那我们就完成了同频共振。</p>
            <p>欢迎在评论区讨论和发表意见，但恕我玻璃心，请嘴下留情。</p>
          </div>
        `,
        fullscreen: true, // 开启全屏模式，使其成为居中的开屏弹窗并带有模糊背景
        confirm: true,    // 设置为 true 时，用户不能点击空白处关闭，必须点击按钮
        // noticeKey: "home-splash-v1", // 可选：弹窗的唯一标识符
        actions: [
          {
            text: "我已了解，开始阅读",
            type: "primary",
          }
        ],
      },
    ],

    // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
