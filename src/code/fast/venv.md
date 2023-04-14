# python虚拟环境

- [你学Python 虚拟环境 看这一篇就够了](https://zhuanlan.zhihu.com/p/216157886)

在当前目录创建名为`myenv`的虚拟环境

```
python -m venv myvenv
```

- Windows 系统中，激活脚本路径是 `<myvenv>\Scripts\activate.bat`，如果是 powershell 命令行，脚本换成 `Activate.ps1` , 注意将 `<myvenv>`换成你自己的虚拟环境目录
- Linux 系统中，激活脚本路径是 `<myvenv>/bin/activate`，默认脚本没有执行权限，要么设置脚本为可执行，要么用 `source` 命令执行，例如

```sh
source myvenv/bin/activate
```

退出，这个命令也在虚拟环境的脚本目录下

```
deactivate
```