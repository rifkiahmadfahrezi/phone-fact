import { createContext, useState, useEffect, useCallback } from "react"
import Alert from "@/components/Alert"

const AlertContext = createContext()

export const AlertProvider = ({ children }) => {
  const [isShowAlert, setIsShowAlert] = useState(false)
  const [alertConfig, setAlertConfig] = useState({ type: null, text: null, duration: 5000 })
  const [count, setCount] = useState(0)

  const showAlert = (type, text, duration) => {
    setAlertConfig({ type, text, duration })
    setCount(duration / 1000)
    setIsShowAlert(true)
  }

  const hideAlert = useCallback(() => {
    setIsShowAlert(false)
    setCount(0)
  }, [])

  useEffect(() => {
   if(isShowAlert){
      const interval = setInterval(() => {
         setCount(prevCount => {
           if (prevCount <= 1) {
             hideAlert()
             clearInterval(interval)
             return 0
           }
           return prevCount - 1
         })
       }, 1000)
   
       return () => clearInterval(interval)
   }
  }, [isShowAlert, hideAlert])

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {isShowAlert && (
        <div className="toast toast-top toast-end z-[9999]">
          <Alert type={alertConfig.type} className="fixed w-fit top-5 right-5 z-[1002]">
            <span className="font-bold capitalize">{alertConfig.text}</span>
            <small className="p-1">{count}s</small>
          </Alert>
        </div>
      )}
      {children}
    </AlertContext.Provider>
  )
}

export default AlertContext
