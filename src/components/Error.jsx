import { cn } from '@/utils/styling'
import React from 'react'
export const Error = ({message, refetch = null, className, ...props}) => {

   return (
   <div className={cn(`card card-body bg-base-200 text-center ${className}`)} {...props}>
      <p>{message}</p>

      {refetch && 
         <button 
            onClick={() => refetch()}
            className='btn btn-secondary w-fit mx-auto my-5'
            type="button">
            Reload
         </button>
      }
   </div>
  )
}
