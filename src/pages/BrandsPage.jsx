import React from 'react'
import useGetData from '@/hooks/useGetData'
import GridLayout from '@/layouts/GridLayout'
import { CardSkeleton } from '@/components/Skeletons'
import { Error } from '@/components/Error'
import { Link } from 'react-router-dom'
import { Card, Input } from 'react-daisyui'
import Image from '@/components/elements/Image'
import useSearch from '@/hooks/useSearch'


const BrandsPage = () => {

   const { data : brands, isLoading, error } = useGetData("/brands")
   const { inputRef, handleKeyword, keyword } = useSearch()
   if (error) return <Error message={error} />

   if ( isLoading ) {
      return(
         <>
            <GridLayout className="lg:grid-cols-3">
               {Array(3).fill(0).map((_,i) => (
                  <CardSkeleton key={i} />
               ))}
            </GridLayout>
         </>
      )
   }
   return (
      <>

      <div className="flex items-center justify-between gap-3">
         <h1 className='text-xl font-bold'>Brands</h1>

         <Input 
            type='search'
            placeholder='Search brand...'
            ref={inputRef}
            onChange={handleKeyword}
            defaultValue={keyword}
            />
      </div>

      <GridLayout className="grid-cols-2 lg:grid-cols-3 mt-10">
         {brands.filter(item => (
            item.name.toLowerCase().includes(keyword)
         )).map((brand, idx) => (
            <Card className='group' key={idx}>
               <Image className='object-contain w-full size-32 mx-auto' src={brand.logo_url}
                     alt={`Image of ${brand.full_name}`}  />
              <Card.Body className='p-3'>
                  <Card.Title tag={'h1'}>{brand.name}</Card.Title>

               <Card.Actions className='mt-10'>
                  <Link
                    preventScrollReset={false}
                    to={`/brands/${brand.id}`}
                    className="btn btn-primary w-full sm:w-fit" >View Details</Link>
               </Card.Actions>
              </Card.Body>
            </Card>
         ))}
      </GridLayout>
      </>
   )
}

export default BrandsPage