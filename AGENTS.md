# Repository Guidelines

> 本文件由 Deep Code 自动加载为「项目指令」，每轮对话都会注入。
> 因此只放**稳定的规则**，不要放会频繁变化的内容。

## 项目概况

纯前端「文档库 + 简历站」。Vue 3 + Vite + marked，**无后端**，构建为静态站点部署。

## 目录与文件约定

| 路径 | 用途 |
| --- | --- |
| `public/files/` | **所有文档统一放这里**，一级子目录名自动作为「分类」；直接放根目录则归为「未分类」 |
| `public/files/AI/paper/` | 论文原文（PDF） |
| `public/files/AI/notes/` | 阅读笔记、精读总结（Markdown） |
| `public/files/AI/project/` | 项目相关规格文档 |
| `public/files/简历/` | 简历 PDF |
| `docs.meta.json`（可选） | 补充文档标题与描述，格式 `{ "分类/文件名.pdf": { "title": "...", "desc": "..." } }` |
| `src/`、`index.html`、`vite.config.js` | 站点源码 |

## 生成物 —— 不要手改，不要提交

- `public/docs.json`：由 `npm run gen:docs` 扫描 `public/files/` 自动生成（已在 `.gitignore`）
- `docs/`：`npm run build` 的产物（已在 `.gitignore`）

## 常用命令

```bash
npm run dev        # 本地开发（先 gen:docs 再 vite）
npm run build      # 生成文档清单并构建静态站点
npm run preview    # 预览构建产物
npm run deploy     # 构建并部署
npm run gen:docs   # 仅重新扫描生成 public/docs.json
```

## 代码风格与约定

- 提交信息**用中文**，一句话说明改了什么（参考现有 git log 风格）
- 环境为 **Windows + Git Bash**，路径使用 POSIX 风格并注意引号
- 保持零后端依赖，新增依赖前先确认是否必要

## 版本管理注意

- `*.pdf` 默认被忽略，但 `public/files/**/*.pdf` 例外，**必须提交**
- `node_modules/`、`dist/`、`.vite/`、`*.local` 不提交

---

## 论文阅读约定

<!-- TODO: 待填写 -->

- 默认用中文讲解；专业术语保留英文原词并附中文译名
- 讲解顺序：句子主干 → 逐词/短语拆解 → 放回论文上下文说明作用
- 引用论文时标注到「章节 / Figure / Table」级别

## 代码编写要求

<!-- TODO: 待填写 -->
