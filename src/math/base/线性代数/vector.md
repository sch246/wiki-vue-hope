# 向量

向量是相对于基来说的

如果我们确定一个基和一组数，那么就能确定一个向量

$$\vec{i},\vec{j},\vec{k}$$

$$\vec{a}=\left(\begin{array}{l}1\\2\\3\end{array}\right)=\vec{i}+2\vec{j}+3\vec{k}$$

如果$\vec{a}$的基是$\vec{u}$和$\vec{v}$

$$\vec{u}=\left(\begin{array}{l}1\\2\\3\end{array}\right),\vec{v}=\left(\begin{array}{l}4\\3\\2\end{array}\right)$$

那$\vec{a}$应该这样表示

$$\vec{a}=\vec{u}+2\vec{v}=(\vec{u}\space\vec{v})\left(\begin{array}{l}1\\2\end{array}\right)$$

## 点乘

$$\vec{a}=\left(\begin{array}{l}a_1\\a_2\\a_3\end{array}\right),\vec{b}=\left(\begin{array}{l}b_1\\b_2\\b_3\end{array}\right)$$

$$\vec{a}·\vec{b}=\vec{a}^T\vec{b}$$

如果$\vec{a}$和$\vec{b}$是在$\vec{u}$和$\vec{v}$下的

$$\vec{a}_{uv}=\left(\begin{array}{l}a_1\\a_2\end{array}\right),\vec{b}_{uv}=\left(\begin{array}{l}b_1\\b_2\end{array}\right)$$

$$\vec{a}=(\vec{u}\space\vec{v})\left(\begin{array}{l}a_1\\a_2\end{array}\right),\vec{b}=(\vec{u}\space\vec{v})\left(\begin{array}{l}b_1\\b_2\end{array}\right)$$

$$\vec{a}·\vec{b}=((\vec{u}\space\vec{v})\vec{a}_{uv})^T((\vec{u}\space\vec{v})\vec{b}_{uv})=\vec{a}_{uv}^T\left(\begin{array}{l}\vec{u}^T\\\vec{v}^T\end{array}\right)(\vec{u}\space\vec{v})\vec{b}_{uv}$$
$$=\vec{a}_{uv}^T\left(\begin{array}{ll}\vec{u}\vec{u} & \vec{u}^T\vec{v}\\\vec{u}^T\vec{v} & \vec{v}\vec{v}\end{array}\right)\vec{b}_{uv}$$
