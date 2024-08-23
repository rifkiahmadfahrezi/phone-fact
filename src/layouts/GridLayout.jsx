import React from 'react'
import { cn } from '@/utils/styling'

const GridLayout = ({className, children,  ...props}) => {
  return (
    <div className={cn(`grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${className}`)} {...props}>
      {children}
    </div>
  )
}

export default GridLayout