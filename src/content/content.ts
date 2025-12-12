function applyDarkMode() {
  document.documentElement.style.backgroundColor = '#ff0000ff'
  document.documentElement.style.color = '#fff'
}

function resetColors() {
  document.documentElement.style.backgroundColor = ''
  document.documentElement.style.color = ''
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'APPLY_COLOR') {
    if (message.enabled) {
      applyDarkMode()
    } else {
      resetColors()
    }
  }
})
