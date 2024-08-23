import { forwardRef } from 'react'
import { cn } from '@/utils/styling'

const Alert = forwardRef (({type, className, children, ...props}, ref) => { 
   let alertClass = ""

   switch(type?.toLowerCase()){
      case "success":
         alertClass = "alert-success text-success-content"
         break
      case "error":
         alertClass = "alert-error text-error-content"
         break
      case "info":
         alertClass = "alert-info text-info-content"
         break
      default:
         alertClass = ""
      break 
   }

  return (
    <>
      <div className={cn(`alert ${alertClass} ${className}`)} role='alert' {...props} ref={ref}>
         {children}
      </div>
    </>
  )
})

export default Alert
