import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'pink'

type Setting = {
  enabled: boolean
  theme: Theme
}

export default function Popup() {
  const [hostname, setHostname] = useState<string | null>(null)
  const [setting, setSetting] = useState<Setting>({
    enabled: false,
    theme: 'light',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    chrome.runtime.sendMessage(
      { type: 'GET_SETTINGS_FOR_ACTIVE_TAB' },
      (resp) => {
        if (resp) {
          setHostname(resp.hostname || null)
          setSetting(resp.setting || { enabled: false, theme: 'light' })
        }
        setLoading(false)
      }
    )
  }, [])

  const saveSettings = (newSetting: Setting) => {
    if (!hostname) return
    chrome.runtime.sendMessage(
      {
        type: 'SET_DOMAIN_SETTINGS',
        payload: { hostname, settings: newSetting },
      },
      (resp) => {
        if (!resp || !resp.success)
          console.error('popup: failed to save settings', resp)
      }
    )
  }

  const toggleEnabled = () => {
    const next = { ...setting, enabled: !setting.enabled }
    setSetting(next)
    saveSettings(next)
  }

  const changeTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = {
      enabled: true,
      theme: e.target.value as Theme,
    }
    setSetting(next)
    saveSettings(next)
  }

  const onReset = () => {
    chrome.runtime.sendMessage({ type: 'RESET_PAGE' }, () => {})
  }

  if (loading) return <div className="p-4">Loading…</div>

  return (
    <div className="p-4 w-64">
      <div className="mb-2">
        <strong>Domain:</strong> <span>{hostname || 'unknown'}</span>
      </div>

      <label className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={setting.enabled}
          onChange={toggleEnabled}
        />
        <span>Enabled for this site</span>
      </label>

      <div className="mb-3">
        <label className="block mb-1">Theme</label>
        <select value={setting.theme} onChange={changeTheme} className="w-full">
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="pink">Pink</option>
        </select>
      </div>

      <button onClick={onReset} className="px-3 py-1 border rounded">
        Reset Page
      </button>
    </div>
  )
}
