# 四元数笔记

之前有一点复数基础，看了 3Blue1Brown 的四元数理解视频，但是还是没有完全理解四元数是怎么表示旋转的

在小豆发视频后，通过参考一篇知乎文章，加上自己的思考，终于大致理解了四元数的运作，可喜可贺可喜可贺

为此在这里把拼图大致总结一下，以表纪念

## 状态与作用

在研究旋转时，我们考虑的是数字的乘法

数字可以表示一个状态，也能表示一个作用，它们是一一对应的

例如，当用一个数字去乘时

`2`表示将`1`伸长为原来的2倍

`-1`表示将`1`逆向，长度保持不变

`-3`表示将`1`逆向，且长度变为原来的 3 倍

`0`表示将`1`长度变为 0

`1`是一个特殊的作用，表示什么都不做

一个数的 n次方 表示做这个动作 n 次

0次方 表明做 0 次，也就是什么都不做，所以任意数的 0次方 都是 1

-1次方 表明做 -1 次，即对应操作的逆向操作，可以还原对应操作的影响

## 复数

我们定义一个新的作用 $i$, 让 $i^2=-1$

如果 $-1$ 是将 $1$ 反转 180 度，不妨认为，$i$ 的作用是将 $1$ 旋转 90 度

以 $\{1, i\}$ 为基向量，以向量的形式 $(a,b)$ 表示 $a+bi$，称为`复平面`

这样的构造有很多符合直觉的巧合，略过不谈

### 关于 $i$ 的作用

$i(a+bi) = -b + ai$

$i$ 的作用就是将任意复数(向量) ，围绕原点，按照 $1 \rightarrow i$ 的方向旋转 90 度

### 关于任意复数 $x=x_1+x_2i$ 对任意复数 $u=u_1+u_2i$ 的作用

$x(u_1+u_2i)=(xu_1+xu_2i)$

等价于以 $\{x, xi\}$ 为基向量表示 $(u_1, u_2)$

$(x_1+x_2i)u=(x_1u+x_2iu)$

等价于以 $\{u, ui\}$ 为基向量表示 $(x_1, x_2)$

任意复数 $x$ 的作用，就是将任意复数，按照 $1 \rightarrow x$ 的方向旋转并放缩

在单位圆上的复数 $x=cos\theta+isin\theta$ ，作用就是将任意复数按照 $1 \rightarrow i$ 的方向旋转 $\theta$

## 四元数

复数的定义并没有限定虚数单位是唯一的

我们定义

$i^2=j^2=k^2=-1$

满足运算

$\begin{matrix}ij = k\\jk = i\\ki = j\end{matrix}$

$\begin{matrix}ji = -k\\kj = -i\\ik = -j\end{matrix}$

$\{1,i,j,k\}$ 相互垂直，构成四维空间，以 $\{i,j,k\}$ 组成三维空间，将实数轴隐藏起来，我们能描述四维旋转

### 关于 $i/j/k$ 的作用

$i(w+xi+yj+zk)=-x+wi-zj+yk$

$j(w+xi+yj+zk)=-y+zi+wj-xk$

$k(w+xi+yj+zk)=-z-yi+xj+wk$

$\begin{matrix}i\\j\\k\end{matrix}$ 的作用就是将任意四元数(向量)

在 $\{\begin{matrix}1, i\\1, j\\1, k\end{matrix}\}$ 平面内的分量，围绕原点，按照 $\begin{matrix}1 \rightarrow i\\1 \rightarrow j\\1 \rightarrow k\end{matrix}$ 的方向旋转 90 度

在 $\{\begin{matrix}j\\k\\i\end{matrix}, \begin{matrix}k\\i\\j\end{matrix}\}$ 平面内的分量，围绕原点，按照 $\begin{matrix}j \rightarrow k\\k \rightarrow i\\i \rightarrow j\end{matrix}$ 的方向旋转 90 度

之后再把分量重新加起来即可

### 任意四元数乘任意四元数

计算

$(x_0+x_1i+x_2j+x_3k)(y_0+y_1i+y_2j+y_3k)$

将虚数部分用向量表示 $V_x=x_1i+x_2j+x_3k, V_y=y_1i+y_2j+y_3k$

则原式 $=(x_0+V_x)(y_0+V_y)=x_0y_0+x_0V_y+V_xy_0+V_xV_y$

接下来按照乘法分配律，计算

$V_xV_y$

若虚数单位相同，则变成 $-1$, 且值相乘, 于是有 $- V_x \cdot V_y$

若虚数单位不同，则按照顺序，$\begin{matrix}ij \rightarrow k\\jk \rightarrow i\\ki \rightarrow j\end{matrix}$，恰好等价于 $\begin{vmatrix}i&j&k\\x_1&x_2&x_3\\y_1&y_2&y_3\end{vmatrix}$, 恰好是 $V_x \times V_y$

于是

$V_xV_y = - V_x \cdot V_y + V_x \times V_y$

于是

$xy = (x_0+V_x)(y_0+V_y)=x_0y_0+x_0V_y+V_xy_0- V_x \cdot V_y + V_x \times V_y$

### 单位球面上的四元数对任意向量的作用

用单位球面上的向量是没法表示一个完整的三维旋转的

当它是姿态时，没法表示横滚角；当它是旋转轴时，没法表示旋转的角度

当然，可以把最后一个量存储在模长上

对于四元数表示的旋转，我们要旋转的目标向量是 $\{i,j,k\}$ 上的向量 $u$

当取 $\{i,j,k\}$ 单位球面上的四元数 $x$ 时

它长度为 $1$ 且垂直于实数轴，所以有 $x^2=-1$, $\{1,x\}$ 的性质与 $\{1,i\}$ 等的性质一样, $\{1,x\}$ 上的向量乘以 $x$ 的作用是, 按照 $1 \rightarrow x$ 的方向旋转 90 度

$\{i,j,k\}$ 上以 $x$ 为法向量的平面，记为 $W_x$ ，是与 $\{1,x\}$ 垂直的平面

任意四元数可以分解为 $\{1,x\}, W_x$ 这两个平面上的向量的组合

$xu = V_xV_u=- V_x \cdot V_u + V_x \times V_u$

对于在 $\{1,x\}$ 上的 $u$, 等价于按照 $1 \rightarrow x$ 的方向旋转 90 度

对于在 $W_x$ 上的 $u$，$V_x \cdot V_u=0$，于是 $xu=V_x \times V_u$, 按照叉乘的性质，会按照右手定则旋转 90 度

其它四元数都可以分解为这两个平面上的分量，分别作用后再组合

### 单位超球面上的四元数对任意向量的作用

如果想要旋转任意度数呢？

四元数用 3 个虚数单位的分量表示旋转轴，用实数轴与四元数的夹角表示旋转的度数，作用于实部为 0 的四元数表示的向量上

设单位超球面上的 $x=cos\theta+I_xsin\theta$ (使用 $I_x$ 表示在 $\{i,j,k\}$ 内 $x$ 投影方向上的单位向量)

$xu = (cos\theta+I_xsin\theta)V_u=V_ucos\theta+(- I_x \cdot V_u + I_x \times V_u)sin\theta$

对于在 $\{1,x\}$ 上的 $u$，等价于按照 $1 \rightarrow x$ 的方向旋转 $\theta$ 度

对于在 $W_x$ 上的 $u$，$I_x \cdot V_u=0$，于是 $xu=V_ucos\theta+I_x \times V_usin\theta$, 按照叉乘的性质，会按照右手定则旋转 $\theta$ 度

其它四元数都可以分解为这两个平面上的分量，分别作用后再组合

## 四元数旋转

现在的作用会让它在 $\{1,x\}$ 上有多余的旋转, 我们需要抵消这个旋转

我们用 $quq^{-1}, q=cos\theta+I_qsin\theta$ 来表示让 $u$ 绕 $I_q$ 按右手定则旋转 $2\theta$, 记为 $\phi_q(u)$

$q^{-1}$ 的影响是将影响还原，由于这里仅涉及旋转，把 $\theta$ 变成 $-\theta$ 即可

我们看看左乘变成右乘有什么变化

在

$(x_0+V_x)(y_0+V_y)=x_0y_0+x_0V_y+V_xy_0- V_x \cdot V_y + V_x \times V_y$

中，只有 $V_x \times V_y$ 不满足交换律

我们将对 $u$ 的影响分解为在 $\{1,q\}$ 上的和在 $W_q$ 上的作用

则变成右乘不会对 $\{1,q\}$ 上的作用产生影响

而对于 $W_q$ 上的作用，$V_ucos\theta-I_q \times V_usin\theta=V_ucos(-\theta)+I_q \times V_usin(-\theta)$, 等价于反向

因此，$quq^{-1}$ 时，

先左乘 $q$, $\{1,q\}$ 上旋转 $\theta$, $W_q$ 上旋转 $\theta$

再右乘 $q^{-1}$, $\{1,q\}$ 上旋转 $-\theta$, $W_q$ 上旋转 $-(-\theta)=\theta$

$\{1,q\}$ 上的旋转被抵消，因此只有 $W_q$ 上旋转了 $2\theta$

### 用任意四元数来旋转

任意非零四元数都可以用 $aq, q=cos\theta+I_qsin\theta$ 表示，其中 $a$ 是非零实数

由于 $q^{-1}$ 的存在， $aqu(aq)^{-1}=aqua^{-1}q^{-1}=quq^{-1}$

所以同一个方向的四元数都表明同一个旋转，并不能缩放大小

## 参考资料

- [bilibili - 3Blue1Brown - 四元数的可视化](https://www.bilibili.com/video/BV1SW411y7W1)
- [bilibili - 小豆8593 - 四元数如何控制物体旋转？](https://www.bilibili.com/video/BV14t421h7M4)
- [知乎 - lxycg - 四元数和旋转(Quaternion & rotation)](https://www.zhihu.com/tardis/zm/art/78987582)
