import useGetData from "@/hooks/useGetData"
import { RiDeleteBin2Line, RiPencilLine,RiAddFill } from "@remixicon/react"
import { Error } from "@/components/Error"
import { Link } from "react-router-dom"
import { convertDateOnly } from "@/utils/helper"
import { useCallback } from "react"
import { deletePhone } from "@/services/phones"
import useAlert from "@/hooks/useAlert"
import { Input } from "react-daisyui"
import useSearch from "@/hooks/useSearch"
import Image from "@/components/elements/Image"

const Phones = () => {
   const { showAlert } = useAlert()
   const { inputRef, keyword, handleKeyword } = useSearch()
   const { data : phones, error, isLoading, refetch } = useGetData("/phones")

   const handleDelete = useCallback((id, model) => {
      if(confirm(`Delete ${model}`)){
         (async() => {
            try {
               const res = await deletePhone(id)
               if (res.status !== 200){
                  throw new Error("An error is occured")
               }
               
               showAlert("success", `Phone ${model} deleted succesfuly`, 3500)
               refetch()
            } catch (error) {
               showAlert("error", error.response.data.message || "An error is occured", 3500)
               console.error(error)
            }

         })()
      }
   }, [])

   if (error) return <Error refetch={refetch} error={error}/>
   return (
   <>
      <h1 className='text-xl my-5 font-bold capitalize'>List of all phones ({phones.length})</h1>

      <div className="flex items-center justify-between gap-2 w-full">
         <Link to={`/dashboard/phones/create`}  className="btn btn-secondary btn-sm w-fit my-5">
            <RiAddFill />
            <span className="hidden sm:block capitalize">add new phone</span>
         </Link>

         <Input 
            defaultValue={keyword}
            ref={inputRef}
            onChange={handleKeyword}
            type="search"
            placeholder="Search phone..." />
      </div>

      <div className="overflow-x-auto">
         <table className="table table-zebra-zebra">
            {/* head */}
            <thead className='bg-primary text-primary-content text-center text-base' >
               <tr>
                  <th>No</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Full Name</th>
                  <th>Avg Rating</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Release Date</th>
                  <th>Action</th>
               </tr>
            </thead>
            <tbody className='text-center text-base'>
               {isLoading && <tr><td colSpan={9}><span className="loading loading-dots loading-md"></span></td></tr>}
               {(phones.length == 0 && !isLoading) 
               ? <tr><td colSpan={3}>There is no data to display</td></tr> 
               :phones.filter((item) => {
                  return item.full_name.toLowerCase().includes(keyword)
               }).map((phone, i) => (
                  <tr key={phone.phone_id}>
                     <td>{i + 1}</td>
                     <td>
                        <Link className="link" to={`/brands/${phone.brand_id}`}>
                           {phone.brand_name}
                        </Link>
                     </td>
                     <td>
                        <Link className="link" to={`/phones/${phone.phone_id}/reviews`}>
                           {phone.phone_model}
                        </Link>
                     </td>
                     <td>{phone.full_name}</td>
                     <td>{phone.avg_rating || 'N/A'}</td>
                     <td>
                        <Image 
                           className="aspect-square w-[75px] object-contain"
                           src={phone.phone_image}  
                           loading="lazy" 
                           alt={`image of ${phone.full_name}`} />
                     </td>
                     <td>{phone.price}</td>
                     <td>{convertDateOnly(phone.release_date)}</td>
                     <td className="flex items-center gap-2">
                        <Link 
                           to={`/dashboard/phones/update/${phone.phone_id}`} 
                           data-tip={`Update ${phone.phone_model}`}  className="btn lg:tooltip btn-success bg-success/10 btn-outline" style={{ display: "flex"}}>
                           <RiPencilLine />
                        </Link>
                        <button 
                           onClick={() => handleDelete(phone.phone_id, phone.full_name)}
                           type="button" 
                           data-tip={`Delete ${phone.phone_model}`}  className="btn lg:tooltip btn-error bg-error/10 btn-outline">
                           <RiDeleteBin2Line />
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

export default Phones