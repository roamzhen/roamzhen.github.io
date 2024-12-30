---
title: 'Technical Notes on Townscaper'
excerpt: ''
date: '2023-06-07'
author:
  name: roamzhen
  picture: '/assets/blog/authors/roam.jpeg'
---

### Pros and Cons of Different Grid Types

Common square grids and hexagonal grids

![a](/assets/blog/images/230607/230607a.png)

To ensure the integrity of grid rendering, we can choose to render the Tile model at a slightly smaller size relative to the grid, rendering it inside the grid.
However, in this case, to connect different blocks, additional types of model faces need to be created for rendering.

![b](/assets/blog/images/230607/230607b.png)

Here we can try using grid intersection points as positioning points.
In this case, square grids only need 6 types of Tile models to build a complete case. Hexagonal grids only need 4 types of Tile models to build a complete case.

![d](/assets/blog/images/230607/230607c.png)



![d](/assets/blog/images/230607/230607d.png)

![e](/assets/blog/images/230607/230607e.png)
