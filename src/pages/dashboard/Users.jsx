import useGetData from "@/hooks/useGetData"
import { RiDeleteBin2Line } from "@remixicon/react"
import { Error } from "@/components/Error"
import { Link } from "react-router-dom"
import useAlert from "@/hooks/useAlert"
import { deleteUserByID } from "@/services/users"
import { useState } from "react"
import { Button, Input } from "react-daisyui"
import useSearch from "@/hooks/useSearch"

const Users = () => {
   const { showAlert } = useAlert()
   const [dltLoad, setDltLoad] = useState(null) // store a user id that will be deleted
   const { inputRef, handleKeyword, keyword } = useSearch()

   const { data : users, error, isLoading, refetch } = useGetData("/users")

   const handleDelete = (id, username) => {
      if(confirm(`Delete ${username}?`)){
         (async() => {  
            setDltLoad(id)
            try{
               const res = await deleteUserByID(id)
               if(res.status != 200){
                  throw new Error("An error is occured")
               }

               showAlert("success", `User '${username}' deleted succesfully!`, 5000)
               refetch()
            }catch(error){
               showAlert("error",error.response.data.message || "An error is occured", 5000)
               console.error(error)
            }finally{
               setDltLoad(null)
            }
         })()
      }
   }

   if (error) return <Error refetch={refetch} error={error}/>
   return (
      <>

         <div className="flex my-5 items-center justify-between gap-2">
            <h1 className='text-xl font-bold capitalize'>List of all users ({users.length})</h1>
            <Input 
               ref={inputRef}
               onChange={handleKeyword}
               type="search"
               placeholder="Search user..."
               defaultValue={keyword}
               />
         </div>

         <div className="overflow-x-auto">
            <table className="table table-zebra-zebra">
               {/* head */}
               <thead className='bg-primary text-primary-content text-center text-base' >
                  <tr>
                     <th>No</th>
                     <th>Username</th>
                     <th>Email</th>
                     <th>Action</th>
                  </tr>
               </thead>
               <tbody className='text-center text-base'>
                  {isLoading && <tr><td colSpan={4}><span className="loading loading-dots loading-md"></span></td></tr>}
                  {(users.length == 0 && !isLoading) 
                  ? <tr><td colSpan={4}>There is no data to display</td></tr> 
                  :users.filter(item => (
                     item.username.toLowerCase().includes(keyword) ||
                     item.email.toLowerCase().includes(keyword)
                  )).map((user, i) => (
                     <tr key={user.id}>
                        <td>{i + 1}</td>
                        <td>
                           <Link to={`/users/${user.id}/profile`} className="link">
                              {user.username}
                           </Link>
                        </td>
                        <td>{user.email}</td>
                        <td>
                           <button
                              onClick={() => handleDelete(user.id, user.username)}
                              type="button" 
                              data-tip={`Delete ${user.username}`}  className="btn lg:tooltip btn-error bg-error/10 btn-outline">
                              {dltLoad === user.id 
                              ? <div className="loading loading-spinner"></div>
                              : <RiDeleteBin2Line />
                              }
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </>
   )
}

export default Users