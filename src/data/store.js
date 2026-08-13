import { loadProvinces } from './parseDocs'

export const provinces = loadProvinces()
export const totalProvinces = provinces.length
export const totalCities = provinces.reduce((sum, p) => sum + p.cities.length, 0)

const normalize = (s) => (s || '').toLowerCase().trim()

export function searchProvinces(query, list = provinces) {
  const q = normalize(query)
  if (!q) return list
  return list.filter((p) => {
    if (normalize(p.name).includes(q) || normalize(p.region).includes(q)) return true
    if (normalize(p.intro).includes(q)) return true
    return p.cities.some(
      (c) =>
        normalize(c.name).includes(q) ||
        Object.values(c.details).some((v) => normalize(v).includes(q))
    )
  })
}

export function searchCities(province, query) {
  const q = normalize(query)
  if (!q) return province.cities
  return province.cities.filter(
    (c) =>
      normalize(c.name).includes(q) ||
      Object.values(c.details).some((v) => normalize(v).includes(q))
  )
}

export function getProvince(id) {
  return provinces.find((p) => p.id === id)
}

const FEATURED_PROVINCES = [
  '北京',
  '上海',
  '天津',
  '江苏',
  '浙江',
  '安徽',
  '福建',
  '山东',
  '湖北',
  '湖南',
  '云南',
  '陕西',
  '辽宁',
  '黑龙江'
]

export function featuredProvinces(limit = 12) {
  return provinces.filter((p) => FEATURED_PROVINCES.includes(p.name)).slice(0, limit)
}

export function cityTicker(limit = 48) {
  const chips = []
  for (const p of provinces) {
    for (const c of p.cities) {
      chips.push({ city: c.name, provinceId: p.id, province: p.name })
      if (chips.length >= limit) return chips
    }
  }
  return chips
}
