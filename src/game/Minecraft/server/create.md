---
order: 1
---

# 创建MC服务器

## VPS

### 选择 VPS

原光云 好像挺好的

腾讯云、阿里云好像也不错，就是贵，不过可以买按量付费的

### 设置`ssh-key`

现在的服务器可以创建时直接设置的样子

::: info [ssh免密登录](/code/fast/linux/ssh免密登录)
:::

### 连接 VPS

建议用 VSCode 的`Remote - SSH: Editing Configuration Files`拓展，能远程编辑/传输文件和ssh交互，唯一的问题是占用内存有点多

也可以直接打开一个 cmd 或者 powershell ，然后`ssh 用户名@地址`

例如我连接我的服务器就是`ssh root@sch246.top`，当然地址也能换成`xx.xx.xx.xx`这样的 ipv4 地址

如果前面`ssh-key`设置正确，应该不需要密码能直接进去，不然也可以在控制台查看密码

## Java

```
apt update
apt upgrade
apt search openjdk-17
apt install <你找到的jdk版本>
```

## mc服务器

打开 fabric 官网

- [https://fabricmc.net/](https://fabricmc.net/)

点击`download here`

点击`Minecraft Server`

选择想要的 mc 版本，下面的拉到最新就行

复制下面类似这样的命令，在你的服务器打算装mc的地方执行就行

```sh
curl -OJ https://meta.fabricmc.net/v2/versions/loader/1.20.1/0.14.21/0.11.2/server/jar
```

以上面为例，它应该会下载一个 mc服务器 的jar文件`fabric-server-mc.1.20.1-loader.0.14.21-launcher.0.11.2.jar`

然后下面是启动命令，`2G`是 mc服务器 可以占用的内存上限，如果服务器内存大可以调大一点

```sh
java -Xmx2G -jar fabric-server-mc.1.20.1-loader.0.14.21-launcher.0.11.2.jar nogui
```

为了方便可以把它写进一个启动脚本

```sh
echo 'java -Xmx2G -jar fabric-server-mc.1.20.1-loader.0.14.21-launcher.0.11.2.jar nogui' > run.sh
# 添加执行权限
chmod +x run.sh
```

以后启动服务器使用`./run.sh`就行了

第一次启动

```sh
./run.sh
```

第一次运行会下载一堆文件然后结束，并且提示你需要同意协议

打开`eula.txt`（刚刚下载的文件之一）

把`false`改成`true`就行

随后可以修改`server.properties`来设置服务器

::: details 默认设置可以在wiki查到

> [https://minecraft.fandom.com/zh/wiki/Server.properties](https://minecraft.fandom.com/zh/wiki/Server.properties)

``` 以下内容来自22w42a(1.19.3)
#Minecraft server properties
#（文件修改时间戳）
enable-jmx-monitoring=false
rcon.port=25575
level-seed=
gamemode=survival
enable-command-block=false
enable-query=false
generator-settings={}
enforce-secure-profile=true
level-name=world
motd=A Minecraft Server
query.port=25565
pvp=true
generate-structures=true
max-chained-neighbor-updates=1000000
difficulty=easy
network-compression-threshold=256
max-tick-time=60000
require-resource-pack=false
use-native-transport=true
max-players=20
online-mode=true
enable-status=true
allow-flight=false
initial-disabled-packs=
broadcast-rcon-to-ops=true
view-distance=10
server-ip=
resource-pack-prompt=
allow-nether=true
server-port=25565
enable-rcon=false
sync-chunk-writes=true
op-permission-level=4
prevent-proxy-connections=false
hide-online-players=false
resource-pack=
entity-broadcast-range-percentage=100
simulation-distance=10
rcon.password=
player-idle-timeout=0
force-gamemode=false
rate-limit=0
hardcore=false
white-list=false
broadcast-console-to-ops=true
spawn-npcs=true
spawn-animals=true
function-permission-level=2
initial-enabled-packs=vanilla
level-type=minecraft\:normal
text-filtering-config=
spawn-monsters=true
enforce-whitelist=false
spawn-protection=16
resource-pack-sha1=
max-world-size=29999984
```
:::

以下是我的服务器的设置（不是默认设置

```
#Minecraft server properties
#Sat Jun 10 14:39:57 CST 2023
enable-jmx-monitoring=false
rcon.port=25575                     # 开启rcon的话需要设置rcon的端口
level-seed=                 # 世界种子
gamemode=survival           # 默认游戏模式
enable-command-block=true   # 是否允许开启命令方块
enable-query=false
generator-settings={}
enforce-secure-profile=true
level-name=world2           # 重要，存档文件夹的名字，若没有则会创建新存档
motd=sch246 | server        # 在服务器界面显示的标语，不能超过59个字符
query.port=25565
pvp=true                    # 玩家之间能否互相攻击
generate-structures=true    # 是否在世界中生成结构（例如村庄或废弃矿洞）
max-chained-neighbor-updates=1000000
difficulty=normal           # 世界难度
network-compression-threshold=256
max-tick-time=60000
require-resource-pack=false # 若为true，不使用服务器资源包的玩家将被断开连接
use-native-transport=true
max-players=15              # 设置服务器能加入的玩家上限
online-mode=false           # 是否启用正版验证，若为true，则只有正版账号能加入
enable-status=true
allow-flight=true           # 若为false，悬空超过5秒的玩家会被踢出服务器。
broadcast-rcon-to-ops=true  # 向所有在线OP发送通过RCON执行的命令的输出。
view-distance=10            # 服务器向玩家发送的最远区块距离(默认是10个区块即160格)，玩家视距开再高也不能看到这以外的方块，若网络卡顿可以考虑减小这个值，最小为3
server-ip=
resource-pack-prompt=       # 大概是设置服务器设置的资源包的标题，没试过
allow-nether=true           # 若为false，下界传送门将不会生效
server-port=25565           # 服务器端口，需要在防火墙放行(如果有防火墙)，若不是25565，则玩家连接时需要在末尾带上端口号
enable-rcon=true                    # 是否启用rcon
sync-chunk-writes=true
op-permission-level=4       # 设置op的命令权限等级，若设为2，则不能使用`op`这种命令
prevent-proxy-connections=false
hide-online-players=false
resource-pack=              # 可选，可输入指向一个资源包的URI。玩家可选择是否使用该资源包。需要用`\`转义`:`和`=`
entity-broadcast-range-percentage=100
simulation-distance=10      # 超出此范围的实体不会被更新，对玩家也不可见，若网络卡顿可以考虑减小这个值，最小为3
rcon.password=12345ssdlh            # 开启rcon的话需要设置rcon的密码
player-idle-timeout=0       # 玩家挂机时达到指定时间把他踢出去，单位为分钟，0表示不限制
force-gamemode=false        # 是否强制玩家加入时为默认游戏模式。
rate-limit=0
hardcore=false              # 是否开启极限模式
white-list=false            # 白名单，若设为true，则只有白名单上的玩家能加入
broadcast-console-to-ops=true   # 向所有在线OP发送所执行命令的输出，默认为true
spawn-npcs=true
previews-chat=false
spawn-animals=true
function-permission-level=4 # 设置数据包的权限级别，默认为2，不能运行`op`这种指令
level-type=minecraft\:normal
text-filtering-config=
spawn-monsters=true
enforce-whitelist=false
spawn-protection=16         # 出生点保护半径，默认为16格
resource-pack-sha1=
max-world-size=29999984     # 设置世界半径，如果设置的 max-world-size 超过默认值的大小，那将不会起任何效果。
```

