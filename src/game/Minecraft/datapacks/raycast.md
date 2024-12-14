# 视线检测计算问题

不知道有没有人发啊，不过总之我发一个吧

适用于MCF数据包或mod编写（大概）

写到哪发到哪

## 涵盖范围

射线与长方体的相交判定，可能需要返回相交点，其长方体可能与xyz轴平行，也可能不是

- 经典问题
    - 长方体与xyz轴平行
    - 判定是否相交
    - 变体
        - 长方体与xyz轴不平行
        - 需要求出交点
- 列举问题
    - 用于方块检测
    - 长方体与xyz轴平行
    - 列举或者迭代出经过的方块坐标

## 经典问题

- 长方体与xyz轴平行
- 判定是否相交

### 输入

- 射线起点 `x0 y0 z0`
- 射线长度 `max_len`
- 射线方向 `dx dy dz`（单位向量）
- 长方体 `x1 y1 z1 x2 y2 z2`
    - 表示长方体对应的边界，满足
    - `x1 < x < x2`
    - `y1 < y < y2`
    - `z1 < z < z2`

### 输出

- 是否相交 `hit`

### 思路

首先对原始问题进行处理，设起始点为 `pos` ，方向向量为 `vec`，那么问题转换为

是否存在浮点数 `λ` 使得点 `pos + λ*vec` 在长方体范围内，即

- `x1 < x0 + λ*dx < x2`
- `y1 < y0 + λ*dy < y2`
- `z1 < z0 + λ*dz < z2`

整理不等式组，得到

- `(x1-x0)/dx < λ < (x2-x0)/dx`
- `(y1-y0)/dy < λ < (y2-y0)/dy`
- `(z1-z0)/dz < λ < (z2-z0)/dz`

求出六个值，判断这个范围是否存在即可

长度则是

- `λ < max_len`
- `0 < λ`

额外情况：

- 初始点就在长方体内，直接返回 `true`
- 初始点不在长方体内，且方向向量为 `0`，直接返回 `false`

总结为：

- 对于方向分量为 `0` 的所有轴，比较是否在范围内，不在则返回 `false`
- 如果全部都在则返回 `true`
- 否则，对于剩下的轴列出不等式组进行判断

### 代码示例

```py
def raycast(pos: list[float], vec: list[float], max_len: float, box_min:list[float], box_max:list[float]) -> bool:
    ran = []
    for i in range(3):
        if vec[i]==0:
            if not box_min[i] < pos[i] < box_max[i]:
                return False
        else:
            ran.append(i)

    if not ran:
        return True

    bottom = max((box_min[i]-pos[i])/vec[i] for i in ran)
    top = min((box_max[i]-pos[i])/vec[i] for i in ran)
    return bottom <= top and bottom < max_len and 0 < top
```

### mcf实现

```mcfunction
#func load
scoreboard objectives add e-4 dummy
scoreboard objectives add int dummy

scoreboard players set -1 int -1
scoreboard players set 10 int 10
scoreboard players set 10000 int 10000
scoreboard players set max int 2147483647

forceload add 0 0
execute unless entity @e[type=marker,tag=marker] run summon marker 0.0 0.0 0.0 {Tags:["marker"]}

scoreboard players set max_len int 50
```


```mcfunction
#func for_raycast_blocks
# input 执行位置, max_len int
# call foo


function get_direction
#mcf get_direction
    tp @e[type=marker,tag=marker,limit=1] ~ ~ ~ ~ ~

    execute store result score x0 e-4 run data get entity @e[type=marker,tag=marker,limit=1] Pos[0] 10000
    execute store result score y0 e-4 run data get entity @e[type=marker,tag=marker,limit=1] Pos[1] 10000
    execute store result score z0 e-4 run data get entity @e[type=marker,tag=marker,limit=1] Pos[2] 10000

    tp @e[type=marker,tag=marker,limit=1] ^ ^ ^1

    execute store result score dx e-4 run data get entity @e[type=marker,tag=marker,limit=1] Pos[0] 10000
    execute store result score dy e-4 run data get entity @e[type=marker,tag=marker,limit=1] Pos[1] 10000
    execute store result score dz e-4 run data get entity @e[type=marker,tag=marker,limit=1] Pos[2] 10000

    scoreboard players operation dx e-4 -= x0 e-4
    scoreboard players operation dy e-4 -= y0 e-4
    scoreboard players operation dz e-4 -= z0 e-4


# input [x0, y0, z0, dx, dy, dz] e-4, max_len int

execute if score dx e-4 matches 0 if score dy e-4 matches 0 if score dz e-4 matches 0 run return fail
```

## 列举问题

- 用于方块检测
- 长方体与xyz轴平行
- 列举或者迭代出经过的方块坐标

### 输入

- 射线起点 `x0 y0 z0`
- 射线长度 `max_len`
- 射线方向 `dx dy dz`（单位向量）

### 输出

- 迭代，每次输出一个坐标 `x y z`

### 思路

每次判断射线最先到哪个方向的边界，这个方向+1格，迭代

每次需要比较三个方向，判断哪个最小，为此需要统一度量

每边的距离是

- `(rx + k1)/dx`
- `(ry + k2)/dy`
- `(rz + k3)/dz`

`dx, dy, dz` 需要取绝对值

`rx, ry, rz` 是射线起点到对应边界的初始距离，`k1, k2, k3` 是迭代的变量，用于记录每个方向增加了几个方块，初始为 `0`

### 代码示例

```py
import math
from typing import Callable
def sign(x):
    return -1 if x < 0 else 1


# 信任参数是正确的，默认vec是单位向量
def raycast(pos: list[float], vec: list[float], max_len: float, func: Callable[[list[float]], None]) -> None:
    if all(d == 0 for d in vec):
        return

    max_dist = max_len

    # 每个轴方向上的距离
    distances = [pos[i] % 1 if vec[i] < 0
            else 1 - pos[i] % 1
            for i in range(3)]

    # 生成每个轴方向的放缩距离
    dists = []
    for i in range(3):
        if vec[i] == 0:
            dists.append(float('inf'))
        else:
            dists.append(distances[i] / abs(vec[i]))

    dist = 0
    while dist < max_dist:
        func(pos)
        dist = min(dists)
        i = dists.index(dist)
        distances[i] += 1 # 距离+1格
        dists[i] = distances[i] / abs(vec[i]) # 这保证了精度不会因为累加而丢失
        # 增加对应距离并调用函数
        pos[i] += sign(vec[i])
```

### mcf实现

```mcfunction
#func load
scoreboard objectives add e-4 dummy
scoreboard objectives add int dummy

scoreboard players set -1 int -1
scoreboard players set 10 int 10
scoreboard players set 10000 int 10000
scoreboard players set max int 2147483647

forceload add 0 0
execute unless entity @e[type=marker,tag=marker] run summon marker 0.0 0.0 0.0 {Tags:["marker"]}

scoreboard players set max_len int 50

```


```mcfunction
#func for_raycast_blocks
# input 执行位置, max_len int
# call foo


function get_direction
#mcf get_direction
    tp @e[type=marker,tag=marker,limit=1] ~ ~ ~ ~ ~

    execute store result score x0 e-4 run data get entity @e[type=marker,tag=marker,limit=1] Pos[0] 10000
    execute store result score y0 e-4 run data get entity @e[type=marker,tag=marker,limit=1] Pos[1] 10000
    execute store result score z0 e-4 run data get entity @e[type=marker,tag=marker,limit=1] Pos[2] 10000

    tp @e[type=marker,tag=marker,limit=1] ^ ^ ^1

    execute store result score dx e-4 run data get entity @e[type=marker,tag=marker,limit=1] Pos[0] 10000
    execute store result score dy e-4 run data get entity @e[type=marker,tag=marker,limit=1] Pos[1] 10000
    execute store result score dz e-4 run data get entity @e[type=marker,tag=marker,limit=1] Pos[2] 10000

    scoreboard players operation dx e-4 -= x0 e-4
    scoreboard players operation dy e-4 -= y0 e-4
    scoreboard players operation dz e-4 -= z0 e-4


# input [x0, y0, z0, dx, dy, dz] e-4, max_len int

execute if score dx e-4 matches 0 if score dy e-4 matches 0 if score dz e-4 matches 0 run return fail

# 要求(dx,dy,dz)为单位向量以简化运算
# vec_len = 1, 跳过计算

# max_dist = max_len
scoreboard players operation max_dist e-4 = max_len int
scoreboard players operation max_dist e-4 *= 10000 int

# 计算向量分量方向上离边界的距离 distances[i]
scoreboard players operation rx e-4 = x0 e-4
scoreboard players operation ry e-4 = y0 e-4
scoreboard players operation rz e-4 = z0 e-4
scoreboard players operation rx e-4 %= 10000 int
scoreboard players operation ry e-4 %= 10000 int
scoreboard players operation rz e-4 %= 10000 int
execute if score dx e-4 matches 1.. run scoreboard players operation rx e-4 *= -1 int
execute if score dy e-4 matches 1.. run scoreboard players operation ry e-4 *= -1 int
execute if score dz e-4 matches 1.. run scoreboard players operation rz e-4 *= -1 int
execute if score dx e-4 matches 1.. run scoreboard players operation rx e-4 += 10000 int
execute if score dy e-4 matches 1.. run scoreboard players operation ry e-4 += 10000 int
execute if score dz e-4 matches 1.. run scoreboard players operation rz e-4 += 10000 int

# 获取vec绝对值
scoreboard players operation abs_dx e-4 = dx e-4
scoreboard players operation abs_dy e-4 = dy e-4
scoreboard players operation abs_dz e-4 = dz e-4
execute if score abs_dx e-4 matches ..-1 run scoreboard players operation abs_dx e-4 *= -1 int
execute if score abs_dy e-4 matches ..-1 run scoreboard players operation abs_dy e-4 *= -1 int
execute if score abs_dz e-4 matches ..-1 run scoreboard players operation abs_dz e-4 *= -1 int

# 生成每个轴方向的放缩距离 distances[i] / abs(vec[i])
execute if score dx e-4 matches 0 run scoreboard players operation dist_x e-4 = max int
execute if score dy e-4 matches 0 run scoreboard players operation dist_y e-4 = max int
execute if score dz e-4 matches 0 run scoreboard players operation dist_z e-4 = max int
execute unless score dx e-4 matches 0 run scoreboard players operation dist_x e-4 = rx e-4
execute unless score dy e-4 matches 0 run scoreboard players operation dist_y e-4 = ry e-4
execute unless score dz e-4 matches 0 run scoreboard players operation dist_z e-4 = rz e-4
execute unless score dx e-4 matches 0 run scoreboard players operation dist_x e-4 *= 10000 int
execute unless score dy e-4 matches 0 run scoreboard players operation dist_y e-4 *= 10000 int
execute unless score dz e-4 matches 0 run scoreboard players operation dist_z e-4 *= 10000 int
execute unless score dx e-4 matches 0 run scoreboard players operation dist_x e-4 /= abs_dx e-4
execute unless score dy e-4 matches 0 run scoreboard players operation dist_y e-4 /= abs_dy e-4
execute unless score dz e-4 matches 0 run scoreboard players operation dist_z e-4 /= abs_dz e-4

# 已经在对应位置
tp @e[type=marker,tag=marker,limit=1] ~ ~ ~

scoreboard players set dist e-4 0
execute if score dist e-4 < max_dist e-4 at @e[type=marker,tag=marker,limit=1] run function for_raycast_blocks/loop

execute in overworld run tp @e[type=marker,tag=marker,limit=1] 0.0 0.0 0.0

```

```mcfunction
#func for_raycast_blocks/loop
function foo
# particle end_rod ~ ~ ~ 0.0 0.0 0.0 0.01 1

scoreboard players set #end_if int 0

#for e in [x, y, z]
    execute if score #end_if int matches 0 if score dist_<e> e-4 <= dist_y e-4 if score dist_<e> e-4 <= dist_z e-4 run function for_raycast_blocks/<e>_min
    #mcf for_raycast_blocks/<e>_min
        # dist = min(dists)
        scoreboard players operation dist e-4 = dist_<e> e-4
        # distances[i] += 1
        scoreboard players operation r<e> e-4 += 10000 int
        # dists[i] = distances[i] / abs(vec[i])
        # 简便大数除法 a*10000//b
        # a0 = a//b*10000
        # a1 = a%b*10000//b
        # 计算 a0+a1

        scoreboard players operation #a0 int = r<e> e-4
        scoreboard players operation #a0 int /= abs_d<e> e-4
        scoreboard players operation #a0 int *= 10000 int

        scoreboard players operation #a1 int = r<e> e-4
        scoreboard players operation #a1 int %= abs_d<e> e-4
        scoreboard players operation #a1 int *= 10000 int
        scoreboard players operation #a1 int /= abs_d<e> e-4

        scoreboard players operation dist_<e> e-4 = #a0 int
        scoreboard players operation dist_<e> e-4 += #a1 int

        execute if score d<e> e-4 matches 1.. run tp @e[type=marker,tag=marker,limit=1] ~1 ~ ~
        execute if score d<e> e-4 matches ..-1 run tp @e[type=marker,tag=marker,limit=1] ~-1 ~ ~

        scoreboard players set #end_if int 1



execute if score dist e-4 < max_dist e-4 at @e[type=marker,tag=marker,limit=1] run function for_raycast_blocks/loop

```

### mcf测试

```mcfunction
#func tick
execute as @e[tag=raycast] at @s run function minecraft:raycast
```

```mcfunction
#func raycast

execute at @s anchored eyes positioned ^ ^ ^ run function default_raycast

execute at @s anchored eyes positioned ^ ^ ^ run function for_raycast_blocks
```

```mcfunction
#func default_raycast
scoreboard players operation #len int = max_len int
scoreboard players operation #len int *= 10 int

execute if score #len int matches 1.. run function default_raycast/loop
#mcf default_raycast/loop
    particle end_rod ~ ~ ~ 0.0 0.0 0.0 0 1 force
    scoreboard players remove #len int 1

    execute if score #len int matches 1.. positioned ^ ^ ^.1 run function default_raycast/loop
```

```mcfunction
#func foo
execute align xyz run function show_block
```

```mcfunction
#func show_block
scoreboard players set #x int 0
execute if score #x int matches ..4 run function show_block/x
scoreboard players set #y int 0
execute if score #y int matches ..4 positioned ~ ~.25 ~ run function show_block/y
scoreboard players set #z int 0
execute if score #z int matches ..4 positioned ~ ~ ~.25 run function show_block/z
```

```mcfunction
#func show_block/x
particle bubble ~ ~ ~ 0.0 0.0 0.0 0 1 force
particle bubble ~ ~1 ~ 0.0 0.0 0.0 0 1 force
particle bubble ~ ~ ~1 0.0 0.0 0.0 0 1 force
particle bubble ~ ~1 ~1 0.0 0.0 0.0 0 1 force

scoreboard players add #x int 1
execute if score #x int matches ..4 positioned ~.25 ~ ~ run function show_block/x
```

```mcfunction
#func show_block/y
particle bubble ~ ~ ~ 0.0 0.0 0.0 0 1 force
particle bubble ~1 ~ ~ 0.0 0.0 0.0 0 1 force
particle bubble ~ ~ ~1 0.0 0.0 0.0 0 1 force
particle bubble ~1 ~ ~1 0.0 0.0 0.0 0 1 force

scoreboard players add #y int 1
execute if score #y int matches ..3 positioned ~ ~.25 ~ run function show_block/y
```

```mcfunction
#func show_block/zparticle bubble ~ ~ ~ 0.0 0.0 0.0 0 1 force
particle bubble ~1 ~ ~ 0.0 0.0 0.0 0 1 force
particle bubble ~ ~1 ~ 0.0 0.0 0.0 0 1 force
particle bubble ~1 ~1 ~ 0.0 0.0 0.0 0 1 force

scoreboard players add #z int 1
execute if score #z int matches ..3 positioned ~ ~ ~.25 run function show_block/z
```

