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

### 关于任意复数 $q=q_1+q_2i$ 对任意复数 $u=u_1+u_2i$ 的作用

$q(u_1+u_2i)=(qu_1+qu_2i)$

等价于以 $\{q, qi\}$ 为基向量表示 $(u_1, u_2)$

$(q_1+q_2i)u=(q_1u+q_2iu)$

等价于以 $\{u, ui\}$ 为基向量表示 $(q_1, q_2)$

任意复数 $q$ 的作用，就是将任意复数，按照 $1 \rightarrow q$ 的方向旋转并放缩

在单位圆上的复数 $qu=(cos\theta+isin\theta)u$ 可以理解为，找到 $u$ 方向，和 $iu$ 方向，用横坐标($cos\theta$)去乘 $u$, 用纵坐标($sin\theta$)去乘 $iu$, 就是将 $u$ 向 $iu$ 旋转 $\theta$

## 四元数

复数的定义并没有限定虚数单位是唯一的

我们定义

$i^2=j^2=k^2=-1$

满足运算

$\begin{matrix}ij = k\\jk = i\\ki = j\end{matrix}$

$\begin{matrix}ji = -k\\kj = -i\\ik = -j\end{matrix}$

$\{1,i,j,k\}$ 相互垂直，构成四维空间，以 $\{i,j,k\}$ 按照右手标架组成三维空间，将实数轴隐藏起来，我们能描述四维旋转

### 关于 i/j/k 的作用

$i(w+xi+yj+zk)=-x+wi-zj+yk$

$j(w+xi+yj+zk)=-y+zi+wj-xk$

$k(w+xi+yj+zk)=-z-yi+xj+wk$

$\begin{matrix}i\\j\\k\end{matrix}$ 的作用就是将任意四元数(向量)

在 $\{\begin{matrix}1, i\\1, j\\1, k\end{matrix}\}$ 平面内的分量，围绕原点，按照 $\begin{matrix}1 \rightarrow i\\1 \rightarrow j\\1 \rightarrow k\end{matrix}$ 的方向旋转 90 度

在 $\{\begin{matrix}j\\k\\i\end{matrix}, \begin{matrix}k\\i\\j\end{matrix}\}$ 平面内的分量，围绕原点，按照 $\begin{matrix}j \rightarrow k\\k \rightarrow i\\i \rightarrow j\end{matrix}$ 的方向旋转 90 度，也就是按照右手定则旋转它的法平面

之后再把分量重新加起来即可

这其实也对应了四元数的定义

如果想要旋转任意角度，对于 $h=i,j,k$，只需要使用 $cos\theta+hsin\theta$ 的形式即可

对于 $\{1,h\}$ 和与其垂直的平面 $W_h$(在这里是 $1,i,j,k$ 中剩下两个基向量组成的平面) 内的 $u$

找到 $u$ 方向，和 $hu$ 方向，用横坐标($cos\theta$)去乘 $u$, 用纵坐标($sin\theta$)去乘 $hu$, 就是将 $u$ 向 $hu$ 旋转 $\theta$

由于对于每个 $h$，所有四元数都可以分解为这两个平面上向量的和，所以它可以应用到所有四元数上，它作用于一般四元数，表现为两个旋转的组合

这就是四维双旋转

事实上，这对单位球面上的任意四元数都成立，即只要满足 $h^2=-1$ 即可

使用单位超球面上的 $q=cos\theta+hsin\theta$, 就可以对任意四元数进行任意角度的四维双旋转

### 任意四元数相乘

计算

$(q_0+q_1i+q_2j+q_3k)(u_0+u_1i+u_2j+u_3k)$

将虚数部分用向量表示 $V_q=q_1i+q_2j+q_3k, V_u=u_1i+u_2j+u_3k$

则原式 $=(q_0+V_q)(u_0+V_u)=q_0u_0+q_0V_u+V_qu_0+V_qV_u$

接下来按照乘法分配律，计算

$V_qV_u$

若虚数单位相同，则变成 $-1$, 且值相乘, 于是有 $- V_q \cdot V_u$

若虚数单位不同，则按照顺序，$\begin{matrix}ij \rightarrow k\\jk \rightarrow i\\ki \rightarrow j\end{matrix}$，恰好等价于 $\begin{vmatrix}i&j&k\\q_1&q_2&q_3\\u_1&u_2&u_3\end{vmatrix}$, 恰好是 $V_q \times V_u$

于是

$V_qV_u = - V_q \cdot V_u + V_q \times V_u$

于是

$qu = (q_0+V_q)(u_0+V_u)=q_0u_0+q_0V_u+V_qu_0- V_q \cdot V_u + V_q \times V_u$

### 单位超球面上四元数的作用

设 $q=cos\theta+hsin\theta$, 其中 $h$ 是 $\{i,j,k\}$ 单位球面上的点，满足 $h^2=-1$

设 $u=u_0+u_hh+V_u$，其中 $V_u$ 垂直于 $\{1,h\}$

于是

$qu = (cos\theta+hsin\theta)(u_0+u_hh+V_u)$

$=(cos\theta+hsin\theta)(u_0+u_hh)+(cos\theta+hsin\theta)V_u$

由于 $h^2=-1$，$(cos\theta+hsin\theta)(u_0+u_hh)$ 就和正常的复数旋转一样

由于 $V_u$ 垂直于 $\{1,h\}$，$h \cdot V_u=0$

$(cos\theta+hsin\theta)V_u=V_u cos\theta + h \times V_usin\theta$ 也确实是按照右手定则旋转

## 四元数旋转

用单位球面上的向量是没法表示一个完整的三维旋转的

当它是姿态时，没法表示横滚角；当它是旋转轴时，没法表示旋转的角度

当然，可以把最后一个量存储在模长上

对于四元数表示的旋转，我们要旋转的目标向量是实部为 0, $\{i,j,k\}$ 上的向量 $u$

现在的作用会让它在 $\{1,h\}$ 上有多余的旋转, 我们需要抵消这个旋转

我们用 $quq^{-1}, q=cos\theta+hsin\theta$ 来表示让 $u$ 绕 $h$ 按右手定则旋转 $2\theta$, 记为 $\phi_q(u)$

$-1$ 次方的含义是将影响还原，由于这里仅涉及旋转，把 $\theta$ 变成 $-\theta$ 即可

我们看看左乘变成右乘有什么变化

在

$(p_0+V_p)(q_0+V_q)=p_0q_0+p_0V_q+V_pq_0- V_p \cdot V_q + V_p \times V_q$

中，只有 $V_p \times V_q$ 不满足交换律

我们将对 $u$ 的影响分解为在 $\{1,h\}$ 上的和在 $W_h$ 上的作用

则变成右乘不会对 $\{1,h\}$ 上的作用产生影响

而对于 $W_h$ 上的作用，$V_ucos\theta-h \times V_usin\theta=V_ucos(-\theta)+h \times V_usin(-\theta)$, 等价于反向

因此，$quq^{-1}$ 时，

先左乘 $q$, $\{1,h\}$ 上旋转 $\theta$, $W_h$ 上旋转 $\theta$

再右乘 $q^{-1}$, $\{1,h\}$ 上旋转 $-\theta$, $W_h$ 上旋转 $-(-\theta)=\theta$

$\{1,h\}$ 上的旋转被抵消，因此只有 $W_h$ 上旋转了 $2\theta$

所有向量的变化都可以被分解到这两个平面上，看起来就像是绕轴旋转了一样

### 用任意四元数来旋转

任意非零四元数都可以用 $aq, q=cos\theta+hsin\theta$ 表示，其中 $a$ 是非零实数

由于 $q^{-1}$ 的存在， $aqu(aq)^{-1}=aqua^{-1}q^{-1}=quq^{-1}$

所以同一个方向的四元数都表明同一个旋转，并不能缩放大小

## 参考资料

- [bilibili - 3Blue1Brown - 四元数的可视化](https://www.bilibili.com/video/BV1SW411y7W1)
- [bilibili - 小豆8593 - 四元数如何控制物体旋转？](https://www.bilibili.com/video/BV14t421h7M4)
- [知乎 - lxycg - 四元数和旋转(Quaternion & rotation)](https://www.zhihu.com/tardis/zm/art/78987582)
