const STYLE_ID = 'ext-theme-style'
const HTML_CLASS = 'ext-theme-active'

type Theme = 'dark' | 'light' | 'pink'

const THEMES: Record<Theme, string> = {
  dark: `
    html.${HTML_CLASS}.ext-theme-dark,
    body.${HTML_CLASS}.ext-theme-dark {
      background: #0b0b0b !important;
      color: #e6e6e6 !important;
    }
    html.${HTML_CLASS}.ext-theme-dark img,
    html.${HTML_CLASS}.ext-theme-dark video {
      filter: brightness(0.95) contrast(1.05) !important;
    }
  `,
  light: `
    html.${HTML_CLASS}.ext-theme-light,
    body.${HTML_CLASS}.ext-theme-light {
      background: #ffffff !important;
      color: #111111 !important;
    }
  `,
  pink: `
    html.${HTML_CLASS}.ext-theme-pink,
    body.${HTML_CLASS}.ext-theme-pink {
      background: #ffe6f0 !important;
      color: #4a0033 !important;
    }
    html.${HTML_CLASS}.ext-theme-pink a {
      color: #cc0066 !important;
    }
  `,
}

function setThemeStyle(theme: Theme) {
  const css = THEMES[theme]
  if (!css) return

  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!style) {
    style = document.createElement('style')
    style.id = STYLE_ID
    document.head?.appendChild(style)
  }
  style.textContent = css
}

function removeThemeStyle() {
  const style = document.getElementById(STYLE_ID)
  if (style) style.remove()
}

function applyTheme(enabled: boolean, theme: Theme) {
  try {
    const html = document.documentElement
    if (!html) return

    html.classList.remove(
      HTML_CLASS,
      'ext-theme-dark',
      'ext-theme-light',
      'ext-theme-pink'
    )

    if (!enabled) {
      removeThemeStyle()
      return
    }

    html.classList.add(HTML_CLASS, `ext-theme-${theme}`)
    setThemeStyle(theme)
  } catch (err) {
    console.error('content: applyTheme error', err)
  }
}

function resetPage() {
  try {
    removeThemeStyle()
    const html = document.documentElement
    if (html) {
      html.classList.remove(
        HTML_CLASS,
        'ext-theme-dark',
        'ext-theme-light',
        'ext-theme-pink'
      )
    }
  } catch (err) {
    console.error('content: resetPage error', err)
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message?.type) return

  if (message.type === 'APPLY_THEME') {
    const { enabled, theme } = message.payload || {}
    applyTheme(!!enabled, (theme as Theme) || 'light')
    sendResponse({ applied: true })
  }

  if (message.type === 'RESET_PAGE') {
    resetPage()
    sendResponse({ reset: true })
  }

  return true
})
