import { Error } from "@/components/Error"
import useGetData from "@/hooks/useGetData"
import { useParams } from "react-router-dom"
import { Card, Button } from "react-daisyui"
import { CardSkeleton } from "@/components/Skeletons"
import ReviewCard from "@/components/ReviewCard"
import Image from "@/components/elements/Image"
import { RiAddFill } from "@remixicon/react"
import useAuth from "@/hooks/useAuth"
import { Modal, ModalContent } from "@/components/Modal"
import { useCallback, useRef } from "react"
import ReviewForm from "@/components/forms/ReviewForm"
import { Link } from "react-router-dom"


const PhoneReviewsPage = () => {
   const { id } = useParams()
   const { data: phoneInfo, error, isLoading, refetch } = useGetData(`/phones/${id}/specification`)

   
   if(phoneInfo.length == 0 && !isLoading) return <Error message={"Phone data is not exist"}/>
   if  (error) return <Error message={error} refetch={refetch}/>
   if (isLoading) return (
      <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-h-[400px]">
            {Array(2).fill(0).map((_,i) => (
               <CardSkeleton key={i} className={"h-[400px]"} />
            ))}
          </div>
      </>
   )

  return (
   <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
         {/*Phone image  */}
         <figure className="card card-body grid place-items-center">
            <Image 
               className="aspect-square w-full object-contain"
               src={phoneInfo.image_url} 
               alt="" />
         </figure>
         <Card className="group">
            <Card.Body>
               <article className="mb-3">
                  <h1 className="text-2xl font-bold">Brand</h1>
                  <Link 
                     to={`/brands/${phoneInfo.brand_id}`} 
                     className="flex justify-start items-center mt-3 gap-3 group-hover:link">
                     <img 
                        className="aspect-square object-contain w-[50px]"
                        src={phoneInfo.brand_logo} 
                        alt={`logo ${phoneInfo.brand_name}`} />
                     <span className="text-base">{phoneInfo.brand_name}</span>
                  </Link>
               </article>
               <article className="mb-3">
                  <h1 className="text-2xl font-bold">Model</h1>
                  <p className="capitalize text-lg">{phoneInfo.model}</p>
               </article>
               <article className="mb-2">
                  <h1 className="text-2xl font-bold">Specification</h1>

                  <div className="my-3">
                     {phoneInfo?.specification?.map((item, i) => (
                        <div className="flex flex-col gap-3" key={i}>
                           <span>
                              <span className="text-lg font-semibold">Network :</span>  {item.network}
                           </span>
                           <span>
                              <span className="text-lg font-semibold">Memory :</span>  {item.memory} GB
                           </span>
                           <span>
                              <span className="text-lg font-semibold">Battery :</span>  {item.battery} mAh
                           </span>
                           <span>
                              <span className="text-lg font-semibold">Camera :</span>  {item.camera} MP
                           </span>
                           <span>
                              <span className="text-lg font-semibold">Storage :</span>  {item.storage} GB
                           </span>
                           <span>
                              <span className="text-lg font-semibold">Operating System :</span>  {item.operating_system}
                           </span>
                           <span>
                              <span className="text-lg font-semibold">Additional Feature :</span>  {item.additional_feature}
                           </span>

                        </div>
                     ))}
                  </div>
               </article>
                     
               <a className="btn btn-neutral" href={"#reviews"}>
                  View Reviews
               </a>
            </Card.Body>
         </Card>
      </div> 
      
      <Reviews phone_id={id} phoneInfo={phoneInfo} />

   </>
  )
}

export const Reviews = ({ phone_id, phoneInfo }) => {
   const { auth } = useAuth()
   const { id } = useParams()
   const { data: reviews, isLoading, error, refetch} = useGetData(`/phones/${id}/reviews`)

   const reviewModalRef = useRef(null)
   const showModal = useCallback(() => {
      if(reviewModalRef.current){
         reviewModalRef.current.showModal()
      }
   },[])


   if(isLoading) return <CardSkeleton className={`h-40 w-full`}/>
   if (error) return <Error message={error} refetch={refetch}/>
   if(!isLoading && reviews.length === 0) {
      return (
         <> 
            <section id="reviews" className="mt-7">
               <div className="flex items-center  mb-4 justify-between">
                 <div className="flex flex-col">
                      <h1 className="text-2xl font-bold">Reviews</h1>
                      <small>One user can only give rating once</small>
                 </div>
                  <Button 
                     onClick={() => auth?.token && showModal()}
                     className={!auth?.token && "cursor-not-allowed"}
                     disabled={!auth?.token} 
                     color="primary">
                     <RiAddFill />
                     <span className="hidden sm:block">Write some review</span>
                  </Button>
               </div>
               {/* Reviews section */}
               <Error message={"This phone doesnt have a review yet"}/>
            </section>
            
            <Modal ref={reviewModalRef}>
               <ModalContent>
                  <h1 className="text-xl font-bold mb-4">Write review for "{phoneInfo.model}"</h1>
                  <ReviewForm phone_id={phone_id} refetch={refetch} />
               </ModalContent>
            </Modal>
         </>
      )
   }
   return (
      <>
         <section id="reviews" className="mt-7">
            <div className="flex items-center  mb-4 justify-between">
               <div className="flex flex-col">
                     <h1 className="text-2xl font-bold">Reviews</h1>
                     <small>One user can only give rating once</small>
               </div>
               <Button 
                  onClick={() => auth?.token && showModal()}
                  className={!auth?.token && "cursor-not-allowed"}
                  disabled={!auth?.token || reviews[0].user_id == auth?.id} 
                  color="primary">
                  <RiAddFill />
                  <span className="hidden sm:block">Write some review</span>
               </Button>
            </div>
            {/* Reviews section */}
            {reviews?.map((review) => (
               <ReviewCard 
                  key={review.id}
                  refetch={refetch}
                  reviewData={review}/>
            ))}
         </section>
         
         <Modal ref={reviewModalRef}>
            <ModalContent>
               <h1 className="text-xl font-bold mb-4">Write review for "{phoneInfo.model}"</h1>

               <ReviewForm phone_id={phone_id} refetch={refetch} />
            </ModalContent>
         </Modal>
        
      </>
   )
}

export default PhoneReviewsPage