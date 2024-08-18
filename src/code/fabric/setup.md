# 配置 fabric 开发环境

配置个环境也这么麻烦..

记下来以防万一

首先这是总的参考：[https://fabricmc.net/develop/](https://fabricmc.net/develop/)

次要参考，更详细：[https://fabricmc.net/wiki/zh_cn:tutorial:setup](https://fabricmc.net/wiki/zh_cn:tutorial:setup)

## 安装java

安装器可参考

- [https://adoptium.net/releases.html](https://adoptium.net/releases.html。)
- [https://bell-sw.com/pages/downloads](https://bell-sw.com/pages/downloads)

## 配置 VSCode

当然用万能的VSCode啦

搜索 java 扩展，安装 Extension Pack for Java 就行了

然后搜索 gradle 扩展，安装 Gradle for Java

## 下载项目模板

打开 [项目模板生成器](https://fabricmc.net/develop/template/)

模组名就填模组名就行

包名其实就是命名空间，虽然可以随便填，但是建议按照java的命名规范来，例如你有个域名叫foo.net，模组名是test-bar，那么包名就可以是net.foo.testbar啥的

版本不用说

高级选项默认就行

下载完毕后，解压到你喜欢的位置

## 打开项目并配置

新建一个空文件夹放项目，把压缩包解压进去

用 VSCode 打开这个文件夹，它会自动开始配置，不过不用管它，我们需要先手动修改gradle的配置，稍后再重新打开

开头可能卡在一个`gradle-8.8-bin.zip`下载半天下不好，可以打开`gradle\wrapper\gradle-wrapper.properties`修改里面的`distributionUrl`

你可以

- 改为镜像源，例如`distributionUrl=https://mirrors.cloud.tencent.com/gradle/gradle-8.8-bin.zip`
- 下载到本地，然后把本地路径改成`distributionUrl=file:///path/to/gradle-8.8-bin.zip`

::: info 这里的`:`前面可以加上反斜杠以增加兼容性
:::

可以在`gradle.properties`文件中配置java路径

```gradle.properties
org.gradle.java.home=C:/path/to/your/jdk-home
```

把梯子也加上，不然会很慢甚至构建不了，具体参考这个

- [如何加速Fabric模组的构建](https://fabricmc.cn/2021/06/28/%E5%A6%82%E4%BD%95%E5%8A%A0%E9%80%9FFabric%E6%A8%A1%E7%BB%84%E7%9A%84%E6%9E%84%E5%BB%BA/)

```gradle.properties
systemProp.http.proxyHost=127.0.0.1
systemProp.http.proxyPort=7897
systemProp.https.nonProxyHosts=10.*|localhost

systemProp.https.proxyHost=127.0.0.1
systemProp.https.proxyPort=7897
systemProp.https.nonProxyHosts=10.*|localhost
```

接下来就可以关闭VSCode，重新打开，它会自动配置gradle了

## 进一步配置并运行游戏

等待配置完成，点击左边的 Gradle 图标，会发现里面的 Tasks 多了很多任务，点击 Tasks 里面的 ide -> vscode，它就会生成 VSCode 的配置

::: info
也可以在终端中运行`./gradlew vscode`来生成配置
:::

接下来生成资源，点击 Tasks 里面的 fabric -> genSources，它就会开始下载所需的 Minecraft 资源，它会下载到`C:/Users/[YourUsername]/.gradle/caches/fabric-loom`文件夹下，保证下次不需要重复下载

::: info
也可以在终端中运行`./gradlew genSources` 来生成资源
:::

点击左边的运行和调试，会发现里面多了`Minecraft Client`和`Minecraft Server`两个配置，点击`Minecraft Client`就会运行客户端，点击`Minecraft Server`就会运行服务器，所有文件都在`run`文件夹下

::: info
可能会遇到控制台输出中文会乱码的问题，这是因为 Windows 的控制台默认编码是GBK，而 gradle 的输出默认是UTF-8，所以需要修改输出为GBK(修改终端的编码也行)

比较简单的方式是在启动参数里指定编码，可以在命令行里加上，就这个例子而言，我们可以直接修改 VSCode 的 debug 配置

打开`./.vscode/launch.json`文件，在对应项(例如`"name": "Minecraft Client"`)的`vmArgs`末尾加上`-Dfile.encoding=GBK`
:::

::: info
也可以在终端中运行`./gradlew runClient`来运行客户端，`./gradlew runServer`来运行服务器
:::

::: info
你也可以指定用户名

在`args`里面加上`--username [YourUsername]`即可
:::

最后看起来大概是这样(里面那`\u003d`就是`=`的转义，路径的`\\`也可以替换成`/`)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "java",
      "name": "Minecraft Client",
      "request": "launch",
      "cwd": "${workspaceFolder}/run",
      "console": "integratedTerminal",
      "stopOnEntry": false,
      "mainClass": "net.fabricmc.devlaunchinjector.Main",
      "vmArgs": "-Dfabric.dli.config\u003dC:\\Users\\sch246\\Downloads\\named-entities-template-1.21@@0020(1)\\.gradle\\loom-cache\\launch.cfg -Dfabric.dli.env\u003dclient -Dfabric.dli.main\u003dnet.fabricmc.loader.impl.launch.knot.KnotClient -Dfile.encoding=GBK",
      "args": "--username sch233",
      "env": {},
      "projectName": "named-entities-template-1.21 (1)"
    },
    // ...
  ]
}
```

## 结束

你可以把这个文件夹复制一份作为模板，这样以后就不用每次都重新配置了

