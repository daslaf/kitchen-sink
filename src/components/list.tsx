import React from 'react'
import classnames from 'classnames'
import './list.css'

type ListProps = React.HTMLAttributes<HTMLUListElement>

const List = ({ children, ...rest }: ListProps) => (
  <ul {...rest} className="ui-list">
    {children}
  </ul>
)

type ListItemProps = React.HTMLAttributes<HTMLLIElement>

const ListItem = ({ children, className, ...rest }: ListItemProps) => (
  <li {...rest}>
    <div className={classnames('ui-list-item', className)}>{children}</div>
  </li>
)

export { List, ListItem }
