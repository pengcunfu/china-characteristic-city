import { provinces, getProvince } from '../data/store'

export const SITE_URL = 'https://city-all.xin'
export const SITE_NAME = '中国特色城市 · 城市印象志'

const TOTAL_CITIES = provinces.reduce((sum, p) => sum + p.cities.length, 0)
export const SITE_DESCRIPTION = `中国特色城市风物志：按省份浏览全国 ${provinces.length} 个省级行政区、${TOTAL_CITIES} 座城市，整理每座城市的特色、景点、饮食、特产、文化、节庆、历史、交通与当地习惯。`
export const OG_IMAGE = `${SITE_URL}/og-cover.jpg`
export const OG_IMAGE_ALT = '中国特色城市 · 城市印象志，水墨山河封面'

const DEFAULT_KEYWORDS =
  '中国特色城市,城市印象,省份浏览,城市特色,地方美食,旅游景点,地方特产,城市文化,城市历史,出行参考'

function today() {
  return new Date().toISOString().slice(0, 10)
}

function cleanPath(path) {
  const raw = String(path || '/')
  const withoutQuery = raw.split('?')[0].split('#')[0]
  return withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`
}

function provincePath(id) {
  return `/province/${encodeURIComponent(id)}`
}

function homeSeo(date) {
  return {
    path: '/',
    title: `${SITE_NAME}：${provinces.length} 个省份、${TOTAL_CITIES} 座城市的特色与烟火日常`,
    description: SITE_DESCRIPTION,
    keywords: DEFAULT_KEYWORDS,
    robots: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
    canonical: `${SITE_URL}/`,
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: `${SITE_URL}/`,
          name: SITE_NAME,
          alternateName: '中国特色城市',
          description: SITE_DESCRIPTION,
          inLanguage: 'zh-CN',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${SITE_URL}/provinces?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/#webpage`,
          url: `${SITE_URL}/`,
          name: `${SITE_NAME}：中国特色城市风物志`,
          description: SITE_DESCRIPTION,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          about: { '@type': 'Thing', name: '中国城市与地方风物' },
          inLanguage: 'zh-CN',
          dateModified: date
        }
      ]
    }
  }
}

function provincesSeo(date) {
  const url = `${SITE_URL}/provinces`
  const title = `省份浏览：全国 ${provinces.length} 个省级行政区 | ${SITE_NAME}`
  const description = `按华北、东北、华东、华中、华南、西南、西北七大地理分区浏览全国 ${provinces.length} 个省级行政区，并查看各省城市的特色、饮食、文化、历史与当地习惯。`
  return {
    path: '/provinces',
    title,
    description,
    keywords: `${DEFAULT_KEYWORDS},省份列表,地理分区,华北,东北,华东,华中,华南,西南,西北`,
    robots: 'index,follow,max-image-preview:large,max-snippet:-1',
    canonical: url,
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${url}#webpage`,
          url,
          name: title,
          description,
          inLanguage: 'zh-CN',
          dateModified: date,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          mainEntity: {
            '@type': 'ItemList',
            name: `中国 ${provinces.length} 个省级行政区`,
            numberOfItems: provinces.length,
            itemListElement: provinces.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.name,
              url: `${SITE_URL}${provincePath(p.id)}`
            }))
          }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${url}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: '省份浏览', item: url }
          ]
        }
      ]
    }
  }
}

function provinceSeo(province, date) {
  const url = `${SITE_URL}${provincePath(province.id)}`
  const cityNames = province.cities.slice(0, 6).map((c) => c.name)
  const cityPart = province.cities.length
    ? `收录${cityNames.join('、')}${province.cities.length > cityNames.length ? '等' : ''}${province.cities.length}座城市。`
    : ''
  const overviewText =
    province.intro || Object.values(province.overview).find((v) => typeof v === 'string') || ''
  const fallbackText = `介绍${province.name}的城市特色、景点、饮食、特产、文化、节庆、历史、交通与当地习惯。`
  const description = `${province.name}城市印象：${cityPart}${overviewText || fallbackText}`.slice(0, 158)
  const title = `${province.name}城市印象：特色、美食、景点、文化与当地习惯 | ${SITE_NAME}`
  const keywords = [
    province.name,
    `${province.name}特色`,
    `${province.name}美食`,
    `${province.name}景点`,
    `${province.name}特产`,
    `${province.name}文化`,
    `${province.name}历史`,
    `${province.name}旅游`,
    province.region,
    ...cityNames
  ].join(',')

  return {
    path: provincePath(province.id),
    title,
    description,
    keywords,
    robots: 'index,follow,max-image-preview:large,max-snippet:-1',
    canonical: url,
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${url}#webpage`,
          url,
          name: title,
          description,
          inLanguage: 'zh-CN',
          dateModified: date,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          breadcrumb: { '@id': `${url}#breadcrumb` },
          about: { '@id': `${url}#place` },
          mainEntity: { '@id': `${url}#cities` }
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${url}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: '省份浏览', item: `${SITE_URL}/provinces` },
            { '@type': 'ListItem', position: 3, name: province.name, item: url }
          ]
        },
        {
          '@type': 'AdministrativeArea',
          '@id': `${url}#place`,
          name: province.name,
          description: overviewText,
          containedInPlace: { '@type': 'Country', name: '中国' },
          additionalProperty: [
            { '@type': 'PropertyValue', name: '地理分区', value: province.region },
            { '@type': 'PropertyValue', name: '收录城市数', value: province.cities.length }
          ]
        },
        {
          '@type': 'ItemList',
          '@id': `${url}#cities`,
          name: `${province.name}城市列表`,
          numberOfItems: province.cities.length,
          itemListElement: province.cities.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name
          }))
        }
      ]
    }
  }
}

function notFoundSeo(path) {
  return {
    path,
    title: `页面不存在 | ${SITE_NAME}`,
    description: '你访问的页面不存在，请返回首页或从省份浏览重新进入。',
    keywords: '',
    robots: 'noindex,nofollow',
    canonical: '',
    ogType: 'website',
    jsonLd: null
  }
}

export function getPageSeo(path, date = today()) {
  const clean = cleanPath(path)
  if (clean === '/' || clean === '') return homeSeo(date)
  if (clean === '/provinces') return provincesSeo(date)

  const match = clean.match(/^\/province\/([^/]+)\/?$/)
  if (match) {
    let id = match[1]
    try {
      id = decodeURIComponent(id)
    } catch {
      /* keep raw id */
    }
    const province = getProvince(id)
    if (province) return provinceSeo(province, date)
  }

  return notFoundSeo(clean)
}

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!content) {
    if (el) el.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!href) {
    if (el) el.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(jsonLd) {
  const old = document.getElementById('seo-jsonld')
  if (!jsonLd) {
    if (old) old.remove()
    return
  }
  const script = old || document.createElement('script')
  script.id = 'seo-jsonld'
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(jsonLd)
  if (!old) document.head.appendChild(script)
}

export function applySeo(seo) {
  document.title = seo.title
  upsertMeta('name', 'description', seo.description)
  upsertMeta('name', 'keywords', seo.keywords)
  upsertMeta('name', 'robots', seo.robots)

  upsertLink('canonical', seo.canonical)

  upsertMeta('property', 'og:title', seo.title)
  upsertMeta('property', 'og:description', seo.description)
  upsertMeta('property', 'og:type', seo.ogType || 'website')
  upsertMeta('property', 'og:site_name', SITE_NAME)
  upsertMeta('property', 'og:locale', 'zh_CN')
  upsertMeta('property', 'og:url', seo.canonical)
  upsertMeta('property', 'og:image', OG_IMAGE)
  upsertMeta('property', 'og:image:type', 'image/jpeg')
  upsertMeta('property', 'og:image:alt', OG_IMAGE_ALT)
  upsertMeta('property', 'og:image:width', '1200')
  upsertMeta('property', 'og:image:height', '630')

  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', seo.title)
  upsertMeta('name', 'twitter:description', seo.description)
  upsertMeta('name', 'twitter:image', OG_IMAGE)
  upsertMeta('name', 'twitter:image:alt', OG_IMAGE_ALT)

  upsertJsonLd(seo.jsonLd)
}
