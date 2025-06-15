# Floc 语言设计文档

## 简介

Floc 是一种专注于**数据流处理**的编程语言，旨在提供一种**声明式、函数式**且**高性能**的范式来构建复杂的数据转换和计算管道。它从现代编程语言的优秀实践中汲取灵感，并引入了多项创新，尤其在序列/张量操作和控制流方面。Floc 的目标是让数据处理代码更具表现力、可读性、可维护性和可扩展性。

## 核心设计原则

- **数据流优先:** 语言结构和操作符旨在直观地表达数据的流动和转换。
- **单一输入/输出:** 函数设计为接收一个输入值并产出一个输出值（这个值可以是复合类型，如序列、元组、或 `nil`）。
- **函数式编程:** 强调纯函数、鼓励无副作用的计算，但通过受控的赋值和代数效应来管理状态和副作用。
- **声明式编程:** 尽可能地描述“做什么”而非“如何做”，将执行细节留给编译器进行优化。
- **代数效应:** 提供一种结构化的方式来处理副作用（如 I/O、异常、异步操作和非局部控制流），使核心业务逻辑保持纯净。

## 赋值与作用域

Floc 对赋值有着独特的处理方式，旨在平衡函数式的纯粹性和命令式的便利性。

- **赋值运算符:**
    - `<-` : 右结合，右边部分绑定到左值，左值所绑定的变量对后续代码可见对右边不可见（最常见的用法）
    - `=` : 右结合，右边部分绑定到左值，左值所绑定的变量对后续代码可见对右边可见（用于普通函数定义，允许递归）
    - `=>` : 右结合，右边部分绑定到左值，左值所绑定的变量对后续代码不可见对右边可见（用于匿名函数递归，作为额外补充）

整个顶层代码被视为包裹在`do`块内，遵循类似 haskell 的 monad 组织方式，但是更为通用。

```floc
a <- 233
print a
print (a + 1)
// 这个代码意味着 233 作为参数调用 (a => ...后续代码)
```

于是赋值操作在 Floc 中被视为创建对当前作用域内后续内容的**局部作用域**。这意味着同一个变量名可以被多次赋值，每次赋值都会创建一个新的同名变量在局部遮蔽原有的，其作用域持续到当前代码块结束或下一次同名赋值。这允许了一种“逐步构建”或“状态演化”的编程风格，同时保持了每次绑定的局部性。

## 函数定义与调用

在 Floc 中，函数是构建数据流的基本单元。

### 函数定义

通过 `{}` 语法定义函数对象，通过巧妙的设计让所有的`{}`都算是函数。

- **单一值输入/输出:** 函数始终接收一个输入值并输出一个值。输入值可以是 `nil` (表示无参数)。

- **匿名函数:**
    - **显式参数:** `{ x -> x + 1 }`，只有一个分支时可以省略花括号`x -> x + 1`
    - **隐式参数:** `{ it + 1 }` (当只有一个隐式参数时，可用 `it`)
    - **元组解构与位置参数:**
        - `{ (a, b) -> a + b }`
        - `{ \0 + \1 }` (引用元组的第0和第1个元素。**谨慎使用于嵌套，推荐显式命名。**)
    - **匿名函数递归:**
    ```floc
    22 |> fib => { // 这个fib只在函数体内可见
        0 -> 0;
        1 -> 1;
        n -> fib(n-1) + fib(n-2);
    } |> print;
    ```

- **具名函数:**
    ```floc
    square = { it * it };
    add_one = x -> x + 1;
    fact = {
        0 -> 1;
        x -> x * fact(x - 1); // 直接使用函数名递归
    };
    ```

- **模式匹配:** 匿名函数内部可以使用分号 `;` 分隔的多个分支来执行模式匹配，每个形参部分被称为`parttern`，`_`表示通配符。前面描述的函数被视为单分支函数，同样可以使用模式匹配。
    ```floc
    fact = {
        0 -> 1;
        x -> x * fact(x - 1);
    };
    ```

额外的，由于顶层代码本质上在`do`块内，很自然的，`<-`赋值的左值也可以是`parttern`。

- **无参函数与代码块:**
    代码块可以看作特殊形式的函数
    函数可以没有参数声明，此时分支直接写函数体。这种分支只能被无参调用匹配。
    - **无参调用:** `f()` 或 `f ()` 或 `f nil` (`nil` 代表空参数列表，等价于 `()`)。
    - **代码块:** 如果一个函数的所有分支都是无参的（即函数体由分号分隔的多行操作组成），它实际上定义了一个**代码块**。
        ```floc
        my_block <- {
            print "Step 1";
            let temp = compute_something();
            print "Step 2: " + temp;
            final_result(); // 假设 final_result 是一个无参函数
        };
        ```

虽然这样的代码块可以直接无参调用（会执行第一个分支/语句），但它们更常用于被**宏**（如 `do` 或 `for`）消费，宏会根据其定义解析和执行块内的内容。

```floc
hello = name -> do {
    print "hello, ${name}";
};
```

- **函数类型检查:** 往类型声明中传入函数，会通过函数返回值是否为nil判断是否匹配。同时类型本身也能作为函数使用，作用是检查输入的对象是否在类型内。
    - 函数类型检查是可选的
    ```floc
    add = (a:Int, b:Int):Int -> a + b
    countdown = {
        n:int and {it>0} -> do {
            print n;
            countdown(n-1);
        };
        n:int -> do {
            print "Blast off!";
        };
        _ -> do {
            print "not a int!";
        };
    };
    ```

### 函数调用

Floc 支持多种函数调用语法，以适应不同的编程风格和场景。

- **传统括号调用:** `function(argument)`
- **空格分隔调用 (左结合):** `function argument`
    ```floc
    result = parse string_to_parse with_options;
    // 等价于 (parse(string_to_parse))(with_options)
    ```
- **右结合调用 (`<|`):** `function <| argument` (优先级较低，通常用于省括号)
    ```floc
    result = toJson <| transform <| fetchData "endpoint";
    // 等价于 toJson(transform(fetchData("endpoint")))
    print <| 2 + 1
    // 等价于 print(2 + 1)
    ```
- **管道数据应用 (`|>` 左结合):** `data |> function` (优先级低于 `>>`)
    ```floc
    words <- "  hello world "
        |> trim
        |> toUpperCase
        |> {split " " it}
    // words = ["HELLO", "WORLD"];
    ```

`|>`和`<|`输入和期望的值类型不匹配将会报错。

### 函数复合

- **`>>`:** `a >> b` 意味着 `b(a(x))`。
- **`<<`:** `a << b` 意味着 `a(b(x))`。
- **类型匹配**: 复合的函数间必须输入输出类型兼容。
    ```floc
    raw_data |> logData >> sanitizeInput >> transformFormat =: result;
    // 由于优先级高于`|>`，所以这意味着先组合函数，再应用数据
    ```

由于两边都是函数时，二元逻辑运算符始终返回true，我们可以复用逻辑运算符用于函数复合

- **`and`:** `a and b` 意味着 `a(x) and b(x)`。
- **`or`:** `a or b` 意味着 `a(x) or b(x)`。

有时我们需要在值异常时短路计算，`?>`和`<?`将会在运算出`nil`时短路。

```floc
result <- datas
    |> filter {it.classtype=='文科'}
    ?> filter {it.math.score>90}
    ?> map {it.name, it.id}
    >> sort {it.id};
```

## 代码块与宏

- 前述无参函数定义的代码块特性，是 Floc 中宏系统的基础。

### do

`do {...}` 的行为类似于 Haskell 中的 `do` 记法，用于顺序执行代码块中的操作。

`do`使用`<-`赋值，实际上顶层代码就被视为包裹在一个`do`块内，因此`=`赋值也有效

```floc
do {
    a <- 1 + 1; //相当于`1+1 |> a -> 后续代码`
    print a;
    f = {it + 1}; // `=`赋值也有效
    print <| f a;
};
```

`do` 的每一行如果不使用`<-`赋值，那么默认存入`it`中

```floc
do {
    datas;
    print it; // 打印datas
};
```

`do`块第一行的`it`来自外界

```floc
datas;
do {
    print it; // 打印datas
};
```

`do` 返回最后一个表达式的值

```floc
result <- do {
    datas;
    map func it;
    // 对每一个data运行func，最后result获得了处理后的列表
};
```

`continue`是捕获两层`do`块(两层作用域)之间的剩余部分的定界续体，`break`是外层`do`块的一次性续体

```floc
do {
    datas;
    do { map continue it |> break };
    // 将“后续操作”作用在每个data上
    // 使用break让内层do块执行完后不再继续运行后续代码，而是继续外层do块的后续内容
    process it;
};
```

`do`块支持代数效应，是天然的边界

```floc
do {
    datas;
    do fork it;
    //使用`do`不接代码块相当于perform效应，这里当没有参数时可以写成`do fork;`
    process it;
} with {
    fork = { map continue it |> break };
    // 此时 continue和break代表的续体不变
};
```

continue和break能跨越不止一层作用域进行捕获

```floc
do {
    datas;
    do foo it;
    process2 it;
} with {
    foo = x -> do { do fork x; process1 it };
    fork = { map continue it |> break };
    // 所有数据会经过process1和process2
    // 由于在with块内，continue和break绑定的是with块处的作用域
};
```

此时的`continue`含义可以看成是，在**调用层面**，**继续直到绑定层**函数的运行

`break`含义可以看成是，在**调用层面**，**结束绑定层**函数的运行

如果不使用`break`，那么相当于在末尾默认调用一次`continue`，**这可能带来非预期的效果**

`continue`和`break`的生命周期只在对应作用域执行期间起效，虽然理论上可以作为返回值传出去，但是不建议这么做。

直接或间接持有它的变量的生命周期不能长于对应作用域执行的生命周期

用这玩意模拟多层循环

```floc
do {
    data <- do fork datas;
    el <- do fork data;
    [el*2];
} with {
    fork = { flatmap continue it |> break };
}; // 最终会遍历并铺平datas
```

### ?

用代数效应的方式处理可能为nil的值

```floc
do {
    do maybe data;
    // `do maybe`的语法糖为`?`，于是这里可以缩写为`?data;`
    process it;
} with {
    maybe = {
        nil -> break nil;
        x -> x; // 默认调用continue接收返回值
    };
    // maybe是一个默认处理器，定义于每个作用域，这里其实可以不定义
};
```

### by

`by`宏可以交换两边的值，一般用于给高阶函数插入值

```floc
result <- do {
    datas <- do readData();
    filter it by {it.classtype=='文科'};
    //by宏用于交换两边的值，于是这段能显得很自然
    filter it by {it.math.score>90};
    map it by {it.name, it.id};
    sort it by {it.id};
} with {
    readData = {...};
};
```

### for

Floc 中的 `for` 也是一种宏，提供了超越传统列表推导的表达力，支持复杂的索引、缩并和结构转换。

- `for` 宏接收两个主要部分：
    1.  **迭代器声明与绑定:** 定义如何从数据源中提取元素。
    2.  **主体表达式:** 在第一个部分构建的变量环境下执行的表达式，决定了如何组织从上一个部分迭代出的结果。

#### 基本用法

最基本的循环

```floc
for (i <- 1..10) print i;
```

执行代码块

```floc
for (i <- 1..10) do {
    print i;
    print i;
};
```

使用 `yield` 组织返回值，否则返回 `nil`

```floc
print for (i <- 1..10) yield i; // 打印 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
print for (i <- 1..10) i; // 打印nil
```

`for` 使用`{}`支持多层循环，默认嵌套循环

```floc
for {
    i <- 1..3;
    j <- "a".."c";
} print (i, j); // 打印笛卡尔积
```

使用`yield`会将所有结果收集到一层列表中

```floc
print for {
    i <- 1..3;
    j <- "a".."c";
} yield (i, j);
// 打印 (1,"a"), (1, "b"), (1, "c"), (2, "a"), (2, "b"), (2, "c"), (3,"a"), (3, "b"), (3, "c")
```

`for`支持可选值迭代，当迭代目标为非迭代对象时只迭代一次，是`nil`时短路。

```
print for {
    data <- datas;
    data <- data?.name;
} yield data; // 只选出有名字的data对象
```

上面的代码实际上可以用`if`来过滤

```
print for {
    data <- datas if data?.name;
} yield data; // 只选出有名字的data对象
```

#### 同步迭代

`a, b`和`(a, b)`是不同的，当循环目标有多个时，元素会**同步迭代**

```floc
print for {
    item <- 1..4, "a".."c";
} yield item; // 相当于zip，打印 (1, "a"), (2, "b"), (3, "c")
```

左边也可以进行解包

```floc
print for {
    i, j <- 1..4, "a".."c";
} yield (i, j); // 同样相当于zip
```

使用`*`进行解包，与同步迭代语法配合，就形成了转置

这就是利用这个进行的矩阵乘法示例

```floc
for {
    row1 <- M1;
} yield for {
    col2 <- *M2;
    //这就是单纯的解包，配合同步迭代语法
    //表示同步从每一行迭代，自然一次迭代一列
} yield sum <| for { // 求和
    e1, e2 <- row1, col2;
} yield e1*e2;
```

#### 指标

每行使用`[]`标记索引，标记在迭代目标后，`if`判断前，相同的索引会同步迭代，缺少的索引自动短路

这种索引记为**指标**，对，就是张量计算的那个指标

```floc
print for {
    a <- 1..4[i];
    b <- "a".."c"[i];
} yield (a, b); // 同样相当于zip
```

指标可以像正常的值一样使用

```floc
print for {
    a <- 1..4[i];
    b <- "a".."c"[i];
} yield (i, a, b); // 这样会带着索引创建元组
```

对于每个指标，除了第一个变量外，指标可以计算

```floc
print for {
    a <- "a".."c"[i];
    b <- 1..4[i+1];
} yield (a, b); // 打印 ("a", 2), ("b", 3), ("c", 4)
```

计算后可以继续赋值

```floc
print for {
    a <- "a".."c"[i];
    b <- 1..4[j<-i+1];
} yield (j, a); // 打印 (1, "a"), (2, "b"), (3, "c")
```

叠加指标相当于嵌套取值

输出用指标可以起到`group by`的效果

例如，转置矩阵可以表示为

```floc
print for {
    col1 <- *M1;
} yield col1;
```

它的两种等价写法

```floc
//等价写法
print for {
    e1 <- M1[i][j];
}[j] yield e1; //j的变化会导致分组，每组内yield出去


// 另一个等价写法
print for {
    e1 <- M1[i][j];
}[j][i] e1; //j的变化会导致分组，每组内i的变化会再次分组
```

于是我们能重新定义`yield`的功能为：收集剩余指标并合并为一个维度

```floc
// 这段代码
print for {
    a <- 1..3;
    b <- "a".."c";
} yield (a, b);

// 就等价于
print for {
    a <- 1..3[i];
    b <- "a".."c"[j];
    // 为每层循环分配不同的隐式指标
}[i,j] (a, b);
// 自动合并指标，相当于[(i,j)]
// 这意味着i或者j的变化都会导致它们笛卡尔积发生变化，于是导致分组
```

“不使用`yield`将不会返回值”的行为可以被重新定义为：当不注明“输出所需要的维度”，也不使用`yield`时，仅执行副作用

```floc
print for {
    a <- 1..3[i];
    b <- "a".."c"[j];
} (a, b); // 这将不会返回值，最终打印 nil

print for {
    a <- 1..3[i];
    b <- "a".."c"[j];
}[i] (a, b); // 缺少维度，报错
```

每一处的指标标记都是可选的。

#### 指标缩并

有时候需要将指标缩并，下面是一个矩阵乘法示例

```floc
for {
    e1 <- M1[i][j];
    e2 <- M2[j][k];
    merge j by {\0 + \1}     // 对共同索引 j 进行求和缩并
}[i][k] e1 * e2          // 结果的形状由未缩并的索引 i 和 k 决定
```

缩并可以将维度减少到0

```floc
for {
    i <- 1..10;
    merge i // by后面的内容可以省略，因为相加是merge的默认行为
} yield i //返回5050
```

#### continue 与 break

`for`本身会创建一层隐式的作用域，对其中每一次循环也都会额外创建一层作用域

```floc
for {
    a <- 1..3;
    b <- 1..3;
    c <- 1..2;
}
```

就像

```伪代码
for {
    a=1 {
        b=1 {
            c=1 {}
            c=2 {}
        }
        b=2 {
            c=1 {}
            c=2 {}
        }
        b=3 {
            c=1 {}
            c=2 {}
        }
    }
    a=2 {
        b=1 {
            c=1 {}
            c=2 {}
        }
        b=2 {
            c=1 {}
            c=2 {}
        }
        b=3 {
            c=1 {}
            c=2 {}
        }
    }
    a=3 {
        b=1 {
            c=1 {}
            c=2 {}
        }
        b=2 {
            c=1 {}
            c=2 {}
        }
        b=3 {
            c=1 {}
            c=2 {}
        }
    }
}

```

此时运行`continue`根据定义，只会往外跳出一层作用域，也就是继续下一个循环

```floc
for {
    a <- 1..10
} do {
    if (a<5) break continue();
    // 为了防止continue运行完后返回，必须配合break使用
    // 于是只会运行一次continue的内容
    print a; // 此时只会打印5..10
}
```

当`for`是多层循环时，可以在每一行循环后接`with`绑定这一层循环**外面**的作用域，于是可以自定义续体以跳出，其中第一个循环绑定的是最外层的`for`块

```floc
for {
    a <- 1..3 with { k={break it} }; // 当运行 k 时跳出整个 for 循环
    b <- 1..3;   // 如果它设置在更内层，那么跳出内层循环相当于外层的 continue
    c <- 1..3;   // 在最内层的break与主体表达式的break相同，都只能结束最内层循环
} do {
    if (a>7) do k();
    print a; // 此时只会打印1..7，虽然由于后面的bc循环，每个数字打印9次
}
```


#### `for` 循环与 `it`

`for` 循环可以直接使用 `it` 来引用其输入流，这使得 `for` 表达式本身可以被视为一个接收流并转换流的函数。
```floc
// 定义一个将流中每个元素乘以2的函数
double_stream = for ( el <- it ) yield el*2 // 保留原始索引

// 使用
[1,2,3] |> double_stream =: result // result 将是 [2,4,6]
```
