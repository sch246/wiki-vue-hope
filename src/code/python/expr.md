# 纯表达式(迷惑行为)

python在3.8版本增加了海象运算符`:=`，就是赋值语句的表达式版本

自此，除了with和异常处理之外，所有的操作都可以在表达式中完成了

```py
# 赋值
(a:=1)
# 顺序执行
[print(1),print(2),print(3)]
# 条件语句
[1 if x else 2]
# for循环
[print(i) for i in [1,2,3]]
# 函数定义
(f:=lambda x:x**2)
# 函数及其返回值
(f:=lambda x:[(y:=x**2),y].pop())
# 递归函数
(f:=lambda x:1 if x==1 else x*f(x-1))
# 列表/字典赋值
(lst.__setitem__(0,2))
# 切片赋值
(lst.__setitem__(slice(0,2),[1,2,3,4,5,6]))
# 属性赋值
(a.__setattr__('b',var))
# +=之类的运算
(a.__iadd__(233))
# 类定义
# class A(baseA):
#     a = 1
#     def __init__(self,var):
#         self.b = var
(A:=type('A',(),{'a':1,'__init__':(lambda self,var:(self.__setattr__('b',var)))}))
# while 循环
[
    (until:=type('R',(),{
        '__init__':lambda self, f:self.__setattr__('f',f),
        '__iter__':lambda self: self,
        '__next__':lambda self: None if self.f() else next(i for i in [])})),
    (i:=0),
    [[print(i), i:=i+1] for _ in until(lambda:i<10)],
]
```

写一个reduce函数并运行

```py
[
(f := (lambda f,objs:[
    (r:=objs.pop(0)),
    [(r:=f(r,o)) for o in objs],
    r
    ].pop())),
(result := f(int.__add__,[2,3,3,3])),
print(result),
]
```

输出是

```
11
```
