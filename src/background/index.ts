chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension is WORKING!!!')
})

chrome.commands.onCommand.addListener((command) => {
  if (command === 'open_side_panel') {
    chrome.windows.getCurrent((w) => {
      chrome.sidePanel.open({ windowId: w.id! })
      console.log('Side panel opened')
    })
  }
})

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TOGGLE_COLOR') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id
      if (!tabId) return

      chrome.tabs.sendMessage(tabId, {
        type: 'APPLY_COLOR',
        enabled: message.enabled,
      })
    })
  }
})
