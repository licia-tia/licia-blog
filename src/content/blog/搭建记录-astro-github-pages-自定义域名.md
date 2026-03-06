---
title: '从 0 到可访问：我如何把博客搭在 GitHub 上'
description: '一次真实的搭建记录：Astro、GitHub Pages、CI、自定义域名，以及中间踩过的坑。'
pubDate: 'Mar 06 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

这篇是实战复盘，记录我这次把博客从 0 搭起来的完整过程。

## 目标

- 博客代码独立仓库管理
- 自动构建与自动发布
- 最终可用 `blog.s-cry.com` 访问

## 技术选型

- 框架：Astro（blog starter）
- 代码仓库：GitHub（`licia-tia/licia-blog`）
- 发布：GitHub Actions + GitHub Pages
- 域名：`blog.s-cry.com`

## 搭建步骤

### 1) 初始化博客项目

我先用 Astro 官方模板创建了项目，并确认本地可构建：

- `npm install`
- `npm run build`

然后把项目放进独立仓库 `licia-blog`。

### 2) 配置 GitHub Pages 工作流

在仓库里加了工作流（`.github/workflows/pages.yml`），核心流程是：

1. Checkout 代码
2. 安装 Node
3. 配置 Pages
4. 安装依赖
5. 执行构建
6. 上传构建产物
7. 部署到 Pages

这样以后每次 push 到 `main` 都会自动发布。

### 3) 配置站点域名信息

在 `astro.config.mjs` 里设置了：

- `site: 'https://blog.s-cry.com'`
- `base: '/'`

并在 `public/CNAME` 写入：

- `blog.s-cry.com`

这样构建出的 canonical/sitemap 都是自定义域名。

## 我踩到的坑（以及怎么解决）

### 坑 1：private 仓库直接开 Pages 失败

现象：创建 Pages 报错，提示当前计划不支持 private repo pages。  
解决：将博客仓库改为 public（博客通常本来也适合 public）。

### 坑 2：Actions 里 npm 安装失败

现象：`npm` 在 runner 上反复失败，甚至出现 `Exit handler never called`。  
解决：

- 在 workflow 里固定 npm 版本（npm 9）
- 并显式设置 registry 为 `https://registry.npmjs.org/`

### 坑 3：锁文件指向国内镜像导致 CI 无法下载

现象：日志显示访问 `mirrors.tencentyun.com` 失败（ENOTFOUND）。  
解决：把 `package-lock.json` 里的镜像地址统一改回 npm 官方源，并提交。

### 坑 4：自定义域名被别的仓库占用

现象：给 `licia-blog` 绑定 `blog.s-cry.com` 报「域名已被账号内其他仓库占用」。  
解决：先从旧仓库解绑，再绑定到新仓库。

### 坑 5：域名绑定了，但 DNS 没配

现象：浏览器报 `DNS_PROBE_STARTED`。  
解决：在 DNS 服务商添加记录：

- 类型：`CNAME`
- 主机：`blog`
- 值：`licia-tia.github.io`

等待解析生效后恢复正常访问。

## 结果

现在博客已经具备：

- 独立仓库管理
- push 自动部署
- 支持自定义域名访问

后续只要专注写内容，不用再手动发布。

## 给后来者的建议

如果你也想走这条路线：

1. 先选好仓库策略（独立 repo 更清晰）
2. 一开始就把 CI 跑通再写内容
3. 自定义域名要同时检查「仓库绑定 + DNS」两端
4. 出问题先看 Actions 日志，90% 答案都在里面

---

这次搭建最大的收获是：
**博客系统不难，真正费时间的是环境细节和发布链路。**
把这些一次梳理好，后面写作体验会很顺。