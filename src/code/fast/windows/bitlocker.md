# BitLocker


暂停 BitLocker 加解密，你需要把下面的`G:`替换成对应的盘符

```cmd
manage-bde -pause G:
```

继续 BitLocker 加解密

```cmd
manage-bde -resume G:
```

键入 `manage-bde -?` 获取用法。

或者去[官网](https://learn.microsoft.com/zh-cn/windows-server/administration/windows-commands/manage-bde)查看
