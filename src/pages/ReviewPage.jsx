import ReviewCard from "@/components/ReviewCard"
import useGetData from "@/hooks/useGetData"
import useAlert from "@/hooks/useAlert"
import { useParams } from "react-router-dom"
import { Error } from "@/components/Error"
import { CardSkeleton } from "@/components/Skeletons"
import { Card, Accordion } from "react-daisyui"
import CommentCard from "@/components/CommentCard"
import CommentForm from "@/components/forms/CommentForm"

const ReviewPage = () => {
   const { id } = useParams()
   const { data: review, isLoading, error, refetch } = useGetData(`/reviews/${id}/comments`)
    // console.log(review)
   if ( isLoading ) return <CardSkeleton className={`h-[550px]`} />
   if ( review.length === 0 && !isLoading ) return <Error message={"Review data Not Found"} />
   if ( error ) return <Error message={error} refetch={refetch}/>
  return (
    <>
      <ReviewCard reviewData={review[0]} refetch={refetch}/>

      <h1 className="text-2xl my-5">Comments</h1>

      {(!review[0]?.comments || review[0]?.comments?.length == 0 ) ? 
        <>
        <Card>
          <Card.Body>
            <span className="text-center">
              There is no comment on this review yet
            </span>
          </Card.Body>
        </Card>
        <div className="flex flex-col gap-3 my-5">
          <div tabIndex={0}  className="collapse collapse-arrow card" >
              <input type="checkbox" />
              <div className="collapse-title">Write Comments</div>
              <div className="collapse-content">
                <CommentForm review_id={review[0].id} refetch={refetch} />
              </div>
          </div>
        </div>
        </>
        : <>
            <div className="flex flex-col gap-3 my-5">
              <div tabIndex={0}  className="collapse collapse-arrow card" >
                  <input type="checkbox" />
                  <div className="collapse-title">Write Comments</div>
                  <div className="collapse-content">
                    <CommentForm review_id={review[0].id} refetch={refetch} />
                  </div>
              </div>
            </div>
            {review[0].comments.map(item => (
              <CommentCard 
                className={`w-full md:w-3/4 ml-auto`}
                key={item.id}
                commentData={item} 
                refetch={refetch} />
            ))}
          </>
        }

    </>
  )
}

export default ReviewPage