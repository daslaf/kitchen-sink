import React from 'react'
import axios from 'axios'
import type { CancelToken } from 'axios'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { ErrorMessage } from '../../components/error-message'
import { Inline, MODE } from '../../components/inline'
import { List, ListItem } from '../../components/list'
import { NoData } from '../../components/no-data'
import { Paginator } from '../../components/paginator'
import { Spinner } from '../../components/spinner'
import { Stack } from '../../components/stack'

import './invoices.css'

const formatResponseInterceptor = axios.interceptors.response.use(
  (response) => {
    const link = response.headers['link']

    if (!link) return response

    const paginationInfo = getPaginationInfo(response.headers['link'])

    return {
      ...response,
      data: {
        info: paginationInfo,
        results: response.data,
      },
    }
  },
  (error) => Promise.reject(error)
)

interface InvoiceT {
  id: string
  amount: {
    currency: string
    value: number
  }
  date: string
  recipient: string
}

interface InvoiceResponseT {
  info: PaginationInfoT
  results: Array<InvoiceT>
}

interface RelMap {
  first: string
  last: string
  next?: string
  previous?: string
}

interface PaginationInfoT {
  totalPages: number
}

interface PaginatorT {
  totalPages: number
  currentPage: number
  pageSize: number
}

function getPaginationInfo(link: string): PaginationInfoT {
  const tuples = link.split(',').map((entry) => entry.split(';'))

  const entries = tuples.reduce((acc, [url, rel]) => {
    const position = rel.match(/(?<=rel=")(.*)(?=")/)

    if (!position) return acc

    return Object.assign(acc, { [position[0]]: url.trim().slice(1, -1) })
  }, {}) as RelMap

  const { last } = entries

  const totalPages = new URL(last).searchParams.get('_page') || 1

  return {
    totalPages: +totalPages,
  }
}

function Invoices() {
  const [params] = useSearchParams()
  const [paginator, setPaginator] = React.useState<PaginatorT>(() => {
    const page = Number(params.get('page')) || 1
    const pageSize = Number(params.get('pageSize')) || 10

    return {
      currentPage: page,
      next: null,
      pageSize: pageSize,
      previous: null,
      totalPages: page,
    }
  })
  const [invoices, setInvoices] = React.useState<InvoiceT[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [itFailed, setItFailed] = React.useState(false)

  const { pathname } = useLocation()
  const navigate = useNavigate()

  const getInvoices = React.useCallback(
    (
      { page, pageSize }: { page: number; pageSize: number },
      config: { cancelToken: CancelToken }
    ) => {
      setIsLoading(true)

      const params = { _page: page, _limit: pageSize }
      const BASE_URL = 'http://localhost:3001/invoices'

      axios.get<InvoiceResponseT>(BASE_URL, { ...config, params }).then(
        (res) => {
          const { info, results } = res.data

          setIsLoading(false)
          setItFailed(false)
          setInvoices(results)
          setPaginator({
            currentPage: page,
            pageSize: pageSize,
            totalPages: info.totalPages,
          })
        },
        (e) => {
          if (!axios.isCancel(e)) {
            setIsLoading(false)
            setItFailed(true)
          }
        }
      )
    },
    []
  )

  const handleNextPageClick = React.useCallback(() => {
    setPaginator((paginator) =>
      paginator.totalPages && paginator.currentPage < paginator.totalPages
        ? { ...paginator, currentPage: paginator.currentPage + 1 }
        : paginator
    )
  }, [])

  const handlePreviousPageClick = React.useCallback(() => {
    setPaginator((paginator) =>
      paginator.currentPage > 1
        ? { ...paginator, currentPage: paginator.currentPage - 1 }
        : paginator
    )
  }, [])

  const handleInvoiceClick = React.useCallback(
    ({ id }: Pick<InvoiceT, 'id'>) => navigate(id),
    [navigate]
  )

  React.useEffect(() => {
    const source = axios.CancelToken.source()
    const params = new URLSearchParams({
      page: `${paginator.currentPage}`,
      pageSize: `${paginator.pageSize}`,
    })

    navigate(pathname + '?' + params.toString())
    getInvoices(
      {
        page: paginator.currentPage,
        pageSize: paginator.pageSize,
      },
      { cancelToken: source.token }
    )

    return () => source.cancel()
  }, [pathname, paginator.currentPage, paginator.pageSize, getInvoices])

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
                amount={invoice.amount.value.toLocaleString('en-US', {
                  style: 'currency',
                  currency: invoice.amount.currency,
                })}
                date={new Date(invoice.date).toLocaleString()}
                recipient={invoice.recipient}
                onClick={handleInvoiceClick}
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

// ----- remove axios interceptor on hot module reloading -----
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    axios.interceptors.response.eject(formatResponseInterceptor)
  })
}
