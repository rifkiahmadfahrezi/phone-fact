import { useFormik } from "formik"
import { Input, Textarea, Button, Loading,FileInput } from "react-daisyui"
import useAlert from "@/hooks/useAlert"
import { validUrlRegex } from "@/lib/regex"
import Label from "../elements/Label"
import useGetData from "@/hooks/useGetData"
import { memo } from "react"
import { Error } from "../Error"
import { createBrand, updateBrand } from "@/services/brands"
import useImageUploader from "@/hooks/useImageUploader"
import Image from "../elements/Image"
import { cn } from "@/utils/styling"
import { deleteObject, ref } from "firebase/storage"
import { storage } from "@/services/firebase"


const initialValues = {
   name: '', logo_url: '', description: ''
}

const validate = values => {
   const errors = {}
   
   if(!values.name){
      errors.name = "Brand name is required"
   }
   if(!values.logo_url){
      errors.logo_url = "Logo URL is required"
   }else if(!validUrlRegex.test(values.logo_url)){
      errors.logo_url = "Logo URL must be a valid URL"
   }

   if(!values.description){
      errors.description = "Please enter a description, or use '-' if you want it empty"
   }

   return errors
}

export const AddBrandForm = memo(({ refetch }) => {
   const { inputFileRef, handleFileInputChange, progressPercent, imgUrl } = useImageUploader()

   const { showAlert } = useAlert()
   const formik = useFormik({
      enableReinitialize: true,
      initialValues: { ...initialValues, logo_url: imgUrl },
      validate,
      onSubmit: (values, { setSubmitting, resetForm }) => {
         (async() => {
            try {
               const res = await createBrand(values)
               if(res.status !== 200){
                  throw new Error("An error is occured")
               }

               showAlert("success", "Brand data created succesfully!", 3500)
               refetch()
               resetForm()
            } catch (error) {
               showAlert("error", error.response.data.message || "An error is occured" , 4500)
               console.error(error);
            }finally{
               setSubmitting(false)
            }
         })()
      }
   })

  return (
    <>
      <h1 className="text-2xl font-bold">Create new brand data</h1>
      {(imgUrl) &&
         <Image 
            className={cn(`my-5 bg-base-300 animate-none size-20 aspect-square object-contain`, (progressPercent > 0 && !imgUrl) && "animate-pulse")}
            src={imgUrl}
         />
      }
      <form onSubmit={formik.handleSubmit}>

         <div className="form-control w-full my-5">
            <Label htmlFor="brand_name">
               <span className="label-text">Brand Name</span>
            </Label>
            <FileInput
               required
               accept="image/*"
               onChange={() => handleFileInputChange()}
               ref={inputFileRef}
               />
            {formik.errors.logo_url ? <span className='my-2 text-red-500'>{formik.errors.logo_url}</span> : null }
         </div>
         <div className="form-control w-full my-5">
            <Label htmlFor="brand_name">
               <span className="label-text">Brand Name</span>
            </Label>
            <Input 
               id="brand_name"
               placeholder="Brand name"
               name="name"
               type="text"
               onChange={formik.handleChange}
               value={formik.values.name}
               className="w-full" />
               {formik.errors.name ? <span className='my-2 text-red-500'>{formik.errors.name}</span> : null }
         </div>
         {/* <div className="form-control w-full my-5">
            <Label htmlFor="logo_url">
               <span className="label-text">Logo URL</span>
            </Label>
            <Input 
               id="logo_url"
               placeholder="Logo URL"
               name="logo_url"
               type="url"
               onChange={formik.handleChange}
               value={formik.values.logo_url}
               className="w-full" />
               {formik.errors.logo_url ? <span className='my-2 text-red-500'>{formik.errors.logo_url}</span> : null }
         </div> */}
         <div className="form-control w-full my-5">
            <Label htmlFor="description">
               <span className="label-text">Description</span>
            </Label>
            <Textarea 
               id="description"
               placeholder="description"
               name="description"
               onChange={formik.handleChange}
               value={formik.values.description}
                className="w-full" />
                {formik.errors.description ? <span className='my-2 text-red-500'>{formik.errors.description}</span> : null }
         </div>
      
         <Button 
            disabled={formik.isSubmitting}
            color="primary" 
            type="submit" className="w-fit my-5">{formik.isSubmitting ? "Loading..." : "Create"}</Button>
      </form>
    </>
  )
})
export const UpdateBrandForm = memo(({ brandID, refetch }) => {
   const { showAlert } = useAlert()
   const { data: brand, isLoading, error, refetch: refetchBrand } = useGetData(`/brands/${brandID}`)
   const { inputFileRef, handleFileInputChange, progressPercent, imgUrl } = useImageUploader()
   // console.log(brand)

   const formik = useFormik({
      enableReinitialize: true,
      initialValues: brand.length == 0 ? initialValues : {
         name: brand[0].name, 
         logo_url: !imgUrl ? brand[0].logo_url : imgUrl, 
         description: brand[0].description},
      validate,
      onSubmit: (values, { setSubmitting }) => {
         (async() => {
            try {

               const updatedData = {...values}

               // check if brand name updated or not
               if(brand[0].name !== values.name){
                  updatedData.name = values.name
               }else{
                  delete updatedData.name
               }
               // check if brand logo_url updated or not
               if(brand[0].logo_url !== values.logo_url){
                  updatedData.logo_url = values.logo_url
               }else{
                  delete updatedData.logo_url
               }


               const res = await updateBrand(updatedData, brandID)
               if(res.status !== 200){
                  throw new Error("An error is occured")
               }
               showAlert("success", "Brand data created succesfully!", 3500)
               refetch()
            } catch (error) {
               showAlert("error", error.response.data.message || "An error is occured" , 4500)
               console.error(error);
            }finally{
               setSubmitting(false)
            }
         })()
      }
   })

   if(error) return <Error message={error} refetch={refetchBrand}/>

   if(isLoading) return <div className="grid h-[100px] place-items-center"><Loading variant="dots"/></div>   

  return (
    <>
      <h1 className="text-2xl font-bold">Update brand "{brand[0].name}"</h1>

      {(formik.values.logo_url) &&
         <Image 
            className={cn(`my-5 bg-base-300 animate-none size-20 aspect-square object-contain`, (progressPercent > 0 && !formik.values.logo_url) && "animate-pulse")}
            src={formik.values.logo_url}
         />
      }

      <form onSubmit={formik.handleSubmit}>
         <div className="form-control w-full my-5">
            <Label htmlFor="logo_url">
               <span className="label-text">Logo URL</span>
            </Label>
            <FileInput
               ref={inputFileRef}
               accept="image/*"
               onChange={handleFileInputChange}
               className="w-full" />
               <span className="mt-2 text-xs">Choose file if want to replace current logo</span>
               {formik.errors.logo_url ? <span className='my-2 text-red-500'>{formik.errors.logo_url}</span> : null }
         </div>
         <div className="form-control w-full my-5">
            <Label htmlFor="brand_name">
               <span className="label-text">Brand Name</span>
            </Label>
            <Input 
               id="brand_name"
               placeholder="Brand name"
               name="name"
               type="text"
               onChange={formik.handleChange}
               value={formik.values.name}
               className="w-full" />
               {formik.errors.name ? <span className='my-2 text-red-500'>{formik.errors.name}</span> : null }
         </div>
         <div className="form-control w-full my-5">
            <Label htmlFor="description">
               <span className="label-text">Description</span>
            </Label>
            <Textarea 
               id="description"
               placeholder="description"
               name="description"
               onChange={formik.handleChange}
               value={formik.values.description}
                className="w-full" ></Textarea>
                {formik.errors.description ? <span className='my-2 text-red-500'>{formik.errors.description}</span> : null }
         </div>
      
         <Button 
            disabled={formik.isSubmitting}
            color="primary" 
            type="submit" className="w-fit my-5">{formik.isSubmitting ? "Loading..." : "Update"}</Button>
      </form>
    </>
  )
})
