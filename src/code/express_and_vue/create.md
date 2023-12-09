---
order: 2
---
# 创建项目


首先找个空文件夹作为项目文件夹

cd进去，接下来所有修改都只影响这个文件夹

## 安装vue

- [cn.vuejs.org](https://cn.vuejs.org/)

```sh
pnpm create vue@latest
```

## 设置ssl证书

主要是为了，在用express启动时，vite自带的wss不报错

```js vite.config.js
//...

import fs from 'fs'

export default defineConfig({

  //...

  server: {
    https: {
      key: fs.readFileSync('/root/.acme.sh/mydomain.com_ecc/mydomain.com.key'),
      cert: fs.readFileSync('/root/.acme.sh/mydomain.com_ecc/fullchain.cer')
    }
  }
})
```

## 安装vite-express

- [vitejs](https://cn.vitejs.dev/guide/backend-integration.html)
  - [awesome-vite](https://github.com/vitejs/awesome-vite#integrations-with-backends)
    - [Vite + Express](https://github.com/szymmis/vite-express)

```sh
pnpm add express vite-express
```

创建服务器启动的入口，端口改成5173，因为vite默认端口也是5173，这样测试起来不用去改nginx

```js server.js
import express from "express";
import ViteExpress from "vite-express";

const app = express();

app.get("/message", (_, res) => res.send("Hello from express!"));

ViteExpress.listen(app, 5173, () => console.log("Server is listening..."));
```

## 启动

```sh
node server.js
```

应该可以通过域名访问了，并且有https
