# 雅可比矩阵

雅可比矩阵是多元微积分中的重要概念，表示由向量值函数的所有一阶偏导数组成的矩阵。

## 定义

对于函数 $\mathbf{f}: \mathbb{R}^n \to \mathbb{R}^m$，其雅可比矩阵 $J$ 是一个 $m \times n$ 的矩阵，表示为：

$$J = \begin{pmatrix}
\frac{\partial f_1}{\partial x_1} & \cdots & \frac{\partial f_1}{\partial x_n} \\
\vdots & \ddots & \vdots \\
\frac{\partial f_m}{\partial x_1} & \cdots & \frac{\partial f_m}{\partial x_n}
\end{pmatrix}$$

或者

$$J_{ij} = \frac{\partial f_i}{\partial x_j}$$

函数不是标量函数，即 $m>1$ 时也可以写成向量梯度

$$(\nabla \mathbf{f})_{ij} = \frac{\partial f_i}{\partial x_j} = J_{ij}$$

## 性质

### 坐标变换

设有两个坐标系 $X$ 和 $Y$，一个点在两个坐标系中分别有坐标 $(x_1, x_2, \ldots, x_n)$ 和 $(y_1, y_2, \ldots, y_n)$。

此时，坐标变换可以表示为函数：$y_i = f_i(x_1, x_2, \ldots, x_n)$

基向量变换之间的雅可比矩阵 $J$ 定义为：

$$J_{ij} = \frac{\partial y_i}{\partial x_j}$$

###  局部坐标系

在微分几何中，我们常需要在流形上建立局部坐标系。

假设 $Y$ 是全局坐标系，$X$ 是流形上的坐标系

对于任意一点，

### 雅可比行列式在积分中的作用

雅可比行列式（雅可比矩阵的行列式），记为 $\det J$ 或 $|J|$，在坐标变换下的积分计算中起着关键作用。

当我们从一个坐标系变换到另一个坐标系时，积分区域和积分元也会发生相应变化。具体地，若要计算积分：

$$\int_{\Omega} f(y_1, y_2, \ldots, y_n) dy_1 dy_2 \ldots dy_n$$

通过变换 $y_i = g_i(x_1, x_2, \ldots, x_n)$，转换为：

$$\int_{g^{-1}(\Omega)} f(g(x_1, x_2, \ldots, x_n)) \cdot |\det J| dx_1 dx_2 \ldots dx_n$$

其中，$|\det J|$ 是雅可比行列式的绝对值，表示在坐标变换下体积元的变化比例。雅可比行列式实质上描述了坐标变换引起的"体积变形因子"。

在多重积分、曲线积分、曲面积分等各类积分中，雅可比行列式都起着至关重要的作用，特别是在变量替换和坐标变换技术中。

1. 行列式 $|J|$ 称为雅可比行列式，表示局部变换的体积缩放因子

2. 当 $m=n$ 时，若雅可比行列式非零，函数在该点局部可逆

## 雅可比行列式

对于一些柱体、锥体、球体求积分时，往往转换为对应的坐标系进行求解

如果将函数直接代入对应坐标系，将会引起拉伸导致积分值不同



此时需要乘以雅可比行列式抵消这一变化

对于从柱坐标系和球坐标系到空间直角坐标系的行列式，有

柱坐标系：
$$
J = \begin{vmatrix}
\frac{\partial x}{\partial r} & \frac{\partial x}{\partial \theta} & \frac{\partial x}{\partial z} \\
\frac{\partial y}{\partial r} & \frac{\partial y}{\partial \theta} & \frac{\partial y}{\partial z} \\
\frac{\partial z}{\partial r} & \frac{\partial z}{\partial \theta} & \frac{\partial z}{\partial z}
\end{vmatrix} = 
\begin{vmatrix}
\cos \theta & -r\sin \theta & 0 \\
\sin \theta & r\cos \theta & 0 \\
0 & 0 & 1
\end{vmatrix} = r
$$

球坐标系：
$$
J = \begin{vmatrix}
\frac{\partial x}{\partial r} & \frac{\partial x}{\partial \theta} & \frac{\partial x}{\partial \varphi} \\
\frac{\partial y}{\partial r} & \frac{\partial y}{\partial \theta} & \frac{\partial y}{\partial \varphi} \\
\frac{\partial z}{\partial r} & \frac{\partial z}{\partial \theta} & \frac{\partial z}{\partial \varphi}
\end{vmatrix} = 
\begin{vmatrix}
\sin \varphi \cos \theta & -r\sin \varphi \sin \theta & r\cos \varphi \cos \theta \\
\sin \varphi \sin \theta & r\sin \varphi \cos \theta & r\cos \varphi \sin \theta \\
\cos \varphi & 0 & -r\sin \varphi
\end{vmatrix} = r^2\sin \varphi
$$

所以有：

- 柱坐标系：$dx\,dy\,dz = |J|\,dr\,d\theta\,dz = r\,dr\,d\theta\,dz$
- 球坐标系：$dx\,dy\,dz = |J|\,dr\,d\theta\,d\varphi = r^2\sin \varphi\,dr\,d\theta\,d\varphi$

::: info 雅可比行列式为什么是这样

雅可比行列式代表 $(x,y,z)$ 下体积微元——三个向量 $(dr,d\theta,d\varphi)$ 围成的平行六面体的体积

众所周知，这就是行列式的含义： $|\mathbf{r}_r\,\mathbf{r}_\theta\,\mathbf{r}_\varphi|$ （也可以写成 $|\frac{\partial \mathbf{r}}{\partial r}\,\frac{\partial \mathbf{r}}{\partial \theta}\,\frac{\partial \mathbf{r}}{\partial \varphi}|$ ） 展开就是雅可比行列式

其中 $\mathbf{r}$ 表示 $(x,y,z)$ 中的一点

$$
\mathbf{r}=\begin{pmatrix}
	x(r,\theta,\varphi) \\
	y(r,\theta,\varphi) \\
	z(r,\theta,\varphi)
\end{pmatrix}
$$
