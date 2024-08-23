import API from '@/api/api'
import { useState, useEffect, useCallback } from 'react'

const useGetData = (endpoint) => {
   const [data, setData] = useState([])
   const [error, setError] = useState(null)
   const [isLoading, setIsLoading] = useState(true)

   const fetcher = useCallback(async () => {
      setIsLoading(true)
      try{
         const response = await API.get(endpoint)
         const { data : dataAxios , status  } = response
         
         if(status!=200){
            throw new Error("An error is occured!")
         }

         setData(dataAxios.data)
      }catch(err){
         console.error(err)
         setError(err.response?.data.message || err.message || "An error is occured")
      }finally{
         setIsLoading(false)
      }
   }, [endpoint])

   useEffect(() => {
      fetcher()
   }, [endpoint])

  return { data, error, isLoading, refetch : fetcher }
}

export default useGetData