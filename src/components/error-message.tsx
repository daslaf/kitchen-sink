import React from 'react'

interface ErrorMessageProps {
  label: string
}

const ErrorMessage = (props: ErrorMessageProps) => <p>{props.label}</p>

export { ErrorMessage }
