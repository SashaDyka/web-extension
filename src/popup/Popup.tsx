import { useState } from 'react'

export default function Popup() {
  const [enabled, setEnabled] = useState(false)

  const toggle = async () => {
    const newValue = !enabled
    setEnabled(newValue)

    chrome.runtime.sendMessage({
      type: 'TOGGLE_COLOR',
      enabled: newValue,
    })
  }

  return (
    <div className="p-4 w-48">
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={enabled} onChange={toggle} />
        Red mode
      </label>
    </div>
  )
}
