import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/button'
import { Inline, MODE } from '../../components/inline'
import { Stack } from '../../components/stack'

const InvoiceDetail = () => {
  const navigate = useNavigate()

  return (
    <Stack>
      <header>
        <Inline mode={MODE.Stacked}>
          <Button onClick={() => navigate(-1)}>Back</Button>
          <h1>Detail</h1>
        </Inline>
      </header>
    </Stack>
  )
}

export { InvoiceDetail }
