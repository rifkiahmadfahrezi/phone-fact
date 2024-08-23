import { cn } from "@/utils/styling"
import { Suspense, useCallback, useRef, useState } from "react"
import { lazy } from "react"

const Modal = lazy(() => import("../Modal").then(module => ({ default: module.Modal })))
const ModalContent = lazy(() => import("../Modal").then(module => ({ default: module.ModalContent })))

const Image = ({src, alt, className, ...props}) => {
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(false)
   const modalRef = useRef(null)
   const [modaImglUrl, setModaImglUrl] = useState(null)
   const handleShowModal = useCallback((src) => {
      if(modalRef.current){
         modalRef.current.showModal()
         setModaImglUrl(src)
      }
   }, [modaImglUrl])

   const handleCloseModal = useCallback(() => {
      if(modalRef.current){
         modalRef.current.close()
         setModaImglUrl(null)
      }
   }, [modaImglUrl])

  return (
    <>
   <img
      onLoad={() => setLoading(false)}
      onError={() => {
         setError(true)
         setLoading(false)
      }}
      onClick={() => handleShowModal(src)}
      loading="lazy"
      src={src} 
      alt={alt} 
      className={cn(`cursor-pointer ${className}`,
         loading && "skeleton",
         error && "bg-base-200"
      )} 
      {...props} />

      <Suspense>
         <Modal ref={modalRef} onClick={() => handleCloseModal()}>
            <ModalContent>
               <div className="mt-10">
                  <img
                     className="w-full object-contain mx-auto"
                     src={modaImglUrl} 
                     alt={alt} />
               </div>
            </ModalContent>
         </Modal>
      </Suspense>
    </>
  )
}

export default Image