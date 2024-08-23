import { createContext, useLayoutEffect, useState } from "react";
import useLocalStorage from '@/hooks/useLocalStorage'
import { isTokenExpired, isJwt } from '@/utils/token'
import { logout } from "@/services/auth";
import API from "@/api/api";

const AuthContext = createContext({})

export const AuthProvider = ({children}) => {

   const [auth, setAuth] = useState({})

   const { getItem, removeItem } = useLocalStorage(import.meta.env.VITE_LOCAL_AUTH_KEY)
   const authData = getItem()


   useLayoutEffect(() => {
      if (isJwt(authData?.token)){
         // check token expiration
         if(isTokenExpired(authData?.token)){
            console.log("expired")
            setAuth({})
            removeItem()
            logout()
         }else{
            // insert jwt token to headers
            API.interceptors.request.use((config) => {
               config.headers.Authorization = `Bearer ${authData?.token}`
               return config
            }, err => Promise.reject(err))

            const { email, id, role, token, username } = authData

            setAuth({ email, id, role, token, username })
         }
      }
   }, [])

   return (
      <AuthContext.Provider value={{auth, setAuth}}>
         {children}
      </AuthContext.Provider>
   )
}

export default AuthContext