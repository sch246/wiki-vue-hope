# ubuntu安装node.js

- https://deb.nodesource.com/

```sh
sudo apt update
sudo apt install curl dirmngr apt-transport-https lsb-release ca-certificates
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
```

## 安装pnpm

```sh
npm install -g pnpm
```

::: info
记得可以使用`whereis`找可执行文件路径
:::
