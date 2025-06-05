# 安装和配置aria2

参考

- [下载神器 aria2 安装、配置教程（适用于 Linux）](https://www.bilibili.com/read/cv16612773/)

## 安装

```sh
apt install aria2
```

## 配置

默认的配置文件在`~/.aria2/aria2.conf`，不过也可以指定配置文件，例如这样：`--conf-path=/root/.aria2/aria2.conf`

这是一个示例

```sh title="/root/.aria2/aria2.conf"
rpc-secret=<密码>
enable-rpc=true
rpc-listen-all=true
```

- `rpc-secret`：设置 RPC 密钥。这个密钥主要用于在 JSON-RPC 客户端和 Aria2 服务器之间进行通信时的认证。这里的值应保密并仅在客户端和服务器之间共享。

- `enable-rpc`：启用 RPC 功能。这将允许 Aria2 通过 JSON-RPC 或 XML-RPC 接口与其他程序进行通信。这通常用于实现远程控制或与图形界面程序的集成。

- `rpc-listen-all`：允许所有网络接口上的连接访问 RPC 服务。如果设置为 false，仅限于本地主机（127.0.0.1 或 ::1）访问 RPC 服务。将其设置为 true 可以允许从其他设备（例如您的手机或另一台计算机）远程访问 Aria2。但请确保正确设置了`rpc-secret`以保证安全。

## 后台及开机自启

注意把`/root/.aria2/aria2.conf`替换成你放配置文件的地方

```sh
# 创建并写入文件
echo "[Unit]
Description=Aria2
[Service]
ExecStart=/usr/bin/aria2c --conf-path=/root/.aria2/aria2.conf
[Install]
WantedBy=multi-user.target" > /usr/lib/systemd/system/aria2.service
# 启动
systemctl start aria2
# 自启动
systemctl enable aria2
```

- `[Unit]`: 这是一个 `Unit` 部分，包含了有关服务的基本信息。
  - `Description=Aria2`: 设置服务的描述为 "Aria2"。

- `[Service]`: 这是一个 `Service` 部分，定义了如何启动和管理服务。
  - `ExecStart=/usr/bin/aria2c --conf-path=/root/.aria2/aria2.conf`: 指定启动服务时要执行的命令。在这里，它将执行 `/usr/bin/aria2c` 并设置配置文件路径为 `/root/.aria2/aria2.conf`。

- `[Install]`: 这是一个 `Install` 部分，定义了如何安装服务。
  - `WantedBy=multi-user.target`: 指定服务应该被安装到 `multi-user.target` 目标下。当系统达到 `multi-user.target` 状态时，该服务将被启动。这通常意味着 Aria2 服务在启动多用户模式时会自动运行。

检查状态

```sh
systemctl status aria2
```

