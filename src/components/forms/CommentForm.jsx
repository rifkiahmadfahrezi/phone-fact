import React from 'react'
import { Textarea, Button } from 'react-daisyui'
import Label from '../elements/Label'
import { useFormik } from 'formik'
import { createComment, updateComment } from '@/services/comments'
import useAlert from '@/hooks/useAlert'
import { cn } from '@/utils/styling'
import useAuth from '@/hooks/useAuth'
import { Link } from 'react-router-dom'


const CommentForm = ({ review_id, refetch, commentData = null, commentID = null, className, ...props}) => {
   const { auth } = useAuth()
   const { showAlert } = useAlert()
   const formik = useFormik({
      initialValues: (!commentData || !commentID) ? { content: ''} : commentData,
      validate: values => {
         const errors  = {}

         if(!values.content){
            errors.content = "Comment content is required"
         }
         return errors
      },
      onSubmit: (values, { setSubmitting }) => {
         if(!commentData){
            (async() => {
               try {
                  const rating = Number(values.rating)
                  const res = await createComment({ ...values, rating}, review_id)
                  if(res.status !== 200) {
                     throw new Error("An error is occured")
                  }
                  showAlert("success", "Your comment published succesfuly!", 3500)
                  refetch()
               } catch (error) {
                  showAlert("error", error.response.data.message || "An error is occured", 3500) 
                  console.error(error)
               }finally{
                  setSubmitting(false)
               }
            })()
         }else{
            (async() => {
               try {
                  const rating = Number(values.rating)
                  const res = await updateComment({ ...values, rating}, commentID)
                  if(res.status !== 200) {
                     throw new Error("An error is occured")
                  }
                  showAlert("success", "Your comment updated succesfuly!", 3500)
                  refetch()
               } catch (error) {
                  showAlert("error", error.response?.data.message || "An error is occured", 3500) 
                  console.error(error)
               }finally{
                  setSubmitting(false)
               }
            })()
         }

      } 
   })

  return (
    <form onSubmit={formik.handleSubmit} className={cn(`flex flex-col gap-3 ${className}`)} {...props}>
      <div className="">
         <Label htmlFor="content" className={"label-text text-base"}>
            Comments
         </Label>
         <Textarea
            className='w-full'
            title={!auth?.token ? "You have to login to comment" : null}
            disabled={!auth?.token}
            autoFocus
            placeholder='Write your comment here...'
            id='content'
            name='content'
            value={formik.values.content}
            onChange={formik.handleChange}
            ></Textarea>
            {formik.errors.content && 
               <span className='text-base text-error my-3'>{formik.errors.content}</span> 
            }
      </div>
      <div className="flex gap-2 items-center justify-between">
         <div className="space-x-3">
            <Button
               onClick={formik.resetForm}
               type='reset'
               disabled={!auth?.token}
               color='error'>
               Clear
            </Button>
            {!auth?.token &&
               <Link 
                  to={"/login"}
                  className="btn btn-secondary">
                  Login
               </Link>
            }
         </div>
         <Button
            type='submit'
            disabled={!auth?.token}
            color='primary'>
            Submit
         </Button>
      </div>
    </form>
  )
}

export default CommentForm