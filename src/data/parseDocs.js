import { regionOf } from './regions'

const RAW_DOCS = import.meta.glob('../../docs/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
})

const OVERVIEW_SECTION = '全市概览'
const DISTRICT_SECTIONS = ['主要城区', '主要区域', '主要市区']

function isImageLine(line) {
  return /^!\[.*\]\(.*\)$/.test(line)
}

function parseBullets(lines) {
  const details = {}
  for (const raw of lines) {
    const m = raw.trim().match(/^[-*]\s*\*\*(.+?)\*\*\s*[：:]\s*(.+)$/)
    if (m) details[m[1].trim()] = m[2].trim()
  }
  return details
}

function parseDistricts(lines) {
  const districts = []
  for (const raw of lines) {
    const m = raw.trim().match(/^[-*]\s*\*\*(.+?)\*\*\s*[：:]\s*(.+)$/)
    if (m) districts.push({ name: m[1].trim(), desc: m[2].trim() })
  }
  return districts
}

function parseCity(name, lines) {
  const city = { name, intro: '', details: {} }
  let bulletStarted = false
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    if (isImageLine(line)) continue
    if (/^[-*]/.test(line)) {
      bulletStarted = true
      const m = line.match(/^[-*]\s*\*\*(.+?)\*\*\s*[：:]\s*(.+)$/)
      if (m) city.details[m[1].trim()] = m[2].trim()
    } else if (!bulletStarted && !city.intro) {
      city.intro = line
    }
  }
  return city
}

function parseProvince(fileName, raw) {
  const lines = raw.split(/\r?\n/)
  let name = fileName.replace(/\.md$/, '')
  const introLines = []
  const sections = []
  let current = null

  for (const rawLine of lines) {
    const h1 = rawLine.match(/^#\s+(.+)\s*$/)
    const h2 = rawLine.match(/^##\s+(.+)\s*$/)
    if (isImageLine(rawLine.trim())) continue
    if (h1) {
      name = h1[1].trim()
      continue
    }
    if (h2) {
      if (current) sections.push(current)
      current = { title: h2[1].trim(), lines: [] }
      continue
    }
    if (current) current.lines.push(rawLine)
    else introLines.push(rawLine)
  }
  if (current) sections.push(current)

  const province = {
    id: fileName.replace(/\.md$/, ''),
    name,
    region: regionOf(name),
    intro: introLines.map((s) => s.trim()).filter(Boolean).join(' '),
    overview: {},
    districts: [],
    cities: []
  }

  for (const section of sections) {
    if (section.title === OVERVIEW_SECTION) {
      province.overview = parseBullets(section.lines)
    } else if (DISTRICT_SECTIONS.includes(section.title)) {
      province.districts = parseDistricts(section.lines)
    } else {
      province.cities.push(parseCity(section.title, section.lines))
    }
  }
  return province
}

export function loadProvinces() {
  return Object.entries(RAW_DOCS)
    .map(([path, raw]) => parseProvince(path.split('/').pop(), raw))
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))
}
