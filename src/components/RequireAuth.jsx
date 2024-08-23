import React, { useEffect } from 'react'
import useAuth from '@/hooks/useAuth'
import {  Outlet } from 'react-router-dom'
import Unauthorized from '@/layouts/Unauthorized'
import { Navigate } from 'react-router-dom'
import { useState } from 'react'

const RequireAuth = ({ allowedRoles = ["user"]}) => {
   const { auth } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(!!auth){
      setLoading(false)
    }
  }, [auth])

  if(loading){
    return <span>loading user information</span>
  }

  return (
    <>
      {   
        !auth?.token 
        ? <Navigate to={"/login"} replace={true} />
        : // if role and jwt exist, that means user already logged in
          (!!allowedRoles.find(role => role === auth?.role) && auth?.token)
          ? <Outlet />
          : <Unauthorized />
      }
    </>
  )
}

export default RequireAuth