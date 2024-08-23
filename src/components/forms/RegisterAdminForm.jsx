import PasswordInput from "../elements/PasswordInput"
import { useFormik } from "formik"
import { validEmailRegex } from "@/lib/regex"
import { registerAdmin } from "@/services/admins"
import useAlert from "@/hooks/useAlert"

const validate = values => {
   const errors = {}

   if(!values.username){
      errors.username = "Username required"
   }else if(values.username.length < 5){
      errors.username = "Username must be at least 5 characters"
   }

   if(!values.email){
      errors.email = "Email required"
   }else if(!validEmailRegex.test(values.email)){
      errors.email = "Email must be a valid email format"
   }

   if(!values.password){
      errors.password = "Password required"
   }else if(values.password.length < 5){
      errors.password = "Password must be at least 5 characters"
   }

   return errors
}

const RegisterAdminForm = ({ refetch }) => {

   const { showAlert } = useAlert()

   const formik = useFormik({
      initialValues: { email:'', username: '', password: '' },
      validate,
      onSubmit: (values, { setSubmitting, resetForm }) => {
         ( async () => {
            try {
               const res = await registerAdmin(values)
               if (res.status != 200){
                  throw new Error("An error is occured")
               }

               showAlert("success", "New admin succesfuly registered!", 5000)
               refetch()
               resetForm()
            } catch (error) {
               showAlert("error", error.response.data.message || "An error is occured", 5000)
               console.error(error);
            }finally{
               setSubmitting(false)
            }
         })()
      } 
   })

  return (
    <>
      <h1 className="my-5 text-xl font-bold">Register New Admin</h1>
      <form onSubmit={formik.handleSubmit}>
         <label htmlFor='email' className="form-control w-full">
               <div className="label">
               <span className="label-text text-base">Email</span>
               </div>
               <input 
               type="email" 
               name='email' 
               id='email' 
               placeholder="email"
               onChange={formik.handleChange}
              
               value={formik.values.email}
               className="input input-bordered w-full" />
               {formik.errors.email ? <span className='my-2 text-red-500'>{formik.errors.email}</span> : null }
            </label>
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
            <label htmlFor='password' className="w-full">
               <div className="label">
               <span className="label-text text-base">Password</span>
               </div>
               <PasswordInput 
                  name='password' 
                  id='password' 
                  placeholder="password"
                  onChange={formik.handleChange}
                  value={formik.values.password} />
               {formik.errors.password ? <span className='my-2 text-red-500'>{formik.errors.password}</span> : null }
               </label>
            <div className="">
            <button className="btn btn-primary my-5" disabled={formik.isSubmitting} type="submit">
               {formik.isSubmitting ? "Loading..." : "Register New Admin"}
            </button>
            </div>
      </form>
    </>
  )
}

export default RegisterAdminForm