import React from 'react'
import { createRoot } from 'react-dom/client'
import Popup from './Popup'

const root = document.getElementById('root')!

const appRoot = createRoot(root)
appRoot.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
)
