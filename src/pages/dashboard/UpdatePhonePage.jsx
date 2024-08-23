
import { Error } from '@/components/Error'
import { UpdatePhoneInfoForm, UpdatePhoneSpecsForm } from '@/components/forms/UpdatePhoneForm'
import Preloader2 from '@/components/Preloader2'
import useGetData from '@/hooks/useGetData'
import { useParams } from 'react-router-dom'



const UpdatePhonePage = () => {

   const { id } = useParams()

   if (!Number(id)) return <Error message={"Provide Phone ID"}/>

   const { data: phones, error, isLoading, refetch } = useGetData(`/phones/${id}/specification`)

   if (isLoading) return <Preloader2 />

   if (error) return <Error message={error} refetch={refetch}/>
   if (phones?.length === 0 && !isLoading) return <Error message={`Phone with ID ${id} is not exist!`}/>
  return (
    <>  
        <h1 className='my-5 text-xl font-bold'>Update Phone Data</h1>

        <div role="tablist" className="tabs tabs-lifted">
            <input 
               defaultChecked 
               type="radio" 
               name="tab-phone" 
               role="tab"
                className="tab text-base" 
               aria-label="Phone infomation" />
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
               <UpdatePhoneInfoForm phoneInfoData={phones} />
            </div>

            <input
               type="radio"
               name="tab-phone"
               role="tab"
               title={!phones?.specification ? "Phone specification not found" : null}
               disabled={!phones?.specification}
               className="tab text-base"
               aria-label="Phone Specification" />
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
               {
                  !phones?.specification
                  ? null
                  : <UpdatePhoneSpecsForm phoneSpecsData={phones?.specification[0]} />
               }
            </div>
         </div>

    </>
  )
}


export default UpdatePhonePage