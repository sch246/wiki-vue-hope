import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  {
    text: "计算机",
    icon: "pepicons-pop:code",
    link: "/code/"
  },
  {
    text: "游戏",
    icon: "pepicons-pop:controller",
    link: "/game/"
  },
  {
    text: "数学",
    icon: "pepicons-pop:division",
    link: "/math/"
  },
  {
    text: "养生",
    icon: "pepicons-pop:flower",
    link: "/life/"
  },
  {
    text: "友情链接",
    icon: "pepicons-pop:chain",
    children: [
      {
        text: "脏脏子的博客",
        icon: "https://q1.qlogo.cn/g?b=qq&nk=339898749&s=40",
        link: "https://blog.messyghost.net/"
      },
    ],
  },
]);
