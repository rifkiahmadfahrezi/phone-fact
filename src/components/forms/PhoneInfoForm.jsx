import useGetData from "@/hooks/useGetData"
import { useFormik } from "formik"
import { validUrlRegex } from "@/lib/regex"
import { Link } from "react-router-dom"
import { convertDateOnly, convertDateTimeString } from "@/utils/helper"
import { useCreatePhone } from "@/pages/dashboard/AddPhonePage"
import useImageUploader from "@/hooks/useImageUploader"
import { FileInput, Input, Loading } from "react-daisyui"
import Image from "../elements/Image"
import { useEffect } from "react"

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

const PhoneInfoForm = () => {
   const { phoneData, setPhoneData, setCurrentForm} = useCreatePhone()
   const { inputFileRef, handleFileInputChange, imgUrl, progressPercent } = useImageUploader()
   const { data: brands, isLoading} = useGetData("/brands")
   const formik = useFormik({
      enableReinitialize: true,
      initialValues: phoneData?.phoneInfo 
      ? {...phoneData.phoneInfo[0],  release_date: convertDateOnly(phoneData.phoneInfo[0].release_date)} 
      : { brand_id: '', model: '', price: '', image_url: imgUrl, release_date: '' },
      validate,
      onSubmit: (values) => {
         const release_date = convertDateTimeString(values.release_date)
         setCurrentForm("specs")
         setPhoneData({ ...phoneData, phoneInfo: [{...values, release_date}]  })
      }
   })

   useEffect(() => {
      console.log({progressPercent, imgUrl})
   }, [progressPercent, imgUrl])

   return (
    <>
      {(progressPercent > 0 && !imgUrl) &&
         <Loading size="lg"/>
      }
      {(phoneData?.phoneInfo != null || imgUrl) &&
         <Image 
            src={imgUrl || phoneData?.phoneInfo[0]?.image_url} 
            className={`size-32 object-contain my-5`}/>
      }
      {/* Form phone information */}
      <form onSubmit={formik.handleSubmit}>
          <label htmlFor="brand"  className="form-control w-full my-3">
            <div className="label">
              <span className="label-text text-base">Brand</span>
            </div>
            <select  onChange={formik.handleChange} name="brand_id" value={formik.values.brand_id} id="brand"  className="select select-bordered w-full text-base">
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
          <label htmlFor='image_url' className="form-control w-full">
               <div className="label">
                  <span className="label-text text-base">Phone Image</span>
               </div>
               <FileInput
                  ref={inputFileRef}
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="w-full" />
               {phoneData?.phoneInfo != null &&
                  <span className="text-xs mt-3">Choose another file if you want to change it</span>
               }
               {formik.errors.image_url ? <span className='my-2 text-red-500'>{formik.errors.image_url}</span> : null }
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
               disabled={!formik.isValid}
                className="btn btn-primary w-fit my-5" type="submit">
               Next
            </button>
      </form>
    </>
  )
}

export default PhoneInfoForm