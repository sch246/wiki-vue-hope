# WSL hostname

```sh
echo -e "[network]\ngenerateHosts=false\nhostname=你想设置的名字" | sudo tee -a /etc/wsl.conf
```

```cmd
wsl --shutdown
```