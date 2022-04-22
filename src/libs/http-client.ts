import axios from 'axios'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

interface PaginationInfoT {
  totalPages: number
}

interface RelMap {
  first: string
  last: string
  next?: string
  previous?: string
}

interface PaginatedResponseT<T> {
  info: PaginationInfoT
  results: Array<T>
}

const formatResponseInterceptor = httpClient.interceptors.response.use(
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
  (error) => {
    return Promise.reject({ ...error, isCancelError: axios.isCancel(error) })
  }
)

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

function getCancelToken() {
  return axios.CancelToken.source()
}

function isCancelError(e: Error) {
  return axios.isCancel(e)
}

export { httpClient, getCancelToken, isCancelError }
export type { PaginatedResponseT }
export type { CancelToken } from 'axios'

// ----- remove axios interceptor on hot module reloading -----
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    axios.interceptors.response.eject(formatResponseInterceptor)
  })
}
