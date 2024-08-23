
import { useFormik } from 'formik'
import { convertDateOnly, convertDateTimeString } from '@/utils/helper'
import { validUrlRegex } from '@/lib/regex'
import { updateProfile, createProfile } from '@/services/profile'
import useAlert from '@/hooks/useAlert'
import { FileInput, Input, Textarea, Loading } from 'react-daisyui'
import useImageUploader from '@/hooks/useImageUploader'
import Image from '../elements/Image'


const initialValues = {
   image_url: '',
   full_name: '',
   birthday: '',
   biodata: ''
}

const validate = values => {
   const errors = {}

   if(!values.image_url){
      errors.image_url = "Required"
   }else if(!validUrlRegex.test(values.image_url)){
      errors.image_url = "Image url must be a valid url"
   }

   if(!values.full_name){
      errors.full_name = "Required"
   }
   if(!values.birthday){
      errors.birthday = "Required"
   }
   if(!values.biodata){
      errors.biodata = "Biodata cannot be empty, use - if you want to make you bio empty"
   }

   return errors
}

const ProfileForm = ( { profileData = null, refetch } ) => {
   const { showAlert } = useAlert()
   const { inputFileRef, handleFileInputChange, imgUrl, progressPercent } = useImageUploader()

   const formik = useFormik({
      enableReinitialize: true,
      initialValues: !profileData 
      ? { initialValues, image_url: imgUrl} 
      : {   
         image_url: profileData.image_url,
         full_name: profileData.full_name,
         birthday: convertDateOnly(profileData.birthday),
         biodata: profileData.biodata 
         },
      validate,
      onSubmit: (values, { setSubmitting }) => {
         const newBirthday = convertDateTimeString(values.birthday)
         const image_url = !imgUrl ? values.image_url : imgUrl
         const profile = { ...values, birthday: newBirthday, image_url }

         if(!profileData){ // create profile

            const create = async () => {
               try {
                  const res = await createProfile(profile)

                  if (res.status !== 200){
                     throw new Error("An error is occured")
                  }
                  
                  
                  showAlert("success", "Profile created successfuly", 5000)
                  refetch() // refetch data from custom hook useGetData
               } catch (error) {
                  const message = error.response?.data.message || "An error is occured"
                  showAlert("error", message, 5000)
                  console.error(error)
               }finally{
                  setSubmitting(false)
               }
            }
            create()

         }else{ // update profile
            const update = async () => {
               try {
                  const res = await updateProfile(profile)

                  if (res.status !== 200){
                     throw new Error("An error is occured")
                  }
                  
                  
                  showAlert("success", "Profile updated successfuly", 5000)
                  refetch() // refetch data from custom hook useGetData
               } catch (error) {
                  const message = error.response?.data.message || "An error is occured"
                  showAlert("error", message, 5000)
                  console.error(error)
               }finally{
                  setSubmitting(false)
               }
            }
            update()
         }

      },
   })

   return (
      <>
         {
            (profileData || imgUrl) &&
             <Image 
               className={`size-24 object-contain mx-auto my-5 rounded-full`}
               src={imgUrl || profileData.image_url}
               /> 
         }
         {
            (progressPercent > 0 && !imgUrl) &&
            <Loading size='lg' />
         }

        <form className='flex flex-col gap-3' onSubmit={formik.handleSubmit}>

            <h1 className='mb-4 text-xl font-semibold cap'>{!profileData ? "Create" : "Update"} Profile</h1>

            <label htmlFor='image_url' className="form-control w-full">
               <div className="label">
               <span className="label-text text-base">Profile Imag</span>
               </div>
               <FileInput
                  id='image_url'
                  ref={inputFileRef}
                  onChange={handleFileInputChange}
                  className="w-full" />
               <span className='text-xs my-2'>Choose file if you want to update curret profile image</span>
               {formik.errors.image_url ? <span className='my-2 text-red-500'>{formik.errors.image_url}</span> : null }
            </label>
            
            <label htmlFor='full_name' className="form-control w-full">
               <div className="label">
               <span className="label-text text-base">Full Name</span>
               </div>
               <input 
               type="text" 
               name='full_name' 
               id='full_name' 
               placeholder="Full name"
               onChange={formik.handleChange}
               
               value={formik.values.full_name}
               className="input input-bordered w-full" />
               {formik.errors.full_name ? <span className='my-2 text-red-500'>{formik.errors.full_name}</span> : null }
            </label>
            <label htmlFor='birthday' className="form-control w-full">
               <div className="label">
               <span className="label-text text-base">Birthday</span>
               </div>
               <input 
               type="date" 
               name='birthday' 
               id='birthday' 
               onChange={formik.handleChange}
               value={formik.values.birthday}
               className="input input-bordered w-full" />
               {formik.errors.birthday ? <span className='my-2 text-red-500'>{formik.errors.birthday}</span> : null }
            </label>
            <label htmlFor='biodata' className="form-control w-full">
               <div className="label">
               <span className="label-text text-base">Biodata</span>
               </div>
               <Textarea 
               type="date" 
               name='biodata' 
               id='biodata' 
               placeholder="Biodata"
               onChange={formik.handleChange}
               value={formik.values.biodata}
               className="w-full" ></Textarea>
               {formik.errors.biodata ? <span className='my-2 text-red-500'>{formik.errors.biodata}</span> : null }
            </label>

            <button 
               disabled={formik.isSubmitting}
               type="submit" 
               className='btn btn-primary'>
                  {formik.isSubmitting 
                  ? "Loading..." 
                  :!profileData ? "Create" : "Update" + " Profile"
                  }
            </button>
        </form>
  
      </>
    )
}

export default ProfileForm