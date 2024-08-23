import React, { useCallback, useRef } from 'react'
import {
         RiPencilLine,
         RiMore2Fill,
         RiDeleteBin2Line
} from '@remixicon/react'
import useAuth from '@/hooks/useAuth'
import { Dropdown } from 'react-daisyui'
import { timeAgo } from '@/utils/helper'
import { deleteComment } from '@/services/comments'
import useAlert from '@/hooks/useAlert'
import { Modal, ModalContent } from './Modal'
import { cn } from '@/utils/styling'
import CommentForm from './forms/CommentForm'
import { Link } from 'react-router-dom'

const CommentCard = ({ commentData , refetch, className, ...props}) => {
   const { auth } = useAuth()
   const { showAlert } = useAlert()
   const updateModalRef = useRef(null)
   
   const handleDelete = useCallback(() => {
      if(confirm("Delete my comment?")){
         (async () => {
            try {
               const res = await deleteComment(commentData.id)
               if (res.status !== 200){
                  throw new Error("An error is occured")
               }
               showAlert("success", "Your comment deleted!", 3500)
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
         <article className={cn(`card card-body bg-base-200 my-5 relative ${className}`)} {...props}>
            
            <div className="absolute right-5 top-5 flex items-center gap-3">
            <span data-tip={new Date(commentData.updated_at).toLocaleString()} className='lg:tooltip'>
               last updated {timeAgo(commentData.updated_at)}
            </span>
            {(auth?.token && auth?.id == commentData.user_id) &&
               <Dropdown className='dropdown-end rounded-full'>
                  <Dropdown.Toggle>
                     <RiMore2Fill />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-52">
                     <Dropdown.Item className='hover:bg-success/30' >
                        <button className='flex items-center justify-between gap-3' 
                           onClick={showUpdateModal}>
                           <RiPencilLine className='size-5' /> 
                           <span className='text-base capitalize ml-3'>Edit</span>
                        </button>
                     </Dropdown.Item>
                     <Dropdown.Item className='hover:bg-error/30'>
                        <button className='flex items-center justify-between gap-3' 
                           onClick={handleDelete}>
                           <RiDeleteBin2Line className='size-5' /> 
                           <span className='text-base capitalize ml-3'>Delete</span>
                        </button>
                     </Dropdown.Item>
                  </Dropdown.Menu>
               </Dropdown>
               }
            </div>
            <section className='mb-7 flex justify-start flex-col items-start gap-3'>
                  <Link
                     to={`/users/${commentData.user_id}/profile`}
                     className='link font-bold text-lg'>{commentData.username}</Link>
               </section>
            <div className="">
               {commentData.content}
            </div>
         </article>

         {/* modal update comment */}
         <Modal ref={updateModalRef}>
            <ModalContent>
               <h1 className='text-xl font-bold'>Update comment</h1>
               <CommentForm commentData={commentData} refetch={refetch} commentID={commentData.id} /> 
            </ModalContent>
         </Modal>
      </>
  )
}

export default CommentCard