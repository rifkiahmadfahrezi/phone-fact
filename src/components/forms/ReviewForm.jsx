import React from 'react'
import { Textarea, Button, Rating } from 'react-daisyui'
import Label from '../elements/Label'
import { useFormik } from 'formik'
import { createReview, updateReview } from '@/services/reviews'
import useAlert from '@/hooks/useAlert'

const ReviewForm = ({ phone_id, refetch, reviewData = null, reviewID = null}) => {
   const { showAlert } = useAlert()
   const formik = useFormik({
      initialValues: (!reviewData || !reviewID) ? { rating: '5', content: ''} : reviewData,
      validate: values => {
         const errors  = {}

         if(!values.content){
            errors.content = "Review content is required"
         }
         if(!values.rating){
            errors.rating = "Rating is required"
         }else if(values.rating > 5){
            errors.rating = "Review rating max is 5"
         }else if(values.rating < 1){
            errors.rating = "Review rating min is 1"
         }

         return errors
      },
      onSubmit: (values, { setSubmitting }) => {
         if(!reviewData){
            (async() => {
               try {
                  const rating = Number(values.rating)
                  const res = await createReview({ ...values, rating}, phone_id)
                  if(res.status !== 200) {
                     throw new Error("An error is occured")
                  }
                  showAlert("success", "Your review published succesfuly!", 3500)
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
                  const res = await updateReview({ ...values, rating}, reviewID)
                  if(res.status !== 200) {
                     throw new Error("An error is occured")
                  }
                  showAlert("success", "Your review updated succesfuly!", 3500)
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
    <form onSubmit={formik.handleSubmit} className='flex flex-col gap-3'>
      <div className="">
         <Label htmlFor="rating" className={"label-text text-base"}>
            Rating
         </Label>
            <div className="rating space-x-1" > 
            {Array(5).fill(0).map((_, i) => (
               <input 
                  key={i}
                  value={Number(i+1)}
                  type="radio"
                  defaultChecked={!reviewData?.rating 
                     ? false
                     : (i+1) == reviewData?.rating 
                  }
                  onChange={formik.handleChange}
                  name="rating"
                  className="mask mask-star-2 size-10 bg-yellow-400" />
            ))}
            </div>

         </div>
         {formik.errors.rating && 
            <span className='text-base text-error mb-3'>{formik.errors.rating}</span> 
         }
      <div className="">
         <Label htmlFor="content" className={"label-text text-base"}>
            Content
         </Label>
         <Textarea
            className='w-full'
            rows={7}
            autoFocus
            placeholder='Write your review here...'
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
         <Button
            onClick={formik.resetForm}
            type='reset'
            color='error'>
            Clear
         </Button>
         <Button
            type='submit'
            color='primary'>
            Submit
         </Button>
      </div>
    </form>
  )
}

export default ReviewForm