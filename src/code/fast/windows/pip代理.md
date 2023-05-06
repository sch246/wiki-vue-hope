# pip 使用代理

::: info 由 GPT4 生成
:::

是的，你可以在运行`pip`时使用系统代理。你需要设置`HTTPS_PROXY`（或者`HTTP_PROXY`）环境变量，使其指向你的代理服务器。以下是如何在命令提示符（Command Prompt）或PowerShell中设置环境变量的方法。

对于命令提示符（Command Prompt），你可以使用以下命令设置环境变量：

```bash
set HTTPS_PROXY=http://your_proxy_server:your_proxy_port
set HTTP_PROXY=http://your_proxy_server:your_proxy_port
```

对于PowerShell，你可以使用以下命令设置环境变量：

```powershell
$Env:HTTPS_PROXY = "http://your_proxy_server:your_proxy_port"
$Env:HTTP_PROXY = "http://your_proxy_server:your_proxy_port"
```

请将`your_proxy_server`和`your_proxy_port`替换为你的代理服务器地址和端口。

设置好环境变量后，你就可以使用`pip`来安装或更新Python包了，它将自动使用你设置的代理服务器。

如果你想要永久设置代理，可以将这些环境变量添加到系统环境变量中。在Windows中，你可以通过以下步骤来设置：

1. 右键点击“计算机”图标（或“此电脑”），选择“属性”。
2. 在弹出的窗口中，点击“高级系统设置”。
3. 在“系统属性”窗口中，点击“环境变量”按钮。
4. 在“环境变量”窗口中，点击“新建”（在“系统变量”区域），并分别添加`HTTPS_PROXY`和`HTTP_PROXY`变量及其值。

完成上述步骤后，系统环境变量将永久生效。