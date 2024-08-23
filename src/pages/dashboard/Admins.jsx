import useGetData from "@/hooks/useGetData"
import { RiDeleteBin2Line, RiAddFill } from "@remixicon/react"
import { Link } from "react-router-dom"
import { Modal, ModalContent } from "@/components/Modal"
import { useCallback, useRef, useState } from "react"
import RegisterAdminForm from "@/components/forms/RegisterAdminForm"
import { Button, Table, Loading, Input  } from "react-daisyui"
import { deleteUserByID } from "@/services/users"
import useAlert from "@/hooks/useAlert"
import useAuth from "@/hooks/useAuth"
import useSearch from "@/hooks/useSearch"


const Admins = () => {
   const { inputRef, handleKeyword, keyword } = useSearch()
   const [deleting, setDeleting] = useState(null) // id of deleting user
   const { showAlert } = useAlert()
   const { auth } = useAuth()
   const modal = useRef(null)

   const openModal = useCallback(() => {
      if(modal.current){
         modal.current.showModal()
      }
   }, [modal])

   const { data: admins , error, isLoading, refetch } = useGetData("/admins")

   const handleDelete = useCallback((id, username) => {
      if(confirm(`Delete ${username}?`)){
         (async () => {
            setDeleting(id)
            try {
               const res = await deleteUserByID(id)
               
               if (res.status !== 200){
                  throw new Error("An error is occured")
               }
               
               refetch()
               showAlert("success", `${username} deleted succesfuly!`, 3500)
            } catch (error) {
               showAlert("error", error.response.data.message || "An error is occured", 3500)
               console.error(error)
            }finally{
               setDeleting(null)
            }
         })()
      }
   }, [])


   if (error) return <Error refetch={refetch} error={error}/>
   return (
   <>   
         <h1 className='text-xl my-5 font-bold capitalize'>List of all admins ({admins.length})</h1>
         
         <div className="flex items-center justify-between gap-3 mb-5" >
            <Button 
               color="secondary"
               onClick={openModal}
               type="button" className="capitalize w-fit btn-sm flex items-center gap-3">
               <RiAddFill />
               <span className="hidden sm:block">Register new admin</span>
            </Button>

            <Input 
               type="search"
               ref={inputRef}
               onChange={handleKeyword}
               defaultValue={keyword}
               placeholder="Searh admin.."
               />
         </div>

         <div className="overflow-x-auto">
            <Table className="table table-zebra">
               {/* head */}
               <Table.Head className='bg-primary text-primary-content text-center text-base' >
                  <span>No</span>
                  <span>Username</span>
                  <span>Email</span>
                  <span>Action</span>
               </Table.Head>
               <Table.Body className='text-center text-base'>
                  {isLoading && <tr><td colSpan={4}> <Loading variant="dots"/>  </td></tr> }
                  {(admins.length == 0 && !isLoading) 
                  ? <tr><td colSpan={4}>There is no data to display</td></tr>
                  :admins.filter(item => (
                     item.username.toLowerCase().includes(keyword) ||
                     item.email.toLowerCase().includes(keyword)
                  )).map((admin, i) => (
                     <Table.Row key={admin.id}>
                        <span>{i + 1}</span>
                        <span>
                           <Link to={`/users/${admin.id}/profile`} className="link">
                              {admin.username}
                           </Link>
                        </span>
                        <span>{admin.email}</span>
                        <span>
                           <Button 
                              disabled={auth?.id == admin.id}
                              onClick={() => {
                                 handleDelete(admin.id, admin.username)
                              }}
                              color="error"
                              variant="outline"
                              type="button" 
                              data-tip={`Delete ${admin.username}`}  className="lg:tooltip">
                              {deleting != admin.id ? <RiDeleteBin2Line /> : <Loading variant="spinner" /> }
                           </Button>
                        </span>
                     </Table.Row>
                  ))}
               </Table.Body>
            </Table>
         </div>

      <Modal ref={modal}>
         <ModalContent>
            <RegisterAdminForm refetch={refetch} />
         </ModalContent>
      </Modal>
   </>
   )
}

export default Admins