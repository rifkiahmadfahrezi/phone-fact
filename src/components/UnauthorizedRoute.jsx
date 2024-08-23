import React from 'react'
import { Outlet } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import { Navigate } from 'react-router-dom'

const UnauthorizedRoute = () => {
   const { auth } = useAuth()

   return (
      <>
         {!auth?.token 
            ? <Outlet /> 
            : <Navigate to={"/"} replace={true}/>
         }

      </>
   )
}

export default UnauthorizedRoute