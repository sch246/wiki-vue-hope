# git设置代理

设置

```cmd
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
```

清除

```cmd
git config --global --unset http.proxy
git config --global --unset https.proxy
```

