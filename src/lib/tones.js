export const TONE_BY_REGION = {
  华东: 'jade',
  华南: 'jade',
  华中: 'ember',
  华北: 'ember',
  东北: 'dusk',
  西南: 'dusk',
  西北: 'dusk'
}

export function toneOfRegion(region) {
  return TONE_BY_REGION[region] || 'ember'
}
