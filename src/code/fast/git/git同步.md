# git 同步到服务器

反正我就一个人写写代码，想同步到服务器上的聊天机器人

## 初始化仓库

记得在之前先将主分支设为`main`而不是`master`，不然会弹警告，主要警告是master有歧义

```sh
git config --global init.defaultBranch main
```

然后 cd 到放代码的文件夹初始化仓库

```sh
git init
```

如果有想要忽略的文件而不是整个文件夹，这时候创建一个`.gitignore`文件并编辑

添加到暂存并且提交

```sh
git add .
git commit -m "init"
```

## 允许提交

```sh
git config receive.denyCurrentBranch ignore
```

::: warning
默认情况下，Git 服务器不允许在非裸仓库中更新当前分支，因为这会导致索引和工作树与您推送的内容不一致，需要使用 "git reset --hard" 命令来将工作树与 HEAD 匹配。

为了解决这个问题，您可以在远程仓库中设置 'receive.denyCurrentBranch' 配置变量，将其值设置为 'ignore' 或 'warn'，以允许向当前分支推送更改。

但是，这并不推荐，除非您已经以某种方式安排更新其工作树以匹配推送的内容。

如果您仍然想保持默认行为并禁止在非裸仓库中更新当前分支，可以将 'receive.denyCurrentBranch' 配置变量设置为 'refuse'。
:::

## 设置钩子

```sh
touch .git/hooks/post-receive
```

然后把这个塞进去

```sh
#!/bin/bash

# Location of the working directory on the server
WORK_DIR=/path/to/working/directory

# Branch that was pushed
BRANCH=$(git rev-parse --symbolic --abbrev-ref $1)

# Git checkout the branch that was pushed
GIT_WORK_TREE=$WORK_DIR git checkout -f $BRANCH
```

请注意，需要将 `WORK_DIR` 替换为服务器上的工作目录的路径。

还需要将 `BRANCH` 设置为您要推送到服务器上的分支的名称。

脚本将检查该分支的最新提交，并使用 `git checkout` 命令将更改应用到工作目录中。

## 客户端

```sh
git clone username@server_address:/path/to/repository
```

然后就能正常推送到服务器并更改服务器文件了

::: info
需要注意的是，在服务器的文件修改后，也需要同步到git仓库，才能被本地拉取

```sh
git add .
git commit -m 'example'
```
:::
