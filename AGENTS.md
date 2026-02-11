# OpenSPG Schema 编辑器项目

## 项目概述

这是一个赛博朋克风格的 OpenSPG Schema 可视化编辑器，使用 React + ReactFlow 构建。

## 使用的 Skill

### frontend-design

**位置**: `.agents/skills/frontend-design/`

在进行任何前端界面相关的开发时，必须参考并使用此 skill 的设计原则：

- **Typography**: 使用 Orbitron (标题) + Rajdhani (正文)，避免通用字体
- **Color & Theme**: 霓虹青 (#00f0ff) + 紫 (#b829dd) 渐变配色
- **Motion**: CSS 动画优先，高影响力入场动画
- **Spatial Composition**: 3D 透视、非对称、玻璃拟态
- **Backgrounds**: 噪点纹理、扫描线、渐变网格

**禁止**: 通用 AI 美学（紫色渐变白背景、Inter 字体等）

## 技术栈

- React 19
- ReactFlow 11
- Tailwind CSS 4
- Framer Motion
- Lucide React

## 项目结构

```
src/
├── components/
│   ├── CustomNode.jsx      # 六边形节点组件
│   ├── EnergyEdge.jsx      # 能量流动连接线
│   └── MiniMapPanel.jsx    # 迷你地图
├── App.jsx                  # 主应用
├── index.css               # 全局样式
└── main.jsx                # 入口
```

## 开发规范

1. 所有文字使用白色，确保深色背景对比度
2. 保持赛博朋克视觉风格一致性
3. 节点使用六边形设计，带发光效果
4. 连接线使用能量流动画
