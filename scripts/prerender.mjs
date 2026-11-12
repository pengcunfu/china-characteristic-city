import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')
const templatePath = path.join(distDir, 'index.html')
const ssrEntry = path.join(root, '.ssr-dist', 'entry-server.js')

if (!fs.existsSync(templatePath)) {
  console.error('未找到 dist/index.html，请先执行 vite build')
  process.exit(1)
}
if (!fs.existsSync(ssrEntry)) {
  console.error('未找到 .ssr-dist/entry-server.js，请先执行 vite build --ssr')
  process.exit(1)
}

const {
  render,
  provinces,
  cityPath,
  provincePath,
  getPageSeo,
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  OG_IMAGE,
  OG_IMAGE_ALT,
  buildDate
} = await import(pathToFileURL(ssrEntry).href)

const template = fs.readFileSync(templatePath, 'utf8')
const provinceRoutes = provinces.map((p) => ({
  path: provincePath(p.id),
  province: p
}))
const cityRoutes = provinces.flatMap((p) =>
  p.cities.map((c) => ({
    path: cityPath(p.id, c.name),
    province: p,
    city: c
  }))
)
const routes = [
  { path: '/' },
  { path: '/provinces' },
  ...provinceRoutes,
  ...cityRoutes
]

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
}

function headTags(seo) {
  const tags = []
  if (seo.keywords) tags.push(`<meta name="keywords" content="${escapeHtml(seo.keywords)}" />`)
  tags.push(`<meta name="robots" content="${escapeHtml(seo.robots)}" />`)
  if (seo.canonical) tags.push(`<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`)

  tags.push(`<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`)
  tags.push(`<meta property="og:locale" content="zh_CN" />`)
  tags.push(`<meta property="og:type" content="${escapeHtml(seo.ogType || 'website')}" />`)
  tags.push(`<meta property="og:title" content="${escapeHtml(seo.title)}" />`)
  tags.push(`<meta property="og:description" content="${escapeHtml(seo.description)}" />`)
  if (seo.canonical) tags.push(`<meta property="og:url" content="${escapeHtml(seo.canonical)}" />`)
  tags.push(`<meta property="og:image" content="${OG_IMAGE}" />`)
  tags.push(`<meta property="og:image:type" content="image/jpeg" />`)
  tags.push(`<meta property="og:image:alt" content="${escapeHtml(OG_IMAGE_ALT)}" />`)
  tags.push(`<meta property="og:image:width" content="1200" />`)
  tags.push(`<meta property="og:image:height" content="630" />`)

  tags.push(`<meta name="twitter:card" content="summary_large_image" />`)
  tags.push(`<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`)
  tags.push(`<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`)
  tags.push(`<meta name="twitter:image" content="${OG_IMAGE}" />`)
  tags.push(`<meta name="twitter:image:alt" content="${escapeHtml(OG_IMAGE_ALT)}" />`)

  if (seo.jsonLd) {
    tags.push(`<script id="seo-jsonld" type="application/ld+json">${safeJson(seo.jsonLd)}</script>`)
  }
  return tags.join('\n    ')
}

function injectPage(appHtml, seo) {
  let html = template
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(seo.title)}</title>`)
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`
  )
  html = html.replace('<!--SEO_HEAD-->', headTags(seo))
  html = html.replace(/<div id="app"><\/div>/, `<div id="app">${appHtml}</div>`)
  return html
}

async function writeRoute(route) {
  const { html } = await render(route)
  const seo = getPageSeo(route, buildDate)
  const page = injectPage(html, seo)

  if (route === '/') {
    fs.writeFileSync(path.join(distDir, 'index.html'), page, 'utf8')
    return
  }

  const outFile = path.join(distDir, `${decodeURIComponent(route)}.html`)
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, page, 'utf8')
}

function write404() {
  return render('/404').then(({ html }) => {
    const seo = getPageSeo('/404', buildDate)
    const page = injectPage(html, seo)
    fs.writeFileSync(path.join(distDir, '404.html'), page, 'utf8')
  })
}

function buildSitemap() {
  const urls = routes
    .map(({ path: route }) => {
      const depth = route.split('/').filter(Boolean).length
      const priority =
        route === '/' ? '1.0' : route === '/provinces' ? '0.9' : depth >= 3 ? '0.6' : '0.7'
      const changefreq = route === '/' ? 'weekly' : 'monthly'
      return [
        '  <url>',
        `    <loc>${escapeHtml(SITE_URL + route)}</loc>`,
        `    <lastmod>${buildDate}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>'
      ].join('\n')
    })
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8')
  return routes.length
}

function buildLlms() {
  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    '## 站点信息',
    `- 主域名: ${SITE_URL}`,
    '- 内容语言: 简体中文（zh-CN）',
    `- 覆盖范围: ${provinces.length} 个省级行政区，${provinces.reduce((n, p) => n + p.cities.length, 0)} 座城市`,
    `- 内容维度: 特色、景点、饮食、特产、文化、节庆、历史、交通、当地习惯`,
    `- 城市页面: 每座城市独立成页，路径格式为 /city/{省份}/{城市}`,
    `- 最近更新: ${buildDate}`,
    '',
    '## 主要页面',
    `- [首页](${SITE_URL}/)`,
    `- [省份浏览](${SITE_URL}/provinces)`,
    `- [全量内容纯文本](${SITE_URL}/llms-full.txt)`,
    `- [城市数据 JSON](${SITE_URL}/api/cities.json)`,
    `- [省份数据 JSON](${SITE_URL}/api/provinces.json)`,
    `- [站点地图](${SITE_URL}/sitemap.xml)`,
    '',
    '## 省份索引',
    ...provinces.map(
      (p) => `- [${p.name}](${SITE_URL}/province/${encodeURIComponent(p.id)}): ${p.region}，${p.cities.length} 座城市`
    ),
    '',
    '## 使用建议',
    '- 引用城市内容时请注明来源：中国特色城市 · 城市印象志。',
    '- 站点内容为公开资料整理，适合作为城市特色、饮食、文化、历史与出行参考的检索入口。',
    '- 如需完整内容，优先读取 llms-full.txt，其中按省份与城市整理了全部字段。',
    ''
  ]
  fs.writeFileSync(path.join(distDir, 'llms.txt'), lines.join('\n'), 'utf8')

  const full = [
    `# ${SITE_NAME} 全量内容`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    `最近更新: ${buildDate}`,
    ''
  ]
  for (const p of provinces) {
    full.push(`## ${p.name}`)
    full.push(`- 页面: ${SITE_URL}/province/${encodeURIComponent(p.id)}`)
    full.push(`- 地理分区: ${p.region}`)
    if (p.intro) full.push(`- 简介: ${p.intro}`)
    if (p.overview && Object.keys(p.overview).length) {
      full.push('', '### 全市概览')
      for (const [key, value] of Object.entries(p.overview)) {
        full.push(`- ${key}: ${value}`)
      }
    }
    if (p.districts && p.districts.length) {
      full.push('', '### 主要区域')
      for (const d of p.districts) {
        full.push(`- ${d.name}: ${d.desc || ''}`)
      }
    }
    if (p.cities && p.cities.length) {
      full.push('', `### 城市（${p.cities.length}）`)
      for (const c of p.cities) {
        full.push('', `#### ${c.name}`)
        full.push(`- 页面: ${SITE_URL}${cityPath(p.id, c.name)}`)
        if (c.intro) full.push(`- 简介: ${c.intro}`)
        for (const [key, value] of Object.entries(c.details || {})) {
          full.push(`- ${key}: ${value}`)
        }
      }
    }
    full.push('')
  }
  fs.writeFileSync(path.join(distDir, 'llms-full.txt'), full.join('\n'), 'utf8')
}


function buildApi() {
  const apiDir = path.join(distDir, 'api')
  fs.mkdirSync(apiDir, { recursive: true })

  const provinceData = {
    site: SITE_NAME,
    generated: buildDate,
    count: provinces.length,
    provinces: provinces.map((p) => ({
      id: p.id,
      name: p.name,
      region: p.region,
      url: `${SITE_URL}${provincePath(p.id)}`,
      intro: p.intro,
      overview: p.overview,
      districts: p.districts,
      cityCount: p.cities.length
    }))
  }
  fs.writeFileSync(path.join(apiDir, 'provinces.json'), JSON.stringify(provinceData), 'utf8')

  const cities = provinces.flatMap((p) =>
    p.cities.map((c) => ({
      name: c.name,
      provinceId: p.id,
      province: p.name,
      region: p.region,
      url: `${SITE_URL}${cityPath(p.id, c.name)}`,
      intro: c.intro,
      details: c.details
    }))
  )
  const cityData = {
    site: SITE_NAME,
    generated: buildDate,
    count: cities.length,
    cities
  }
  fs.writeFileSync(path.join(apiDir, 'cities.json'), JSON.stringify(cityData), 'utf8')
  return cities.length
}

console.log(`预渲染 ${routes.length} 个页面...`)
for (const route of routes) {
  await writeRoute(route.path)
  process.stdout.write('.')
}
console.log('')

await write404()
const count = buildSitemap()
buildLlms()
const cityCount = buildApi()

console.log(`完成: ${count} 个页面写入 dist/，${cityCount} 座城市写入 api/cities.json`)
console.log('已生成 404.html、sitemap.xml、llms.txt、llms-full.txt、api/provinces.json、api/cities.json')
