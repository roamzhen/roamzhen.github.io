---
title: 'resume-cn'
excerpt: ''
date: '2024-12-04'
author:
  name: roamzhen
  picture: '/assets/blog/authors/roam.jpeg'
hide: true
---

# 居然被找到了，嘻嘻，欢迎联系我

工作经历

**高级前端开发工程师 (T10),**  腾讯 – 微信小程序	 广州,  Feb 2019 – Present

* **交易订单页提取交易商品：**开发基于小程序页面运行时分析提取基础信息,  并通过 langchain封装的, 对接内部不同LLM的, 带幻觉检查过滤能力的推理能力, 校验信息并对复杂情况进行二次提取,  然后缓存结果路径优化请求成本的 具体商品信息获取功能.

* **小程序智能广告:**  零代码接入 动态调整广告插入位置与适配原小程序样式的 微信广告组件能力  
* 开发基于 openCV 自建算法流程分析小程序截图, 识别 ROI 并提取样式的广告智能样式适配能力. 简单情况, 使用边缘直方图, 分块分析得到强弱边缘; 复杂情况使用类距离场进行边缘距离变换, 拆分为多分区, 结合定制方向算子处理, 得到特征明显的边缘.  
* 开发基于 小程序运行时逻辑 分析得到的多个推荐位置, 清洗提取合理信息,  结合大模型使用多角色打分(结构,体验,体验,转化)策略 得到推荐位置 的 广告智能位置推荐能力.

* **小程序AR能力与 xr-frame:**  基于 wxml 使用 Typescript 结合客户端逻辑(C++)与AR算法 实现的 XR/3D 框架  
* 开发  xr-frame 中的 渲染部分, 实现 PBR(BRDF), 完整地支持 glTF 2.0 规范及大部分扩展, 并针对不同设备平台对应渲染逻辑实现 OpenGL(mobile) Metal(visionPro) WebGPU(MetaQuest).  
* 开发维护小程序AR能力(3dof, 6dof, Marker, 各类躯体) 并开发小程序AR案例与xr-frame案例集, 对接各类服务商与大小用户需求. 

* **微信小游戏引擎 :**  基于 Typescript 通过共享内存 结合 客户端逻辑(C++)  的微信小游戏官方引擎  
* 主开发引擎的二维系统, 实现相互独立的通用渲染能力(图片, 文本, 图形), 排版能力(节点, 图文), 交互能力(触摸, 文本输入),  兼容大部分第三方引擎的二维能力(NGUI, UGUI, FairyGUI) 并提供对应第三方引擎资产导入的工具插件.	  
* 利用 共享内存节点池回收 降低CPU耗时与GC jank, 通过拆分节点子树动静分离, 细分渲染脏位与脏队列合并, 渲染 CommandBuffer 动态合批等手段实现逻辑剪枝缓存与渲染缓冲, 使性能达到上线标准.  对比CocosCreator 2000个精灵移动切图 快 4 倍.  
* 完整支持多款 Unity 大型游戏 (e.g., 天龙八部荣誉版, 新轩辕传奇, 传说对决), 休闲游戏 (e.g., 神庙逃亡, EA饥饿鲨) 的 对接 与 具体二维资产迁移接入，成功上线运营,  该年被评为 优秀员工.

**高级前端开发工程师 (P6),**  阿里巴巴 – 淘宝	杭州,  Oct 2017 – Feb 2019

* 开发基于 Rax(React Weex DSL) 的 淘宝有好货功能页面 与双十一活动页面, 并进行  Weex (类似React Native) 的 动画优化 与 GCanvas 改造 (动态合批)。  
* **imgcook代码智能生成平台:**  开发基于 OpenCV 与 OCR 通过 自建算法 将图片转化为代码的能力, 以及 通过 Sketch 的结构化信息 将设计稿 转化为代码 的 Sketch 插件.

**UI工程师,**  腾讯 – ISUX 手机QQ	深圳,  June 2016 – Oct 2017

* 开发 会员相关功能页面 与 基于 webGL(Pixi.js) 活动页面, 协同设计团队制定设计规范, 构建业务组件库 FrozenUI, 推动 APNG 落地到业务, 并参与 APNG 制作工具 iSparta 的开发, 贡献 APNG 压缩算法.

技能  
**Languages:** Typescript(日常使用), Python(日常使用), Rust (for wasm), Dart(for Flutter), C\#(for Unity)   
**Technologies:** Unity(对接游戏,开发插件,独立游戏), webGL/WebGPU/OpenGL/Metal(实现PBR), GaussianSplating(实现WebGL2渲染), 计算机视觉/OpenCV(工作使用), React(独立开发),  Web Develop(原理),  StableDiffusion(生成图片转SVG), Flutter(解析SVG并填色软件)  
**Design:** Blender(独立完成粗模建模, 模型修改, 骨骼绑定蒙皮), Sketch(开发插件), Figma

教育背景  
**华南农业大学** – 本科 软件工程	 Oct 2016