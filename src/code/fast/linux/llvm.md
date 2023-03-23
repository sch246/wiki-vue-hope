# 安装llvm

## 添加源

去`https://apt.llvm.org/`找源

比如我的是 ubuntu 18.04(Bionic):

```sh
add-apt-repository 'deb http://apt.llvm.org/bionic/ llvm-toolchain-bionic main'
add-apt-repository 'deb http://apt.llvm.org/bionic/ llvm-toolchain-bionic-15 main'
add-apt-repository 'deb http://apt.llvm.org/bionic/ llvm-toolchain-bionic-16 main'
```

- [sources.list中的deb与deb-src之间的区别](https://qastack.cn/unix/20504/the-difference-between-deb-versus-deb-src-in-sources-list)

::: details 若出现错误

```sh
The following signatures couldn't be verified because the public key is not available: NO_PUBKEY 15CF4D18AF4F7421
```

对应处理，这里末尾的key取决于报错的是什么

```sh
apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 15CF4D18AF4F7421
```

- [ubuntu换源更新失败：The following signatures couldn‘t be verified because the public key is not available](https://blog.csdn.net/sxiaocaicai/article/details/119111365)

:::

## 安装

```sh
apt install llvm
```

出现错误，提示需要安装llvm-17

```sh
The following packages have unmet dependencies:
 llvm : Depends: llvm-runtime (= 1:17.0-58~exp1~20230129223910.17) but it is not going to be installed
        Depends: llvm-17 (>= 17~) but it is not going to be installed
```

然后再install llvm-17 发现需要 libgcc-s1 啥的

::: details 绕远路

怀疑是源不行所以换了源(先备份了)

```sh
sed -i 's/archive.ubuntu.com/mirrors.ustc.edu.cn/g' /etc/apt/sources.list
```

随后又试了aptitude

```sh
apt-get install aptitude
aptitude install llvm
```

它提示就少了gcc,,,, hum

```sh
The following packages have unmet dependencies:
 llvm-17-linker-tools : Depends: libgcc-s1 (>= 3.0) which is a virtual package and is not provided by any available package

                        Depends: libstdc++6 (>= 11) but 8.4.0-1ubuntu1~18.04 is installed
 llvm-17-dev : Depends: libgcc-s1 (>= 3.0) which is a virtual package and is not provided by any available package

 llvm-17-runtime : Depends: libgcc-s1 (>= 3.3) which is a virtual package and is not provided by any available package

                   Depends: libstdc++6 (>= 11) but 8.4.0-1ubuntu1~18.04 is installed
 libllvm17 : Depends: libgcc-s1 (>= 3.3) which is a virtual package and is not provided by any available package

             Depends: libstdc++6 (>= 11) but 8.4.0-1ubuntu1~18.04 is installed
 libclang-cpp17 : Depends: libgcc-s1 (>= 3.0) which is a virtual package and is not provided by any available package

                  Depends: libstdc++6 (>= 11) but 8.4.0-1ubuntu1~18.04 is installed
 llvm-17-tools : Depends: libgcc-s1 (>= 3.3) which is a virtual package and is not provided by any available package

                 Depends: libstdc++6 (>= 11) but 8.4.0-1ubuntu1~18.04 is installed
 llvm-17 : Depends: libgcc-s1 (>= 3.3) which is a virtual package and is not provided by any available package

           Depends: libstdc++6 (>= 11) but 8.4.0-1ubuntu1~18.04 is installed
The following actions will resolve these dependencies:

     Keep the following packages at their current version:
1)     libclang-cpp17 [Not Installed]                     
2)     libllvm17 [Not Installed]                          
3)     llvm [Not Installed]                               
4)     llvm-17 [Not Installed]                            
5)     llvm-17-dev [Not Installed]                        
6)     llvm-17-linker-tools [Not Installed]               
7)     llvm-17-runtime [Not Installed]                    
8)     llvm-17-tools [Not Installed]                      
9)     llvm-runtime [Not Installed]       
```

:::

于是去更新了gcc

```sh
add-apt-repository ppa:ubuntu-toolchain-r/test
apt update
apt install gcc
```

再次运行

```sh
apt install llvm
```

```
# llvm-as --version
Ubuntu LLVM version 17.0.0
  Optimized build.
```

成功