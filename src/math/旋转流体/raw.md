# 2 旋转流体

## 2.1 引言

正如我们可以从观察中推断的那样，大多数恒星保持在力学平衡状态，压力梯度力平衡了它们自身的引力，并由离心力校正了轴向旋转的影响。因此，理论工作倾向于关注旋转恒星的平衡图像，假设运动完全是纯旋转。然而，对太阳的详细研究表明，在其对流层中存在大尺度运动，既围绕旋转轴，也在穿过轴的子午面内。理论工作表明，大尺度的子午环流也存在于旋转恒星的辐射区域。此外，随着新的结果不断出现，越来越明显的是，这些区域包含了嵌入在大尺度流动中的各种湍流运动谱。所有这些问题都属于天体物理流体动力学的范畴——这是一个发展相当缓慢的领域。

然而，在过去的五十年里，气象学家和海洋学家在了解旋转流体行为方面取得了重要进展。因此，我认为有必要回顾一些适用于地球大气和海洋以及恒星的动力学概念。正如我们将看到的，所有这些都在对旋转恒星中大尺度运动进行定量分析时发挥着关键作用。因此，除非读者已经熟悉地球物理流体动力学，否则我建议阅读这个介绍性章节，这对理解本书中处理的许多流体动力学问题至关重要。

## 2.2 流体运动方程

流体动力学基于这样一个假设：流动的长度尺度总是被认为大于构成粒子的平均自由程，因此流体可以被视为连续体。这个模型使得可以在空间中的一点处理流体性质（如速度、压力、密度等），物理变量是空间和时间的连续函数。换句话说，我们假设我们系统的宏观行为与物质分布完全连续的情况相同。因此，当我们谈论"质量元素"（或"流体粒子"）的速度时，我们总是指包含在有限范围的小体积内的大量构成粒子的平均速度，尽管这个体积必须被视为一个点。

从连续体角度对流体运动的数学描述允许两种不同的方法。第一种称为拉格朗日描述,它识别每个质量元素并描述它随时间的变化。从数学上讲,我们用函数表示运动:

$$
\mathbf{r} = \mathbf{r}(\mathbf{R}, t),\tag{2.1}
$$

其中$\mathbf{R} = (X_1, X_2, X_3)$是流体粒子在$t = 0$时（假设）的原始位置,而$\mathbf{r} = (x_1, x_2, x_3)$是同一质量元素在随后时刻$t$的位置。因变向量$\mathbf{r}$由此被确定为独立变量$\mathbf{R}$和$t$的函数。流体粒子的速度和加速度是

$$
\mathbf{v}(\mathbf{R}, t) = \frac{\partial\mathbf{r}}{\partial t} \quad \text{和} \quad \mathbf{a}(\mathbf{R}, t) = \frac{\partial^2\mathbf{r}}{\partial t^2},\tag{2.2}
$$

其中偏导数表示对给定质量元素（即,保持$\mathbf{R}$不变）进行微分。

第二种方法,称为欧拉描述,关注空间中的特定点,并描述该点随时间的流动。从数学上讲,运动状态由速度场描述

$$
\mathbf{v} = \mathbf{v}(\mathbf{r}, t),\tag{2.3}
$$

其中独立变量是空间位置,由向量$\mathbf{r} = (x_1, x_2, x_3)$表示,以及时间。流体粒子的加速度是速度的物质导数。因此,我们有

$$
\mathbf{a}(\mathbf{r}, t) = \frac{D\mathbf{v}}{Dt} = \frac{\partial\mathbf{v}}{\partial t} + (\mathbf{v} \cdot \text{grad})\mathbf{v}.\tag{2.4}
$$

同样,可以定义物质导数

$$
\frac{DQ}{Dt} = \frac{\partial Q}{\partial t} + (\mathbf{v} \cdot \text{grad})Q,\tag{2.5}
$$

它测量当我们沿流体粒子的路径移动时量$Q$的变化率。

### 2.2.1 守恒原理

我不打算推导流体动力学的基本方程,因为它们可以在许多教科书中找到。在本节中,我将列出这些方程,使用欧拉规范,在惯性参考系中。

在流体内部没有物质源或汇的情况下,质量守恒由连续性方程表示,

$$
\frac{1}{\rho} \frac{D\rho}{Dt} + \text{div}\mathbf{v} = 0.\tag{2.6}
$$

这个方程说明质量元素的密度变化率和体积变化率在大小上相等但符号相反。

牛顿第二运动定律可以写成

$$
\frac{D\mathbf{v}}{Dt} = \mathbf{g} - \frac{1}{\rho}\text{grad}p + \frac{1}{\rho}\mathbf{f}(\mathbf{v}),\tag{2.7}
$$

其中$\mathbf{g}$是重力加速度，$\rho$是密度，$p$是压力。向量$\mathbf{f}$是单位体积的粘性力，可以写成粘性应力张量$\tau$的矢量散度。对于牛顿流体，这个对称张量的六个分量是

$$
\tau_{ij} = \mu \left(\frac{\partial v_i}{\partial x_j} + \frac{\partial v_j}{\partial x_i} - \frac{2}{3}\delta_{ij}\frac{\partial v_k}{\partial x_k}\right) + \mu_B\delta_{ij}\frac{\partial v_k}{\partial x_k},\tag{2.8}
$$

其中剪切粘度$\mu$和体积粘度$\mu_B$系数都依赖于局部热力学性质（仅当$\delta_{ij} = 1$如果$i = j$，$\delta_{ij} = 0$如果$i \neq j$；求和是对重复指标进行的）。因此，我们有

$$
\mathbf{f}(\mathbf{v}) = \mu\nabla^2\mathbf{v} + \left(\mu + \frac{1}{3}\mu_B\right)\text{grad}(\text{div}\mathbf{v}),\tag{2.9}
$$

这里为了简单起见，我们假设粘度系数在运动场中保持恒定。方程(2.7)通常被称为纳维-斯托克斯方程。

如果流动的压力变化不产生任何显著的密度变化，则可以忽略流体的可压缩性。（这在大多数液体流动中发生，也在气体流动中发生，其中速度处处远小于声速。）然而，在不可压缩流动中，总是需要用基于热力学原理的方程来增补方程(2.6)和(2.7)。具体来说，热能守恒意味着

$$
\rho\frac{DU}{Dt} + p\,\text{div}\mathbf{v} = \text{div}(k_c\,\text{grad}\,T) + \Phi_v + \rho Q,\tag{2.10}
$$

其中$U$是单位质量的热能，$T$是温度，$k_c$是热传导系数，$\Phi_v$是（每单位体积和单位时间）由粘性摩擦产生的热量，$Q$是（每单位质量）由内部热源产生的净热量。对于本书中要讨论的所有情况，耗散函数$\Phi_v$都可以忽略不计。由于函数$Q$对恒星内部特别相关，它将在3.2节中进一步讨论。

现在，假设流体的每一点都发生准静态变化，我们可以写

$$
T\frac{DS}{Dt} = \frac{DU}{Dt} + p\frac{D}{Dt}\left(\frac{1}{\rho}\right),\tag{2.11}
$$

其中$S$是单位质量的熵。根据方程(2.6)，比较方程(2.10)和(2.11)得到结果

$$
\rho T\frac{DS}{Dt} = \text{div}(k_c\,\text{grad}\,T) + \Phi_v + \rho Q,\tag{2.12}
$$

表示当我们沿着质量元素的运动路径时比熵的变化。

要完成方程组，还需要进一步的热力学关系。例如，对于理想气体，我们有

$$
U = c_VT\tag{2.13}
$$

且

$$
p = \frac{\mathcal{R} }{\bar{\mu} } \rho T, \tag{2.14}
$$

其中$\bar{\mu}$是平均分子量。我们还有$\mathcal{R}/\bar{\mu} = c_p - c_V$，其中$c_p$和$c_V$分别是恒压比热容和恒容比热容。将这些关系代入方程(2.11)，我们得到

$$
S = c_p \log \Theta + constant. \tag{2.15}
$$

量

$$
\Theta = T \left(\frac{p_0}{p}\right)^{(\gamma-1)/\gamma}, \tag{2.16}
$$

其中$p_0$是一个常数参考压力，$\gamma$是绝热指数，被称为势温。对于等熵运动（即方程[2.12]右侧恒等于零的运动），每个流体粒子的势温沿其路径保持恒定。

### 2.2.2 边界条件

为了求解控制流体运动的偏微分方程，必须规定覆盖所有空间的初始条件和覆盖所有时间的边界条件。虽然初始条件总是特定于手头的问题，但适当的边界条件具有相当普遍的性质。

在固定的固体边界上，不能有穿过边界的流体运动。这个条件意味着

$$
\mathbf{n} \cdot \mathbf{v} = 0, \tag{2.17}
$$

其中$\mathbf{n}$是表面的外法线。第二个条件由无滑移条件提供，即刚性壁和与之相邻的粘性流体之间不应有相对切向速度。因此，我们还必须规定

$$
\mathbf{n} \times \mathbf{v} = \mathbf{0}, \tag{2.18}
$$

在固定的固体壁上。

在界面边界（如海洋表面或恒星的外表面），必须规定没有质量元素穿过这个边界，以便边界上的流体粒子保持在边界上。因此，如果$\xi(\mathbf{r}, t)$定义了相对于平衡水平的表面高程，则速度的运动学边界条件为

$$
\frac{D\xi}{Dt} = \mathbf{n} \cdot \mathbf{v} \tag{2.19}
$$

在物质边界上。如果这个边界是固定的（即$\xi \equiv 0$），条件(2.19)简化为

$$
\mathbf{n} \cdot \mathbf{v} = 0, \tag{2.20}
$$

表示物质总是沿着规定的物质边界流动。

除了这个运动学边界条件，显然我们还必须确保在任何非固体边界上的力平衡。例如，在恒星的自由表面上重力加速度必须是连续的。同样，作用于非固体边界上的应力矢量的分量必须在该边界上连续（参见方程[2.8]）。因此，我们有

$$
[n_k(-p\delta_{ik} + t_{ik})] = 0,\tag{2.21}
$$

其中方括号表示该量在非固体边界上的跳跃（$i = 1, 2, 3$）。特别是，在嵌入真空中的恒星模型的自由表面上，这三个分量必须恒等于零。

### 2.2.3 旋转参考系

在某些应用中，描述运动以相对于以恒定角速度$\Omega$旋转的参考系中静止的观察者所看到的方式是很方便的。我们可以写作

$$
\mathbf{v}(\mathbf{r}, t) = \mathbf{u}(\mathbf{r}, t) + \mathbf{\Omega} \times \mathbf{r},\tag{2.22}
$$

其中速度$\mathbf{u}$指的是相对于运动轴的速度。同样，物质加速度(2.4)具有如下形式

$$
\mathbf{a}(\mathbf{r}, t) = \frac{D\mathbf{u}}{Dt} + 2\mathbf{\Omega} \times \mathbf{u} + \mathbf{\Omega} \times (\mathbf{\Omega} \times \mathbf{r}),\tag{2.23}
$$

其中

$$
\frac{D\mathbf{u}}{Dt} = \frac{\partial\mathbf{u}}{\partial t} + (\mathbf{u} \cdot \mathrm{grad})\mathbf{u}\tag{2.24}
$$

是相对于旋转参考系的加速度。量$2\mathbf{\Omega} \times \mathbf{u}$和$\mathbf{\Omega} \times (\mathbf{\Omega} \times \mathbf{r})$分别表示科里奥利加速度和离心加速度。由于张量(2.8)对于均匀旋转是不变的，方程(2.7)则变为

$$
\frac{D\mathbf{u}}{Dt} + 2\mathbf{\Omega} \times \mathbf{u} = \mathbf{g} - \mathbf{\Omega} \times (\mathbf{\Omega} \times \mathbf{r}) - \frac{1}{\rho} \mathrm{grad}\, p + \frac{1}{\rho} \mathbf{f}(\mathbf{u}). \tag{2.25}
$$

容易证明

$$
\mathbf{\Omega} \times (\mathbf{\Omega} \times \mathbf{r}) = -\mathrm{grad} \left(\frac{1}{2}|\mathbf{\Omega} \times \mathbf{r}|^2\right). \tag{2.26}
$$

因为矢量$\mathbf{g}$也可以从标量势$V$（比如说）导出，我们可以将动量方程(2.25)改写为

$$
\frac{D\mathbf{u}}{Dt} + 2\mathbf{\Omega} \times \mathbf{u} = \mathbf{g}_e - \frac{1}{\rho} \mathrm{grad}\, p + \frac{1}{\rho} \mathbf{f}(\mathbf{u}), \tag{2.27}
$$

其中

$$
\mathbf{g}_e = -\mathrm{grad} \left(V - \frac{1}{2}|\mathbf{\Omega} \times \mathbf{r}|^2\right) \tag{2.28}
$$

是有效重力。比较方程(2.27)和方程(2.7)，可以很容易看出，科里奥利加速度是相对于旋转参考系的牛顿第二运动定律的唯一结构变化。

> 早在1835年，法国工程师Gaspard Coriolis (1792-1843)就对旋转参考系中运动物体的绝对加速度进行了详细的数学研究。他的工作对当时的气象学研究几乎没有产生影响，以至于在整个十九世纪期间，我们对旋转流体行为的认知几乎没有取得进展。事实上，直到19世纪50年代末，美国气象学家威廉·费雷尔（William Ferrel，1817-1891年）才首次对旋转地球上的大气运动进行了数学公式化。此外，正如我们将在2.6.1节中看到的，地球自转对风驱动海洋洋流的偏转力的重要性直到二十世纪初才被认识到。例如，英国学者亚瑟·埃丁顿（Arthur Eddington，1882-1944年）在1925年注意到，恒星辐射区域中的大尺度子午线环流会因恒星的自转而向东西方向偏转，但直到1941年冈纳·雷塞兰（Gunnar Randers，1914-1992年）才对旋转恒星中粘性力和偏转力之间的平衡进行了首次详细分析（参见公式[4.49]）。

对于稳定流动，在旋转坐标系中测量的加速度和科里奥利加速度的相对重要性可以估计为

$$
\frac{|\mathbf{u} \cdot \mathrm{grad}\, \mathbf{u}|}{|\Omega \times \mathbf{u}|} \approx \frac{U^2/L}{\Omega U} = \frac{U}{\Omega L}, \tag{2.29}
$$

其中$U$和$L$分别是流动的特征速度和长度。这个比值是一个无量纲数，称为罗斯比数，用$Ro$表示：

$$
Ro = \frac{U}{\Omega L}. \tag{2.30}
$$

类似地，利用方程(2.9)，可以很容易地估算粘性力与科里奥利力的比值。得到：

$$
\frac{|\nu\nabla^2\mathbf{u}|}{|\Omega \times \mathbf{u}|} \approx \frac{\nu U/L^2}{\Omega U} = \frac{\nu}{\Omega L^2}, \tag{2.31}
$$

其中$\nu = \mu/\rho$是运动粘度系数。无量纲数

$$
E = \frac{\nu}{\Omega L^2} \tag{2.32}
$$

被称为埃克曼数。

## 2.3 涡度方程

为了可视化流体运动，通常构建流线来表示流动是很方便的。由于流线是处处与流体速度v(r, t)相切的想象线，这样的线族可以通过以下积分给出：

$$
\frac{dx_1}{v_1} = \frac{dx_2}{v_2} = \frac{dx_3}{v_3} \tag{2.33}
$$

在稳态流动中，流线和粒子路径是相同的。

然而，在许多情况下，用绝对涡度来描述流动也很有启发性：

$$
\omega = \text{curl } \mathbf{v}, \tag{2.34}
$$

它表示在惯性参考系中测量的流体局部瞬时旋转速率。根据定义，处处与ω(r, t)相切的连续线被称为绝对涡度线。涡度线族由以下微分方程对给出：

$$
\frac{dx_1}{\omega_1} = \frac{dx_2}{\omega_2} = \frac{dx_3}{\omega_3}. \tag{2.35}
$$

根据方程(2.34)，我们总是有：

$$
\text{div } \omega = 0. \tag{2.36}
$$

因此，绝对涡度线不能在流体中开始或结束；它们要么是闭合曲线，要么终止于边界。利用方程(2.22)，我们还可以写出：

$$
\omega = \text{curl}(\mathbf{u} + \mathbf{\Omega} \times \mathbf{r}) = \zeta + 2\mathbf{\Omega}, \tag{2.37}
$$

其中ζ是相对涡度，即在旋转参考系中测量的速度的旋度。

现在让我们推导表达连续运动中涡度变化率的方程。使用矢量分析中众所周知的公式，

$$
\frac{1}{2} \text{ grad}|\mathbf{u}|^2 = \mathbf{u} \times \text{curl }\mathbf{u} + \mathbf{u} \cdot \text{grad }\mathbf{u}, \tag{2.38}
$$

我们可以对方程(2.27)取旋度得到：

$$
\frac{\partial \zeta}{\partial t} + \text{curl}(\omega \times \mathbf{u}) = \frac{1}{\rho^2} \text{ grad }\rho \times \text{ grad }p + \text{curl}\left(\frac{1}{\rho}\mathbf{f}\right). \tag{2.39}
$$

利用方程(2.36)，我们发现：

$$
\text{curl}(\omega \times \mathbf{u}) = \mathbf{u} \cdot \text{grad }\omega - \omega \cdot \text{grad }\mathbf{u} + \omega \text{ div }\mathbf{u}. \tag{2.40}
$$

由于Ω是常矢量，我们也有∂ζ/∂t = ∂ω/∂t。因此，方程(2.39)变为：

$$
\frac{D\omega}{Dt} = \omega \cdot \text{grad }\mathbf{u} - \omega \text{ div }\mathbf{u} + \frac{1}{\rho^2} \text{ grad }\rho \times \text{ grad }p + \text{curl}\left(\frac{1}{\rho}\mathbf{f}\right). \tag{2.41}
$$

结合方程(2.6)和(2.41)，我们得到涡度方程：

$$
\frac{D}{Dt}\left(\frac{\omega}{\rho}\right) = \frac{\omega}{\rho} \cdot \text{grad }\mathbf{u} + \frac{1}{\rho^3} \text{ grad }\rho \times \text{ grad }p + \frac{1}{\rho} \text{curl}\left(\frac{1}{\rho}\mathbf{f}\right). \tag{2.42}
$$

这个方程右边的第一项表示速度变化对比值ω/ρ的作用。第二项，即所谓的斜压矢量，当流体中等压面和等密度面不重合时修改这个比值。第三项表示由于粘性摩擦引起的ω/ρ比值的变化率。

由于矢量(ω/ρ) · grad u在动量方程中没有对应项，它值得进一步讨论。因此，忽略斜压矢量和摩擦力的旋度，我们得到：

$$
\frac{D}{Dt}\left(\frac{\omega}{\rho}\right) = \frac{\omega}{\rho} \cdot \text{grad }\mathbf{u}. \tag{2.43}
$$

现在，通过使用拉格朗日变量R和t（参见方程[2.1]和[2.2]），我们可以立即积分这个方程得到

$$
\frac{\omega_i}{\rho} = \frac{\omega_{0i}}{\rho_0} \frac{\partial x_i}{\partial X_i},  \tag{2.44}
$$

其中$\omega_0(\mathbf{R}, 0)$和$\rho_0(\mathbf{R}, 0)$是$\omega(\mathbf{R}, t)$和$\rho(\mathbf{R}, t)$的初始值。正如亥姆霍兹所示，这个解简单地意味着在某一时刻构成绝对涡度线的粒子将继续在任何后续时刻形成绝对涡度线。证明在于这样一个事实：这种线的切线被流体携带，使得它始终保持切于绝对涡度线。让$dX_i$是在时刻$t = 0$时绝对涡线上矢量表示线元的分量。当我们跟随其运动时，我们有

$$
dx_i = \frac{\partial x_i}{\partial X_k} dX_k,  \tag{2.45}
$$

其中$dx_i$是这个线元在时刻t的新分量。现在，根据假设，我们总是可以写

$$
dX_i = \epsilon \frac{\omega_{0i}}{\rho_0},  \tag{2.46}
$$

其中$\epsilon$是某个常数。从方程(2.44)-(2.46)可以得出

$$
dx_i = \epsilon \frac{\omega_{0k}}{\rho_0} \frac{\partial x_i}{\partial X_k} = \epsilon \frac{\omega_i}{\rho},  \tag{2.47}
$$

这意味着具有分量$dx_i$的矢量也切于绝对涡度线。这就完成了证明。根据方程(2.46)和(2.47)，我们还注意到比率$\omega_i/\rho$与绝对涡度线上线元的长度成正比。这被称为涡线拉伸或收缩。

总之，我们已经证明了绝对涡度线随流体在没有斜压性和摩擦的情况下移动。然而，尽管人们也可以构造相对涡度线，但只有绝对涡度线可能与材料线保持一致。此外，当方程(2.42)中的最后两项不恒等于零时，粘性摩擦允许绝对涡度线在流体中扩散，斜压性也能够创造新的涡旋。

### 2.3.1 泰勒-普劳德曼定理

让我们考虑旋转流体中的稳态运动。那么，如果流体的罗斯比数和埃克曼数都很小，且斜压矢量恒等于零，方程(2.42)变为

$$
\mathbf{\Omega} \cdot \text{grad} \mathbf{u} = 0,  \tag{2.48}
$$

因为当$Ro \ll 1$时，$|\zeta| \ll |\mathbf{\Omega}|$。这个条件意味着相对于移动轴的速度必须独立于平行于$\mathbf{\Omega}$的坐标。如果这个矢量沿x3轴，我们可以这样写

$$
\frac{\partial u_1}{\partial x_3} = \frac{\partial u_2}{\partial x_3} = \frac{\partial u_3}{\partial x_3} = 0.  \tag{2.49}
$$

特别地，如果我们考虑一个系统，其中固体边界垂直于旋转轴，使得在某个特定的$x_3$值处$u_3 = 0$，那么立即可以得出：

$$
\frac{\partial u_1}{\partial x_3} = \frac{\partial u_2}{\partial x_3} = 0 \quad \text{and} \quad u_3 = 0, \tag{2.50}
$$

这在流体中的任何地方都成立。因此，流动完全是在垂直于旋转轴的平面内的二维流动。

满足Taylor-Proudman约束的运动可以在实验室实验中观察到（例如，Greenspan 1968, Fig. 1.2, 和 Tritton 1988, Sec. 16.4）。举个例子，让我们考虑一种情况，其中流体和障碍物之间的相对运动垂直于旋转轴。显然，流体会绕过障碍物偏转。然而，由于流动必须是二维的，这种偏转也发生在障碍物的上方和下方。因此，人们观察到形成了一个流体柱，从障碍物延伸平行于旋转轴，在这个流体柱周围，流体被偏转，就好像它也是固体一样。由于被忽略的项从不完全消失，特别是在柱体的边缘，实际上柱体的外部和内部之间存在一些交换。然而，方程(2.48)清楚地表明了相对运动在平行于旋转轴方向上耦合的趋势。

## 2.4 雷诺应力和涡粘性

实验室实验表明，不可压缩流体中从层流到湍流运动的转变取决于雷诺数

$$
Re = \frac{LU}{\nu}, \tag{2.51}
$$

这是流动中惯性力与粘性力相对大小的度量（参见方程2.7）。这里U是流动的特征速度，L是所讨论问题的特征长度，而ν = μ/ρ是运动粘度。当无量纲数Re超过某个临界值Rec（比如说）时，湍流总是发生。这个临界数值并不是一个普适常数，而是对每种类型的流动都有不同的值。（在管道中，层流通常在Re ≈ 2,200时变为湍流。）这解释了为什么大尺度和低粘度的流体系统是湍流的。

由于分子粘度引起的阻尼非常小，其对地球物理和天体物理中遇到的大尺度运动的影响是完全可以忽略的。然而，由于地球大气层和海洋中存在强烈的中尺度运动，长期以来人们认识到这些系统包含一个与最大尺度运动共存的广泛的涡旋运动谱。（正如我们将在3.6节看到的，类似的小尺度运动存在于恒星内部，但它们的存在只能通过推理来推断。）由于目前还没有实用和准确的理论来描述从最大到最小尺度的所有运动，因此只考虑大尺度运动是方便的。因为方程（2.7）包含非线性项v·gradv，这种隔离事实上永远不可能完全，一个空间尺度上的运动必然与其他空间尺度上的运动相互作用。这些相互作用通常通过在动量方程中包含比分子粘度大得多的各向异性涡粘性来建模。

这种摩擦力的函数形式类似于方程（2.9）。不幸的是，由于湍流不是流体的特征而是流体流动的特征，涡旋运动引起的动量交换只是表面上类似于分子动量交换。然而，尽管涡粘性的经验概念不能从第一性原理严格推导出来，但它在许多动力学问题中都被证明是有用和有效的，这些问题需要存在一些摩擦力。

在任何给定的点和时间，系统的物理变量可以用平均值（用上横线表示）和波动值（用撇号表示）来表示。为了使这种分解有意义，必须找到一个合适的平均周期，使平均值基本上独立于这个平均周期。这里我们假设这是可能的。因此，我们令

$$
\mathbf{v} = \overline{\mathbf{v}} + \mathbf{v}', \tag{2.52}
$$

并且我们为其他物理变量写出类似的表达式。根据定义，平均速度的分量由下式给出

$$
\overline{v_k} = \frac{\overline{\rho v_k}}{\overline{\rho}}, \tag{2.53}
$$

因此

$$
\overline{\rho v'_k} = 0. \tag{2.54}
$$

注意我们还有

$$
v'_k = -\frac{\rho' v'_k}{\overline{\rho}}, \tag{2.55}
$$

这只在不可压缩流体的情况下消失。方程（2.54）确保了平均上没有由于湍流引起的质量转移，并且方程（2.6）对平均流仍然有效。立即可得

$$
\frac{1}{\overline{\rho}} \frac{D\overline{\rho}}{Dt} + \text{div}\overline{\mathbf{v}} = 0. \tag{2.56}
$$

结合下面的方程（2.6）和（2.7），我们可以将动量方程重写为

$$
\frac{\partial}{\partial t}(\rho v_i) + \frac{\partial}{\partial x_k}(\rho v_i v_k) = \rho g_i - \frac{\partial p}{\partial x_i} + \frac{\partial t_{ik}}{\partial x_k}, \tag{2.57}
$$

其中粘性应力张量在方程（2.8）中定义。如果我们假设体力不受湍流影响，方程（2.57）的平均值为

$$
\frac{\partial}{\partial t}(\overline{\rho v_i}) + \frac{\partial}{\partial x_k}(\overline{\rho v_i v_k}) = \overline{\rho} g_i - \frac{\partial \overline{p}}{\partial x_i} + \frac{\partial}{\partial x_k}(\overline{t_{ik}} + \sigma_{ik}), \tag{2.58}
$$

因为平均和微分操作可以交换。张量$\overline{t}$是张量t的平均值。新张量σ的分量为

$$
\sigma_{ik} = -\overline{\rho v'_i v'_k}. \tag{2.59}
$$

这六个量定义了雷诺应力。方程(2.58)与方程(2.7)相同，所有量都用它们的平均值替代，除了额外的雷诺应力。这个对称张量表示由涡旋运动引起的动量通量。方程(2.58)中的div σ项因此在这些小尺度运动和平均流之间交换动量，尽管湍流速度脉动的平均动量$\overline{ρv'_i}$的三个分量为零。当涡旋运动占主导时，平均粘性应力$\overline{τ}$通常与雷诺应力σ相比可以忽略不计。

这种小尺度运动表示的中心问题在于方程(2.58)引入了六个未知量，即张量σ的六个分量。最简单的方法是类比分子粘度。遵循布西内斯克，我们应假设湍流运动以类似于大尺度流的方式作用，其方式模仿了当宏观速度梯度存在时组成粒子之间的微观动量传递。为了将这种方法应用于地球物理问题，我们将使用笛卡尔坐标。相关方程将在3.6节中进一步讨论旋转星的情况。

在地球大气和海洋中，大尺度运动的水平尺度远大于垂直尺度。这种大尺度流的各向异性强烈暗示在这两个方向上的湍流动量输运不能期望是相同的。如果选择坐标轴使得$x_3$轴在垂直方向，雷诺应力的一个特别简单的表达式是

$$
\begin{aligned}
σ_{11} = 2A_H \frac{\partial\overline{v_1}}{\partial x_1}, \quad σ_{22} = 2A_H \frac{\partial\overline{v_2}}{\partial x_2}, \quad σ_{33} = 2A_V \frac{\partial\overline{v_3}}{\partial x_3}, \tag{2.60}
\end{aligned}
$$

$$
σ_{12} = σ_{21} = A_H \left(\frac{\partial\overline{v_1}}{\partial x_2} + \frac{\partial\overline{v_2}}{\partial x_1}\right) \tag{2.61}
$$

$$
σ_{13} = σ_{31} = A_V \left(\frac{\partial\overline{v_1}}{\partial x_3} + \frac{\partial\overline{v_3}}{\partial x_1}\right) \tag{2.62}
$$

$$
σ_{23} = σ_{32} = A_V \left(\frac{\partial\overline{v_2}}{\partial x_3} + \frac{\partial\overline{v_3}}{\partial x_2}\right) \tag{2.63}
$$

其中$A_H$和$A_V$分别是水平和垂直涡粘性系数。忽略分子粘度并省略上划线，可以将方程(2.58)重写为

$$
\frac{Dv}{Dt} = g - \frac{1}{ρ} \text{grad } p + \frac{1}{ρ} \text{F(v)}, \tag{2.64}
$$

其中F是每单位体积的湍流粘性力，它是张量σ的矢量散度。忽略可压缩性效应，得到

$$
\text{F(v)} = A_H \left(\frac{\partial^2 v}{\partial x_1^2} + \frac{\partial^2 v}{\partial x_2^2}\right) + A_V \frac{\partial^2 v}{\partial x_3^2}, \tag{2.65}
$$

其中我们假设$A_H$和$A_V$是常量。这样就正确地考虑了垂直方向的偏好。（与方程[2.7]和[2.9]比较。）

由于涡旋粘度不能仅从第一原理计算得出，对地球大气和海洋中涡旋粘度值的粗略测量已经进行。典型的大气值$K_V(=A_V/\rho)$在$10^4-10^6$ cm$^2$ s$^{-1}$范围内，

而空气的$v \approx 10^{-1}$ cm$^2$ s$^{-1}$。因此可得

$$
\frac{K_V}{v} \approx 10^5-10^7, \tag{2.66}
$$

这是在大气中（Houghton 1986）。对于海洋，$K_V$的估计值范围从1 cm$^2$ s$^{-1}$到$10^2$ cm$^2$ s$^{-1}$。这意味着

$$
\frac{K_V}{v} \approx 10^2-10^4, \tag{2.67}
$$

在海洋中，因为水的$v = 10^{-2}$ cm$^2$ s$^{-1}$。较小的值对应于小尺度运动，反之亦然（Apel 1987）。值得注意的是，在地球的低层大气中，$A_H/A_V \lesssim 10^2$，而在观察到大尺度洋流的海洋表层，这个比率可能高达$10^5$。

## 2.5 应用于地球大气

由于大气本质上是球体上的薄流体层，在地球表面上任何点设置一个方便的坐标系是：x指向东，y指向北，z垂直向上（即沿有效重力$\mathbf{g}_e$方向，它结合了重力和离心力的效应）。如果$\mathbf{i}$，$\mathbf{j}$和$\mathbf{k}$是沿这些旋转轴的单位向量，平均流的相对速度可以表示为

$$
\mathbf{u} = u\mathbf{i} + v\mathbf{j} + w\mathbf{k}. \tag{2.68}
$$

令$\mathbf{g}_e = -g\mathbf{k}$，可以将动量方程的分量重写为：

$$
\frac{Du}{Dt} - \frac{uv}{R} \tan \varphi + \frac{uw}{R} = -\frac{1}{\rho} \frac{\partial p}{\partial x} + 2\Omega v \sin \varphi - 2\Omega w \cos \varphi + \frac{1}{\rho} F_x, \tag{2.69}
$$

$$
\frac{Dv}{Dt} + \frac{u^2}{R} \tan \varphi + \frac{vw}{R} = -\frac{1}{\rho} \frac{\partial p}{\partial y} - 2\Omega u \sin \varphi + \frac{1}{\rho} F_y, \tag{2.70}
$$

$$
\frac{Dw}{Dt} - \frac{u^2 + v^2}{R} = -\frac{1}{\rho} \frac{\partial p}{\partial z} - g + 2\Omega u \cos \varphi + \frac{1}{\rho} F_z, \tag{2.71}
$$

其中$R$是地球半径，$\Omega$是其自转角速度，$\varphi$是地理纬度。根据方程(2.65)，湍流粘性力由以下给出：

$$
\mathbf{F}(\mathbf{u}) = A_H \left(\frac{\partial^2 \mathbf{u}}{\partial x^2} + \frac{\partial^2 \mathbf{u}}{\partial y^2}\right) + A_V \frac{\partial^2 \mathbf{u}}{\partial z^2}. \tag{2.72}
$$

如果进一步假设流体不可压缩，方程(2.6)变为

$$
\frac{\partial u}{\partial x} + \frac{\partial v}{\partial y} + \frac{\partial w}{\partial z} = 0, \tag{2.73}
$$

这就完成了方程组。

在本节中，我们将关注中纬度天气尺度运动，即在水平方向上通常为$10^3$ km，垂直方向上为10 km的系统。对于这个尺度，垂直速度（通常小于1 cm s$^{-1}$）远小于水平速度（通常为$10^3$ cm s$^{-1}$）。因此，作为第一近似，涉及$w$的项在方程(2.69)-(2.71)中可以忽略。同样，由于曲率项也比其他项小得多，它们也可以被忽略。由此得到的近似水平动量方程为

$$
\frac{Du}{Dt} - fv = -\frac{1}{\rho} \frac{\partial p}{\partial x} + \frac{1}{\rho} F_x  \tag{2.74}
$$

和

$$
\frac{Dv}{Dt} + fu = -\frac{1}{\rho} \frac{\partial p}{\partial y} + \frac{1}{\rho} F_y,  \tag{2.75}
$$

其中

$$
f = 2\Omega \sin \varphi  \tag{2.76}
$$

是科里奥利参数。在这个近似阶段，方程(2.71)变为

$$
\frac{\partial p}{\partial z} = -\rho g,  \tag{2.77}
$$

这就是静力平衡近似。

科里奥利参数$f$是地球涡度向量在当地的法向分量。如果南北粒子运动在纬度上足够广泛，这个参数的值也会发生变化。对于围绕平均纬度$\varphi_0$（其中$f = f_0$）的小变化，可以写为

$$
f = f_0 + \frac{df}{dy} y + \cdots = f_0 + \beta y + \cdots.  \tag{2.78}
$$

在中纬度，$\varphi = 45°$（假设），有$f_0 = 10^{-4}$ s$^{-1}$和$\beta = 1.619 \times 10^{-13}$ cm$^{-1}$ s$^{-1}$。
将$f$视为常数的切平面近似被称为$f$平面；如果我们假设$f$和$y$之间是线性关系，则称为$\beta$平面近似。