# alias

众所周知，linux里有alias可以给命令设置别名，这样的话就可以更简便地调用命令，执行一些快捷动作

## [doskey](https://learn.microsoft.com/zh-cn/windows-server/administration/windows-commands/doskey)

```bat
doskey ls=dir /b $*
# 多个命令用$t分割
doskey tx=cd temp$tdir/w $*
```

## 花里胡哨

首先找到一个文件夹，我这里是`E:/bats/`，然后把它添加进环境变量，之后创建的东西都在这里面了

可能需要重启电脑来应用环境变量

::: details python版本

写一个bat`alias.bat`

```bat
@echo off
python alias.py %*
```

写一个python程序`alias.py`

```py
from sys import argv

name = argv[1]
alias = ' '.join(argv[2:])

print("makefile: E:/bats/{name}.bat")
with open(f'E:/bats/{name}.bat','w') as f:
    f.write(f'@echo off\n{alias} %*')
```

:::

::: details c版本

写一个c程序`alias.c`

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[]) {
    char path[] = "E:/bats/";
    strcat(path, argv[1]);
    char alias[1024] = "";

    for (int i = 2; i < argc; i++) {
        strcat(alias, argv[i]);
        strcat(alias, " ");
    }

    strcat(path, ".bat");

    printf("makefile: %s", path);
    FILE *fp = fopen(path, "w");
    fprintf(fp, "@echo off\n%s %%*", alias);

    fclose(fp);
    return 0;
}
```

```sh
gcc alias.c -o alias
```

:::

于是就能快乐地使用alias了（创建的都是永久的）

```sh
alias ls dir /b $*
```