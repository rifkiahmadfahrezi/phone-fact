import React from 'react'
import { cn } from '@/utils/styling'

const Label = ({className,children,  ...props}) => {
  return (
   <label  className={cn(`label ${className}`)} {...props}>
      {children}
   </label>
  )
}

export default Label