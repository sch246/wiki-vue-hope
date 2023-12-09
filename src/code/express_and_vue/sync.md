---
order: 3
---
# 文件同步

由于我用vsc远程过去服务器会由于莫名原因卡死，我只能采用在本地编写同步过去的方法，因为vite检测到变化能自动重载所以挺好的

## 方法一：git同步

参考[git同步](../fast/git/git同步.md)

安装git

```sh
apt install git
```

cd 到项目目录，运行

```sh
git init
git add .
git commit -m "init"
git config init.defaultBranch main
git config receive.denyCurrentBranch ignore
echo "#!/bin/bash
# Git checkout the branch that was pushed
GIT_WORK_TREE=`pwd` git checkout -f main
" > .git/hooks/post-receive
chmod +x .git/hooks/post-receive
```

于是在其它地方可以这样git clone，记得替换`user`，`remote`，`/path/to/repo`

```sh
git clone user@remote:/path/to/repo
```

## 方法二：rsync同步

- [Cygwin 安装与卸载](https://zhuanlan.zhihu.com/p/100059570)
  - [Cygwin](https://cygwin.com/install.html)
    - [setup-x86_64.exe](https://cygwin.com/setup-x86_64.exe)

用Cygwin安装rsync，把安装目录下的bin文件夹添加进windows的环境变量中，重启电脑

但是我没有成功(x)报错

```sh
rsync: connection unexpectedly closed (0 bytes received so far) [Receiver]
rsync error: error in rsync protocol data stream (code 12) at io.c(231) [Receiver=3.2.7]
rsync: connection unexpectedly closed (0 bytes received so far) [sender]
rsync error: error in rsync protocol data stream (code 12) at io.c(231) [sender=3.2.7]
```

不知道怎么搞

<!-- 使用脚本，每三秒同步一次，记得修改`/path/to/your/repo/`，`user`，`/path/to/repo/`

```cmd
timeout /t 3
:loop
rsync -avz --delete /path/to/your/repo/ user@remote:/path/to/repo/
timeout /t 3
goto loop
``` -->
