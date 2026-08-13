export const REGIONS = [
  { name: '华北', provinces: ['北京', '天津', '河北', '山西', '内蒙古'] },
  { name: '东北', provinces: ['辽宁', '吉林', '黑龙江'] },
  { name: '华东', provinces: ['上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '台湾'] },
  { name: '华中', provinces: ['河南', '湖北', '湖南'] },
  { name: '华南', provinces: ['广东', '广西', '海南', '香港', '澳门'] },
  { name: '西南', provinces: ['重庆', '四川', '贵州', '云南', '西藏'] },
  { name: '西北', provinces: ['陕西', '甘肃', '青海', '宁夏', '新疆'] }
]

export function regionOf(name) {
  return REGIONS.find((r) => r.provinces.includes(name))?.name ?? '其他'
}

export const REGION_EMOJI = {
  华北: '🏛',
  东北: '❄️',
  华东: '🛶',
  华中: '⛰',
  华南: '🌴',
  西南: '🏔',
  西北: '🏜'
}
