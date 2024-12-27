---
title: 'Townscaper 的一些技术阅读笔记'
excerpt: ''
date: '2023-06-07'
author:
  name: roamzhen
  picture: '/assets/blog/authors/roam.jpeg'
---

### 不同类型网格选用的优劣

常见方形网格与六边形网格

![a](/assets/blog/images/230607/230607a.png)

为了保证格子渲染的完整性，可以选择以相对网格小一点的大小渲染 Tile 模型，渲染于网格内部。
但是这种情况下，为了进行不同区块的拼接，需要创建额外类型的模型面片进行渲染。

![b](/assets/blog/images/230607/230607b.png)

这里可以尝试用网格交点作为定位点。
此时方形网格只需要 6种 Tile 模型构建完整的案例。六边形网格只需要 4种 Tile 模型即可构建完整的案例。

![d](/assets/blog/images/230607/230607c.png)



![d](/assets/blog/images/230607/230607d.png)

![e](/assets/blog/images/230607/230607e.png)
