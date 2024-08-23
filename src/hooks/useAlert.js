import { useContext } from "react";
import AlertContext from "@/context/AlertProvider";


const useAlert = () => {
   const { showAlert, hideAlert } = useContext(AlertContext)
   return { showAlert, hideAlert }
}

export default useAlert