import { Table, Loading, Button, Input } from "react-daisyui"
import useGetData from "@/hooks/useGetData"
import { RiAddFill, RiDeleteBin2Line, RiPencilLine } from "@remixicon/react"
import { Modal, ModalContent } from "@/components/Modal"
import { useCallback, useRef, useState } from "react"
import { AddBrandForm, UpdateBrandForm } from "@/components/forms/BrandForm"
import { Error } from "@/components/Error"
import { deleteBrand } from "@/services/brands"
import useAlert from "@/hooks/useAlert"
import useSearch from "@/hooks/useSearch"
import Image from "@/components/elements/Image"
import { Link } from "react-router-dom"

const Brands = () => {
   const { inputRef, keyword,  handleKeyword } = useSearch()
   const { showAlert } = useAlert()
   const [brandID, setBrandID] = useState(true)
   const modalAddRef = useRef(null)
   const modalUpdateRef = useRef(null)
   const { data: brands, isLoading, error, refetch } = useGetData("/brands")

   const showAddModal = useCallback(() => { modalAddRef.current?.showModal() }, [])
   const showUpdateModal = useCallback(() => { 
      modalUpdateRef.current?.showModal() 
   }, [])

   const handleDelete = (id, brand) => {
      if(confirm(`delete ${brand}`)){
         (async() => {
            try{
               const res = await deleteBrand(id)
               if(res.status !== 200){
                  throw new Error("An error is occured")
               }
               refetch()
               showAlert("success", `Brand ${brand} deleted`, 5000)
            }catch(error){
               showAlert("error", error.response.data.message || "An error is occured", 5000)
               console.error(error);
            }
         })()
      }
   }

   if (error) return <Error message={error} refetch={refetch}/>
  return (
    <>
      <div className="overflow-x-auto">
         <h1 className="text-xl font-bold capitalize my-5">List of all brands ({brands.length})</h1>

         <div className="flex items-center justify-between my-5 mb-7">
            <Button onClick={showAddModal}  color="secondary" className="capitalize" size="sm">
              <RiAddFill />
              <span className="hidden sm:block">add new brand</span>
            </Button>

            <Input 
               onChange={handleKeyword}
               type="search"
               defaultValue={keyword}
               placeholder="Search Brand.."
               ref={inputRef}/>
         </div>
         
         <Table className="mt-3">
            <Table.Head className="bg-primary text-primary-content text-base text-center">
               <span>No</span>
               <span>Logo</span>
               <span>Name</span>
               <span>Description</span>
               <span>Action</span>
            </Table.Head>
            <Table.Body>
               {isLoading && <tr><td colSpan={5} className="text-center"><Loading variant="dots" className="mx-auto"/></td></tr>}
               {(brands.length == 0 && !isLoading) 
                  ?  <trd> <td colSpan={5} className="text-center">there is no data to display</td> </trd>
                  :brands.filter(item => item.name.toLowerCase().includes(keyword)).map((brand, i) => (
                     <Table.Row key={brand.id} className="text-center">
                        <span>{i+1}</span>
                        <figure className="size-[50px] mx-auto">
                           <Image className="w-full object-contain" src={brand.logo_url} alt={`logo of ${brand.name}`} />
                        </figure>
                        <span>
                           <Link className="link" to={`/brands/${brand.id}`}>
                              {brand.name}
                           </Link>
                        </span>
                        <span className="line-clamp-1">{brand.description || "-"}</span>
                        <span className="space-x-2">
                           <Button 
                              onClick={() => {
                                 setBrandID(brand.id)
                                 showUpdateModal()
                              }}
                              variant="outline" 
                              color="success">
                              <RiPencilLine />
                           </Button>
                           <Button 
                              onClick={() => handleDelete(brand.id, brand.name)}
                              variant="outline" 
                              color="error">
                              <RiDeleteBin2Line />
                           </Button>
                        </span>
                     </Table.Row>
                  ))}
            </Table.Body>
         </Table>
      </div>

      <Modal ref={modalAddRef}>
         <ModalContent>
            <AddBrandForm refetch={refetch} />
         </ModalContent>
      </Modal>
      {brandID &&
         <Modal ref={modalUpdateRef}>
            <ModalContent>
               <UpdateBrandForm brandID={brandID} refetch={refetch} />
            </ModalContent>
         </Modal>
      }
    </>
  )
}

export default Brands