<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  index: { type: Number, default: 0 }
})

const uid = `vista-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
const no = computed(() => String(props.index + 1).padStart(2, '0'))
</script>

<template>
  <article class="vista-card" :class="`vista-${item.key}`" v-parallax>
    <div class="vista-art">
      <svg viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <!-- 江南水乡 -->
        <template v-if="item.key === 'jiangnan'">
          <defs>
            <linearGradient :id="`${uid}-sky`" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#e9f0e6" />
              <stop offset="100%" stop-color="#f7eed9" />
            </linearGradient>
            <linearGradient :id="`${uid}-water`" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#8fb3a4" />
              <stop offset="100%" stop-color="#3d5d52" />
            </linearGradient>
            <radialGradient :id="`${uid}-sun`">
              <stop offset="0%" stop-color="#fdf3d4" />
              <stop offset="100%" stop-color="#eed396" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="520" :fill="`url(#${uid}-sky)`" />
          <g data-depth="3">
            <circle cx="298" cy="126" r="66" :fill="`url(#${uid}-sun)`" opacity="0.9" />
            <circle cx="298" cy="126" r="32" fill="#f2ddad" opacity="0.85" />
          </g>
          <g data-depth="5" fill="#ffffff">
            <ellipse cx="118" cy="152" rx="86" ry="11" opacity="0.35" />
            <ellipse cx="272" cy="196" rx="66" ry="8" opacity="0.25" />
          </g>
          <g data-depth="8">
            <path
              d="M0 302 Q52 246 112 288 T222 280 T322 296 L400 282 L400 360 L0 360 Z"
              fill="#9db8a4"
              opacity="0.6"
            />
          </g>
          <g data-depth="12">
            <path
              d="M0 340 Q72 292 152 328 T292 318 T400 336 L400 400 L0 400 Z"
              fill="#6d8f7c"
              opacity="0.8"
            />
          </g>
          <g data-depth="17">
            <rect y="360" width="400" height="160" :fill="`url(#${uid}-water)`" />
            <g fill="#ecf4ee" opacity="0.25">
              <rect x="40" y="392" width="98" height="3" rx="1.5" />
              <rect x="86" y="414" width="62" height="2.5" rx="1.25" />
              <rect x="228" y="388" width="84" height="2.5" rx="1.25" />
              <rect x="266" y="432" width="54" height="2.5" rx="1.25" />
              <rect x="58" y="462" width="70" height="3" rx="1.5" />
            </g>
            <path d="M-20 452 Q120 378 262 452" fill="none" stroke="#43352a" stroke-width="7" />
            <path
              d="M-20 468 Q120 396 262 468"
              fill="none"
              stroke="#43352a"
              stroke-width="3"
              opacity="0.65"
            />
            <g stroke="#43352a" stroke-width="3" opacity="0.7">
              <path d="M22 446 L22 418" />
              <path d="M86 424 L86 398" />
              <path d="M150 412 L150 386" />
              <path d="M214 426 L214 400" />
            </g>
            <g transform="translate(276 414)">
              <path d="M0 24 Q34 42 78 24 L70 32 Q36 46 8 32 Z" fill="#3b2c23" />
              <path d="M18 24 Q30 -2 56 6 Q74 10 74 24 Z" fill="#5d4836" />
              <rect x="44" y="32" width="26" height="2" rx="1" fill="#d9c7a3" opacity="0.5" />
            </g>
          </g>
          <g data-depth="23" stroke="#4d6b5a" fill="none" stroke-width="2" opacity="0.85">
            <path d="M34 -10 q26 62 -4 122" />
            <path d="M52 -10 q30 72 2 136" />
            <path d="M70 -10 q22 56 -2 104" />
            <g fill="#4d6b5a" stroke="none" opacity="0.8">
              <circle cx="31" cy="46" r="2.6" />
              <circle cx="26" cy="72" r="2.2" />
              <circle cx="52" cy="60" r="2.4" />
              <circle cx="55" cy="92" r="2.2" />
              <circle cx="70" cy="52" r="2.2" />
              <circle cx="67" cy="80" r="2" />
            </g>
          </g>
        </template>

        <!-- 塞北大漠 -->
        <template v-else-if="item.key === 'beihai'">
          <defs>
            <linearGradient :id="`${uid}-sky`" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#f5dcb4" />
              <stop offset="55%" stop-color="#e6a46b" />
              <stop offset="100%" stop-color="#b5654a" />
            </linearGradient>
            <radialGradient :id="`${uid}-sun`">
              <stop offset="0%" stop-color="#fff1c8" />
              <stop offset="100%" stop-color="#f4bd69" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="520" :fill="`url(#${uid}-sky)`" />
          <g data-depth="3">
            <circle cx="204" cy="248" r="120" :fill="`url(#${uid}-sun)`" opacity="0.85" />
            <circle cx="204" cy="248" r="62" fill="#f6cd80" opacity="0.9" />
          </g>
          <g data-depth="5" fill="#ffffff" opacity="0.18">
            <ellipse cx="120" cy="180" rx="82" ry="7" />
            <ellipse cx="300" cy="150" rx="58" ry="5" />
          </g>
          <g data-depth="8">
            <path
              d="M0 304 Q84 240 182 288 T400 268 L400 372 L0 372 Z"
              fill="#dbab6e"
              opacity="0.9"
            />
          </g>
          <g data-depth="13">
            <path
              d="M0 356 Q112 294 224 342 T400 324 L400 438 L0 438 Z"
              fill="#b97a4b"
            />
          </g>
          <g data-depth="18">
            <path
              d="M0 432 Q122 382 262 422 T400 402 L400 520 L0 520 Z"
              fill="#7f4a31"
            />
            <g fill="#3c2418">
              <g transform="translate(238 372)">
                <ellipse cx="0" cy="12" rx="17" ry="8.5" />
                <path d="M-13 6 q-5 -20 4 -29 q5 -4 9 0 l2 12" />
                <path d="M13 7 q7 -17 3 -26" />
                <path
                  d="M-11 18 l-3 18 M-2 19 l0 17 M7 18 l2 17 M13 17 l4 15"
                  stroke="#3c2418"
                  stroke-width="2.2"
                  fill="none"
                />
                <path d="M15 -19 q2 -4 5 0" stroke="#3c2418" stroke-width="2" fill="none" />
              </g>
              <g transform="translate(304 360) scale(0.72)" opacity="0.9">
                <ellipse cx="0" cy="12" rx="17" ry="8.5" />
                <path d="M-13 6 q-5 -20 4 -29 q5 -4 9 0 l2 12" />
                <path d="M13 7 q7 -17 3 -26" />
                <path
                  d="M-11 18 l-3 18 M-2 19 l0 17 M7 18 l2 17 M13 17 l4 15"
                  stroke="#3c2418"
                  stroke-width="2.6"
                  fill="none"
                />
              </g>
              <g transform="translate(352 352) scale(0.5)" opacity="0.8">
                <ellipse cx="0" cy="12" rx="17" ry="8.5" />
                <path d="M-13 6 q-5 -20 4 -29 q5 -4 9 0 l2 12" />
                <path d="M-11 18 l-3 18 M-2 19 l0 17 M7 18 l2 17 M13 17 l4 15" stroke="#3c2418" stroke-width="3" fill="none" />
              </g>
            </g>
            <g fill="#4a2b1d" opacity="0.55">
              <circle cx="120" cy="470" r="2" />
              <circle cx="152" cy="486" r="1.6" />
              <circle cx="184" cy="464" r="1.8" />
            </g>
          </g>
        </template>

        <!-- 雪域高原 -->
        <template v-else-if="item.key === 'xueyu'">
          <defs>
            <linearGradient :id="`${uid}-sky`" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1f2b46" />
              <stop offset="58%" stop-color="#4c4568" />
              <stop offset="100%" stop-color="#9b7f8e" />
            </linearGradient>
            <radialGradient :id="`${uid}-moon`">
              <stop offset="0%" stop-color="#fff8e2" />
              <stop offset="62%" stop-color="#f3e4b8" />
              <stop offset="100%" stop-color="#f3e4b8" stop-opacity="0" />
            </radialGradient>
            <linearGradient :id="`${uid}-snow`" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#f4f8fc" />
              <stop offset="100%" stop-color="#c2d3e4" />
            </linearGradient>
          </defs>
          <rect width="400" height="520" :fill="`url(#${uid}-sky)`" />
          <g data-depth="3">
            <circle cx="300" cy="112" r="64" :fill="`url(#${uid}-moon)`" opacity="0.75" />
            <circle cx="300" cy="112" r="30" fill="#f6ebc8" opacity="0.95" />
          </g>
          <g data-depth="5" fill="#ffffff">
            <circle cx="70" cy="86" r="1.8" opacity="0.85" />
            <circle cx="126" cy="140" r="1.3" opacity="0.6" />
            <circle cx="196" cy="70" r="1.5" opacity="0.7" />
            <circle cx="244" cy="176" r="1.2" opacity="0.5" />
            <circle cx="352" cy="188" r="1.6" opacity="0.6" />
          </g>
          <g data-depth="8">
            <path
              d="M0 336 L72 240 L132 302 L182 208 L262 302 L332 228 L400 312 L400 404 L0 404 Z"
              fill="#5a6a8c"
              opacity="0.55"
            />
          </g>
          <g data-depth="13">
            <path
              d="M0 386 L92 258 L142 322 L212 188 L282 322 L332 268 L400 362 L400 462 L0 462 Z"
              fill="#2c3852"
            />
            <path d="M212 188 L234 234 L220 226 L208 242 L196 226 L188 234 Z" :fill="`url(#${uid}-snow)`" />
            <path d="M92 258 L108 288 L98 282 L90 294 L82 282 L76 288 Z" :fill="`url(#${uid}-snow)`" opacity="0.9" />
            <path d="M332 268 L346 292 L338 288 L332 298 L326 288 L320 292 Z" :fill="`url(#${uid}-snow)`" opacity="0.85" />
          </g>
          <g data-depth="18">
            <path d="M0 468 Q104 428 204 460 T400 444 L400 520 L0 520 Z" fill="#1b2337" />
            <path d="M118 352 L364 388" stroke="#d8c9a5" stroke-width="1" opacity="0.45" />
            <g opacity="0.9">
              <rect x="140" y="353" width="8" height="11" fill="#b0342c" transform="rotate(3 144 358)" />
              <rect x="164" y="357" width="8" height="11" fill="#c8a45c" transform="rotate(4 168 362)" />
              <rect x="188" y="361" width="8" height="11" fill="#3e6b5c" transform="rotate(4 192 366)" />
              <rect x="212" y="365" width="8" height="11" fill="#e9e2d0" transform="rotate(4 216 370)" />
              <rect x="236" y="369" width="8" height="11" fill="#b0342c" transform="rotate(5 240 374)" />
              <rect x="260" y="373" width="8" height="11" fill="#c8a45c" transform="rotate(5 264 378)" />
              <rect x="284" y="377" width="8" height="11" fill="#3e6b5c" transform="rotate(5 288 382)" />
              <rect x="308" y="381" width="8" height="11" fill="#e9e2d0" transform="rotate(5 312 386)" />
            </g>
          </g>
        </template>

        <!-- 海角潮生 -->
        <template v-else>
          <defs>
            <linearGradient :id="`${uid}-sky`" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#f8dfc7" />
              <stop offset="58%" stop-color="#d9e8df" />
              <stop offset="100%" stop-color="#a8cfc7" />
            </linearGradient>
            <linearGradient :id="`${uid}-sea`" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#7fb6ad" />
              <stop offset="100%" stop-color="#2b5f5b" />
            </linearGradient>
            <radialGradient :id="`${uid}-sun`">
              <stop offset="0%" stop-color="#fff4d6" />
              <stop offset="100%" stop-color="#f5c987" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="520" :fill="`url(#${uid}-sky)`" />
          <g data-depth="3">
            <circle cx="286" cy="132" r="86" :fill="`url(#${uid}-sun)`" opacity="0.9" />
            <circle cx="286" cy="132" r="40" fill="#f8e4b6" opacity="0.95" />
          </g>
          <g data-depth="6">
            <rect y="286" width="400" height="234" :fill="`url(#${uid}-sea)`" />
            <g stroke="#f0f7f2" fill="none" opacity="0.4">
              <path d="M36 322 q22 -10 44 0 t44 0" stroke-width="2" />
              <path d="M188 352 q24 -11 48 0 t48 0" stroke-width="2" />
              <path d="M60 396 q26 -12 52 0 t52 0" stroke-width="2.5" />
              <path d="M244 430 q28 -13 56 0 t56 0" stroke-width="2.5" />
              <path d="M20 476 q30 -14 60 0 t60 0" stroke-width="3" />
            </g>
          </g>
          <g data-depth="12">
            <path d="M214 408 Q262 354 330 372 Q380 384 400 404 L400 520 L214 520 Z" fill="#1f423c" />
            <path d="M232 412 Q262 368 306 378 Q344 386 368 408 L368 520 L232 520 Z" fill="#173430" opacity="0.85" />
            <g stroke="#14302b" fill="none">
              <path d="M286 388 q-8 -56 -18 -78" stroke-width="5" />
              <path d="M312 392 q10 -50 24 -70" stroke-width="5" />
            </g>
            <g fill="#1c3b34">
              <path d="M268 310 q-30 -14 -46 2 q22 6 44 8 Z" />
              <path d="M268 310 q-22 -26 -44 -30 q10 22 38 34 Z" />
              <path d="M270 310 q6 -30 -6 -48 q-10 18 -4 46 Z" />
              <path d="M272 312 q28 -18 46 -8 q-18 12 -44 16 Z" />
              <path d="M336 322 q26 -18 48 -8 q-20 14 -46 18 Z" />
              <path d="M338 322 q20 -30 42 -34 q-6 24 -34 40 Z" />
              <path d="M340 322 q4 -26 -4 -42 q-10 16 -2 42 Z" />
            </g>
          </g>
          <g data-depth="16" stroke="#4a3a2c" fill="none" stroke-width="1.6" opacity="0.65">
            <path d="M80 132 q6 -8 12 0 q6 -8 12 0" />
            <path d="M118 106 q4 -6 8 0 q4 -6 8 0" />
            <path d="M146 148 q5 -7 10 0 q5 -7 10 0" />
          </g>
        </template>
      </svg>
    </div>

    <div class="vista-shade"></div>
    <div class="vista-grain"></div>
    <div class="vista-sheen"></div>

    <div class="vista-content">
      <div class="vista-top">
        <span class="vista-index">{{ no }}</span>
        <span class="vista-place">{{ item.place }}</span>
      </div>
      <div class="vista-bottom">
        <h3 class="vista-title">{{ item.title }}</h3>
        <p class="vista-sub">{{ item.sub }}</p>
        <p class="vista-line">{{ item.line }}</p>
      </div>
    </div>
  </article>
</template>
