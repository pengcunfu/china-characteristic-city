export function provincePath(id) {
  return `/province/${encodeURIComponent(id)}`
}

export function cityPath(provinceId, cityName) {
  return `/city/${encodeURIComponent(provinceId)}/${encodeURIComponent(cityName)}`
}
