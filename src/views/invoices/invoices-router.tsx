import React from 'react'
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'

import { Invoices, InvoicesProps } from './invoices'
import { InvoiceDetail, InvoiceDetailProps } from './invoice-detail'

function InvoicesRouter() {
  const [params] = useSearchParams()
  const page = Number(params.get('page')) || 1
  const pageSize = Number(params.get('pageSize')) || 10

  const navigate = useNavigate()

  const handleInvoiceClick = React.useCallback<InvoicesProps['onInvoiceClick']>(
    ({ id }) => {
      navigate('detail/' + id)
    },
    [navigate]
  )
  const handlePageChange = React.useCallback<InvoicesProps['onPageChange']>(
    ({ page, pageSize }) => {
      navigate(`?page=${page}&pageSize=${pageSize}`)
    },
    [navigate]
  )
  const handleInvoiceDetailBack = React.useCallback<
    InvoiceDetailProps['onGoBack']
  >(() => {
    navigate(-1)
  }, [navigate])

  return (
    <Routes>
      <Route
        index
        element={
          <Invoices
            page={page}
            pageSize={pageSize}
            onInvoiceClick={handleInvoiceClick}
            onPageChange={handlePageChange}
          />
        }
      />
      <Route
        path="detail/:id"
        element={<InvoiceDetail onGoBack={handleInvoiceDetailBack} />}
      />
      <Route path="*" element={<Navigate to="" />} />
    </Routes>
  )
}

export { InvoicesRouter }
