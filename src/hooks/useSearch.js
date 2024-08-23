import { useCallback, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"

const useSearch = () => {
   const inputRef = useRef(null)
   const [searchParams, setSearchParams ] = useSearchParams()
   const [keyword, setKeyword] = useState(searchParams.get("keyword") || "")

   const handleKeyword = useCallback(() => {
      setSearchParams({keyword : inputRef.current?.value.toLowerCase()})
      setKeyword(inputRef.current?.value.toLowerCase())
   }, [keyword])

   return { inputRef, keyword, handleKeyword }
}

export default useSearch