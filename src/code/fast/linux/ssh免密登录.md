# ssh免密登录



## 创建

首先生成ssh的rsa秘钥

- [如何使用Ssh Keygen生成RSA密钥？](https://blog.csdn.net/cunjiu9486/article/details/109075429)

```sh
ssh-keygen
```

按照默认的来就行

## 分发

私钥(`id_rsa`)一般放自己电脑`<用户>/.ssh/`下，

::: details 如果修改了名称的话
需要修改`<用户>/.ssh/config`文件，来指定连接不同主机时使用的私钥

config里的格式大概长这样
```
Host a_custom_name
  HostName example.com
  User root
  IdentityFile "C:/Users/98000/.ssh/id_rsa"
```
也可以在连接的时候使用`-i`指定私钥

```sh
ssh -i 私钥路径 用户名@主机地址
```
:::


公钥(`id_rsa.pub`)可以复制文本，放服务器`~/.ssh/authorized_keys`这个文件内，这个文件内每行是一个公钥，代表受信任的设备

