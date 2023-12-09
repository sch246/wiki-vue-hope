---
order: 1
---
# 安装


首先假设已经有一个有公网的云服务器，放开所有端口(x，如果有防火墙就找报错然后放行端口)

然后还有一个域名，已经指向了这个云服务器

## 安装node

@include(../fast/linux/nodejs.md{2-})

## 安装nginx

```sh
apt update
apt install nginx
```

配置文件在`/etc/nginx/nginx.conf`

里面会引用其它的配置文件例如

```sh
        include /etc/nginx/conf.d/*.conf;
        include /etc/nginx/sites-enabled/*;
```

`sites-enabled`只是引用`sites-available`里的，里面有个`default`是用来测试nginx的，可以直接删掉，不然会占用80端口

设置开机启动

```sh
systemctl enable nginx
```

## 配置ssl

注意这里只能填localhost不能填127.0.0.1，我也不知道为什么

@include(../fast/ssl.md{2-})

