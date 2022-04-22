interface InvoiceT {
  id: string
  amount: {
    currency: string
    value: number
  }
  date: string
  recipient: string
}

export type { InvoiceT }
