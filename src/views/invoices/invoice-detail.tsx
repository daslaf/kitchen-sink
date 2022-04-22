import { Button } from '../../components/button'
import { Inline, MODE } from '../../components/inline'
import { Stack } from '../../components/stack'

interface InvoiceDetailProps {
  onGoBack(): void
}

const InvoiceDetail = ({ onGoBack }: InvoiceDetailProps) => {
  return (
    <Stack>
      <header>
        <Inline mode={MODE.Stacked}>
          <Button onClick={onGoBack}>Back</Button>
          <h1>Detail</h1>
        </Inline>
      </header>
    </Stack>
  )
}

export { InvoiceDetail }
export type { InvoiceDetailProps }
