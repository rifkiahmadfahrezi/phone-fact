import useGetData from "@/hooks/useGetData"
import { RiDeleteBin2Line, RiEyeLine } from "@remixicon/react"
import { Error } from "@/components/Error"
import { Link } from "react-router-dom"
import useSearch from "@/hooks/useSearch"
import { Input } from "react-daisyui"
import { useCallback } from "react"
import { deleteCommentAdmin } from "@/services/comments"
import useAlert from "@/hooks/useAlert"

const Comments = () => {
   const { keyword, handleKeyword, inputRef } = useSearch()
   const { data : comments, error, isLoading, refetch } = useGetData("/comments")
   const { showAlert } = useAlert()
   console.log(comments)
   const handleDelete = useCallback((id) => {
      if(confirm("delete this review")){
         (async() => {
            try {
               const res = await deleteCommentAdmin(id)
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
         <h1 className='text-xl font-bold capitalize'>List of all comments ({comments.length})</h1>
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
                  <th>Content</th>
                  <th>Username</th>
                  <th>Action</th>
               </tr>
            </thead>
            <tbody className='text-center text-base'>
               {isLoading && <tr><td colSpan={9}><span className="loading loading-dots loading-md"></span></td></tr>}
               {(comments.length == 0 && !isLoading) 
               ? <tr><td colSpan={3}>There is no data to display</td></tr> 
               : comments.filter(item => (
                  item.content.toLowerCase().includes(keyword) ||
                  item.user.username.toLowerCase().includes(keyword)
               )).map((comment, i) => (
                  <tr key={comment.id}>
                     <td>{i + 1}</td>
                     <td className="line-clamp-1">{comment.content}</td>
                     <td>{comment.user.username}</td>
                     <td className="flex items-center gap-2 justify-center">
                        <Link to={`/reviews/${comment.review_id}/comments`} data-tip={`View this comment`}  className="btn lg:tooltip btn-warning bg-warning/10 btn-outline" style={{display: "flex"}}>
                           <RiEyeLine />
                        </Link>
                        <button 
                           onClick={() => handleDelete(comment.id)}
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

export default Comments