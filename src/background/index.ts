chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed')
})

chrome.commands.onCommand.addListener((command) => {
  if (command === 'open_side_panel') {
    chrome.windows.getCurrent((w) => {
      chrome.sidePanel.open({ windowId: w.id! })
      console.log('Side panel opened')
    })
  }
})

function hostnameFromUrl(url?: string | null) {
  if (!url) return null
  try {
    const u = new URL(url)
    return u.hostname
  } catch {
    return null
  }
}

type Theme = 'dark' | 'light' | 'pink'

type DomainSetting = {
  enabled: boolean
  theme: Theme
}

function applySettingsToTab(tabId: number, hostname: string | null) {
  if (!hostname) return

  chrome.storage.sync.get(['perDomainSettings'], (items) => {
    const all = (items.perDomainSettings || {}) as Record<string, DomainSetting>
    const setting = all[hostname]

    if (setting) {
      chrome.tabs.sendMessage(tabId, {
        type: 'APPLY_THEME',
        payload: setting,
      })
    } else {
      chrome.tabs.sendMessage(tabId, { type: 'RESET_PAGE' })
    }
  })
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    const hostname = hostnameFromUrl(tab.url)
    applySettingsToTab(activeInfo.tabId, hostname)
  })
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    const hostname = hostnameFromUrl(tab.url)
    applySettingsToTab(tabId, hostname)
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.type) return

  if (message.type === 'GET_SETTINGS_FOR_ACTIVE_TAB') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]
      const hostname = hostnameFromUrl(tab?.url)
      chrome.storage.sync.get(['perDomainSettings'], (items) => {
        const all = (items.perDomainSettings || {}) as Record<
          string,
          DomainSetting
        >
        const setting = hostname ? all[hostname] : undefined
        sendResponse({
          hostname,
          setting: setting || { enabled: false, theme: 'light' },
        })
      })
    })
    return true
  }

  if (message.type === 'SET_DOMAIN_SETTINGS') {
    const { hostname, settings } = message.payload || {}
    if (!hostname) {
      sendResponse({ success: false, error: 'No hostname provided' })
      return
    }

    chrome.storage.sync.get(['perDomainSettings'], (items) => {
      const all = (items.perDomainSettings || {}) as Record<
        string,
        DomainSetting
      >
      all[hostname] = settings
      chrome.storage.sync.set({ perDomainSettings: all }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tab = tabs[0]
          const tabHostname = hostnameFromUrl(tab?.url)
          if (tabHostname === hostname && tab.id) {
            chrome.tabs.sendMessage(
              tab.id,
              { type: 'APPLY_THEME', payload: settings },
              () => {}
            )
          }
        })
        sendResponse({ success: true })
      })
    })

    return true
  }

  if (message.type === 'RESET_PAGE') {
    const tabId = sender.tab?.id
    if (tabId) {
      chrome.tabs.sendMessage(tabId, { type: 'RESET_PAGE' }, () => {})
      sendResponse({ success: true })
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const id = tabs[0]?.id
        if (id) chrome.tabs.sendMessage(id, { type: 'RESET_PAGE' }, () => {})
        sendResponse({ success: !!id })
      })
    }

    return true
  }
})
