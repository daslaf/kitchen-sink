import { InvoiceT } from './models'
import {
  httpClient,
  CancelToken,
  PaginatedResponseT,
} from '../../libs/http-client'

type InvoiceResponseT = PaginatedResponseT<InvoiceT>

interface GetInvoicesParams {
  params: { _limit: number; _page: number }
  cancelToken: CancelToken
}

const BASE_URL = import.meta.env.VITE_API_URL + '/invoices'

const getInvoices = ({ params, ...config }: GetInvoicesParams) =>
  httpClient.get<InvoiceResponseT>(BASE_URL, { ...config, params })

export { getInvoices }
