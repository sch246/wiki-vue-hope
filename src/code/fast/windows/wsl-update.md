# WSL升级

- [总结Windows下安装WSL与升级WSL2的方法](https://blog.csdn.net/qq_35333978/article/details/113177819)

在windows搜索栏搜索`启用或关闭windows功能`

启用`Hyper-V`(但是我没启用啊)

似乎要下载升级包，我也不记得我下过没

- [https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)

查看wsl版本

```cmd
wsl --version
```

升级wsl

```cmd
wsl --update
```

设置默认为wsl2

```cmd
wsl --set-default-version 2
```

查看当前安装的系统是什么版本

```cmd
wsl -l -v
```

如果是wsl1则会显示1

记住想升级的系统的名字，假设为Ubuntu-18.04

```cmd
wsl --set-version Ubuntu-18.04 2
```
