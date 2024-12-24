# 傅里叶级数 笔记

- [【官方双语】微分方程概论-第四章：但什么是傅立叶级数呢？-从热流到画圈圈](https://www.bilibili.com/video/BV1vt411N7Ti)

## 初始

对于任何 $f:[0,1] \rightarrow \mathbb{C}$ 可以这样逼近

$$
\begin{align*}
f(t) &= \sum_{n=-\infty}^{\infty}c_{n}e^{n \cdot 2\pi it}\\
&= \dots + c_{-2}e^{-2 \cdot 2\pi it} + c_{-1}e^{-1 \cdot 2\pi it} + c_{0}e^{0 \cdot 2\pi it} + c_{1}e^{1 \cdot 2\pi it} + c_{2}e^{2 \cdot 2\pi it} + \dots
\end{align*}
$$

$c_n$是复数，表示每个向量的初始位置，而$e^{n \cdot 2\pi it}$表示旋转速度是每秒(单位时间)转$n$圈

$c_n$可以这样算

$$
\int_{0}^{1}f(t)e^{-n \cdot 2\pi it} dt\\
\begin{align*}
&= \int_{0}^{1}(\dots + c_{-1}e^{-1 \cdot 2\pi it} + c_{0}e^{0 \cdot 2\pi it} + c_{1}e^{1 \cdot 2\pi it} + \dots)e^{-n \cdot 2\pi it} dt\\
&= \int_{0}^{1}(\dots + c_{n-1}e^{-1 \cdot 2\pi it} + c_{n}e^{0 \cdot 2\pi it} + c_{n+1}e^{1 \cdot 2\pi it} + \dots) dt\\
&= \dots + \int_{0}^{1}c_{n-1}e^{-1 \cdot 2\pi it}dt + \int_{0}^{1}c_{n}e^{0 \cdot 2\pi it}dt + \int_{0}^{1}c_{n+1}e^{1 \cdot 2\pi it}dt +  \dots\\
&= \int_{0}^{1}c_{n}e^{0 \cdot 2\pi it}dt\\
&= c_{n}
\end{align*}
$$

## 解释

这里的积分$\int_{0}^{1}f(t) dt$实际上是求整个图像的平均值/重心，只不过 $t$ 的范围是 $1$ 所以值相等

关键在于，和的平均值等于平均值的和

我们给和(f(t))求平均值(积分)，等于给每一个旋转的向量求平均值(积分)，然后求和

由于其它所有向量都旋转了整数倍（都是每秒转n圈，而这个时间就是一秒），因此平均值都是$0$，所以有

$$
\int_{0}^{1}f(t) dt = \int_{0}^{1}c_{0}e^{0 \cdot 2\pi it}dt = c_0
$$

我们再用$e^{-n \cdot 2\pi it}$来增减旋转的速度

由于乘法分配律，它同时作用在所有的旋转上，足以让每秒转n圈的停下来，同时其它的变成旋转整数圈

所以此时的平均值

$$
\int_{0}^{1}f(t)e^{-n \cdot 2\pi it} dt = \int_{0}^{1}c_{n}e^{0 \cdot 2\pi it}dt = c_n
$$

至此，我们对于任意函数，可以有计算式

$$
f(t) = \sum_{n=-\infty}^{\infty}c_{n}e^{n \cdot 2\pi it}
$$

其中

$$
c_n = \int_{0}^{1}f(t)e^{-n \cdot 2\pi it} dt
$$

来逼近

## 练习

例：尝试逼近函数

$$
\begin{equation*}
f(x)=\left\{
\begin{aligned}
1 &, x\in [0, 0.5)
\\ -1 &, x\in [0.5, 1]
\end{aligned}
\right.
\end{equation*}
$$

那么就是要求出

$$
\begin{align*}
c_n &= \int_{0}^{1}f(x)e^{-n \cdot 2\pi ix} dx
\\&= \int_{0}^{0.5}1\cdot e^{-n \cdot 2\pi ix} dx + \int_{0.5}^{1}-1\cdot e^{-n \cdot 2\pi ix} dx
\\&= -\frac{1}{n\cdot 2\pi i}\left(
    e^{-n \cdot\pi i} - e^0
    -e^{-n \cdot 2\pi i} + e^{-n \cdot\pi i}
\right)
\\&= -\frac{1}{n\cdot\pi i}\left(
    (-1)^{-n} - 1
\right)
\\&= \frac{1 - (-1)^n}{n\cdot\pi i}
\\&= \left\{
\begin{aligned}
    &0 &, n\text{是偶数}
\\  &\frac{2}{n\cdot\pi i} &, n\text{是奇数}
\end{aligned}
\right.
\end{align*}
$$

于是我们有

$$
f(x)=\sum_{n=-\infty}^{\infty}c_{n}e^{n \cdot 2\pi ix}
= \sum_{n=1,3,5,\dots}\frac{2}{n\cdot\pi i}e^{n \cdot 2\pi ix}-\frac{2}{n\cdot\pi i}e^{-n \cdot 2\pi ix}
\\= \sum_{n=1,3,5,\dots}\frac{4}{n\cdot\pi}\frac{1}{2i}\left(e^{n \cdot 2\pi ix}-e^{-n \cdot 2\pi ix}\right)
\\= \sum_{n=1,3,5,\dots}\frac{4}{n\cdot\pi}\text{sin}(n\cdot 2\pi x)
$$

::: info

由欧拉公式有

$$
e^{ix} = \text{cos}x + i\cdot \text{sin}x\\
e^{-ix} = \text{cos}x - i\cdot \text{sin}x
$$

于是我们有

$$
2\cdot\text{cos}x = e^{ix}+e^{-ix}\\
2i\cdot\text{sin}x = e^{ix}-e^{-ix}
$$

即

$$
\text{cos}x = \frac{1}{2}(e^{ix}+e^{-ix})\\
\text{sin}x = \frac{1}{2i}(e^{ix}-e^{-ix})
$$

也就是我们在上面例题使用的代换

:::

:::info 试一试！

尝试逼近函数

$$
\begin{equation*}
f(x)=\left\{
\begin{aligned}
&x-0.5 &, x\in [0, 0.5)
\\&0 &, x\in [0.5, 1]
\end{aligned}
\right.
\end{equation*}
$$

:::

## 实数域上的傅里叶级数

对于实数域上的函数$f(t)$，需要将复指数的形式转换为 sin 和 cos 的形式

$$
f(t) = \sum_{n=-\infty}^{\infty}c_{n}e^{n \cdot 2\pi it}
$$

$$
c_n = \int_{0}^{1}f(t)e^{-n \cdot 2\pi it} dt
$$

我们留出$n=0$，把其它的正负两两配对

$$
f(t) = c_0 + \sum_{n=1}^{\infty}\left(c_n e^{n \cdot 2\pi it} + c_{-n} e^{-n \cdot 2\pi it} \right)
$$

由欧拉公式展开

$$
e^{n \cdot 2\pi it} = \text{cos}(n\cdot 2\pi t) + i\cdot\text{sin}(n\cdot 2\pi t)
\\
e^{-n \cdot 2\pi it} = \text{cos}(n\cdot 2\pi t) - i\cdot\text{sin}(n\cdot 2\pi t)
$$

于是

$$
\begin{align*}
c_n &= \int_{0}^{1}f(t)e^{-n \cdot 2\pi it} dt
\\&= \int_{0}^{1}f(t)(\text{cos}(n\cdot 2\pi t) - i\cdot\text{sin}(n\cdot 2\pi t)) dt
\\&= \int_{0}^{1}f(t)\text{cos}(n\cdot 2\pi t) dt - i\cdot\int_{0}^{1}f(t)\text{sin}(n\cdot 2\pi t) dt
\\c_{-n} &= \int_{0}^{1}f(t)\text{cos}(n\cdot 2\pi t) dt + i\cdot\int_{0}^{1}f(t)\text{sin}(n\cdot 2\pi t) dt
\end{align*}
$$

记

$$
\begin{align*}
a_n &= \int_{0}^{1}f(t)\text{cos}(n\cdot 2\pi t) dt
\\ b_n &= \int_{0}^{1}f(t)\text{sin}(n\cdot 2\pi t) dt
\end{align*}
$$

则

$$
c_n = a_n - b_n\cdot i
\\
c_{-n} = a_n + b_n\cdot i
\\
f(t) = c_0 + \sum_{n=1}^{\infty}((a_n - b_n\cdot i) (\text{cos}(n\cdot 2\pi t) + i\cdot\text{sin}(n\cdot 2\pi t))
\\ + (a_n + b_n\cdot i)(\text{cos}(n\cdot 2\pi t) - i\cdot\text{sin}(n\cdot 2\pi t)))
\\ = c_0 + \sum_{n=1}^{\infty}(2a_n\text{cos}(n\cdot 2\pi t)+2b_n\text{sin}(n\cdot 2\pi t))
$$

由于

$$
b_0 = \int_{0}^{1}f(t)\text{sin}(0) dt = 0
$$

于是

$$
c_0=a_0-b_0\cdot i = a_0
$$

于是我们得到了实数域上的傅里叶级数

$$
f(t) = a_0 + \sum_{n=1}^{\infty}(2a_n\text{cos}(n\cdot 2\pi t)+2b_n\text{sin}(n\cdot 2\pi t))
$$

其中

$$
\begin{align*}
a_n &= \int_{0}^{1}f(t)\text{cos}(n\cdot 2\pi t) dt
\\ b_n &= \int_{0}^{1}f(t)\text{sin}(n\cdot 2\pi t) dt
\end{align*}
$$
