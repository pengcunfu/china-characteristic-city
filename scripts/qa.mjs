import { spawn } from 'node:child_process'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const DEBUG_PORT = 9222
const BASE = 'http://localhost:4173'

const pages = {
  home: `${BASE}/#/`,
  provinces: `${BASE}/#/provinces`,
  detailJiangsu: `${BASE}/#/province/%E6%B1%9F%E8%8B%8F`,
  detailBeijing: `${BASE}/#/province/%E5%8C%97%E4%BA%AC`,
  detailHubei: `${BASE}/#/province/%E6%B9%96%E5%8C%97`,
  detailGansu: `${BASE}/#/province/%E7%94%98%E8%82%83`,
  notFound: `${BASE}/#/no-such-page`
}

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=' + `${process.env.TEMP}\\qa-chrome-profile`,
    'about:blank'
  ],
  { stdio: 'ignore' }
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getPageTarget() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json`)
      const targets = await res.json()
      const page = targets.find((t) => t.type === 'page')
      if (page) return page
    } catch {
      /* chrome not ready yet */
    }
    await sleep(300)
  }
  throw new Error('无法连接 Chrome DevTools')
}

async function main() {
  const page = await getPageTarget()
  const ws = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    ws.onopen = resolve
    ws.onerror = reject
  })

  let msgId = 0
  const pending = new Map()
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data)
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg)
      pending.delete(msg.id)
    }
  }
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const mid = ++msgId
      pending.set(mid, resolve)
      ws.send(JSON.stringify({ id: mid, method, params }))
    })
  const evalJs = async (expression) => {
    const msg = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    })
    if (msg.result?.exceptionDetails) {
      throw new Error(
        msg.result.exceptionDetails.exception?.description ||
          msg.result.exceptionDetails.text
      )
    }
    return msg.result?.result?.value
  }

  await send('Page.enable')
  await send('Runtime.enable')
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      window.__qaErrors = [];
      window.addEventListener('error', (e) => window.__qaErrors.push(String(e.message)));
      window.addEventListener('unhandledrejection', (e) => window.__qaErrors.push('rejection: ' + String(e.reason)));
    `
  })

  for (const [name, url] of Object.entries(pages)) {
    await send('Page.navigate', { url })
    await sleep(2600)
    const title = await evalJs('document.title')
    const text = await evalJs('document.body.innerText')
    const appHtml = await evalJs("document.querySelector('#app')?.innerHTML.length || 0")
    const errors = await evalJs('window.__qaErrors || []')
    console.log(`\n===== ${name} =====`)
    console.log(`title: ${title}`)
    console.log(`app html length: ${appHtml}`)
    console.log(`errors: ${errors.length ? errors.join(' | ') : '无'}`)
    console.log(text.slice(0, 700).replace(/\n+/g, ' / '))
  }

  ws.close()
  chrome.kill()
}

main().catch((err) => {
  console.error('QA 失败:', err.message)
  chrome.kill()
  process.exit(1)
})
