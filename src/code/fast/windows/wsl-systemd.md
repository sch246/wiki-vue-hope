# WSL systemd

- [WSL 2 上启用微软官方支持的 systemd](https://zhuanlan.zhihu.com/p/569883693)

```sh
echo -e "[boot]\nsystemd=true" | sudo tee -a /etc/wsl.conf
```

```cmd
wsl --shutdown
```

检查

```sh
ps --no-headers -o comm 1
```

如果命令返回的是`init`说明systemd未启用，如果是`systemd`那么你的systemd已启用成功了。

