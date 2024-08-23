import { forwardRef } from 'react'
import { cn } from '@/utils/styling'

export const Modal = forwardRef (({className, children, ...props}, ref) => { 
  return (
    <>
      <dialog ref={ref} className={cn(`modal ${className}`)} {...props}>
         {children}
         {/* for closing modal on click outside the element */}
         <form method="dialog" className="modal-backdrop">
            <button>close</button>
         </form>
      </dialog>
    </>
  )
})

export const ModalContent = ({className, children, ...props}) => {
   return (
      <>
         <div className={cn(`modal-box bg-base-100 dark:bg-base-200 text-base-content ${className}`)} {...props}>
            <form method="dialog" className="absolute right-4 top-3">
               <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            {children}
         </div>
      </>
   )
}


