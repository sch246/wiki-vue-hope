# ssl证书

可以通过使用 certbot 获得免费的 SSL 证书

```sh
sudo apt install certbot
```

这个命令将列出所有的证书，包括其域名、到期日期、证书路径等信息。

```sh
certbot certificates
```

生成证书，有效期三个月，你可以在快到期时重新生成证书，记得替换域名

- [Certbot命令行工具使用说明](https://www.cnblogs.com/dancesir/p/14329327.html)

```sh
sudo systemctl stop nginx
certbot certonly --rsa-key-size 2048 --standalone --agree-tos -d yourdomainname.info
sudo systemctl start nginx
```

或者

```sh
certbot certonly --rsa-key-size 2048 --nginx --agree-tos -d yourdomainname.info
```

如果想在证书到期或者出现其它问题时接收通知，可以设置邮件地址`--no-eff-email --email user@yourdomainname.info`

::: details GPT给出的参数说明

- `certonly`：指示 Certbot 仅生成 SSL/TLS 证书，并不会自动安装或配置任何 Web 服务器软件。
- `--rsa-key-size 2048`：指定证书的 RSA 密钥大小为 2048 位。较大的密钥通常更安全，但会对性能产生一定影响。
- `--standalone`：指示 Certbot 使用独立模式进行验证。在这种模式下，Certbot 将启动自己的 Web 服务器以验证您的域名，并在验证完成后关闭该服务器。请注意，这意味着您的 Web 服务器必须在证书更新期间停止，以避免端口冲突。
  - 注：如果在使用 nginx，可以不使用`--standalone`，而使用`--nginx`来告诉 certbot 使用 nginx 插件
- `--agree-tos`：指示您同意 Let's Encrypt 的服务条款。
- `--no-eff-email`：指示您不希望接收来自 Let's Encrypt 的效率改进电子邮件。
- `--email user@yourdomainname.info`：指定您的电子邮件地址，以便在证书到期或其他问题时接收通知。
- `-d yourdomainname.info`：指定您要为其生成 SSL/TLS 证书的主要域名。如果您想要为多个域名生成证书，则可以在 `-d` 参数后列出这些域名，中间用空格分隔。

:::

在网页上打开`https://yourdomainname.info:8448`应该能访问了

::: info 设置自动更新证书

首先

```sh
sudo certbot renew --nginx --dry-run
```

- `--nginx`表示使用 nginx 插件进行更新

这将执行一个模拟运行，以确保在实际更新证书之前，一切都可以正常工作。

```sh
sudo crontab -e
```

在末尾添加以下行，这将在每天3:30检测证书是否可以更新，如果离过期不到30天，更新证书

```
30 3 * * * certbot renew --nginx --quiet --post-hook "systemctl reload nginx"
```

- `--quiet` 参数使 Certbot 在执行时不产生任何输出
- `--post-hook` 参数指定在成功更新证书后重新加载 Nginx。

:::

