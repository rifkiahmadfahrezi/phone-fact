import { useFormik } from "formik"
import useAlert from "@/hooks/useAlert"
import PasswordInput from "../elements/PasswordInput"
import { changePassword, logout } from "@/services/auth"
import Alert from "../Alert"
import { useState } from "react"

const validate = values => {
   const errors = {}

   if(!values.current_password){
      errors.current_password = "Insert your current password"
   }

   if(!values.new_password.length){
      errors.new_password = "Insert your new password"
   }else if(values.new_password.length < 5){
      errors.new_password = "Password must be at least 5 characters"
   }

   return errors
}


const ChangePasswordForm = () => {
   const [msg, setMsg] = useState(null)
   const { showAlert } = useAlert()
   // setErroe

   const formik = useFormik({
      initialValues: { 
         current_password: '', 
         new_password: '' 
      },
      validate,
      onSubmit: (values, { setSubmitting }) => {
         (async () => {
            try{
               const res = await changePassword(values)

               if(res.status !== 200){
                  throw new Error("An error in onccured")
               }

               showAlert("success", "Password changed!, Please login to again", 5000)
               logout()
            }catch(error){
               setMsg(error.response.data.message || "An error in occured")
               // showAlert("error", error.response.data.message || "An error in occured", 3000)
               console.error(error);
            }finally{
               setSubmitting(false)
            }
         })()
      }
   })

  return (
    <>
      <form className='flex flex-col gap-3 mt-5' onSubmit={formik.handleSubmit}>

         {msg &&
            <Alert type="error" className="flex justify-between">
               <span>{msg}</span>

               <button 
                  onClick={() => setMsg(null)}
                  type="button" className="btn btn-sm text-lg">
                  &times;
               </button>
            </Alert>
         }

         <label htmlFor='current_password' className="form-control w-full">
            <div className="label">
               <span className="label-text text-base">Current password</span>
               </div>
               <PasswordInput
                  name='current_password' 
                  id='current_password' 
                  placeholder="Current password"
                  onChange={formik.handleChange}
               />
               {formik.errors.current_password ? <span className='my-2 text-red-500'>{formik.errors.current_password}</span> : null }
         </label>
         <label htmlFor='new_password' className="form-control w-full">
            <div className="label">
               <span className="label-text text-base">New password</span>
               </div>
               <PasswordInput
                  name='new_password' 
                  id='new_password' 
                  placeholder="New password"
                  onChange={formik.handleChange}
                  />
               {formik.errors.new_password ? <span className='my-2 text-red-500'>{formik.errors.new_password}</span> : null }
         </label>

         <div className="flex justify-end my-5">
            <button type="submit" className='btn btn-primary'>Change Password</button>
         </div>
      </form>
    </>
  )
}

export default ChangePasswordForm