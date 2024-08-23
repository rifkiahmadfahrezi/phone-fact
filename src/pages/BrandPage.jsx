import { useParams } from "react-router-dom"
import { Card } from "react-daisyui"
import { Link } from "react-router-dom"
import useGetData from "@/hooks/useGetData"
import useAuth from "@/hooks/useAuth"
import Image from "@/components/elements/Image"
import { RiPencilLine } from "@remixicon/react"
import { Error } from "@/components/Error"
import { CardSkeleton } from "@/components/Skeletons"
import GridLayout from "@/layouts/GridLayout"

const BrandPage = () => {
   const { id } = useParams()
   const { auth } = useAuth()
   const { data: brand, isLoading, error, refetch} = useGetData(`/brands/${id}`)
   

   if(isLoading) return <CardSkeleton className={`h-[200px]`}/>
   if(!isLoading && error) return <Error message={error} refetch={refetch}/>

  return (
    <>
      <Card>
         <Card.Body className="relative">
            <div className="flex gap-5 flex-col">
               <div className="flex gap-10 items-center">
                  <Image className={"w-20"} src={brand[0]?.logo_url} />
                  <Card.Title tag={"h1"}>{brand[0]?.name}</Card.Title>
               </div>
               <article>
                  <h2 className="text-xl font-semibold my-5">About {brand[0]?.name}</h2>

                  <div className="">
                     {brand[0]?.description || "-"}
                  </div>
               </article>

            </div>

            {auth?.role === "admin" &&
               <div className="absolute right-5 top-5">
                  <Link 
                     target="_blank"
                     className="btn btn-sm btn-secondary"
                     to={`/dashboard/brands?keyword=${brand[0]?.name.toLowerCase()}`}>
                     <RiPencilLine />
                  </Link>
               </div>
            }
         </Card.Body>
      </Card>

      <section id="phones" className="my-5">
         <h1 className="text-2xl mb-5 font-bold">Phones</h1>

         <BrandPhone />
      </section>
    </>
  )
}

export const BrandPhone = () => {
   const { id } = useParams()
   const { data: brand, isLoading, error, refetch} = useGetData(`/brands/${id}/phones`)
   if (isLoading) return <CardSkeleton className={`h-36`} />
   if (!isLoading && error) return <Error message={error} refetch={refetch} />
   if (!brand[0]?.phones && !isLoading) return <Error message={"This brand does'nt have any phone data yet"} />
   return (
   <>
      <GridLayout>
         {brand[0]?.phones?.map(phone => (
            <Card key={phone.id}>
               <Image
                  className={`size-44 object-contain mx-auto`} 
                  src={phone.image_url}
                  alt={`image of ${phone.model}`}
                  />
               <Card.Body  className="text-center">
                  <Card.Title tag={'h1'}>
                     {phone.model}
                  </Card.Title>

                  <Link 
                     target="_blank"
                     to={`/phones/${phone.id}/reviews`}
                     className="mt-4 btn btn-primary">
                     Visit Reviews
                  </Link>
               </Card.Body>
            </Card>
         ))}
      </GridLayout>
   </>
  )
}

export default BrandPage