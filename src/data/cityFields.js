export const CITY_FIELDS = [
  { key: '特色', label: '特色', icon: '🏙' },
  { key: '景点', label: '景点', icon: '🗺' },
  { key: '饮食', label: '饮食', icon: '🍜' },
  { key: '特产', label: '特产', icon: '🎁' },
  { key: '文化', label: '文化', icon: '🏮' },
  { key: '节庆', label: '节庆', icon: '🎊' },
  { key: '历史', label: '历史', icon: '📜' },
  { key: '交通', label: '交通', icon: '🚄' },
  { key: '当地习惯', label: '习惯', icon: '☕' }
]

export function fieldsOf(city) {
  if (!city || !city.details) return []
  return CITY_FIELDS.filter((field) => city.details[field.key])
}
