import { regionOf } from './regions'

const RAW_DOCS = import.meta.glob('../../docs/*.json', {
  import: 'default',
  eager: true
})

function normalizeCity(city) {
  const src = city && typeof city === 'object' ? city : {}
  return {
    name: String(src.name || ''),
    intro: src.intro || '',
    details: src.details && typeof src.details === 'object' ? src.details : {},
    images: Array.isArray(src.images) ? src.images : [],
    ...src,
    name: String(src.name || ''),
    intro: src.intro || '',
    details: src.details && typeof src.details === 'object' ? src.details : {},
    images: Array.isArray(src.images) ? src.images : []
  }
}

function normalizeProvince(fileName, data) {
  const src = data && typeof data === 'object' ? data : {}
  const id = String(src.id || fileName.replace(/\.json$/, ''))
  const name = String(src.name || id)
  const province = {
    id,
    name,
    region: regionOf(name),
    intro: '',
    overview: {},
    districts: [],
    cities: [],
    images: [],
    ...src,
    id,
    name,
    region: src.region || regionOf(name),
    intro: src.intro || '',
    overview: src.overview && typeof src.overview === 'object' ? src.overview : {},
    districts: Array.isArray(src.districts) ? src.districts : [],
    images: Array.isArray(src.images) ? src.images : [],
    cities: Array.isArray(src.cities) ? src.cities.map(normalizeCity) : []
  }
  return province
}

export function loadProvinces() {
  return Object.entries(RAW_DOCS)
    .map(([path, data]) => normalizeProvince(path.split('/').pop(), data))
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))
}
