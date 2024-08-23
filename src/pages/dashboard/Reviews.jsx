import useGetData from "@/hooks/useGetData"
import { RiDeleteBin2Line, RiEyeLine } from "@remixicon/react"
import { Error } from "@/components/Error"
import { Link } from "react-router-dom"
import useSearch from "@/hooks/useSearch"
import { Input } from "react-daisyui"
import { useCallback } from "react"
import { deleteReview } from "@/services/reviews"
import useAlert from "@/hooks/useAlert"

const Reviews = () => {
   const { keyword, handleKeyword, inputRef } = useSearch()
   const { data : reviews, error, isLoading, refetch } = useGetData("/reviews")
   const { showAlert } = useAlert()

   const handleDelete = useCallback((id) => {
      if(confirm("delete this review")){
         (async() => {
            try {
               const res = await deleteReview(id)
               if(res.status!=200){
                  throw new Error("An error is occured")
               }
               refetch()
               showAlert("success", "Review deleted!", 3500)
            } catch (error) {
               showAlert("error", error.response?.data.message || "an error is occured", 3500)
               console.error(error)
            }
         })()
      }
   }, [])

   if (error) return <Error refetch={refetch} error={error}/>
   return (
   <>
      <div className="flex my-5 items-center justify-between gap-2">
         <h1 className='text-xl font-bold capitalize'>List of all reviews ({reviews.length})</h1>
         <Input 
            ref={inputRef}
            onChange={handleKeyword}
            type="search"
            placeholder="Search user..."
            defaultValue={keyword}
            />
      </div>

      <div className="overflow-x-auto">
         <table className="table table-zebra">
            {/* head */}
            <thead className='bg-primary text-primary-content text-center text-base' >
               <tr>
                  <th>No</th>
                  <th>Phone model</th>
                  <th>Rating</th>
                  <th>Review Content</th>
                  <th>Username</th>
                  <th>Action</th>
               </tr>
            </thead>
            <tbody className='text-center text-base'>
               {isLoading && <tr><td colSpan={9}><span className="loading loading-dots loading-md"></span></td></tr>}
               {(reviews.length == 0 && !isLoading) 
               ? <tr><td colSpan={3}>There is no data to display</td></tr> 
               : reviews.filter(item => (
                  item.phone_model.toLowerCase().includes(keyword) ||
                  item.username.toLowerCase().includes(keyword) ||
                  item.content.toLowerCase().includes(keyword) ||
                  item.rating.toString().includes(keyword)
               )).map((review, i) => (
                  <tr key={review.id}>
                     <td>{i + 1}</td>
                     <td>{review.phone_model}</td>
                     <td>{review.rating}</td>
                     <td><span className="line-clamp-1 hover:line-clamp-none">{review.content}</span></td>
                     <td>{review.username}</td>
                     <td className="flex items-center gap-2">
                        <Link to={`/reviews/${review.id}/comments`} data-tip={`View this review`}  className="btn lg:tooltip btn-warning bg-warning/10 btn-outline" style={{display: "flex"}}>
                           <RiEyeLine />
                        </Link>
                        <button 
                           onClick={() => handleDelete(review.id)}
                           type="button" 
                           data-tip={`Delete this review`}  className="btn lg:tooltip btn-error bg-error/10 btn-outline">
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

export default Reviews