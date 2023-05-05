# 安装python

又一次安装 python，上次是在 CentOS， 这次是在 Ubuntu

使用命令`./configure --prefix=/usr/local/python3 --enable-optimizations --with-ssl`有警告: 未知的参数

看起来还是要改成`--with-openssl=openssl的安装路径`

## 下载编译安装 openssl

::: details 首先确认是否有已安装的openssl

```sh
find /usr -name "openssl"
```

应该能看到类似 `/usr/local/openssl` 或 `/usr/include/openssl` 的路径。需要选择包含 `include` 和 `lib` 子目录的路径。

如果有的话，确认可用性，假设是`/usr/local/openssl/`

```sh
/usr/local/openssl/bin/openssl version
```

若成功，跳过步骤

:::

下载地址: [https://www.openssl.org/source/](https://www.openssl.org/source/)

```bash
# 下载
wget https://www.openssl.org/source/openssl-1.1.1s.tar.gz
# 解压
tar -zxvf ./openssl-1.1.1s.tar.gz
# 进入目录
cd openssl-1.1.1s
# 编译安装
# 在这之前确认这个位置没有文件
./config --prefix=/usr/local/openssl
make
make install
```

确认安装是否成功

```sh
/usr/local/openssl/bin/openssl version
```

:::: info
如果遇到了问题`/usr/local/openssl/bin/openssl: relocation error: /usr/local/openssl/bin/openssl: symbol EVP_mdc2 version OPENSSL_1_1_0 notypto.so.1.1 with link time reference`，这可能是因为系统上存在多个 OpenSSL 版本，导致链接时引用了错误的库文件
可以把原来的openssl删掉
或者更新环境变量
```sh
echo 'export PATH="/usr/local/openssl/bin:$PATH"' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH="/usr/local/openssl/lib:$LD_LIBRARY_PATH"' >> ~/.bashrc
echo 'export PKG_CONFIG_PATH="/usr/local/openssl/lib/pkgconfig:$PKG_CONFIG_PATH"' >> ~/.bashrc
source ~/.bashrc
```
或者，GPT提供了使用当前安装的openssl的方式，但是我用了好像没用
:::details
如果您的库文件位于 /usr/lib/x86_64-linux-gnu，头文件位于 /usr/include/openssl，则可以这样设置：
```sh
export LDFLAGS="-L/usr/lib/x86_64-linux-gnu"
export CPPFLAGS="-I/usr/include/openssl"
```
:::
::::

## 安装python

```
./configure --prefix=/usr/local/python3 --enable-optimizations --with-openssl=/usr/local/openssl
make && make install
```

::: info
后来遇到了`ModuleNotFoundError: No module named '_sqlite3'`
根据 GPT 的提醒，可以加上参数`--enable-loadable-sqlite-extensions`
:::

出现报错，`ModuleNotFoundError: No module named 'zlib'`

参考

- [安装python3.7时候，报错ModuleNotFoundError: No module named '_ctypes'](https://blog.csdn.net/wang725/article/details/79905612)
  - [Python3: ImportError: No module named '_ctypes' when using Value from module multiprocessing](https://stackoverflow.com/questions/27022373/python3-importerror-no-module-named-ctypes-when-using-value-from-module-mul)

运行以下命令，然后重新`make install`，解决

```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get dist-upgrade
sudo apt-get install build-essential python-dev python-setuptools python-pip python-smbus
sudo apt-get install build-essential libncursesw5-dev libgdbm-dev libc6-dev
sudo apt-get install zlib1g-dev libsqlite3-dev tk-dev
sudo apt-get install libssl-dev openssl
sudo apt-get install libffi-dev
```

收尾，为什么要这么做可以参考[优先级](优先级.md)

```
ln -sf /usr/local/python3/bin/python3.10 /usr/local/bin/python3
ln -sf /usr/local/python3/bin/pip3 /usr/local/bin/pip3
hash -d python3
hash -d pip3
```

## [python交互式命令行不能使用方向键](/blogs/2023-01-24-python命令行不能使用方向键.md)