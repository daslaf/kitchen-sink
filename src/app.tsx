import { Navigate, Route, Routes } from 'react-router-dom'
import { InvoicesRouter } from './views/invoices'

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="invoices/*" element={<InvoicesRouter />} />
        <Route path="*" element={<Navigate to="invoices" />} />
      </Routes>
    </div>
  )
}

export { App }
