# 中国特色城市 · 城市印象志

一个使用 Vue 3 + Vite 构建的纯静态网站，用于展示中国特色城市的风貌：每座城市的特色、饮食、文化、历史与当地习惯。

## 技术栈

- Vue 3（组合式 API）
- Vue Router（history 路由，构建时预渲染为静态页面）
- Vite 6
- GSAP（ScrollTrigger / Flip）与 Lenis 驱动的滚动动效
- 构建时 SSR 预渲染（`vue/server-renderer`），输出每页独立 HTML
- 无 UI 框架，手写中式风格样式

## 内容来源

站点数据全部来自 `docs/` 目录下的 JSON 文件，每个省级行政区一个文件，构建时自动解析，无需改动代码即可增删内容。

文件格式约定：

```json
{
  "id": "江苏",
  "name": "江苏",
  "intro": "江苏地处长江三角洲……（省份简介）",
  "overview": {
    "特色": "……",
    "饮食": "……",
    "文化": "……",
    "历史": "……",
    "当地习惯": "……"
  },
  "districts": [
    { "name": "……", "desc": "……" }
  ],
  "cities": [
    {
      "name": "南京",
      "intro": "可选：城市一句话简介",
      "details": {
        "特色": "六朝古都、十朝都会……",
        "景点": "中山陵、明孝陵、夫子庙秦淮河……",
        "饮食": "盐水鸭、鸭血粉丝汤……",
        "特产": "雨花石、云锦、盐水鸭……",
        "文化": "明城墙、夫子庙……",
        "节庆": "夫子庙灯会、国际梅花节……",
        "历史": "东吴建都……",
        "交通": "南京南站高铁枢纽，禄口机场通达全国……",
        "当地习惯": "生活从容……"
      },
      "images": []
    }
  ]
}
```

字段说明：

- `id` 与 `name`：省份标识与名称，`id` 缺省时取文件名。
- `intro`：省份简介，显示在详情页顶部。
- `overview`：全市概览，仅直辖市与特别行政区使用，以概览卡片展示。
- `cities`：该省份下所有城市，每个条目包含 `name`、可选 `intro`、`details` 与 `images`。直辖市与特别行政区的各区也以城市条目收录于此。
- `images`：预留的图片字段（省份与城市均支持），后续接入图片时直接填写路径即可。
- 除约定字段外，JSON 中可以自由添加其他字段（如 `extra`），不会被解析逻辑丢弃，便于后续扩展非结构化内容。

## 本地开发

```bash
npm install
npm run dev
```

## 构建与预览

```bash
npm run build     # 客户端构建 + SSR 构建 + 预渲染
npm run preview   # 本地预览 dist/
```

`npm run build` 依次执行三步：

1. `vite build` 生成客户端资源与 `dist/index.html`
2. `vite build --ssr src/entry-server.js` 生成预渲染用的 SSR 包（`.ssr-dist/`）
3. `node scripts/prerender.mjs` 为首页、省份列表、34 个省份详情和 455 个城市详情各生成一份带正文与独立 meta 的静态 HTML，并输出 `404.html`、`sitemap.xml`、`llms.txt`、`llms-full.txt` 与 JSON 数据接口

站点使用根路径 `base: '/'` 与 history 路由，需要静态托管支持目录索引与 `404.html`。Cloudflare Pages 已实测通过；旧的 `/#/province/...` hash 链接会在浏览器端自动跳转到干净路径。

## 项目结构

```text
docs/                  省份 JSON 内容源（34 个省级行政区）
public/                robots.txt、_headers、favicon、og-cover 分享图
src/
  app.js               创建应用并注册全局指令（客户端与 SSR 共用）
  routes.js            路由表与 createAppRouter
  router.js            客户端 history 路由实例
  main.js              客户端入口（水合、SEO 更新、旧 hash 跳转）
  entry-server.js      SSR 入口，供预渲染脚本调用
  lib/seo.js           各页面 title / description / canonical / JSON-LD
  data/                内容解析与搜索（parseDocs、store）
  animations/          GSAP 配置、逐字拆分、Lenis 平滑滚动
  directives/          reveal 进场、tilt 3D 倾斜、parallax 指针视差
  components/          页头、页脚、搜索框、省份卡、城市卡
                       以及 InkScene 水墨场景、VistaCard 山河图景、BrushDivider 笔触分隔
  data/cityFields.js   城市九维字段的图标与顺序
  lib/paths.js         省份与城市 URL 生成
  lib/tones.js         按地理分区分配水墨色调
  views/               首页、省份列表、省份详情、城市详情、404
  styles/main.css      全局样式
  styles/enhance.css   水墨视觉增强：场景图层、图景卡片、光斑与微交互
scripts/prerender.mjs  预渲染 491 个页面并生成 sitemap、llms 与 JSON 数据
scripts/qa.mjs         无头浏览器渲染自检脚本
```

## 视觉与动效

- 首页「山河图景」与英雄区山水均为内联 SVG 绘制，不依赖外部图片，离线可用、无版权风险；如需换成实拍照片，可沿用 `docs/` 中的 `images` 字段扩展。
- 滚动入场、3D 倾斜、指针视差、笔触分隔、路由幕布等动效由 GSAP + ScrollTrigger 驱动；触屏与 `prefers-reduced-motion` 环境会自动降级为静态呈现。
- 省份详情页按地理分区切换朱红、青绿、暮蓝三套色调，与首页水墨场景共用 `InkScene` 组件。

## SEO 与 AI 搜索

站点按「搜索引擎 + AI 搜索 + 生成式引擎优化（GEO）」三方面配置：

- **静态可读**：每个路由在构建时预渲染为独立 HTML，正文、标题与链接不依赖 JavaScript 即可被抓取；每座城市都有独立页面，路径格式为 `/city/{省份}/{城市}`。Googlebot、Bingbot、Baiduspider 以及 GPTBot、OAI-SearchBot、ClaudeBot、PerplexityBot 等均可直接读取。
- **独立元信息**：每个页面有自己的 `title`、`description`、`keywords`、canonical、Open Graph、Twitter Card；`src/lib/seo.js` 同时负责构建期注入与客户端路由切换后的更新。
- **结构化数据**：首页使用 `WebSite + WebPage`，省份列表使用 `CollectionPage + ItemList`，省份详情使用 `WebPage + BreadcrumbList + AdministrativeArea + ItemList`。
- **站点级文件**：`/robots.txt`、`/sitemap.xml`、`/llms.txt`、`/llms-full.txt`。其中 `llms-full.txt` 按省份与城市整理全部字段，方便 AI 检索与引用。
- **分享封面**：`/og-cover.jpg`（1200×630），源文件为 `public/og-cover.svg`。
- **404 处理**：未知路径返回 `404.html` 并标记 `noindex,nofollow`，不会被当成首页软 404。

上线后建议手动提交一次：

1. Google Search Console 添加 `city-all.xin`，提交 `https://city-all.xin/sitemap.xml`
2. Bing Webmaster Tools 同样提交 sitemap
3. 百度搜索资源平台添加站点并提交 sitemap（如需百度收录）
4. 若更换主域名，修改 `src/lib/seo.js` 中的 `SITE_URL` 后重新构建

## 补充内容

在 `docs/` 下新建 `省份名.json` 并遵循上文格式，重新 `npm run build` 后即可在站点中看到新省份。城市条目里的 `details` 支持任意键名，站点默认展示“特色、景点、饮食、特产、文化、节庆、历史、交通、当地习惯”九项（缺省键自动跳过），其余键不会报错。
