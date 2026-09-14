export function splitChars(el) {
  const original = el.innerHTML
  const chars = []

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const textNodes = []
  let node = walker.nextNode()
  while (node) {
    textNodes.push(node)
    node = walker.nextNode()
  }

  for (const textNode of textNodes) {
    const text = textNode.nodeValue
    if (!text || !text.trim()) continue

    const fragment = document.createDocumentFragment()
    for (const char of Array.from(text)) {
      if (!char.trim()) {
        fragment.appendChild(document.createTextNode(char))
        continue
      }
      const span = document.createElement('span')
      span.className = 'split-char'
      span.textContent = char
      fragment.appendChild(span)
      chars.push(span)
    }
    textNode.parentNode.replaceChild(fragment, textNode)
  }

  return {
    chars,
    revert() {
      el.innerHTML = original
    }
  }
}
