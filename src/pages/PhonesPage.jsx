import React from 'react'
import useGetData from '@/hooks/useGetData'
import GridLayout from '@/layouts/GridLayout'
import { PhoneCardSkeleton } from '@/components/Skeletons'
import { Error } from '@/components/Error'
import { RiStarFill } from '@remixicon/react'
import { Link } from 'react-router-dom'
import { Card, Input } from 'react-daisyui'
import Image from '@/components/elements/Image'
import useSearch from '@/hooks/useSearch'


const PhonesPage = () => {

   const { data : phones, isLoading, error } = useGetData("/phones")
   const { inputRef, handleKeyword, keyword } = useSearch()
   if (error) return <Error message={error} />

   if ( isLoading ) {
      return(
         <>
            <GridLayout className="lg:grid-cols-3">
               {Array(3).fill(0).map((_,i) => (
                  <PhoneCardSkeleton key={i} />
               ))}
            </GridLayout>
         </>
      )
   }
   return (
      <>
      <div className="flex items-center justify-between gap-3">
         <h1 className='text-xl font-bold'>Phones</h1>

         <Input 
            type='search'
            placeholder='Search phone...'
            ref={inputRef}
            onChange={handleKeyword}
            defaultValue={keyword}
            />
      </div>
      <GridLayout className="grid-cols-2 lg:grid-cols-3 mt-10">
         {phones.filter(item => (
            item.full_name.toLowerCase().includes(keyword)
         )).map((phone, idx) => (
            <Card className='group' key={idx}>
               <Image className='object-contain w-full max-h-[300px]' src={phone.phone_image}
                     alt={`Image of ${phone.full_name}`}  />
              <Card.Body className='p-3'>
                  <Card.Title tag={'h1'}>{phone.full_name}</Card.Title>

               <Card.Actions className='flex justify-between items-center mt-10'>
                  <div className="flex flex-col items-start">
                    <small>Average rating</small>
                       <span className='flex items-center justify-center gap-1'>
                          <RiStarFill className='text-yellow-400 size-5' /> 
                          <span className='text-md'>{phone.avg_rating || "N/A"}</span>
                       </span>
                    </div>
                  <Link
                    preventScrollReset={false}
                    to={`/phones/${phone.phone_id}/reviews`}
                    className="btn btn-primary w-full sm:w-fit" >View Reviews</Link>
               </Card.Actions>
              </Card.Body>
            </Card>
         ))}
      </GridLayout>
      </>
   )
}

export default PhonesPage