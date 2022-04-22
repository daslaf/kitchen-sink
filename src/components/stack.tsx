import classnames from 'classnames'
import './stack.css'

type StackProps = React.HTMLAttributes<HTMLElement>

const Stack = ({ children, className, ...rest }: StackProps) => (
  <div {...rest} className={classnames('ui-stack', className)}>
    {children}
  </div>
)

export { Stack }
