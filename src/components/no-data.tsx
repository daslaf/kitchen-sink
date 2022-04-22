import React from 'react'

interface NoDataProps {
  label: string
}

const NoData = (props: NoDataProps) => <p>{props.label}</p>

export { NoData }
