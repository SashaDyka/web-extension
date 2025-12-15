let activeDomain: string | null = null
let startTime: number | null = null

function getDomain(url?: string): string | null {
  if (!url) return null
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
}

function saveTime(domain: string, delta: number) {
  chrome.storage.local.get([domain], (res: Record<string, number>) => {
    const prev = res[domain] ?? 0
    chrome.storage.local.set({ [domain]: prev + delta })
  })
}

function handleTab(url?: string) {
  const now = Date.now()

  if (activeDomain && startTime) {
    saveTime(activeDomain, now - startTime)
  }

  activeDomain = getDomain(url)
  startTime = now
}

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, (tab) => handleTab(tab.url))
})

chrome.tabs.onUpdated.addListener((_, info, tab) => {
  if (info.url) handleTab(tab.url)
})

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    if (activeDomain && startTime) {
      saveTime(activeDomain, Date.now() - startTime)
      startTime = null
    }
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) handleTab(tabs[0].url)
    })
  }
})
