const OVERLAY_ID = '__reader_mode_overlay__'

function enableReaderMode() {
  if (document.getElementById(OVERLAY_ID)) return

  const overlay = document.createElement('div')
  overlay.id = OVERLAY_ID

  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    backgroundColor: 'rgba(255, 244, 214, 0.35)',
    pointerEvents: 'none',
    zIndex: '999999',
  })

  document.documentElement.appendChild(overlay)
}

function disableReaderMode() {
  document.getElementById(OVERLAY_ID)?.remove()
}

let enabled = false

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'TOGGLE_READER_MODE') {
    if (enabled) {
      disableReaderMode()
    } else {
      enableReaderMode()
    }

    enabled = !enabled
  }
})
