# Taste
- Works on Windows (project paths on `D:\`, shell is not POSIX — e.g. `;` is not a command separator, use `NUL` instead of `/dev/null`). Confidence: 0.7
- npm is globally configured with `omit=dev`, so plain `npm install` skips devDependencies. Install with `npm install --include=dev` when a project needs dev tooling (e.g. Vite). Confidence: 0.65
- Prefers bold, high-impact visual polish ("高端大气上档次"): when offered understated vs. balanced vs. intense effect styles, picks the most intense; accepts added runtime dependencies (GSAP + ScrollTrigger/Flip, Lenis) and the extra bundle size that comes with them. Confidence: 0.6
- Wants visual/animation work applied broadly across the whole site (all pages, shared layout, components) rather than only the landing page. Confidence: 0.5
- Communicates in Chinese and expects Chinese-language replies. Confidence: 0.7
- Gives short, goal-level requests (e.g. "帮我运行这个项目", "继续", "帮我加入更多的页面动态效果") and expects the agent to explore the codebase, plan, and fill in the details itself rather than handing over spelled-out specs. Confidence: 0.55
