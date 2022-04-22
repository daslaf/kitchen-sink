import { Navigate, Route, Routes } from 'react-router-dom'

import { Invoices } from './invoices'
import { InvoiceDetail } from './invoice-detail'

function InvoicesRouter() {
  return (
    <Routes>
      <Route index element={<Invoices />} />
      <Route path=":id" element={<InvoiceDetail />} />
      <Route path="*" element={<Navigate to="" />} />
    </Routes>
  )
}

export { InvoicesRouter }
