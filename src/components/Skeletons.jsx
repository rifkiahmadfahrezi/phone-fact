import { cn } from '@/utils/styling'
import React from 'react'

export const PhoneCardSkeleton = ({className, ...props}) => {
   return (
      <>
         <div className={cn(`flex w-full flex-col gap-3 ${className}`)} {...props}>
            <div className="skeleton h-40 w-full"></div>
            <div className="skeleton h-4 w-3/4"></div>
            <div className="skeleton h-4 w-1/4"></div>
            <div className="skeleton h-5 w-full"></div>
            <div className="flex items-center justify-between gap-3">
               <div className="skeleton h-10 w-2/4"></div>
               <div className="skeleton h-10 w-2/4"></div>
            </div>
         </div>
      </>
   )
}

export const ProfileCardSkeleton = ({className, ...props}) => (
   <>
      <div className={cn(`card h-48 card-body bg-base-200 mt-20 relative ${className}`)} {...props}>
         <div className="avatar -mt-20">
         <div className="size-32 rounded-full skeleton">
         </div>
         </div>
      </div>
   </>
)

export const CardSkeleton = ({ className , ...props}) => {
   return (
      <>
         <div className={cn(`w-full ${className}`)} {...props}>
            <div className="skeleton h-40 w-full"></div>
         </div>
      </>
   )
}