# 安装zerotier

参考：

- [zerotier自建moon教程](https://www.wnark.com/archives/152.html)

国内直接安装不行，所以得这样

- [Zerotier Mirror](https://mirrors.sustech.edu.cn/help/zerotier.html)

```sh
curl https://install.zerotier.com/ | sed 's,download.zerotier.com/,mirrors.sustech.edu.cn/zerotier/,g' | sudo bash
```

安装后会显示一个十位的id，记下来

```sh
*** Success! You are ZeroTier address [ <本机id> ].
```

设置开机启动

```sh
systemctl enable zerotier-one
```

加入自己的网络，然后在网页那边应该能看到刚刚记下来的id，就能设置它的ip了

```sh
zerotier-cli join <网络id>
```

- [https://my.zerotier.com/network](https://my.zerotier.com/network)

## 设置moon

- [官方文档](https://docs.zerotier.com/zerotier/moons/)

### 配置

生成`moon.json`模板

```sh
cd /var/lib/zerotier-one
zerotier-idtool initmoon identity.public >>moon.json
```

打开`moon.json`，在`stableEndpoints`里，填上`<公网ip或域名或刚刚设置的ip>/<端口>`，端口默认是9993，如果服务器有防火墙记得放行

就是这样

```json
{
 "id": "<本机id>",
 "objtype": "world",
 "roots": [
  {
   "identity": "...",
   "stableEndpoints": ["<公网ip或域名或刚刚设置的ip>/<端口>"]
  }
 ],
 "signingKey": "...",
 "signingKey_SECRET": "...",
 "updatesMustBeSignedBy": "...",
 "worldType": "moon"
}
```

生成签名文件

```sh
zerotier-idtool genmoon moon.json
```

它会生成一个`000000<本机id>.moon`的文件

把它放进`moons.d`

```sh
mkdir moons.d
mv 000000<本机id>.moon moons.d
# 重启服务
systemctl restart zerotier-one
```

## 连接

在客户端

```sh
# 这里的`<moon id>`是前面的`<本机id>`
zerotier-cli orbit <moon id> <moon id>
```

然后重启 zerotier

## 测试

```sh
zerotier-cli listpeers
```

应该有类似这样的输出

```sh
200 listpeers <ztaddr> <path> <latency> <version> <role>
...
200 listpeers <moon id> - -1 1.12.2 MOON
...
```

