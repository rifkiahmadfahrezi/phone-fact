import { memo } from 'react'
import { useFormik } from 'formik'
import { Link } from 'react-router-dom'
import useGetData from '@/hooks/useGetData'
import { validUrlRegex } from '@/lib/regex'
import { convertDateOnly, convertDateTimeString } from '@/utils/helper'
import Label from '../elements/Label'
import { Input, Badge, Textarea, Button } from 'react-daisyui'
import useAlert from '@/hooks/useAlert'
import { updatePhoneInfo, UpdatePhoneSpecs } from '@/services/phones'
import { useNavigate } from 'react-router-dom'
import { Error } from '../Error'
import { FileInput } from 'react-daisyui'
import useImageUploader from '@/hooks/useImageUploader'


const validate = values => {
   const errors = {}

   if(!values.brand_id){
      errors.brand_id = "Please select brand"
   }
   if(!values.model){
      errors.model = "Required"
   }
   if(!values.price){
      errors.price = "Required"
   }else if(!(/[0-9]/).test(values.price)){
      errors.price = "Price must contain only number"
   }
   if(!validUrlRegex.test(values.image_url)){
      errors.image_url = "Image URL must be a valid URL"
   }
   if(!values.release_date){
      errors.release_date = "Required"
   }

   return errors
}



export const UpdatePhoneInfoForm = memo(({ phoneInfoData = null }) => {
   const navigate = useNavigate()
   const { inputFileRef, handleFileInputChange, imgUrl } = useImageUploader()

   const { showAlert } = useAlert()
   const initialValues = { 
      brand_id: phoneInfoData?.brand_id, 
      model: phoneInfoData?.model, 
      price: phoneInfoData?.price, 
      image_url: phoneInfoData?.image_url, 
      release_date: convertDateOnly(phoneInfoData?.release_date)
   }

   const {data : brands, isLoading, error, refetch : refetchBrand} = useGetData("/brands")

  const formik = useFormik({
   initialValues: {...initialValues, brand_id: phoneInfoData?.brand_id},
   validate,
   onSubmit: (values, { setSubmitting }) => {
      ( async () => {
         try{
            const brand_id = Number(values.brand_id)
            const image_url = !imgUrl ? values.image_url : imgUrl
            const release_date = convertDateTimeString(values.release_date)
            const res = await updatePhoneInfo({ ...values, release_date, image_url, brand_id  }, phoneInfoData?.id)
            if (res.status !== 200){
               throw new Error("An error is occured")
            }
            showAlert("success", `Phone ${phoneInfoData?.model} updated succesfuly!`, 3500)
            navigate("/dashboard/phones")
         }catch(error){
            showAlert("error", error.response.data.message || "An error is occured", 3500)
            console.error(error)
         }finally{
            setSubmitting(false)
         }
      })()
   }
   }) 

   if (error) return <Error message={error || "An error is occured"} refetch={refetchBrand}/>
  return (
   <>


   <img src={imgUrl || formik.values.image_url} className='aspect-square object-contain w-[100px]' alt="" />

   <form onSubmit={formik.handleSubmit}>
      <label htmlFor="brand"  className="form-control w-full my-3">
         <div className="label">
            <span className="label-text text-base">Brand</span>
         </div>
         <select 
            onChange={formik.handleChange} 
            name="brand_id" 
            value={formik.values.brand_id} 
            id="brand"  className="select select-bordered w-full text-base">
            <option disabled value="">{isLoading ? "Loading..." : "Select brand"}</option>
            {brands.length === 0
               ? <option value="">None</option>
               : brands.map((brand) => (
               <option
                  key={brand.id}
                  value={brand.id}>
                  {brand.name} - {brand.id}
               </option>
               ))
            }
         </select>
         <span className="text-right text-sm mt-2">Brand not exist? add new brand <Link to={"/dashboard/brands"}  className="link">here</Link></span>
         {formik.errors.brand_id ? <span className='my-2 text-red-500'>{formik.errors.brand_id}</span> : null }
      </label>

      <label htmlFor='model' className="form-control w-full">
            <div className="label">
               <span className="label-text text-base">Model</span>
            </div>
            <input 
               type="text" 
               name='model' 
               id='model' 
               placeholder="model"
               onChange={formik.handleChange}
               value={formik.values.model}
            className="input input-bordered w-full" />
            {formik.errors.model ? <span className='my-2 text-red-500'>{formik.errors.model}</span> : null }
         </label>
      <label htmlFor='price' className="form-control w-full">
         <div className="label">
            <span className="label-text text-base">Price</span>
         </div>
         <input 
            type="number" 
            name='price' 
            id='price' 
            placeholder="price"
            onChange={formik.handleChange}
            value={formik.values.price}
         className="input input-bordered w-full" />
         {formik.errors.price ? <span className='my-2 text-red-500'>{formik.errors.price}</span> : null }
      </label>
      <label htmlFor='image_url' className="form-control w-full">
               <div className="label">
                  <span className="label-text text-base">Phone Image</span>
               </div>
               <FileInput
                  ref={inputFileRef}
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="w-full" />
               {phoneInfoData?.image_url &&
                  <span className="text-xs mt-3">Choose another file if you want to change it</span>
               }
               {formik.errors.image_url ? <span className='my-2 text-red-500'>{formik.errors.image_url}</span> : null }
         </label>
      <label htmlFor='release_date' className="form-control w-full">
         <div className="label">
            <span className="label-text text-base">Release date</span>
         </div>
         <input 
            type="date" 
            name='release_date' 
            id='release_date'
            onChange={formik.handleChange}
            value={formik.values.release_date}
         className="input input-bordered w-full" />
         {formik.errors.release_date ? <span className='my-2 text-red-500'>{formik.errors.release_date}</span> : null }
      </label>

      <button
         disabled={!formik.isValid || formik.isSubmitting}
            className="btn btn-primary w-fit my-5" type="submit">
         { formik.isSubmitting ? "Loading..." : "Update" }
      </button>
   </form>
   </>
  )
})


export const UpdatePhoneSpecsForm = memo(({phoneSpecsData = null}) => {
   const { showAlert } = useAlert()
   const navigate = useNavigate()

   const initialValues = {
      additional_feature: phoneSpecsData?.additional_feature,
      battery: phoneSpecsData?.battery,
      camera: phoneSpecsData?.camera,
      memory: phoneSpecsData?.memory,
      network: phoneSpecsData?.network,
      operating_system: phoneSpecsData?.operating_system,
      storage: phoneSpecsData?.storage
    }
   
   const validate = values => {
      const errors = {}
   
      if(!values.storage){
         errors.storage = "Storage is required"
      }else if(values.storage < 16){
         errors.storage = "Storage minimum is 16 GB"
      }
     
      if(!values.memory){
         errors.memory = "Memory is required"
      }else if(values.memory <  2){
         errors.memory = "Memory minimum is 2 GB"
      }
      if(!values.camera){
         errors.camera = "Camera is required"
      }else if(values.camera < 12){
         errors.camera = "Camera minimum is 12 mp"
      }
      
      if(!values.battery){
         errors.battery = "Battery is required"
      }else if(!(/^[0-9]*$/).test(values.battery)){
         errors.battery = "Battery must contain numbers only"
      }else if(values.battery < 2000){
         errors.battery = "Battery minimum is 2000 mAh"
      }
   
      if(!values.network){
         errors.network = "Network is required"
      }
   
      if(!values.operating_system){
         errors.operating_system = "Operating system is required"
      }
      if(!values.additional_feature){
         errors.additional_feature = "Additional feature is required, use - if you want it empty"
      }
   
      return errors
   }

   const formik = useFormik({
      enableReinitialize: true,
      initialValues,
      validate,
      onSubmit: (values, { setSubmitting }) => {
         ( async () => {
            try{
               const res = await UpdatePhoneSpecs(values, phoneSpecsData?.phone_id)
               if (res.status !== 200){
                  throw new Error("An error is occured")
               }
               showAlert("success", "Specification updated succesfuly!", 3500)
               navigate("/dashboard/phones")
            }catch(error){
               showAlert("error", error.response?.data.message || "An error is occured", 3500)
               console.error(error)
            }finally{
               setSubmitting(false)
            }
         })()
      },
    })
   return (
      <>
         <form onSubmit={formik.handleSubmit}>
         <div className="my-5 w-full">
            <Label htmlFor="operating_system">
               <span className="label-text">Operating System</span>
            </Label>
            <Input
               className="w-full" 
               id="operating_system"
               name="operating_system"
               type="text"
               onChange={formik.handleChange}
               value={formik.values.operating_system}
               placeholder="Android 15..."  />
            {formik.errors.operating_system ? <span className='my-2 pt-3 text-error'>{formik.errors.operating_system}</span> : null }
         </div>
         <div className="my-5 w-full">
            <Label htmlFor="network">
               <span className="label-text">Network</span>
            </Label>
            <Input   
               className="w-full" 
               id="network"
               name="network"
               type="text"
               onChange={formik.handleChange}
               value={formik.values.network}
               placeholder="4G, 5G..."  />
               {formik.errors.network ? <span className='my-2 pt-3 text-error'>{formik.errors.network}</span> : null }
         </div>
         <div className="my-5 w-full">
            <label htmlFor="battery" className="label-text">Battery</label>
            <span className="mt-3 input input-bordered flex items-center gap-2">
               <input
                  className="grow" 
                  id="battery"
                  name="battery"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.battery}
                  placeholder="6000" />
               <Badge>mAh</Badge>
            </span>
            {formik.errors.battery ? <span className='my-2 pt-3 text-error'>{formik.errors.battery}</span> : null }
         </div>
         <div className="my-5 w-full">
            <label htmlFor="camera" className="label-number">Camera</label>
            <span className="mt-3 input input-bordered flex items-center gap-2">
               <input
                  className="grow" 
                  id="camera"
                  name="camera"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.camera}
                  placeholder="100" />
               <Badge>Megapixel</Badge>
            </span>
            {formik.errors.camera ? <span className='my-2 pt-3 text-error'>{formik.errors.camera}</span> : null }
         </div>
         <div className="my-5 w-full">
            <label htmlFor="storage" className="label-number">Storage</label>
            <span className="mt-3 input input-bordered flex items-center gap-2">
               <input
                  className="grow" 
                  id="storage"
                  name="storage"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.storage}
                  placeholder="512.." />
               <Badge>GB</Badge>
            </span>
            {formik.errors.storage ? <span className='my-2 pt-3 text-error'>{formik.errors.storage}</span> : null }
         </div>
         <div className="my-5 w-full">
            <label htmlFor="memory" className="label-number">Memory</label>
            <span className="mt-3 input input-bordered flex items-center gap-2">
               <input
                  className="grow" 
                  id="memory"
                  name="memory"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.memory}
                  placeholder="12.." />
               <Badge>GB</Badge>
            </span>
            {formik.errors.memory ? <span className='my-2 pt-3 text-error'>{formik.errors.memory}</span> : null }
         </div>
         <div className="my-5 w-full">
            <Label htmlFor="additional_feature">
               <span className="label-text">Additional Feature</span>
            </Label>
            <Textarea
               className="w-full" 
               id="additional_feature"
               name="additional_feature"
               type="text"
               onChange={formik.handleChange}
               value={formik.values.additional_feature}
               placeholder="Fast charging etc.."  />
            {formik.errors.additional_feature ? <span className='my-2 pt-3 text-error'>{formik.errors.additional_feature}</span> : null }
         </div>

         <div className="flex items-center gap-3 justify-between">
            <div className="space-x-3">
               <Button disabled={formik.isSubmitting || !formik.isValid} type="submit" color="primary">
                  {formik.isSubmitting ? "Loading..." : "Update Specification"}
               </Button>
            </div>
         </div>
    </form>
      </>
   )
})