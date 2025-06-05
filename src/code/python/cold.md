# 冷知识


## readline

它可以为python的命令行界面提供补全，以及方向键的支持

```sh
# windows
pip3 install pyreadline3
# linux
pip3 install readline
```

如果linux安装不上，可以看python交互式命令行不能使用方向键(已废弃)

它也可以让`input()`支持方向键，需要显式 import

```py
import readline
while True:
    print(eval(input('>>> ')))
```

这样可以简单地模拟一个 python 命令行））

