import { Button } from './button'
import { Inline, MODE } from './inline'

import './paginator.css'

interface PaginatorProps {
  totalPages: number
  currentPage: number
  onNextPageClick(): void
  onPreviousPageClick(): void
}

const Paginator = (props: PaginatorProps) => {
  return (
    <Inline className="ui-paginator" mode={MODE.Stacked}>
      <Button
        onClick={props.onPreviousPageClick}
        disabled={props.currentPage === 1}
      >
        Previous
      </Button>
      <Button
        onClick={props.onNextPageClick}
        disabled={props.currentPage === props.totalPages}
      >
        Next
      </Button>
      <div>
        Page {props.currentPage} of {props.totalPages}
      </div>
    </Inline>
  )
}

export { Paginator }
