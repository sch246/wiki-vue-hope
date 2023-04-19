# 插件

## 安装

可以登录自己的账号来同步插件

也可以点击插件详情，去官网下载插件安装包

应该是`.vsix`文件

如果运行vscode的可执行文件是`./bin/code-server`，要安装的文件在`/opt/jamesmaj.easy-icons-0.3.1.vsix`，那么这样安装

```sh
./bin/code-server --install-extension /opt/jamesmaj.easy-icons-0.3.1.vsix
```

## 插件目录

`~/.local/share/code-server/extensions/`