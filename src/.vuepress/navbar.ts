import { navbar } from "vuepress-theme-hope";

export default navbar([
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
    text: "生活",
    icon: "pepicons-pop:soft-drink",
    link: "/life/"
  },
  {
    text: "文学",
    icon: "pepicons-pop:book",
    link: "/literature/"
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
