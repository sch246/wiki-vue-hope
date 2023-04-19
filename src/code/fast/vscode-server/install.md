# 安装

- [上课摸鱼必备 -- Vscode网页版的搭建教程](https://zhuanlan.zhihu.com/p/379632978)

首先去github下载并解压到服务器

- [https://github.com/coder/code-server/releases/download/v4.11.0/code-server-4.11.0-linux-amd64.tar.gz](https://github.com/coder/code-server/releases/download/v4.11.0/code-server-4.11.0-linux-amd64.tar.gz)

![](https://s2.loli.net/2023/04/19/FfvwQEZ1jB78tOh.png)

然后

```sh
cd code-server
export PASSWORD="你想设置的密码"
./bin/code-server --port 9999 --host 0.0.0.0 --auth password
```

当然为了图省事我没设置密码

```sh
cd code-server
./bin/code-server --port 8888 --host 0.0.0.0 --auth none
```

::: warning

注意要设成0.0.0.0才能外网访问，端口是啥感觉不是很重要，就是设成8080这种也许容易被攻击？

最好不要用root账号开启服务器，如果对方获取了root可能会造成巨大的破坏，可以新建个专门的账号

:::
