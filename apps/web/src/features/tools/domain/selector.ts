export const selectorModes = ['css', 'xpath'] as const
export type SelectorMode = (typeof selectorModes)[number]

/**
 * Parses into an inert document so the sample markup can never run scripts or
 * load subresources in the tool's own page.
 */
const parseInert = (html: string) => new DOMParser().parseFromString(html, 'text/html')

const describeNode = (node: Node) => {
  if (node.nodeType === Node.ELEMENT_NODE) return (node as Element).outerHTML
  if (node.nodeType === Node.ATTRIBUTE_NODE) {
    const attribute = node as Attr
    return `${attribute.name}="${attribute.value}"`
  }
  return node.textContent ?? ''
}

export const querySelectorAll = (html: string, selector: string, mode: SelectorMode): string[] => {
  const document = parseInert(html)
  if (mode === 'css') return [...document.querySelectorAll(selector)].map(describeNode)

  const evaluated = document.evaluate(
    selector,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null,
  )
  const matches: string[] = []
  for (let index = 0; index < evaluated.snapshotLength; index += 1) {
    const node = evaluated.snapshotItem(index)
    if (node) matches.push(describeNode(node))
  }
  return matches
}
