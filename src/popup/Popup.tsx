import { useEffect, useState } from 'react'

type TimeMap = Record<string, number>

function format(ms: number) {
  const min = Math.floor(ms / 60000)
  return `${min} min`
}

export default function Popup() {
  const [data, setData] = useState<TimeMap>({})

  useEffect(() => {
    chrome.storage.local.get(null, (res) => {
      setData(res as TimeMap)
    })
  }, [])

  const toggleReaderMode = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_READER_MODE' })
      }
    })
  }

  const entries = Object.entries(data).sort((a, b) => b[1] - a[1])

  return (
    <div
      style={{
        minWidth: 260,
        padding: 12,
        fontFamily: 'sans-serif',
      }}
    >
      <h3>Time control</h3>

      <button
        onClick={toggleReaderMode}
        style={{
          width: '100%',
          marginBottom: 10,
          padding: 6,
          cursor: 'pointer',
        }}
      >
        📖 Reading mode
      </button>

      {entries.length === 0 && <p>No data available</p>}

      {entries.map(([domain, time]) => (
        <div
          key={domain}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}
        >
          <span>{domain}</span>
          <strong>{format(time)}</strong>
        </div>
      ))}
    </div>
  )
}
