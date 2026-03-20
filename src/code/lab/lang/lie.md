# The Lie Programming Language (谎言)
**官方概念与底层架构规范 (v2.2 Draft)**

## 0. 核心哲学 (Core Philosophy)

在传统的编程语言中，函数被视为接收输入的黑盒。但在 **Lie** 中，我们认为这是一种错觉。Lie 是一门彻底解构了传统控制流与参数传递的现代编程语言，它的核心建立在以下三大哲学支柱之上：

1.  **真相是词法的，谎言是动态的 (Truth is Lexical, Lies are Dynamic)：** 局部变量严格遵循静态词法作用域，绝不污染环境；而函数执行所需的依赖与副作用，全部从动态作用域中“索取”。
2.  **调用即欺骗 (To Call is to Lie)：** 改变下游函数行为的唯一方式，是在调用时显式地将静态变量注入为动态环境（编织谎言）。
3.  **语法的终极大一统 (The Grand Unification)：** 变量赋值、模式匹配与函数调用在底层是完全同构的——它们都是向当前环境链压入新的绑定，并将其作为上下文传递给后续的执行流。
4. **时间的维度正交 (Dimensional Orthogonality of Time)：** 调度语义（map/for）与块执行形态（{}/[]）完全解耦；并发不是特殊的语法，而是控制流在时间维度上的正交组合。
5. **状态是物理的，Actor 是涌现的 (State is Physical, Actors Emerge)：** 闭包节点驻留于当下物理状态而非历史快照；当并发流回归有状态节点，Actor 模式便随之自然诞生。

---

# 第一部分：语法的表象 (The Illusion of Syntax)

这一部分描述了开发者在日常编写 Lie 代码时的直觉与规则。

## 1. 声明与索取 (Declarations & Demands)

在 Lie 中，函数签名中的标识符不是传统意义上的“形参”，而是对动态环境的**索取声明**。

```javascript
// 声明：greet 函数执行时，需要从动态环境中查找到 user 和 greeting
// : void 表示没有显式返回值（可省略，由最后一行表达式推导）
fn greet(user: str, greeting: str): void {
    print(greeting + ", " + user);
}
```
*规则：函数体内部除了声明的动态依赖外，所有其他变量（如内置的 `print`）均严格遵循静态词法作用域查找。*

## 2. 词法作用域、无 `let` 赋值与 `with` 语法糖 (Lexical Scope & `with`)

Lie 彻底消灭了早期 Lisp 语言中的“动态作用域地狱”，并推向了更极致的纯粹性：**Lie 没有 `let`、`var` 这样的声明关键字。**

虽然在**语义层面**（Semantic Level），串行块 `{}` 中的赋值本质上是向后续代码的“子闭包作用域”压入了一个同名参数并进行遮罩（这也是为什么重名赋值没有副作用，且不需要 `let`）。但这只是理解心智模型。在**实现层面**（Implementation Level），Lie 后端会通过逃逸分析和 SSA 将这些闭包调用最大限度地就地转换为**栈上可变赋值运算**，以保证执行效率（详见后端部分）。

所有的局部变量绑定（如 `a = 1`）只会对其后方的词法作用域生效，且绝对不会自动泄漏到动态作用域中。

`with` 关键字在 Lie 中没有任何动态绑定的魔法，它仅仅是词法作用域声明的“倒装句”语法推导：为一个代码块或复合表达式提供依赖注入。

```javascript
// 写法 A：使用 with 语法糖 (do 块本质上就是一个普通表达式)
do {
    greet(user = my_user, greeting = my_greeting);
} with {
    my_user = "Alice";    // 仅仅是作用域遮罩赋值，不需要 let
    my_greeting = "Hello";
}

// 任意表达式后都可以追加 with，用于在词法结尾倒装声明：
// 注意：Lie 的 with 不会隐式污染环境，向底层穿透的依赖（如 on_error）在调用时依然必须被显式注入！
read_file(path, on_error = on_error) with {
    fn on_error(err: Error) { print("Ignored"); continue(); }
}
```

## 3. 符号的终极正交：数据 `()` 与 代码 `{}` `[]`

在主流语言中，数据和代码块的界限常常是混淆的。Lie 对三种括号进行了极其严格的语义正交划分：

*   **复合数据 `()`**：非函数的复合数据均由圆括号表示。无论是位置模式的（如数组/元组），还是键值对模式的（如字典），**核心极简规则：每次构造数据时，要么全是位置参数，要么全是字典参数，严禁混合。**
    *   *消歧护城河：* 如果你想在字典中绑定并省略同名键值，**绝对不可直接写变量名**（那会退化成单一的位置参数），而必须使用原生的 `=name` 语法糖（它会在底层静态展开为 `name = name`）。这套基石死死守住了“位置”与“字典”的严格隔离墙。
*   **串行执行块 `{}`**：创建一个内部表达式顺序执行的函数体。它隐式包含一个名为 `it` 的参数对象（代表传入的整个复合数据，而非特定字典）。在串行执行中，`it` 会在每次表达式执行后被不断覆盖为上一行表达式的计算结果。串行块的值即为最后一行的结果。
*   **并行执行块 `[]`**：创建一个内部表达式完全独立、并发执行的函数体。每一行表达式都能抓取到同一个原始的 `it` 输入，不会逐行覆盖。并行块的值是所有表达式求值后收集而成的结果列表。

**推论：** `do {}` 和 `do []` 只是对这两种函数体的立即执行形式，因此它们会分别返回“最后一行结果”和“并行结果列表”。
真正的函数调用形式只有一种：`f a`。
我们在 Lie 中写出 `f(a, b)` 时，并不是所谓的多参数调用，而是**将一个复合数据对象 `(a, b)` 作为一个单一的右值参数，传递给了函数 `f`。**

## 4. 万物皆表达式、UFCS (`.`) 与 中缀流 (Infix)

为了实现优雅的函数调用与链式管道，Lie 提供了两种不同优先级的调用形态，彻底消灭了嵌套括号的深渊：

*   **高优先级：UFCS 统一函数调用 (`.`)**。类似 Koka 等现代语言，Lie 支持通过 `.` 进行显式倒装调用。`x.f(y)` 会被编译器直接视作传递了复合数据对象的 `f(x, y)`；而 `x.f` 等价于 `f(x)`。这适合紧密的对象操作。
*   **低优先级：中缀符调用降维**。既然代码块就是隐式包含 `it` 的函数，只要函数注册为中缀符，就能作为宏观管道写出极具自然语言表现力的代码：所有的控制流（如 `if/else`）完全可以通过标准库借由中缀符实现，而不再是关键字！

如果你觉得隐式的 `it` 在多层嵌套中不够清晰，**Lie 同样允许在使用 `{}` 或 `[]` 时，在头部使用 `x ->` 显式声明匿名函数的参数名**。

```javascript
urls = ("http://a.com", "http://b.com", "http://c.com"); // 圆括号表示纯数据

// do 本质上是立即执行一个单参数函数。串行中的 it 总是等于上一行的结果。
do { print(it) };

// 中缀符调用与隐含的 it
doubled = numbers map { it * 2 };

// 显式声明 Lambda 参数名（同理也适用于 [] 并行块）
tripled = numbers map n -> {
    n * 3
};

// 控制流可以完美演化为中缀函数的级联调用
status = (score > 60) then {
    "Pass"
} else {
    "Fail"
};

// ---- 语法糖 `\`：匿名函数极简速写家族 ----
//
// 反斜杠 `\` 是 Lie 中所有匿名函数简写的统一前缀，
// 后接不同的符号决定闭包的形态：
//
// 1. `\.foo`    — Point-Free UFCS 速写
//    当 `\` 后紧跟 `.` 时，构建一个以隐式 it 为主语的 UFCS 调用闭包。
names = users map \.name;              // 严格等价于 users map { it.name }
active = users filter \.is_active();   // 严格等价于 users filter { it.is_active() }

//    可以与 >> 复合，构建无数据的预装流水线：
clean = \.trim() >> \.to_lowercase() >> \.replace("  ", " ");

// 2. `\( expr )` — 位置参数表达式闭包
//    当 `\` 后紧跟 `(` 时，构建一个以 `\0`, `\1`, `\2`... 为位置参数的匿名函数。
//    圆括号内的整个表达式即为函数的返回值，无需写 `->` 或 `{}`。
sum = numbers reduce \( \0 + \1 );     // \0 = 累加器, \1 = 当前值
describe = sum >> \( "Total: " + \0.to_string() );

//    可以与逻辑运算符和中缀符自然交织：
report = records
    .filter(\( \0 != null ) and \.email.contains("@"))
    .filter(\( \0.age >= 18 ) or \.email.ends_with(".edu"))
    .sort_by(\.name);

// 3. `{ 模式 -> ... }` — 多重分派/模式匹配闭包
//    当代码块内部由多条 `<模式> -> <表达式/代码块>` 组成时，它直接构成了一个自带分支路由的匿名函数。
//    Lie 没有 switch/match 关键字，基于模式匹配的闭包完美覆盖了这一需求，且极其纯粹。
//    这也是后续结合 `sync` 构建 Actor 消息邮箱的底层基石。
format_val = {
    (n: int)         -> "Num: " + n.to_string()
    (s: str)         -> "Str: " + s
    (tag = "error")  -> "Error payload"
};
print $ format_val(10);  // 输出: "Num: 10"

// 语法糖 $：应用包裹符
// $ 用于消除包裹代码块或参数的繁琐括号。它会将当前表达式后续的所有内容（直到语句的分号）作为右侧参数包裹起来。
// 注意：它是包裹当前这行表达式的剩余部分，而不是一直包裹到函数末尾。
fn build_profile_view() {
    // 等价于 do { verify_token >> uid -> [ ... ] >> format_response }
    do $ verify_token >> uid -> [
        fetch_user_base(uid);
        fetch_recent_orders(uid);
    ]
    >> format_response;
}
```

## 5. 函数与控制流流转 (`>>`, `?>`, `and`/`or`)

受到 Floc 的启发，Lie 吸纳了极其强大的函数复合与短路语义，完全兼容其 `it` 推导哲学。

*   **函数复合 `>>`（管道流转）：** 允许将两个函数或代码块直接组合成一个新的函数（即 `A >> B` 等价于生成 `x -> B(A(x))`）。配合隐式的 `it`，你可以将多个独立的转换逻辑预先拼装成一条数据流水线，而无需提前注入数据。
*   **短路中缀 `?>`（安全透传）：** 结合 Lie 一切皆表达式的特性，如果左侧求值为 `null`（或者抛出默认的空异常），`?>` 操作符会直接终止后续链条的执行并返回空，不再继续向右计算。
*   **逻辑运算符升维：** 当 `and` 或 `or` 的两侧接收的由于中缀演化而来的**代码块 `{}`** 或 **函数** 时，它们会自动升维成一个新的复合函数（即 `x -> A(x) and B(x)`）。这使得数据过滤变得极度优雅：

```javascript
// 假设经过一系列流转，我们在过滤用户
safe_users = users filter { it != null } and { it.age > 18 };

// 短路调用：如果 config 提取失败，后续流程不会崩溃
db = load_config() ?> connect() ?> init_tables();
```

## 6. 并发维度的语法级延伸：`[]` (Parallel Blocks)

在 Lie 中，凡是涉及代码块 `{}` 的地方，都可以直接无缝替换为 `[]` 并行块。这就意味着语言底层统一了串并行的概念规则：
*   **立即执行**：`do {}` 立即执行串行块，`do []` 立即执行并行块。
*   **函数声明**：`fn foo() {}` 声明串行函数体，`fn foo() []` 声明并行函数体。

**关于集合与并发的哲学解答：`map` 与 `for` 的分工**
在遍历集合时，“对集合元素的并发迭代”与“单个元素处理逻辑的内部并发”是两个不同层面的概念。
Lie 标准库对这两者做出了极其克制且优雅的语义约定：
*   **`for` 默认是串行驱动的**。它意味着按顺序走完每个元素。
*   **`map` 默认是并行驱动的！** （Lie 中没有底层的循环关键字只有递归，所谓的 map 本质是一个利用轻量级协程向外辐射的并发分发器）。

如果遇到“集合元素并发映射”+“每个元素的处理逻辑自身需要并发”，你只需要将并行的 `map` 和并行的 `[]` 结合起来即可，反之亦然。

```javascript
// 假设 download 是个极其耗时的函数

// 1. 完全串行：串行遍历，串行执行
urls for { download(it) }

// 2. 宏观并发，微观串行：同时发起三个下载连线，但单条连线内顺序执行
urls map {
    tmp = download(it);
    save(tmp);
}

// 3. 宏观串行，微观并发：按序处理各个用户，但处理单个用户时，并发请求他的多种信息
users for [
    fetch_avatar(it);
    fetch_orders(it);
]
```

## 7. 显式注入与透明透传 (Explicit Injection & Transparent Forwarding)

既然局部变量不会自动变成动态变量，`with` 块也绝对不会因为“包含在内部”就去隐式污染环境（No Magic），那如何满足下游函数的动态依赖？
**答案只有一个：必须在函数调用点，通过强制命名传参的方式，极其明确地显式注入。**

一旦变量在调用点被显式注入到动态环境中，基于环境节点的代理链机制（参考第11节），它将**自动穿透**所有中间那些未声明该依赖的函数，彻底解决无聊的“属性透传（Prop Drilling）”噩梦。

```javascript
// 底层：声明需要 theme
fn Button(theme: str) { print("Button theme: " + theme); }

// 中间层：完全不知道 theme 的存在，保持纯净
fn Dialog() { Button(); }

// 顶层：注入谎言
fn App() {
    theme = "Dark";
    Dialog(=theme); // =theme 是严格的字典参数缩写，等价于 Dialog(theme = theme)
}
```

## 8. 代数效应与双重返回：定界续体与有状态节点

在 Lie 中，**数据和函数没有区别，它们都是动态环境中的值。** 当底层函数调用了一个从动态环境中注入的效应处理器（即代数效应）时，底层函数的执行会被瞬间**挂起（Suspend）**。

要理解 Lie 的控制流，必须触及它的底层本质：**代数效应的底层就是续体（Continuation）。**

在 Lie 的执行流中，不同位置的函数会获得不同的隐式续体：
1.  **单次续体 `continue(val)`：** **每个函数都隐式包含一个回到调用处的单次续体。** 对于普通函数而言，这就是普通的返回；对于效应处理器而言，这就是恢复深层调用栈的执行（`resume`）。它将值交还给触发点，让代码继续往下跑。
2.  **额外的逃逸续体 `break(val)`：** 当一个函数的**定义处**本身正处于当前的调用栈上时（例如被 `with` 附着的局部函数），它就能被动态作用域索引找到。当底层动态触发这个调用时，该函数除了 `continue`，还会获得一个**额外的隐式续体 `break`**。调用 `break` 会直接丢弃（或封存）深层挂起的调用栈，直接把值跳出给定义这个处理器所在的外层作用域。

这使得看似复杂的非局部跳转与状态机，变为了最纯净的两种单次调用返回形式。

**核心性能妥协：有状态的连续体与 Actor 的必然诞生**
在传统的纯函数式续体（如 Scheme 的 Call/CC）中，保存续体会像做时间机器一样“快照”离开时的全部状态（Snapshot Rollback）。但在 Lie 中，基于极端的性能考量，我们做出了一个决定性妥协：
**当你通过续体回到一个节点时，它永远是按照该物理栈帧“当下”的实际状态继续，而不是曾经离开时的快照。**

这意味着：**上下文环境节点（闭包）是具有真实的、就地可变的物理状态的。** 它的局部变量会随着执行就地演进。这也就解释了为什么语言底层可以把闭包降级为栈上的可变赋值（见第10节）。
更深远的意义在于，它铺垫了一个必然的并发推论——既然续体返回的节点状态是就地改变的，如果有多个并发流同时通过 `resume` 续体回到同一个带有状态的处理器节点，就自然会产生数据竞争。**因此，引入带有排他锁的 Actor 模型（即 `sync` 关键字，详见第12节），并不是为了并发强行打的补丁，而是这种“无快照续体传递”在遇到并行化时的物理必然侧影！**

```javascript
/* Lines 123-140 omitted */
// 底层：声明需要一个可能会抛弃流的 check 行为
fn validate_user(check: fn(int)) {
    check(1); // 挂起，携带 continue 续体跳回 my_check
    print("This might be skipped");
    check(2);
}

fn main() {
    do {
        validate_user(check = my_check);
    } with {
        // 定义静态的 check 处理函数。因为它在栈上，所以自动获得了 break 续体
        fn my_check(val: int) {
            (val > 1) then {
                break("Too large"); // 触发逃逸续体，直接跳至主函数的 do 块外层！
            } else {
                continue(); // 触发回归续体，正常返回给 validate_user，继续执行 print
            }
        }
    }
}
```

---

# 第二部分：执行的真相 (The Reality of Execution)

这一部分深入 Lie 的编译器前端与虚拟机（VM）后端，揭示上述优雅语法是如何在底层严谨运作的。

## 9. 类型系统与双向推导 (Strong Typing & Bidirectional Inference)

Lie 是一门强类型语言。动态环境的匹配必须是**名字与类型同时一致**。真正的索引键是「全限定名变量」与「类型」的复合。这种设计不仅使 LSP（语言服务器协议）能够利用这套索引提供极其精准的智能补全与跳转，更重要的是，编译器正是基于这套严格的索引来完成自动静态绑定的，而非依赖运行时的模糊查找。

**静态多重分派 (Multiple Dispatch) 与底层的统一：**
这种「名字+类型」的匹配既然可以用于动态环境，自然也可以直接用于静态词法作用域。在主流语言中，面对多种类型的重载，往往要引入复杂的 OOP 机制。但在 Lie 中，函数签名原本就是需要进行类型验证的左值模式。这意味着，使用不同类型的组合（如 `fn process(a: int)` 与 `fn process(a: str)`），在编译器看来只是对不同的“复合键”进行了静态路由。这使得**静态的函数多重分派**与**动态的环境依赖注入**在底层完美共享了同一套机制！

**函数签名作为一等公民类型 (Function Types)：**
在将函数作为参数传递（或在动态环境中声明函数依赖）时，Lie 统一使用 `输入类型 -> 输出类型` 的箭头语法作为类型签名。因为 Lie 底层将所有参数视为单一复合对象，签名的书写规则非常自然：
*   **单一参数：** `int -> str` （或带有可选名称绑定 `(id: int) -> str`）
*   **复合位置参数：** `(int, str) -> bool`
*   **复合字典参数：** `(name: str, age: int) -> bool`
*   **无参数/无返回值：** `() -> void`
在函数定义处，可以在参数列表括号后通过 `: Type` 来显式标注最终的返回值类型，如果省略则由编译器通过最后一行的返回结果自动推导。由于把 `:` 整体赋予了“声明左侧实体类型”的统一语义，这种写法甚至可以直接用于匿名函数：`(id: int): str -> { ... }`。

编译器不仅推导返回值，更负责推导函数的**“效应行（Effect Row）”**。

*   **向上冒泡：** 如果函数 `A` 调用了 `B`，而 `B` 需要 `config: Config`，编译器会自动推导 `A` 的签名隐式包含了对 `config: Config` 的需求。
*   **向下校验：** 顶层注入环境时，编译器严格校验注入的变量名和类型是否满足了底层冒泡上来的需求树。
*   **可选依赖与作用域捕获 (Optional Parameters)：** 支持在声明左值（包括局部赋值解构和函数声明）时使用 `?:` 语法将其设为可选参数。如果在右侧或调用方没有提供该值，它会直接从当前作用域中尝试捕获它。例如 `fn foo(config?: Config)`，如果在动态环境里未被显式提供，则从当前词法作用域检索变量。
*   **可选限定名 (Optional Qualified Names)：** 在绝大多数情况下，`变量名 + 类型` 的双重校验已足以避免冲突。但为了应对大型工程中的极端重名场景、提高代码可读性或获得更精准的错误提示，Lie 允许使用限定名。例如：`fn connect(db::config: Config, redis::config: Config)`。

## 10. 语法的终极统一：赋值 = 调用 = 模式匹配

在 Lie 的底层 AST（抽象语法树）中，没有传统的“顺序执行”概念，一切都是**续体传递（CPS）**。核心规则：**赋值就是对后续上下文的函数调用，而函数调用在底层实现为对当前环境的赋值（模式匹配）。**

在这里，语法上的 `:` 用于声明左值的类型预期，而 `=` 用于右值的赋值或字典声明。

```javascript
// 写法 A（传统赋值与模式匹配：左值声明 = 右值数据）
(a: str, b: int) = (a = "hello", b = 3);
print a;

// 写法 B（函数调用：本质是环境中的模式匹配）
// 形参是左值声明，调用时相当于执行了一次模式匹配赋值
fn subsequent_code(a: str, b: int) { print a; }
subsequent_code (a = "hello", b = 3);

// 写法 C（可选绑定与当前作用域捕获）
// 允许在声明左值时使其为可选参数（无论是变量赋值还是函数声明）。
// 此时如果没有传入对应的值，可以直接从当前作用域拿：
foo = 233;
{foo?: int} = bar; // 如果 bar 中没有提供 foo，它将直接回退使用当前作用域中的 foo = 233
// 函数也是同理：
fn func(foo?: int) { ... }
```

**模式匹配与环境注入机制：**
函数调用时，系统会拿一个单一的**复合右值对象**，去匹配函数签名以及环境依赖中声明的**多个左值**。在环境查找时，它极度依赖前文提到的「完整限定名 + 类型」作为严格的匹配键。

这也呼应了前文的语法强约束：**传入的右值对象，要么全是位置参数（如 `(1, 2, 3)`），要么全是字典参数（如 `(a=1, b=2)`），严格禁止混合出现。** 在底层的统一模型中，对环境键值（Key）的模式匹配才是最本质的；所谓的位置列表模式，仅仅是这种严格键匹配的一种语法糖投影。只有这样，底层统一的模式匹配虚拟机才能保持极简与无歧义。

**尾递归优化与基于栈的降级 (TCO & Stack Degradation)：**
虽然在**语义层面**，每次赋值（`x = 1`）都相当于创建了一个新的子闭包域并遮罩了外层（纯函数式的CPS传递）。但在**实现层面**，频繁创建闭包会导致极大的性能开销。
通过**逃逸分析（Escape Analysis）**和**静态一次性赋值（SSA）**分析，VM 的编译器后端会识别出这些串行块（`{}`）中从未向外逃逸的续体流。在深层优化时，VM 会将这些无逃逸的等价 CPS 调用安全地“降级”，展平为基于寄存器和栈帧的**普通可变赋值运算（Mutable Assignment）**。
尤其是当嵌套调用位于执行流的最末端（隐式返回 `it`）时，这种底层视角的同构自然而然地实现了**尾递归优化（TCO）**并消除了词法闭包分配的开销。这保证了 Lie 语言在拥有极高数学抽象和纯洁语义的同时，依旧能获得与 C/Rust 相当的执行指令效率。

## 11. 内存模型：代理链与调用树 (Proxy Chains & Call Trees)

为了支持强大的代数效应和协程，Lie 的动态环境（Env）**绝对不是一个原地修改的全局字典**。

1.  **不可变代理链：** 每次发生变量注入，VM 都会生成一个新的环境节点。这个节点包含当前绑定的变量，并持有一个指向父节点的指针（类似原型链）。
2.  **从链到树：** 当程序产生协程（Coroutine）或生成器时，线性的调用链会自然分叉，变成一棵**调用树（Call Tree）**。这棵动态的调用树，与代码的静态词法树产生了完美的对称。协程 A 和 B 可以共享同一个祖先环境，但它们各自的分叉叶子节点互不干扰。

## 12. 并发与 Actor 模型 (Concurrency & Actor Model)

当引入 `[]` 并发块时，代数效应面临一个世界级难题：如果多个并发的子任务同时触发代数效应，试图使用 `resume` 回到同一个父节点处理器中，父节点的状态（局部变量）就会发生数据竞争。

**默认栈运行与 `sync` 升维同步：**

在 Lie 中，性能是第一位的。默认情况下，所有的效应处理器都在当前的栈帧上超高速运行，这也意味着如果不对并发做限制，数据将是不安全的。然而，为了保证内存安全与逻辑的确定性，Lie 引入了 `sync` 关键字妥协且升华了 Actor 模型。

**在并发环境下，任何被注入到动态作用域的效应处理器，只要它涉及状态修改并且需要多线程同步，就可以通过 `sync` 关键字被声明为安全临界区。此时它隐式升维成一个 Actor 邮箱的处理器。**

```javascript
fn main() {
    do [
        // 启动两个并发任务（[]内部默认并行）
        worker(id = 1);
        worker(id = 2);
    ] with {
        counter = 0; // 状态

        // 使用 sync 声明：这个 log 处理器在被并发调用时，隐式成为 Actor 邮箱，保证串行执行
        sync fn log(msg: str) {
            counter = counter + 1;
            print("[" + counter + "] " + msg);

            // 即使 worker 1 和 2 同时触发 log，
            // VM 也会将它们转化为消息进行排队，串行唤醒这个上下文，绝不产生数据竞争。
            continue();
        }
    }
}
```

**`sync` 作为一等公民闭包修饰符：独立 Actor 构造**

`sync` 不仅可以修饰 `fn` 声明，更可以直接修饰任何匿名函数（`\(...)`、`{}`）来生成一个**一等公民的 Actor 对象**——一个带有互斥锁的邮箱处理函数。当一个函数内部创建局部状态并返回一个 `sync` 闭包时，就自然构成了 **spawn 模式**：外部世界只能通过发送消息与之交互，绝对无法直接篡改其内部状态。

```javascript
// ---- spawn 模式：构造一个独立的有状态 Actor ----

fn spawn_counter(initial: int) {
    state = initial; // 保存在当前物理栈帧上的私有状态

    // 返回一个 sync 闭包：指向当前栈帧的、带互斥锁的邮箱处理函数
    // 使用 \() 位置参数闭包，\0 代表传入的消息
    sync \(
        state = state + \0;
        state // 返回处理结果
    )
}

// 调用 spawn 得到一个 Actor 函数指针
my_counter = spawn_counter(initial = 0);

// 像普通函数一样调用，触发重入，返回处理结果
print $ my_counter(10);   // 输出: 10
print $ my_counter(5);    // 输出: 15

// UFCS 风格调用也完美支持
print $ 100.my_counter(); // 输出: 115
```

**多重分派匿名函数 `sync { ... }`：**

当 `sync` 后接的代码块 `{}` 内部包含多个 `模式 -> 表达式` 分支时，它构成了一个**支持模式匹配的匿名 Actor**。不同的消息类型由编译器的多重分派机制自动路由，无需任何 `if/else`：

```javascript
fn spawn_recorder() {
    history = (); // 私有状态

    // 返回一个多重分派的 sync 匿名函数
    // 不是 sync 块，而是被 sync 修饰的匿名函数语法
    sync {
        ("?dump")  -> { history }                             // 匹配字面量消息
        (msg: str) -> { history = history.append(msg) }       // 匹配 str 类型消息
    }
}

recorder = spawn_recorder();
recorder("hello");
recorder("world");
print $ recorder("?dump");  // 输出: ("hello", "world")
```

这种 spawn 模式的核心优势在于：**Actor 就是闭包，闭包就是函数**。它不需要任何特殊的运行时设施或框架支持——私有状态由闭包的栈帧天然持有，互斥保护由 `sync` 修饰符自动提供，消息分派由多重分派机制统一处理。

# 第三部分：手感展示 (A Feel for the Language)

这一部分通过完整的、接近实战的示例程序，展示多个语言特性如何自然交织，帮助读者建立对 Lie v2.2 终极语法的书写直觉。

## 示例 A：HTTP 微服务 — 动态注入与效应处理

一个真实感的 Web 处理器，展示动态依赖穿透如何彻底消灭传统框架中“把 context 传遍所有函数”的噩梦：

```javascript
// ---- 数据层：只声明自己需要什么，不关心来源 ----

// 显式标注返回值类型，增强接口可读性
fn find_user(db: Database, id: int): User {
    db.query("SELECT * FROM users WHERE id = ?", (id));
}

fn save_order(db: Database, user: User, items: List): void {
    // 使用位置闭包彻底净化 reduce 逻辑
    total = items.map(\.price).reduce(\( \0 + \1 ));
    db.execute("INSERT INTO orders ...", (user.id, total, items));
}

// ---- 业务层：依然不关心 db 从哪来 ----

// 依赖注入高阶函数：log 也是直接要求一个特定签名的函数
fn create_order(id: int, items: List, log: str -> void): (status: str, order_id: int) {
    user = find_user(id);           // db 会从动态环境自动穿透进来
    log("Creating order for " + user.name);
    save_order(user, items);        // 同上，db 透传
    (status = "ok", order_id = user.id)
}

// ---- 入口层：编织所有谎言 ----

fn handle_post_order(request: Request): void {
    body = request.body.parse_json();

    create_order(
        id       = body.user_id,
        items    = body.items,
        db       = pg_pool.connect(),   // 唯一注入点，透传给所有深层调用
        log      = logger,
        on_error = on_error,            // 必须显式注入，with 块只是提供词法作用域
    ) with {
        // 代数效应：优雅地捕获任意深度的数据库异常
        fn on_error(err: DbError) {
            break(status = "error", message = err.msg);
        }
    };
}
```

## 示例 B：数据流水线 — `\` 匿名函数与 `and`/`or` 过滤

当你需要在一大堆记录中筛选、转换、聚合时，Lie 的数据管道（`.`）与闭包简写（`\`）会让代码读起来像一段陈述句：

```javascript
// 预先拼装一条可复用的清洗流水线（此时尚未注入任何数据，使用 >> 复合函数）
clean_pipeline = \.trim() >> \.to_lowercase() >> \.replace("  ", " ");

// 一条完整的数据处理表达式（面向数据，使用 . 链式调用）
report = raw_records
    .filter(\( \0 != null ) and \.email.contains("@"))
    .map(r -> (
        name  = r.name.clean_pipeline();   // UFCS 绝杀：局部函数当原生方法用
        email = r.email.clean_pipeline();
        age   = 2026 - r.birth_year;
    ))
    .filter(\( \0.age >= 18 ) or \.email.ends_with(".edu"))
    .sort_by(\.name)
    .take(100);

print("Processed " + report.length + " records");
```

## 示例 C：递归与模式匹配 — 二叉树

展示多重分派 + 模式匹配如何让递归数据结构的处理变得极简，同时编译器自动完成尾递归优化：

```javascript
// 用字典复合数据定义树节点，直接使用 = 等价绑定缩写
fn Leaf(value: int): Tree                           { (tag = "leaf", =value) }
fn Node(left: Tree, value: int, right: Tree): Tree  { (tag = "node", =left, =value, =right) }

// 多重分派闭包：直接对传入的复合数据进行模式匹配！彻底消灭无意义的类型签名耦合
sum = {
    (tag = "leaf", value: int)                           -> { value }
    (tag = "node", left: Tree, value: int, right: Tree)  -> { sum(left) + value + sum(right) }
};

depth = {
    (tag = "leaf")                                       -> { 1 }
    (tag = "node", =left, =right)                        -> { 1 + max(depth(left), depth(right)) }
};

// 使用 >> 组合出"先求和再格式化"的复合函数，结合位置闭包 \0
describe = sum >> \( "Total: " + \0.to_string() );

my_tree = Node(
    left  = Node(left = Leaf(1), value = 2, right = Leaf(3)),
    value = 4,
    right = Leaf(5),
);

print $ describe(my_tree);   // "Total: 15"
print $ depth(my_tree);      // 3
```

## 示例 D：串并行一键切换 — 批量 API 调用

同一段逻辑，只需把 `{}` 换成 `[]` 就从串行变并行。结合 `?>` 安全透传，容错并发变得史无前例的简单：

```javascript
fn fetch_user_profile(api: HttpClient, id: int) {
    api.get("/users/" + id.to_string());
}

fn enrich_fast(profile: Profile, api: HttpClient) {
    // 并行版：avatar 和 posts 同时发起请求
    do [
        api.get(profile.avatar_url);
        api.get("/users/" + profile.id + "/posts");
    ] >> results -> {
        (profile, avatar = results.0, posts = results.1)
    };
}

// 批量获取用户（并行映射数组 + with 统一容错）
fn batch_fetch(ids: List) {
    ids
        // map 自带宏观并发辐射语义！
        // 传入一个 {} 串行闭包，意思是：同时并发处理所有用户，但在单个用户的处理路线上，严格遵循先 fetch 再 enrich 的顺序。
        .map({ 
            fetch_user_profile(id = \0, on_error = on_error) ?> enrich_fast;
        } with {
            fn on_error(err: HttpError) {
                print("Skipped: " + err.url);
                continue(null);  // 恢复执行，当前错误项返回 null
            }
        })
        .filter(\( \0 != null ));
}
```

## 示例 E：状态机 — 代数效应实现无栈协程式交互

展示 `continue` / `break` 双重续体如何让传统上需要复杂状态机或 `async/await` 的交互式流程变成纯粹的线性代码：

```javascript
// 底层：一个简单的问答流程，它"索取"一个 ask 效应
fn signup_flow(ask: str -> str) {
    name  = ask("What's your name?");
    email = ask("Your email?");
    age   = ask("Your age?").parse_int();

    (age >= 13) then {
        (name, email, age)
    } else {
        ask("Sorry, you must be 13+. Press enter to quit.");
        continue();  // 作为 return：直接终止整个 signup_flow 流程
    };
}

// 顶层：注入不同的 ask 实现来适配不同前端
fn main_cli(): void {
    result = signup_flow(
        // 展示显式闭包的返回值标注：(参数): 返回值 -> { ... }
        ask = (prompt: str): str -> { print(prompt); read_line() },
    );
    // 使用短路流转 ?>，仅当 result 成功时才执行右侧闭包
    result ?> \( print("Welcome, " + \0.name) );
}

fn main_web(session: Session) {
    result = signup_flow(
        ask = (prompt: str) -> {
            session.send_form(prompt);
            session.await_submit();  // 挂起当前协程，等待前端回传
        },
    );
    result ?> \( session.redirect("/dashboard") );
}
```

## 示例 F：依赖注入与测试 — 第一公民 Actor (Mock 终极形态)

利用 `sync` 闭包和多重分派，在纯函数式的边界内实现绝对安全的状态收集，无需引入任何 Mock 框架：

```javascript
// 生产代码：依赖穿透
fn checkout(cart: Cart) {
    total = cart.items.map(\.price).reduce(\( \0 + \1 ));
    process_payment();
    send_receipt();
}

// 测试代码：不可变性、代数效应与完美 Actor 降维打击
fn spawn_recorder() {
    history = (); // 私有状态，编译期逃逸分析会自动将其提升至堆内存

    // 返回一个带有状态的 sync 闭包，利用多重分派处理不同的“消息”
    sync {
        ("?dump")  -> { history }                             // 读取状态
        (msg: str) -> { history = history.append(msg) }       // 记录调用
    }
}

fn test_checkout() {
    fake_cart = (items = ((price = 10), (price = 20)));
    recorder = spawn_recorder(); // 实例化 Mock Actor

    // 调用点显式注入！无需 with 块，直接将 Actor 喂给依赖
    checkout(
        cart         = fake_cart,
        gateway      = (charge = \( (id = "fake_001", amount = \0) )),
        logger       = recorder,                              // Actor 本身即闭包
        send_receipt = \( recorder("receipt_sent") )          
    );

    // 向 Actor 发送特定消息提取状态
    final_calls = recorder("?dump");

    assert(final_calls.length == 2);
    assert(final_calls.0 == "Charged: fake_001");
    assert(final_calls.1 == "receipt_sent");
}
```

## 示例 G：并发聚合与上下文 Actor — 实时仪表盘

展示 `sync fn` 如何在带有 `with` 块的并发效应处理器中自动保护共享状态：

```javascript
fn collect_metrics(sources: List) {
    // map 本身就是并发分发器，因此外部无需 do []。
    // 我们仅仅需要对每个 source 执行串行的 {} 逻辑（这里只有一行 poll）。
    sources.map({ poll(url = \0, report = report, on_error = on_error) }) with {
        dashboard = (cpu = 0.0, mem = 0.0, count = 0);

        // sync fn 保证：即使百个数据源同时回报，状态更新依然严格串行
        sync fn report(metric: Metric) {
            dashboard = (
                cpu   = (dashboard.cpu * dashboard.count + metric.cpu) / (dashboard.count + 1),
                mem   = max(dashboard.mem, metric.mem),
                count = dashboard.count + 1,
            );
            (dashboard.count >= sources.length) then {
                break(dashboard);  // 收集完毕，触发逃逸续体返回最终结果
            } else {
                continue();        // 继续等待下一个
            };
        }

        fn on_error(err: PollError) {
            print("Source unreachable: " + err.url);
            continue();  // 跳过失败源
        }
    };
}

fn main() {
    sources = ("http://node1:9090", "http://node2:9090", "http://node3:9090");
    final = collect_metrics(sources);
    print("Avg CPU: " + final.cpu + "%, Peak Mem: " + final.mem + "MB");
}
```

## 示例 H：UFCS 链式操作 — 字符串处理器

将数据处理与函数复合分离：数据用 `.` 流转，流水线用 `>>` 预装：

```javascript
fn slugify(text: str) {
    text
        .trim()
        .to_lowercase()
        .replace(" ", "-")
        .replace("--", "-")
        .strip_non_alphanumeric();
}

fn build_url(base: str, title: str) {
    slug = title.slugify();               // UFCS: 等价于 slugify(title)
    base + "/posts/" + slug;
}

// 管道 >>：组合出一个“从文件读取到生成站点地图 XML”的完整逻辑流
generate_entry = read_file >> extract_title >> \.build_url("https://blog.example.com") >> to_sitemap_xml;

// UFCS 应用
entries = md_files.map(generate_entry);
```

## 示例 I：`with` 倒装与嵌套 — 配置层叠

`with` 可以在调用树的不同层级叠加，未被内层遮罩的“谎言”会继续向下穿透，完美模拟配置继承：

```javascript
fn render_page() {
    header = render_header();     // 需要 theme, lang
    body   = render_body();       // 需要 theme, lang, user
    footer = render_footer();     // 需要 theme
    (header, body, footer);
}

fn main() {
    // 外层：注入全局默认配置
    page = render_page(
        theme = "light",
        lang  = "zh-cn",
    ) with {
        // 内层：仅对 body 区域提供特殊上下文
        fn render_body() {
            do {
                render_content();
                render_sidebar();
            } with {
                theme = "dark";           // 遮罩 theme，lang 依然从外层穿透
                user  = load_current_user();
            };
        }
    };

    send_response(page);
}
```

## 示例 J：综合实战 — 极简 MapReduce

一个浓缩了位置闭包、UFCS 流转、管道拼接和效应处理的终极示例：

```javascript
fn map_reduce(data: List, mapper: any -> any, reducer: any -> any) {
    // Phase 1: 并发 Map。map 默认是并行的
    mapped = data.map({ mapper(\0) });

    // Phase 2: 扁平化并按 key 分组
    grouped = mapped.flatten().group_by(\.key);

    // Phase 3: 并行 Reduce。map 宏观辐射，内部 {} 确保取值和化简串行执行
    grouped.keys.map({
        key = \0;
        values = grouped.get(key);
        // 使用 =key 字典赋值简写
        (=key, result = values.map(\.value).reduce(reducer))
    });
}

fn word_count(texts: List): List {
    map_reduce(
        data     = texts,
        // 函数复合：先切分，再映射为键值对复合数据
        mapper   = \.split(" ") >> \.map(\( (key = \0, value = 1) )),
        // 极简规约：两值相加
        reducer  = \( \0 + \1 ),
        on_error = on_error       // 理所应当的显式注入
    ) with {
        fn on_error(err: Error): List {
            print("Skipped bad chunk: " + err.msg);
            continue(());  // 返回空列表跳过异常分片
        }
    }
    .sort_by(\( 0 - \0.result ))  // 按词频降序 (数学取反)
    .take(20);
}

fn main() {
    texts = load_text_files("/corpus/");
    top_words = word_count(texts);
    // 打印是有序的副作用副作用，必须使用串行驱动的 for，否则输出会乱序！
    top_words.for(\( print(\0.key + ": " + \0.result.to_string()) ));
}
```

---

## 总结 (Conclusion)

**Lie** 语言通过解构传统参数传递，创造了一种全新的编程范式。
在表象上，它用最极简的规则（词法隔离、动态索取、命名注入）消灭了冗长的参数列表和复杂的异步状态机；在底层，它通过 CPS 同构、代理树和隐式 Actor 模型，构建了一个坚不可摧的运行时。

在 Lie 的世界里，编写代码就是一门编织上下文的艺术。