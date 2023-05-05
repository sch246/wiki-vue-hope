# openai API 反向代理

## 安装nginx

```sh
sudo apt-get update
sudo apt-get install nginx
```

## 生成ssl证书

如果不需要 https，那么可以跳过这步

<!-- @include: ./code/fast/ssl.md{2-68} -->

## 配置

由GPT4生成大部分内容

创建一个新的Nginx配置文件，例如`/etc/nginx/sites-available/openai-proxy`：
```sh
sudo nano /etc/nginx/sites-available/openai-proxy
```

在该文件中，粘贴以下配置内容，记得将`yourdomain.com`替换成服务器的域名：

::: info 没有域名可以用`_`代替，这将匹配任何请求
:::

::: code-tabs

@tab http

```sh
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass https://api.openai.com;
        proxy_ssl_server_name on;
        proxy_ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    }
}
```

@tab https

```sh
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;

    location / {
        proxy_pass https://api.openai.com;
        proxy_ssl_server_name on;
        proxy_ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    }
}

```
:::

保存并关闭文件。

为配置文件创建一个符号链接，使其在`sites-enabled`目录中可用：
```sh
sudo ln -s /etc/nginx/sites-available/openai-proxy /etc/nginx/sites-enabled/
```

删除默认的Nginx配置文件链接：
```sh
sudo rm /etc/nginx/sites-enabled/default
```

为了确保没有配置错误，测试Nginx配置：
```sh
sudo nginx -t
```

如果测试成功，则重新加载Nginx配置：
```sh
sudo systemctl reload nginx
```

现在您的Nginx已经配置为将`yourdomain.com`的请求代理到`api.openai.com`。请确保您的域名DNS已正确指向Ubuntu服务器的IP地址。

如果您还没有为`yourdomain.com`配置SSL证书，建议使用Let's Encrypt的免费证书，以便启用HTTPS。您可以参考[这个教程](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-18-04)来配置Let's Encrypt。
