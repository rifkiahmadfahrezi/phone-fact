import React, { useCallback, useRef, useState } from 'react'
import { RiChat1Line,
         RiStarFill,
         RiCloseLine,
         RiStarLine,
         RiPencilLine,
         RiMore2Fill,
         RiDeleteBin2Line
} from '@remixicon/react'
import { Link } from 'react-router-dom'
import { Button, Card, Dropdown } from 'react-daisyui'
import { timeAgo } from '@/utils/helper'
import { deleteReview } from '@/services/reviews'
import useAlert from '@/hooks/useAlert'
import { Modal, ModalContent } from './Modal'
import ReviewForm from './forms/ReviewForm'
import { useLocation } from 'react-router-dom'
import CommentForm from './forms/CommentForm'
import useAuth from '@/hooks/useAuth'

const ReviewCard = ({ reviewData , refetch}) => {
   const { auth } = useAuth()
   const [showInput, setShowInput] = useState(false)
   const { showAlert } = useAlert()
   const updateModalRef = useRef(null)
   const { pathname : currentPath } = useLocation()
   
   const handleDelete = useCallback(() => {
      if(confirm("Delete my review?")){
         (async () => {
            try {
               const res = await deleteReview(reviewData.id)
               if (res.status !== 200){
                  throw new Error("An error is occured")
               }
               showAlert("success", "Your review deleted!", 3500)
               refetch()
            } catch (error) {
               showAlert("error", error.response.data.message || "An error is occured!", 3500)
               console.error(error)
            }
         })()
      }
   }, [])

   const showUpdateModal = useCallback(() => {
      if(updateModalRef.current){
         updateModalRef.current.showModal()
      }
   }, [])

  return (
      <>
         <article className="card card-body bg-base-200 my-5 relative">
            
            <div className="absolute right-5 top-5 flex items-center gap-3">
            <span data-tip={new Date(reviewData.updated_at).toLocaleString()} className='lg:tooltip'>
               last updated {timeAgo(reviewData.updated_at)}
            </span>
            {(auth?.token && auth?.id == reviewData.user_id) &&
               <Dropdown className='dropdown-end rounded-full'>
                  <Dropdown.Toggle>
                     <RiMore2Fill />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-52">
                     <Dropdown.Item className='hover:bg-success/30' >
                        <button className='flex items-center justify-between gap-3' 
                           onClick={showUpdateModal}>
                           <RiPencilLine className='size-5' /> 
                           <span className='text-base capitalize ml-3'>Edit review</span>
                        </button>
                     </Dropdown.Item>
                     <Dropdown.Item className='hover:bg-error/30'>
                        <button className='flex items-center justify-between gap-3' 
                           onClick={handleDelete}>
                           <RiDeleteBin2Line className='size-5' /> 
                           <span className='text-base capitalize ml-3'>Delete review</span>
                        </button>
                     </Dropdown.Item>
                  </Dropdown.Menu>
               </Dropdown>
               }
            </div>

            <div className="">
               <section className='mb-7 flex justify-start flex-col items-start gap-3'>
                  <Link
                     to={`/users/${reviewData.user_id}/profile`}
                     className='link font-bold text-lg'>{reviewData.username}</Link>
                  
                  <span className='flex items-center gap-1 justify-center'>
                     {Array(Number(reviewData.rating)).fill(0).map((_, i) => (
                        <RiStarFill className='text-yellow-400 hover:-translate-y-1 transition duration-100' key={i}/>
                     ))}
                     {Array(5 - Number(reviewData.rating)).fill(0).map((_, i) => (
                        <RiStarLine className='text-yellow-400 hover:-translate-y-1 transition duration-100' key={i}/>
                     ))}
                     <span className="sr-only">{reviewData.rating} stars</span>
                  </span>
               </section>

               <div className="">
                  {reviewData.content}
               </div>

               <div className="mt-6 flex justify-end gap-3 items-center">
                  {!currentPath.startsWith("/reviews") &&
                     <Link className='btn capitalize' to={`/reviews/${reviewData.id}/comments`}>
                        view comments
                     </Link>
                  }
                  {!currentPath.startsWith("/reviews") &&
                  <Button 
                     color={showInput ? "error" : "neutral"}
                     onClick={() => setShowInput(!showInput)} 
                     type='button' className='capitalize lg:tooltip' 
                     data-tip={showInput ? "Cancel" : "Write comments on this reviews.."}>
                        {showInput 
                        ? <RiCloseLine />
                        : <RiChat1Line />
                        }
                  </Button>
                  }
               </div>
            </div>
         </article>

         {(showInput && !currentPath.startsWith("/reviews")) &&
            <Card>
               <Card.Body>
                  <CommentForm refetch={refetch} review_id={reviewData.id}/>
               </Card.Body>
            </Card>
         }

         {/* modal update review */}
         <Modal ref={updateModalRef}>
            <ModalContent>
               <h1 className='text-xl font-bold'>Update review</h1>
               <ReviewForm reviewData={reviewData} refetch={refetch} reviewID={reviewData.id} /> 
            </ModalContent>
         </Modal>
      </>
  )
}

export default ReviewCard