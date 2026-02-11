import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactFlowProvider } from 'reactflow'
import './index.css'
import App from './App.jsx'
import { SchemaProvider } from './hooks/useSchemaStore.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SchemaProvider>
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    </SchemaProvider>
  </StrictMode>,
)
