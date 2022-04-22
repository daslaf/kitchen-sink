import React from 'react'

interface PaginatorT {
  totalPages: number
  currentPage: number
  pageSize: number
}

interface UsePaginatorParamsT {
  page: number
  pageSize: number
}

const usePaginator = ({ page, pageSize }: UsePaginatorParamsT) => {
  const [paginator, setPaginator] = React.useState<PaginatorT>({
    currentPage: page,
    pageSize: pageSize,
    totalPages: page,
  })

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

  return {
    paginator,
    setPaginator,
    handleNextPageClick,
    handlePreviousPageClick,
  }
}

export { usePaginator }
