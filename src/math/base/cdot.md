# 向量内积
## 定义

向量内积的几何定义为

$$\mathbf{a}\cdot\mathbf{b} = |a||b|\cos\theta$$

其中，$\mathbf{a}, \mathbf{b}$ 是向量，$\theta$ 是它们之间的夹角

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

## 内积与测量

当我们写下向量的坐标的时候，暗含了我们使用基向量去测量这个向量

测量的方式就是投影，这个分量上的值计算为

$$\frac{|\mathbf{a}|\cos\theta}{|\mathbf{e}|}$$

其中 $\mathbf{a}$ 是待测向量，$\mathbf{e}$ 是基向量，$\theta$ 是夹角

向量内积可以理解为乘法的一种拓展

用一个向量方向上的单位向量去测量这两个向量，然后乘起来，得到

$$\frac{|\mathbf{a}||\mathbf{b}|\cos\theta}{1}$$

即为定义式

### 反向定义测量

特别地，我们可以用内积反过来定义测量

向量 $\mathbf{v}$ 在一组基向量 $\mathbf{e}_i$ 上的坐标 $v^i$ 可以通过以下方式表达：

$$\mathbf{v} = v^i\mathbf{e}_i$$

它同时也是相对坐标转换为全局坐标的方式

将其与 $\mathbf{e}_i$ 作内积，得到

$$\mathbf{v}\cdot\mathbf{e}_i = v^i\mathbf{e}_i\cdot\mathbf{e}_i$$

整理得到 $\mathbf{v}$ 在 $\mathbf{e}_i$ 下的坐标

$$v^i = \frac{\mathbf{v} \cdot \mathbf{e}_i}{\mathbf{e}_i \cdot \mathbf{e}_i} = \frac{\mathbf{v} \cdot \mathbf{e}_i}{|\mathbf{e}_i|^2}$$

于是我们用内积重新定义了测量。

在标准正交基情况下（即基向量相互垂直且单位长度），$|\mathbf{e}_i|^2 = 1$，此时坐标简化为：

$$v^i = \mathbf{v} \cdot \mathbf{e}_i$$

这在将全局坐标转换为相对坐标时十分有用

## 拓展到多维

我们知道向量可以表示为其基向量的线性组合

$$\begin{align*}
\mathbf{a} &= a^1\mathbf{e}_1 + a^2\mathbf{e}_2+\cdots = a^i\mathbf{e}_i\\
\mathbf{b} &= b^1\mathbf{e}_1 + b^2\mathbf{e}_2+\cdots = b^i\mathbf{e}_i
\end{align*}$$

> 这里的上标来自[上标与下标的区别](/math/base/updown)，意味着基向量变大时，为了保持含义不变，对应的数值会减小

在欧氏空间下，由于

$$\mathbf{e}_i\cdot\mathbf{e}_j=\delta_{ij}$$

所以得到了一般的向量内积计算式

$$\mathbf{a}\cdot\mathbf{b} = \sum_{ij} a^ib^j(\mathbf{e}_i\cdot\mathbf{e}_j) = \sum_{ij} \delta_{ij}a^ib^j = \sum_i a^ib^i$$

## 度量张量

在非欧空间内，基向量可能产生放缩或旋转，以至于每一点都有不同的度量，此时我们定义度量张量 $\mathbf{g}$ 来描述局部基向量的关系

$$g_{ij} = \mathbf{e}_i\cdot\mathbf{e}_j$$

它是一个 $n\cdot n$ 的矩阵，$n$ 是维数，描述每两个基向量内积的值，并且可能随着坐标而改变

由于向量之间的内积是对称的，很容易看出它是一个对称矩阵

$$g_{ij} = g_{ji}$$

于是局部点乘

$$\mathbf{a}\cdot\mathbf{b} = \sum_{ij} a^i\mathbf{e}_ib^j\mathbf{e}_j = g_{ij} a^ib^j$$

局部距离

$$|\mathbf{a}|^2 = g_{ij}a^ia^j$$

由于物理空间中任何非零向量的长度都是正的，所以对任意非零的 $a^i$，有：

$$g_{ij}a^ia^j > 0$$

这正是对称矩阵正定性的定义。因此 $g_{ij}$ 是正定的。
