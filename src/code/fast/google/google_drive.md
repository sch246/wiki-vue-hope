# 谷歌云盘大文件下载

- 参考:[通过命令行从 Google Drive下载数据](https://lccurious.github.io/2021/05/15/Download-from-Google-Drive/)

首先有个能连google的linux服务器

写一个这样的bash脚本，假设是`./google_drive_download.sh`

```sh
#!/bin/bash


# Download zip dataset from Google Drive
filename=$1
fileid=$2
wget --load-cookies /tmp/cookies.txt "https://drive.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies /tmp/cookies.txt --keep-session-cookies --no-check-certificate 'https://drive.google.com/uc?export=download&id=${fileid}' -O- | sed -rn 's/.confirm=([1-9A-Za-z_]+)./\1\n/p')&id=${fileid}" -O ${filename} && rm -rf /tmp/cookies.txt
```

然后这样调用，最好在screen下面，这样就能撒手不管了

```sh
./google_drive_download.sh FILENAME FILEID
```

其中`FILENAME`填想下载到哪里，比如`./data/foo.zip`

`FILEID`填谷歌云盘的文件id

::: info 怎么获取文件id

![](https://s2.loli.net/2023/04/06/7IwKp6txQq3UviE.png)

![](https://s2.loli.net/2023/04/06/pr1oWbwL8DVfHaz.png)

注意设置下访问权限

复制链接，`FILEID`就在连接里面

```
https://drive.google.com/file/d/<FILEID>/view
```

:::