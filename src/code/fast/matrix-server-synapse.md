# 安装matrix服务器Synapse

这玩意的安装好麻烦的样子，，找的教程要么过时要么不全

不过我总算搞好了，所以记下来吧

## 安装

这个东西有好几种安装方法，包括docker，apt，python，我用的是ubuntu18.04，使用的是apt安装

几种安装方式可以看[官方文档](https://matrix-org.github.io/synapse/latest/setup/installation.html?highlight=install#installing-synapse)

```sh
sudo apt install -y lsb-release wget apt-transport-https
sudo wget -O /usr/share/keyrings/matrix-org-archive-keyring.gpg https://packages.matrix.org/debian/matrix-org-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/matrix-org-archive-keyring.gpg] https://packages.matrix.org/debian/ $(lsb_release -cs) main" |
    sudo tee /etc/apt/sources.list.d/matrix-org.list
sudo apt update
sudo apt install matrix-synapse-py3
```

它会有选择的窗口，用命令行显示的

- 第一个是确认域名，我也不知道之后能不能改，所以这里还是谨慎点
- 第二个是是否收集信息参与优化啥的，文档里有一些说明，对用户以随机的id跟踪以保护隐私，不过感觉会有些多余的通信，我就选否了

教程里说大概已经可以启动了

```sh
systemctl start matrix-synapse
systemctl enable matrix-synapse
```

不过我没启动，继续了后面的设置

## 配置

配置文件应该在`/etc/matrix-synapse/homeserver.yaml`，域名大概在`/etc/matrix-synapse/conf.d/server_name.yaml`设置

前者大概有好几百行，顺便，我开始时用的docker安装，大概只有十几行，可能是把注释都删了，和教程完全对不上，，

有一些需要注意的东西，不过总之，可以使用`systemctl status matrix-synapse`来查看日志，然后进行对应的配置

- `registration_shared_secret`
  - 注册用户需要用的密钥，教程里使用的是32位随机秘钥，使用`cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1`生成
- `macaroon_secret_key`
  - 不知道为什么启动时有这个警告，查看注释后，把这个的值也改为了上面生成的密钥
  - 不填会导致不能注册用户
- `trusted_key_servers`
  - 必填，默认含有`matrix.org`
  - `suppress_key_server_warning`
    - 若`trusted_key_servers`中含有`matrix.org`，这个需要为`true`，不然会弹一个警告
- `url_preview_enabled`
  - 如果需要开启链接预览功能，将此项设为`true`
  - `url_preview_ip_range_blacklist`
    - 要一起开
- `max_upload_size`
  - 设置文件上传大小，如果设置了反代，那么上传大小取它和反代的最小值

用systemctl重启来应用

```sh
systemctl restart matrix-synapse
```

更多的设置在[官网文档](https://matrix-org.github.io/synapse/latest/usage/configuration/config_documentation.html)

## 访问

它默认不会对外网开放，只能从本地端口访问，要测试可以使用`curl localhost:8008`看看有没有返回（反正我是这么试的）

虽然好像可以改`homeserver.yaml`的设置来开放，不过官方的推荐是使用反向代理

### nginx

安装并创建虚拟主机文件，如果想知道这玩意是怎么加载的，总的设置在`/etc/nginx/nginx.conf`

```sh
sudo apt install nginx
sudo nano /etc/nginx/sites-available/matrix
```

接下来把这个粘贴进去，记得替换域名

```sh
server {
    listen 80;
    # 这里改改域名
    server_name yourdomainname.info;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    # 这里改改域名
    server_name yourdomainname.info;

    # 这里改改2个域名，文件路径是后面步骤生成的文件的默认路径
    ssl_certificate /etc/letsencrypt/live/yourdomainname.info/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomainname.info/privkey.pem;

    location /_matrix {
        proxy_pass http://localhost:8008;
        proxy_set_header X-Forwarded-For $remote_addr;
        # Nginx 默认只允许1M的文件上传
        # 需要同时设置homeserver.yaml的max_upload_size，否则取二者的最小值
        client_max_body_size 10M;
    }
}

# This is used for Matrix Federation
# which is using default TCP port '8448'
server {
    listen 8448 ssl;
    # 这里改改域名
    server_name yourdomainname.info;

    # 这里改改2个域名，文件路径是后面步骤生成的文件的默认路径
    ssl_certificate /etc/letsencrypt/live/yourdomainname.info/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomainname.info/privkey.pem;

    location / {
        proxy_pass http://localhost:8008;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
}
```

### ssl

反向代理需要 SSL 证书才能工作

@include(./ssl.md{2-})

## 数据库

由于它原本自带的数据库(SQLite3)效率很低，所以要替换为其它数据库

这里安装PostgreSQL

```sh
apt-get install postgresql
```

切换用户

```sh
su postgres
```

进入命令行工具

```sh
psql
```

出现类似`postgres=#`的玩意后，输入

```
ALTER USER postgres WITH PASSWORD '12345678';
```

这意味着给用户postgres设置密码`12345678`

这里的`12345678`可以改成其它密码

创建数据库，数据库名为SYNAPSE，编码方式为UTF8，拥有者为postgres用户。

```
CREATE DATABASE synapse
ENCODING 'UTF8'
LC_COLLATE='C'
LC_CTYPE='C'
template=template0
OWNER postgres;
```

退出

```
\q
```

然后返回到root用户，修改用户postgres的密码，我也不知道要不要改成一样的，反正我改成一样的了

```
passwd postgres
```

编辑`/etc/matrix-synapse/homeserver.yaml`

注释掉类似于这个的东西

```yaml
#database:
#  name: sqlite3
#  args:
#    database: /var/lib/matrix-synapse/homeserver.db
```

加上

```yaml
database:
    name: psycopg2
    args:
        user: postgres
        password: 12345678
        database: synapse
        host: 127.0.0.1
        cp_min: 5
        cp_max: 10
        keepalives_idle: 30
        keepalives_interval: 10
        keepalives_count: 3
```

原本的位置有注释，不过我也没试过用注释的会怎么样

重启

```sh
systemctl restart matrix-synapse
```

## 参考

- [官方文档](https://matrix-org.github.io/synapse/latest/)
- [Matrix聊天服务器Synapse的搭建](https://east.moe/archives/1175)
- [How to set up a Matrix Synapse server in Ubuntu 20.04](https://bitlaunch.io/blog/how-to-set-up-a-matrix-chat-server-in-ubuntu-20-04/)

