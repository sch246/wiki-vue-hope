爱因斯坦求和约定（Einstein Summation Convention）是由阿尔伯特·爱因斯坦引入的一种数学记号简化方法，主要用于张量分析和相对论中。

## 爱因斯坦求和约定的定义

爱因斯坦求和约定规定：当一个表达式中的某个指标（索引）在一个项中重复出现两次时，一次作为上标，一次作为下标，则表示对该指标从1到n（通常是空间维数）进行求和。

### 基本规则：

1. **重复指标自动求和**：在一个单项式中，如果一个指标出现两次（一次作为上标，一次作为下标），则表示对该指标进行求和。

2. **求和范围**：通常求和的范围是从1到n，其中n是所考虑的空间维数（例如，在三维欧几里得空间中，n=3）。

3. **每个指标最多重复两次**：在一个单项式中，一个指标最多只能出现两次。

### 数学表示：

例如，对于向量 $\mathbf{v}$ 和 $\mathbf{w}$ 的点积：

标准记法：$\mathbf{v} \cdot \mathbf{w} = \sum_{i=1}^n v_i w_i$

爱因斯坦约定：$v_i w^i$

这里 $i$ 是重复指标，意味着对 $i$ 从 $1$ 到 $n$ 求和。

## 上标与下标的区别

- [上标与下标的区别](/math/base/updown)
