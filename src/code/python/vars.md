# 变量字典

python可以用`globals()`和`locals()`来获取全局变量字典和局部变量字典，`vars()`的行为和`locals()`类似

其中，`globals()`是实际的变量字典，而`locals()`似乎只是一种复制

这意味着往`globals()`内添加键将创建变量，而往`locals()`内添加键则不会

在模块层级上，`locals()`与`globals()`是同一个字典

## 运行代码

python 除了`eval()`可以解析表达式之外，还有`exec()`用于解析运行代码块

用法基本一致

`exec()`同样具有`__globals`和`__locals`参数

如果仅输入1个参数，那么行为将接近模块

如果2个都输入，那么行为将接近类，这意味着你不能使用类似递归的行为

## 修改locals

python 文档里有这样的一段话

> 不要更改此字典的内容；更改不会影响解释器使用的局部变量或自由变量的值。

这是出于性能考虑所以内部似乎不是用字典存储的

修改这个字典也确实不会影响到实际的值

不过还是有办法的

网上搜索找到了这样的方案，这是[原链接](https://pydev.blogspot.com/2014/02/changing-locals-of-frame-frameflocals.html)

首先使用`inspect`模块获取当前frame对象，修改完毕后用`PyFrame_LocalsToFast`把locals转换即可

作为举例，以下是一个inc函数，它会修改传入字符串所对应的变量，并且对其`+=1`，影响应该会在调用这个函数的地方显现出来

```py
import inspect, ctypes

def apply_loc(frame, replace=False):
    ctypes.pythonapi.PyFrame_LocalsToFast(ctypes.py_object(frame),ctypes.c_int(1 if replace else 0))

def inc(s:str):
    frame = inspect.currentframe().f_back
    frame.f_locals[s] += 1
    apply_loc(frame)

# 测试用函数
def f():
    i=0
    inc('i')
    # 应该会打印 1
    print(i)

f()
```

::: info
python3.11增加了函数[PyFrame_GetLocals](https://docs.python.org/3/c-api/frame.html#c.PyFrame_GetLocals)

![](https://s2.loli.net/2023/03/24/kl1eavHSGmfqX5w.png)
:::

