import React from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { ErrorMessage } from '../../components/error-message'
import { Inline, MODE } from '../../components/inline'
import { List, ListItem } from '../../components/list'
import { NoData } from '../../components/no-data'
import { Paginator } from '../../components/paginator'
import { Spinner } from '../../components/spinner'
import { Stack } from '../../components/stack'

import {
  CancelToken,
  getCancelToken,
  isCancelError,
} from '../../libs/http-client'
import { usePaginator } from '../../libs/paginator/use-paginator'

import * as invoicesService from './invoices-service'
import { InvoiceT } from './models'

import './invoices.css'

interface InvoicesProps {
  page: number
  pageSize: number
  // method
  onInvoiceClick(props: Pick<InvoiceT, 'id'>): void
  onPageChange(props: Pick<InvoicesProps, 'page' | 'pageSize'>): void
}

type InvoiceViewModelT = Omit<InvoiceT, 'amount'> & {
  amount: string
}

function useInvoices({
  page,
  pageSize,
}: Pick<InvoicesProps, 'page' | 'pageSize'>) {
  // Pagination
  const {
    paginator,
    setPaginator,
    handleNextPageClick,
    handlePreviousPageClick,
  } = usePaginator({ page, pageSize })

  // Data
  const [invoices, setInvoices] = React.useState<InvoiceViewModelT[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [itFailed, setItFailed] = React.useState(false)

  const getInvoices = React.useCallback(
    (
      { page, pageSize }: { page: number; pageSize: number },
      config: { cancelToken: CancelToken }
    ) => {
      setIsLoading(true)

      const params = { _page: page, _limit: pageSize }

      invoicesService.getInvoices({ ...config, params }).then(
        (res) => {
          const { info, results } = res.data

          setIsLoading(false)
          setItFailed(false)
          setInvoices(
            results.map((invoice) => {
              return {
                ...invoice,
                amount: invoice.amount.value.toLocaleString('es-CL', {
                  style: 'currency',
                  currency: invoice.amount.currency,
                }),
                date: new Date(invoice.date).toLocaleString('es-CL'),
              }
            })
          )
          setPaginator({
            currentPage: page,
            pageSize: pageSize,
            totalPages: info.totalPages,
          })
        },
        (e) => {
          if (isCancelError(e)) {
            setIsLoading(false)
            setItFailed(true)
          }
        }
      )
    },
    []
  )

  return {
    invoices,
    isLoading,
    itFailed,
    paginator,
    // methods
    handleNextPageClick,
    handlePreviousPageClick,
    getInvoices,
  }
}

function Invoices({
  page,
  pageSize,
  onInvoiceClick,
  onPageChange,
}: InvoicesProps) {
  const {
    invoices,
    isLoading,
    itFailed,
    paginator,
    // methods
    handleNextPageClick,
    handlePreviousPageClick,
    getInvoices,
  } = useInvoices({ page, pageSize })

  React.useEffect(() => {
    onPageChange({ page: paginator.currentPage, pageSize: paginator.pageSize })
  }, [onPageChange, paginator.currentPage, paginator.pageSize])

  React.useEffect(() => {
    const source = getCancelToken()

    getInvoices(
      {
        page: paginator.currentPage,
        pageSize: paginator.pageSize,
      },
      { cancelToken: source.token }
    )

    return () => source.cancel()
  }, [paginator.currentPage, paginator.pageSize, getInvoices])

  return (
    <main>
      <Stack>
        <h1>
          Invoices <span role="img">💸</span>
        </h1>
        <header>
          {paginator.totalPages > 1 ? (
            <Paginator
              totalPages={paginator.totalPages}
              currentPage={paginator.currentPage}
              onNextPageClick={handleNextPageClick}
              onPreviousPageClick={handlePreviousPageClick}
            />
          ) : null}
        </header>

        {isLoading ? (
          <Spinner />
        ) : itFailed ? (
          <ErrorMessage label="Error: Couldn't load invoices" />
        ) : invoices.length === 0 ? (
          <NoData label="There are no invoices yet" />
        ) : (
          <List>
            {invoices.map((invoice) => (
              <Invoice
                key={invoice.id}
                id={invoice.id}
                amount={invoice.amount}
                date={invoice.date}
                recipient={invoice.recipient}
                onClick={onInvoiceClick}
              />
            ))}
          </List>
        )}
      </Stack>
    </main>
  )
}

interface InvoiceProps {
  id: string
  amount: string
  date: string
  recipient: string
  onClick(id: { id: string }): void
}

function Invoice(props: InvoiceProps) {
  return (
    <ListItem className="ui-invoice">
      <Inline
        className="ui-invoice-content"
        mode={MODE.Spaced}
        tabIndex={0}
        onClick={() => props.onClick({ id: props.id })}
        onKeyUp={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            props.onClick({ id: props.id })
          }
        }}
      >
        <div>
          <h3 className="ui-invoice-recipient">{props.recipient}</h3>
          <p>{props.date}</p>
        </div>
        <span>{props.amount}</span>
      </Inline>
    </ListItem>
  )
}

export { Invoices }
export type { InvoicesProps }
