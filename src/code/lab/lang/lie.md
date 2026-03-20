# The Lie Programming Language (谎言)
**官方概念与底层架构规范 (v2.1 Draft)**

## 0. 核心哲学 (Core Philosophy)

在传统的编程语言中，函数被视为接收输入的黑盒。但在 **Lie** 中，我们认为这是一种错觉。Lie 是一门彻底解构了传统控制流与参数传递的现代编程语言，它的核心建立在以下三大哲学支柱之上：

1.  **真相是词法的，谎言是动态的 (Truth is Lexical, Lies are Dynamic)：** 局部变量严格遵循静态词法作用域，绝不污染环境；而函数执行所需的依赖与副作用，全部从动态作用域中“索取”。
2.  **调用即欺骗 (To Call is to Lie)：** 改变下游函数行为的唯一方式，是在调用时显式地将静态变量注入为动态环境（编织谎言）。
3.  **语法的终极大一统 (The Grand Unification)：** 变量赋值、模式匹配与函数调用在底层是完全同构的——它们都是向当前环境链压入新的绑定，并将其作为上下文传递给后续的执行流。

---

# 第一部分：语法的表象 (The Illusion of Syntax)

这一部分描述了开发者在日常编写 Lie 代码时的直觉与规则。

## 1. 声明与索取 (Declarations & Demands)

在 Lie 中，函数签名中的标识符不是传统意义上的“形参”，而是对动态环境的**索取声明**。

```javascript
// 声明：greet 函数执行时，需要从动态环境中查找到 user 和 greeting
fn greet(user: str, greeting: str) {
    print(greeting + ", " + user);
}
```
*规则：函数体内部除了声明的动态依赖外，所有其他变量（如内置的 `print`）均严格遵循静态词法作用域查找。*

## 2. 词法作用域与 `with` 语法糖 (Lexical Scope & `with`)

Lie 彻底消灭了早期 Lisp 语言中的“动态作用域地狱”。**所有的局部变量声明（`let`, `fn`）都是严格静态的，绝对不会自动泄漏到动态作用域中。**

`with` 关键字在 Lie 中没有任何动态绑定的魔法，它仅仅是词法作用域声明的“倒装句”语法糖。

```javascript
// 写法 A：使用 with 语法糖
do {
    greet(user = my_user, greeting = my_greeting);
} with {
    let my_user = "Alice";
    let my_greeting = "Hello";
}

// 写法 B：完全等价的普通顺序写法
let my_user = "Alice";
let my_greeting = "Hello";
greet(user = my_user, greeting = my_greeting);
```

## 3. 显式注入与透明透传 (Explicit Injection & Transparent Forwarding)

既然局部变量不会自动变成动态变量，如何满足下游函数的动态依赖？
**答案：必须在函数调用点，通过强制命名传参的方式，显式注入。**

一旦变量被显式注入到动态环境中，它将**自动穿透**所有未声明该依赖的中间函数，彻底解决“属性透传（Prop Drilling）”问题。

```javascript
// 底层：声明需要 theme
fn Button(theme: str) { print("Button theme: " + theme); }

// 中间层：完全不知道 theme 的存在，保持纯净
fn Dialog() { Button(); }

// 顶层：注入谎言
fn App() {
    let theme = "Dark";
    Dialog(theme = theme); // 语法糖可简写为 Dialog(theme)
}
```

## 4. 代数效应与严格单次续体 (Algebraic Effects & Strict One-Shot Continuations)

在 Lie 中，**数据和函数没有区别，它们都是动态环境中的值。** 当底层函数调用了一个从动态环境中注入的函数时，底层函数的执行会被**挂起（Suspend）**。注入的函数会自动在其作用域内获得一个名为 `resume` 的隐式定界续体。

**性能与约束：** 在绝大多数情况下，`resume` 被严格限定为**单次调用（One-Shot）**。这保证了极高的执行效率（底层仅需切换栈指针）。如果开发者需要实现时间旅行或非确定性编程，必须显式声明多次续体（例如调用 `resume.clone()`），因为这会导致底层调用树的深度拷贝，代价高昂。

```javascript
// 底层：声明需要 yield 行为
fn count_to_three(yield: fn(int)) {
    yield(1); // 挂起，跳回 my_yield
    yield(2);
}

fn main() {
    let results = [];
    do {
        count_to_three(yield = my_yield);
    } with {
        // 定义静态的 yield 处理函数
        fn my_yield(val: int) {
            results.push(val);
            resume(); // 单次调用隐式续体，恢复 count_to_three 的执行
            // resume(); // 编译错误或运行时报错：默认续体不可多次调用
        }
    }
}
```

---

# 第二部分：执行的真相 (The Reality of Execution)

这一部分深入 Lie 的编译器前端与虚拟机（VM）后端，揭示上述优雅语法是如何在底层严谨运作的。

## 5. 类型系统与双向推导 (Strong Typing & Bidirectional Inference)

Lie 是一门强类型语言。动态环境的匹配必须是**名字与类型同时一致**。
编译器不仅推导返回值，更负责推导函数的**“效应行（Effect Row）”**。

*   **向上冒泡：** 如果函数 `A` 调用了 `B`，而 `B` 需要 `config: Config`，编译器会自动推导 `A` 的签名隐式包含了对 `config: Config` 的需求。
*   **向下校验：** 顶层注入环境时，编译器严格校验注入的变量名和类型是否满足了底层冒泡上来的需求树。
*   **可选依赖：** 支持 `?` 语法。`fn foo(?config: Config)` 表示如果外层未提供该依赖，其值为 `null`。
*   **可选限定名 (Optional Qualified Names)：** 在绝大多数情况下，`变量名 + 类型` 的双重校验已足以避免冲突。但为了应对大型工程中的极端重名场景、提高代码可读性或获得更精准的错误提示，Lie 允许使用限定名。例如：`fn connect(db::config: Config, redis::config: Config)`。

## 6. 语法的终极大一统：赋值 = 调用 (Assignment = Call)

在 Lie 的底层 AST（抽象语法树）中，没有传统的“顺序执行”概念，一切都是**续体传递（CPS）**。
**核心规则：赋值本身，就是一种对后续上下文的函数调用。**

以下两种写法在 Lie 的编译器看来是**完全同构**的：

```javascript
// 写法 A（传统赋值与模式匹配）
let { a: str, b: int } = { a: "hello", b: 3 };
print(a);

// 写法 B（函数调用与参数覆盖）
fn subsequent_code(a: str, b: int) { print(a); }
subsequent_code(a = "hello", b = 3);
```
**结论：** `with` 块、`let` 赋值、以及显式传参，本质上都是在当前执行位置创建一个新的**环境节点**，并将后续的代码作为隐式续体放入这个新环境中执行。

## 7. 内存模型：代理链与调用树 (Proxy Chains & Call Trees)

为了支持强大的代数效应和协程，Lie 的动态环境（Env）**绝对不是一个原地修改的全局字典**。

1.  **不可变代理链：** 每次发生变量注入，VM 都会生成一个新的环境节点。这个节点包含当前绑定的变量，并持有一个指向父节点的指针（类似原型链）。
2.  **从链到树：** 当程序产生协程（Coroutine）或生成器时，线性的调用链会自然分叉，变成一棵**调用树（Call Tree）**。这棵动态的调用树，与代码的静态词法树产生了完美的对称。协程 A 和 B 可以共享同一个祖先环境，但它们各自的分叉叶子节点互不干扰。

## 8. 并发与隐式 Actor 模型 (Concurrency & Implicit Actors)

当引入并发时，代数效应面临一个世界级难题：如果多个并发的子任务同时调用 `resume` 试图回到同一个父节点，父节点的状态（局部变量）就会发生数据竞争。

**Lie 的终极妥协与升华：状态节点即 Actor。**

在 Lie 中，回到一个节点时，必须按照当下的执行位置继续，这意味着**节点是有状态的**。
为了保证内存安全，Lie 规定：**在并发环境下，任何被注入到动态作用域并被调用的函数，会自动升维成一个隐式的 Actor。**

```javascript
fn main() {
    do {
        // 启动两个并发任务
        spawn(fn() { worker(id = 1) });
        spawn(fn() { worker(id = 2) });
    } with {
        let counter = 0; // 状态

        // 这个 log 函数被并发调用时，隐式成为 Actor 的邮箱处理器
        fn log(msg: str) {
            counter = counter + 1;
            print("[" + counter + "] " + msg);

            // resume 必须是排队串行的！
            // 即使 worker 1 和 2 同时触发 log，
            // VM 也会将它们转化为消息，串行唤醒这个上下文，绝不产生数据竞争。
            resume();
        }
    }
}
```

---

## 总结 (Conclusion)

**Lie** 语言通过解构传统参数传递，创造了一种全新的编程范式。
在表象上，它用最极简的规则（词法隔离、动态索取、命名注入）消灭了冗长的参数列表和复杂的异步状态机；在底层，它通过 CPS 同构、代理树和隐式 Actor 模型，构建了一个坚不可摧的运行时。

在 Lie 的世界里，编写代码就是一门编织上下文的艺术。