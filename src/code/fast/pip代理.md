# pip 使用代理

::: info 由 GPT4 生成
:::

要让 `pip` 通过代理访问网络，您可以使用 `--proxy` 命令行选项，或者设置 `HTTP_PROXY` 和 `HTTPS_PROXY` 环境变量。以下是两种方法的详细说明：

## 方法 1：使用 `--proxy` 命令行选项

在使用 `pip` 安装或更新软件包时，可以使用 `--proxy` 选项指定代理服务器。例如：

```bash
pip install --proxy=http://proxy.example.com:8080 some_package
```

或者，如果您的代理服务器使用 HTTPS：

```bash
pip install --proxy=https://proxy.example.com:8080 some_package
```

## 方法 2：设置环境变量

另一种方法是通过设置 `HTTP_PROXY` 和 `HTTPS_PROXY` 环境变量来配置代理。这样，`pip` 会自动使用这些环境变量中指定的代理服务器。

### Windows

对于 Windows 用户，在命令提示符中设置环境变量：

```cmd
set HTTP_PROXY=http://proxy.example.com:8080
set HTTPS_PROXY=https://proxy.example.com:8080
pip install some_package
```

对于PowerShell，你可以使用以下命令设置环境变量：

```powershell
$Env:HTTPS_PROXY = "http://proxy.example.com:8080"
$Env:HTTP_PROXY = "http://proxy.example.com:8080"
```

设置好环境变量后，你就可以使用`pip`来安装或更新Python包了，它将自动使用你设置的代理服务器。

如果你想要永久设置代理，可以将这些环境变量添加到系统环境变量中。在Windows中，你可以通过以下步骤来设置：

1. 右键点击“计算机”图标（或“此电脑”），选择“属性”。
2. 在弹出的窗口中，点击“高级系统设置”。
3. 在“系统属性”窗口中，点击“环境变量”按钮。
4. 在“环境变量”窗口中，点击“新建”（在“系统变量”区域），并分别添加`HTTPS_PROXY`和`HTTP_PROXY`变量及其值。

完成上述步骤后，系统环境变量将永久生效。

### Linux 或 macOS

对于 Linux 和 macOS 用户，在终端中设置环境变量：

```bash
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=https://proxy.example.com:8080
pip install some_package
```

请注意，这些环境变量仅在当前终端会话中有效。如果您希望代理设置在系统范围内生效，可以将相应的 `export` 命令添加到 shell 的配置文件（如 `~/.bashrc`、`~/.bash_profile` 或 `~/.zshrc`）中。

使用上述方法之一，您可以配置 `pip` 通过代理服务器访问网络。请将 `proxy.example.com` 和端口 `8080` 替换为您的代理服务器的实际地址和端口。
