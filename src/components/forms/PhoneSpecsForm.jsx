import { Input, Badge, Button, Textarea } from "react-daisyui"
import Label from "../elements/Label"
import { useFormik } from "formik"
import { useCreatePhone } from "@/pages/dashboard/AddPhonePage"
import { Modal, ModalContent } from "../Modal"
import { useCallback, useEffect, useRef } from "react"
import { convertWithMonthName } from "@/utils/helper"
import useAlert from "@/hooks/useAlert"
import { createPhoneInfo, createPhoneSpecs } from "@/services/phones"
import { useNavigate } from "react-router-dom"


const initialValues = {
   additional_feature: '',
   battery: '',
   camera: '',
   memory: '',
   network: '',
   operating_system: '',
   storage: ''
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

const PhoneSpecsForm = () => {
   const navigate = useNavigate()
   const { showAlert } = useAlert()
   const { phoneData, setPhoneData, setCurrentForm } = useCreatePhone() 
   const prevModalRef = useRef(null)



   const showPreviewModal = useCallback(() => {
      if(prevModalRef.current){
         prevModalRef.current.showModal()
      }
   }, [])

   const formik = useFormik({
      initialValues,
      validate,
      onSubmit: (values, { setSubmitting }) => {
        setPhoneData((prevData) => ({ ...prevData, phoneSpecs: [values] }))
        setSubmitting(true)
      },
    })
    
    useEffect(() => {
      const submitPhoneData = async () => {
        if (phoneData.phoneSpecs) {
          try {
            // Submit phone info to db
            const brand_id = Number(phoneData.phoneInfo[0].brand_id)
            const res = await createPhoneInfo({...phoneData.phoneInfo[0], brand_id})
            if (res.status !== 200) {
              throw new Error("An error occurred")
            }
    
            // If phone info submitted, now submit the specification
            const { data: phone } = res.data
            // console.log(phone.id)
            const specsRes = await createPhoneSpecs(phoneData.phoneSpecs[0], phone.id)
            if (specsRes.status !== 200) {
              throw new Error("An error occurred")
            }
    
            showAlert("success", "Phone data created successfully", 3500)
          } catch (error) {
            showAlert("error", error.response?.data?.message || "An error occurred", 3500)
            console.error(error)
          } finally {
            setPhoneData({ phoneInfo: null, phoneSpecs: null })
            // setSubmitting(false)
          }
        }
      }
    
      submitPhoneData()
      
      if(!phoneData.phoneInfo){
         navigate(-1)
      }

    }, [phoneData])
    

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
               placeholder="Fast charging etc.."  />
            {formik.errors.additional_feature ? <span className='my-2 pt-3 text-error'>{formik.errors.additional_feature}</span> : null }
         </div>

         <div className="flex items-center gap-3 justify-between">
            <Button onClick={() => setCurrentForm("info")} type="button">
               Back
            </Button>
            <div className="space-x-3">
               <Button onClick={showPreviewModal} type="button" color="secondary">
                  Preview
               </Button>
               <Button disabled={formik.isSubmitting || !formik.isValid} type="submit" color="primary">
                  {formik.isSubmitting ? "Loading..." : "Create"}
               </Button>
            </div>
         </div>
    </form>

   {/* preview data phone modal */}
      {phoneData?.phoneInfo &&
   <Modal ref={prevModalRef}>
         <ModalContent className={"max-w-fit"}>
         <h1 className="my-5 text-xl font-bold">Preview "{phoneData.phoneInfo[0].model}" data</h1>

         <div className="flex flex-col lg:flex-row items-center gap-4">
            <div className="">
               <h2>Phone Information</h2>
               <div className="flex flex-col my-5">
                  <img className="object-contain size-[100px]" src={phoneData.phoneInfo[0].image_url} alt="" />

                  {Object.keys(phoneData.phoneInfo[0]).map((key) => (
                     <div className="my-1" key={key}>
                        <Label>
                           <span className="label-text capitalize">{key.replaceAll("_", " ")}</span>
                        </Label>
                        <Input className="w-full" readOnly 
                        value={key == "release_date" 
                           ? convertWithMonthName(phoneData.phoneInfo[0][key])
                           : phoneData.phoneInfo[0][key]}/>
                     </div>
                  ))}
               </div>
            </div>
            <div className="">
               <h2>Phone Specification</h2>
               <div className="flex flex-col">
                  {Object.keys(formik.values).reverse().map((key) => (
                     <div className="my-1" key={key}>
                        <Label>
                           <span className="label-text capitalize">{key.replaceAll("_", " ")}</span>
                        </Label>
                        <Input className="w-full" readOnly value={formik.values[key]}/>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </ModalContent>
   </Modal>
      }

   </>
  )
}

export default PhoneSpecsForm