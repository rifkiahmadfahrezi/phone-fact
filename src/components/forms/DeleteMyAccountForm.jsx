import { useFormik } from "formik"
import useAlert from "@/hooks/useAlert"
import PasswordInput from "../elements/PasswordInput"
import { logout } from "@/services/auth"
import { deleteMyAccount } from "@/services/users"
import Alert from "../Alert"
import { useState } from "react"

const validate = values => {
   const errors = {}

   if(!values.password){
      errors.password = "Insert your password"
   }

   return errors
}


const DeleteMyAccountForm = () => {
   const [msg, setMsg] = useState(null)
   const { showAlert } = useAlert()
   // setErroe

   const formik = useFormik({
      initialValues: { 
         password: '', 
      },
      validate,
      onSubmit: (values, { setSubmitting }) => {
         if(confirm(`Cofirm to delete your account`)){
            (async () => {
               try{
                  const res = await deleteMyAccount(values)
   
                  if(res.status !== 200){
                     throw new Error("An error in onccured")
                  }
   
                  showAlert("success", "Your Account succesfuly deleted!", 5000)
                  logout()
               }catch(error){
                  setMsg(error.response?.data.message == "EOF" 
                     ? "Failed!, make sure the password is correct" 
                     : error.response?.data.message || "An error in occured")
                  // showAlert("error", error.response.data.message || "An error in occured", 3000)
                  console.error(error);
               }finally{
                  setSubmitting(false)
               }
            })()
         }else{
            setSubmitting(false)
         }
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

         <span className="text-error my-4">Warning : You cannot restore you account after deleted!</span>
         <label htmlFor='password' className="form-control w-full">
            <div className="label">
               <span className="label-text text-base">Password</span>
               </div>
               <PasswordInput
                  name='password' 
                  id='password' 
                  placeholder="Your Password"
                  onChange={formik.handleChange}
               />
               {formik.errors.password ? <span className='my-2 text-red-500'>{formik.errors.password}</span> : null }
         </label>

         <div className="flex justify-end my-5">
            <button 
               disabled={formik.isSubmitting}
               type="submit" className='btn btn-primary'>{formik.isSubmitting ? "Loading..." : "Delete My account"}</button>
         </div>
      </form>
    </>
  )
}

export default DeleteMyAccountForm