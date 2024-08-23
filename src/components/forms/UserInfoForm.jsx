import { validEmailRegex } from '@/lib/regex'
import ChangePasswordForm from './ChangePasswordForm'
import { useFormik } from 'formik'
import useAlert from '@/hooks/useAlert'
import { updateUserInfo } from '@/services/users'
import Alert from '../Alert'
import { useState } from 'react'
import DeleteMyAccountForm from './DeleteMyAccountForm'

const validate = values => {
   const errors = {}

   if(!values.username){
      errors.username = "Required"
   }else if(values.username.length < 5){
      errors.username = "Username must be at least 5 characters"
   }

   if(!values.email){
      errors.email = "Required"
   }else if(!validEmailRegex.test(values.email)){
      errors.email = "Email must be a valid email format"
   }

   return errors
}

const initialValues = {
   username: '',
   email: ''
}

const UserInfoForm = ({ userInfoData = null, refetch }) => {
   const [msg, setMsg] = useState(null)
   const { showAlert } = useAlert()

   const formik = useFormik({
      enableReinitialize: true,
      initialValues: !userInfoData 
         ? initialValues 
         : { username: userInfoData?.username, email: userInfoData.email },
      validate,
      onSubmit: (values, { setSubmitting }) => {

         const update = async (value) => {
            try {
               
               const res = await updateUserInfo(value)

               if(res.status != 200){
                  throw new error("An error is occured")
               }

               showAlert("success", "User information updated succesfully", 3500)
               refetch()
            } catch (error) {
               const message = error.response?.data.message || "An error is occured"
               showAlert("error", message, 3500)
               setMsg(message)
               console.error(error)
            }finally{
               setSubmitting(false)
            }
         }
         // input only updated value
         const updatedValues = {};

         if (values.username !== userInfoData?.username) {
            updatedValues.username = values.username;
         }

         if (values.email !== userInfoData?.email) {
            updatedValues.email = values.email;
         }

         if(!updatedValues?.username && !updatedValues?.email) {
            setMsg("There is no updated value")
            showAlert("error", "There is no updated value", 3500)
            setSubmitting(false)
            return
         }
         update(updatedValues)
      }

   })


  return (
   <>
      <form className='flex flex-col gap-3' onSubmit={formik.handleSubmit}>
         <h1 className='mb-4 text-xl font-semibold'>Update user information</h1>
         
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

         <label htmlFor='username' className="form-control w-full">
            <div className="label">
            <span className="label-text text-base">Username</span>
            </div>
            <input 
            type="text" 
            name='username' 
            id='username' 
            placeholder="username"
            onChange={formik.handleChange}
            value={formik.values.username}
            className="input input-bordered w-full" />
            {formik.errors.username ? <span className='my-2 text-red-500'>{formik.errors.username}</span> : null }
         </label>
         
         <label htmlFor='email' className="form-control w-full">
            <div className="label">
            <span className="label-text text-base">Email</span>
            </div>
            <input 
            type="text" 
            name='email' 
            id='email' 
            placeholder="Email"
            onChange={formik.handleChange}
            value={formik.values.email}
            className="input input-bordered w-full" />
            {formik.errors.email ? <span className='my-2 text-red-500'>{formik.errors.email}</span> : null }
         </label>

         <button 
            disabled={formik.isSubmitting}
            type="submit" 
            className='btn btn-primary'>{formik.isSubmitting ? "Loading..." : "Update User Information"}</button>
      </form>
      
      <div className="divider my-8">OR</div>

      <div className="flex flex-col gap-3">
         <div tabIndex={0}  className="collapse collapse-arrow bg-slate-100 dark:bg-base-200" >
            <input type="checkbox" />
            <div className="collapse-title btn btn-secondary">Change password</div>
            <div className="collapse-content">
               <ChangePasswordForm />
            </div>
         </div>
         <div tabIndex={0}  className="collapse collapse-arrow bg-slate-100 dark:bg-base-200" >
            <input type="checkbox" />
            <div className="collapse-title btn btn-error">Delete My Account</div>
            <div className="collapse-content">
               <DeleteMyAccountForm />
            </div>
         </div>
      </div>
   </>
  )
}

export default UserInfoForm