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
