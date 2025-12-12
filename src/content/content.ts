function applyDarkMode() {
  const bg = 'rgba(255,0,0,1)'
  const fg = 'rgba(218,11,11,1)'
  if (document.documentElement) {
    document.documentElement.style.backgroundColor = bg
    document.documentElement.style.color = fg
  }
  if (document.body) {
    document.body.style.backgroundColor = bg
    document.body.style.color = fg
  }
}

function resetColors() {
  if (document.documentElement) {
    document.documentElement.style.backgroundColor = ''
    document.documentElement.style.color = ''
  }
  if (document.body) {
    document.body.style.backgroundColor = ''
    document.body.style.color = ''
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message && message.type === 'APPLY_COLOR') {
    try {
      if (message.enabled) {
        applyDarkMode()
      } else {
        resetColors()
      }
    } catch (err) {
      console.error('content: error applying color', err)
    }
  }

  return true
})
