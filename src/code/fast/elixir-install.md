# Elixir & Phoenix 环境搭建日志 ( Ubuntu 24.04.3 LTS, ASDF v0.18+)

**系统环境**: Ubuntu 24.04.3 LTS (Root)
**时间**: 2026-01-07

- https://elixir-lang.org/install.html#version-managers

## 1. 安装 ASDF (二进制方式)

- https://asdf-vm.com/guide/getting-started.html

```bash
# 下载并解压
wget https://github.com/asdf-vm/asdf/releases/download/v0.18.0/asdf-v0.18.0-linux-amd64.tar.gz
tar -xzvf asdf-v0.18.0-linux-amd64.tar.gz
mv asdf /usr/local/bin/

# 清理安装包
rm asdf-v0.18.0-linux-amd64.tar.gz
```

## 2. 安装 Erlang
*Erlang 需要从源码编译，必须先安装系统依赖。*

- https://github.com/asdf-vm/asdf-erlang

```bash
# 添加插件
asdf plugin add erlang https://github.com/asdf-vm/asdf-erlang.git

# 安装编译依赖
apt-get update
apt-get -y install build-essential autoconf m4 libwxgtk3.2-dev libwxgtk-webview3.2-dev libgl1-mesa-dev libglu1-mesa-dev libpng-dev libssh-dev unixodbc-dev xsltproc fop libxml2-utils libncurses-dev libssl-dev

# 安装额外工具
apt-get install inotify-tools

# 查看有哪些版本
asdf list all erlang | grep "28"

# 安装 Erlang (耗时较长，约 10-20 分钟)
# 安装了最新版 (此处为 28.3)
asdf install erlang 28.3

# 可以在另一个窗口偷窥进度，具体填它弹出来的log位置 tail -f /root/.asdf/plugins/erlang/kerl-home/builds/asdf_28.3/otp_build_28.3.log


# 设置全局版本
asdf set --home erlang 28.3
```

## 3. 安装 Elixir
*Elixir 是预编译包，安装很快。注意版本要与 Erlang 对应 (otp-28)。*

- https://github.com/asdf-vm/asdf-elixir

```bash
# 添加插件
asdf plugin add elixir https://github.com/asdf-vm/asdf-elixir.git

# 查看有哪些版本
asdf list all elixir | grep "otp-28"

# 安装 Elixir (选择匹配 Erlang 28 的版本)
asdf install elixir 1.19.4-otp-28

# 设置全局版本
asdf set --home elixir 1.19.4-otp-28

# 刷新 shims (确保命令生效)
asdf reshim

# 配置环境变量 (将 shims 加入 PATH)
# 如果是 Bash:
echo 'export PATH="$HOME/.asdf/shims:$PATH"' >> ~/.bashrc
source ~/.bashrc

# 如果是 Zsh:
# echo 'export PATH="$HOME/.asdf/shims:$PATH"' >> ~/.zshrc
# source ~/.zshrc
```

## 4. 配置 Phoenix 开发环境
*这一步需要网络通畅*

```bash
# 安装包管理器 Hex
mix local.hex --force

# 安装构建工具 Rebar
mix local.rebar --force

# 安装 Phoenix 项目生成器
mix archive.install hex phx_new --force
```

## 5. 验证安装
```bash
elixir -v
# 应输出: Elixir 1.19.4 ... (compiled with Erlang/OTP 28) ...

mix phx.new -v
# 应输出: Phoenix installer v1.x.x
```

---

**根据本次经验总结:**
1.  **ASDF 路径问题**: 新版 ASDF 没有 `asdf.sh` 脚本，必须手动把 `~/.asdf/shims` 加到 `$PATH` 里，否则找不到 `elixir` 命令。
2.  **Erlang 依赖**: 必须装 `libssl-dev` 和 `libncurses-dev`，否则编译会报错或功能缺失。
3.  **Erlang 版本**: 28.0 有正则性能警告，直接上 **28.3** 或更高。
4.  **网络问题**: `mix local.hex` 偶尔超时，不过我重新运行就好了
