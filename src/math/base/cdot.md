# 向量内积
## 定义

向量内积的几何定义为

$$\mathbf{a}\cdot\mathbf{b} = |a||b|\cos\theta$$

其中，$\mathbf{a}, \mathbf{b}$ 是向量，$\theta$ 是它们之间的夹角

直观来看，求点积相当于一个向量乘以另一个向量对自己的投影

它是对称的，从这个向量投影到另一个向量相乘会得到一样的结果。

另一个等价的表述为，用其中一个向量方向上的单位向量去测量这两个向量投影的长度，然后相乘

这可以理解为乘法的一种扩展。

## 计算

以平面直角坐标系为例，我们知道向量可以表示为其基向量的线性组合

$$\begin{align*}
\mathbf{a} &= a_1\mathbf{i} + a_2\mathbf{j}\\
\mathbf{b} &= b_1\mathbf{i} + b_2\mathbf{j}
\end{align*}$$

那么根据乘法分配律，我们可以得到

$$\begin{align*}
\mathbf{a}\cdot\mathbf{b}
&= (a_1\mathbf{i} + a_2\mathbf{j})\cdot(b_1\mathbf{i} + b_2\mathbf{j})\\
&= a_1b_1(\mathbf{i}\cdot \mathbf{i}) + a_1b_2(\mathbf{i}\cdot \mathbf{j}) + a_2b_1(\mathbf{j}\cdot \mathbf{i}) + a_2b_2(\mathbf{j}\cdot \mathbf{j})\\
&= a_1b_1 + a_2b_2
\end{align*}$$

这就是为什么

$$\begin{pmatrix}
a_1\\
a_2
\end{pmatrix}\cdot\begin{pmatrix}
b_1\\
b_2
\end{pmatrix} = a_1b_1+a_2b_2$$

同时，长度也可以由向量与其自身的内积导出

$$|\mathbf{a}|^2 = \mathbf{a}\cdot\mathbf{a}$$

## 拓展到多维

我们知道向量可以表示为其基向量的线性组合

$$\begin{align*}
\mathbf{a} &= a^1\mathbf{e}_1 + a^2\mathbf{e}_2+\cdots = \sum_i a^i\mathbf{e}_i\\
\mathbf{b} &= b^1\mathbf{e}_1 + b^2\mathbf{e}_2+\cdots = \sum_i b^i\mathbf{e}_i
\end{align*}$$

> 这里的上标来自[上标与下标的区别](/math/base/updown)，意味着基向量变大时，为了保持含义不变，对应的数值会减小

在欧氏空间下，由于

$$\mathbf{e}_i\cdot\mathbf{e}_j=\delta_{ij}$$

所以得到了一般的向量内积计算式

$$\mathbf{a}\cdot\mathbf{b} = \sum_{ij} a^ib^j(\mathbf{e}_i\cdot\mathbf{e}_j) = \sum_{ij} \delta_{ij}a^ib^j = \sum_i a^ib^i$$

使用[爱因斯坦求和约定](/math/base/einstein-summation.md)可以简洁地表示为

$$\mathbf{a}\cdot\mathbf{b} =  a^ib_i$$

## 度量张量

在非欧空间内，基向量可能产生放缩或旋转， $\mathbf{e}_i\cdot\mathbf{e}_j$ 不再恒等于 $0$ 或 $1$，甚至可能在每一点都不同，此时我们定义这个值为度量张量 $\mathbf{g}$

$$g_{ij} = \mathbf{e}_i\cdot\mathbf{e}_j$$

它是一个 $n\cdot n$ 的矩阵，$n$ 是维数，描述每两个基向量内积的值，并且是关于坐标的函数

由于向量之间的内积是对称的，很容易看出它是一个对称矩阵

$$g_{ij} = g_{ji}$$

于是局部点乘

$$\mathbf{a}\cdot\mathbf{b} = \sum_{ij} a^i\mathbf{e}_ib^j\mathbf{e}_j = g_{ij} a^ib^j$$

局部距离

$$|\mathbf{a}|^2 = g_{ij}a^ia^j$$

由于物理空间中任何非零向量的长度都是正的，所以对任意非零的 $a^i$，有：

$$g_{ij}a^ia^j > 0$$

这正是对称矩阵正定性的定义。因此 $g_{ij}$ 是正定的。

## 坐标变换

向量 $\mathbf{v}$ 在一组基向量 $\mathbf{e}_i$ 上的坐标 $u^i$ 可以表达为：

$$\mathbf{v} = u^i\mathbf{e}_i$$

若基向量 $\mathbf{e}_i$ 在全局坐标系下表示为 $e_{ij}$，那么向量 $\mathbf{v}$ 的全局坐标

$$v^i = e_{ij} u^j$$

是相对坐标转换为全局坐标的方式

接下来计算全局坐标转换为相对坐标

点乘以基向量

$$\begin{align*}
\mathbf{v}\cdot\mathbf{e}_j &= (u^i\mathbf{e}_i)\cdot\mathbf{e}_j\\
&= u^i(\mathbf{e}_i\cdot\mathbf{e}_j)\\
&= g_{ij} u^i
\end{align*}$$

于是得到：

$$u^i = g^{ij}(\mathbf{v}\cdot\mathbf{e}_j)$$

其中 $g^{ij}$ 是度量张量 $g_{ij}$ 的逆

我们定义对偶基(或称逆变基)

$$\mathbf{e}^i = g^{ij}\mathbf{e}_j$$

这样，坐标可以简洁地表示为：

$$u^i = \mathbf{v}\cdot\mathbf{e}^i$$

在标准正交基情况下（即基向量相互垂直且单位长度），$g_{ij} = \delta_{ij}$，此时坐标简化为：

$$u^i = \mathbf{v} \cdot \mathbf{e}_i$$