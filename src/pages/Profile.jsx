import React, { useRef } from 'react'
import useAuth from '@/hooks/useAuth'
import { RiPencilLine, RiStarFill, RiStarLine, RiUserSettingsLine } from '@remixicon/react'
import useGetData from '@/hooks/useGetData'
import { useParams } from 'react-router-dom'
import { Error } from '@/components/Error'
import { ProfileCardSkeleton } from '@/components/Skeletons'
import ProfileForm from '@/components/forms/ProfileForm'
import UserInfoForm from '@/components/forms/UserInfoForm'
import Image from '@/components/elements/Image'
import { convertWithMonthName } from '@/utils/helper'
import { Modal, ModalContent } from '@/components/Modal'
import GridLayout from '@/layouts/GridLayout'
import { CardSkeleton } from '@/components/Skeletons'
import { Card } from 'react-daisyui'
import { Link } from 'react-router-dom'


const Profile = () => {
  const { auth } = useAuth()
  const { userIDParams } = useParams()

  const modalProfileRef = useRef(null)
  const modalUserRef = useRef(null)


  const openProfileModal = () => {
    if(modalProfileRef.current){
      modalProfileRef.current?.showModal()
    }
  }
  const openUserModal = () => {
    if(modalUserRef.current){
      modalUserRef.current?.showModal()
    }
  }

  const { data, error, isLoading, refetch } = useGetData(`/users/${userIDParams}/profile`)


  if (isLoading) return <ProfileCardSkeleton />


  if (error) return <Error message={error} refetch={refetch} />

  // if user doesnt create profile yet
  if(data?.profiles?.length === 0 || !data?.profiles){
    return (
      <>
        <div className="card card-body bg-base-200">
          <article className="text-center">

            <div className="flex flex-col items-start">
              <span className='text-lg'>{data?.username}</span>
              <span className='text-lg'>{data?.email}</span>
            </div>

            {auth?.id != userIDParams && <h1 className='text-xl font-bold'>This user does'nt complete the profile yet</h1>} 
            

             {auth?.id == userIDParams && <button
              className='btn btn-primary mt-5'
              onClick={openProfileModal}
              >Complete Your Profile</button> }

          </article>
          
            
          { auth?.id == userIDParams && 
          <>
            <div className='mx-auto md:absolute md:top-4 md:right-4 space-x-3'>
              <button 
                  onClick={openUserModal}
                  type='button' 
                  className='lg:tooltip btn btn-secondary w-fit btn-sm'
                  data-tip="Update user information" >
                  <RiUserSettingsLine />
              </button>
            </div>
            <Modal ref={modalUserRef}>
              <ModalContent>
                <div className="mb-5">
                  <UserInfoForm userInfoData={data} refetch={refetch} />
                </div>
              </ModalContent>
            </Modal>
          </>
        }

        </div>

        <section id="reviews">
            <h1 className='text-xl font-bold my-5'>Reviews</h1>
            <UserReviews />
          </section>
        
        {/* modal for create profie */}
        <Modal ref={modalProfileRef}>
          <ModalContent>
            <div className="mb-5">
              <ProfileForm refetch={refetch} />
            </div>
          </ModalContent>
        </Modal>


      </>
    )
  }

  return (
    <>
      {data?.profiles.map((profile, i) => (
        <div className="card card-body bg-white dark:bg-base-200 mt-20 relative" key={i}>
          <div className="flex flex-col justify-center md:justify-start items-center md:flex-row md:items-center gap-5">
            <div className="avatar -mt-20 md:mt-0">
              <div className="size-32 rounded-full bg-base-300">
                <Image src={profile.image_url} alt={`profile image of ${data?.username}`} />
              </div>  
            </div>
            <div className="space-y-1 text-center md:text-left">
              <p>{data.username}</p>
              <h1 className='font-bold text-xl'>{profile.full_name}</h1>
              <p>{data.email}</p>
              <p>{convertWithMonthName(profile.birthday)}</p>
            </div>
          </div>

          { auth?.id == userIDParams &&
            <div className='mx-auto md:absolute md:top-4 md:right-4 space-x-3'>
              <button 
                onClick={openUserModal}
                type='button' 
                className='lg:tooltip btn btn-secondary w-fit btn-sm'
                data-tip="Update user information" >
                <RiUserSettingsLine />
              </button>

              <button 
                onClick={openProfileModal}
                type='button' 
                 className='lg:tooltip btn btn-primary w-fit btn-sm'
                 data-tip="Update profile">
                <RiPencilLine />
              </button>
            </div>
          }
          
          

          <article className='my-3 text-center md:text-left'>
            {profile.biodata}
          </article>
        
        </div>
      ))}

      <section id="reviews">
        <h1 className='text-xl font-bold my-5'>Reviews</h1>
        <UserReviews />
      </section>


      {auth?.id == userIDParams &&
      <>
        {/* modal to update profile */}
        <Modal ref={modalProfileRef}>
          <ModalContent>
            <div className="mb-5">
              <ProfileForm profileData={data.profiles[0]} refetch={refetch} />
            </div>
          </ModalContent>
        </Modal>

        {/* modal update user info */}
          <Modal ref={modalUserRef}>
            <ModalContent>
              <div className="mb-5">
                <UserInfoForm userInfoData={data} refetch={refetch} />
              </div>
            </ModalContent>
          </Modal>
      
      </>
      }
    </>
  )
}


const UserReviews = () => {
  const { auth } = useAuth()
  const { userIDParams } = useParams()
  const {data, isLoading, error, refetch} = useGetData(`/users/${userIDParams}/reviews`)

  if ( isLoading ) {
    return (
      <>
        <GridLayout className={`mt-5`}>
          {Array(4).fill(0).map((_, i) => (
            <CardSkeleton key={i} className="h-24"/>
          ))}
        </GridLayout>
      </>
    )
  }

  if(!data?.reviews && !isLoading) return <Error message={
    <>
      {auth?.id != userIDParams 
         ? <span className='text-xl font-bold'>This user does'nt give any review yet</span>
        : <span className='text-xl font-bold'>You does'nt give any review yet</span>  
      } 
    </>
  }/>
  if ( error && !isLoading ) return <Error message={error} refetch={refetch} />  
  return (
    <>
      <GridLayout className={`mt-5`}>
        {data?.reviews.map((review) => (
          <Card key={review.id}>
            <div className="flex items-center gap-1 p-3">
              {Array(Number(review.rating)).fill(0).map((_,i) => (
                <RiStarFill
                  className='fill-yellow-400' 
                  key={i} />
              ))}
              {Array(5 - Number(review.rating)).fill(0).map((_,i) => (
                <RiStarLine
                  className='fill-yellow-400' 
                  key={i} />
              ))}
            </div>
            <Card.Body>
              {review.content}

            </Card.Body>

              <Link 
                to={`/reviews/${review.id}/comments`}
                className="btn btn-primary btn-sm">
                View review
              </Link>
          </Card>
        ))}
      </GridLayout>
    </>
  )
}

export default Profile