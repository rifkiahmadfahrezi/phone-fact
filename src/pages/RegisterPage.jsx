import React, { useState } from 'react'
import { RiUser2Fill, RiKey2Fill, RiEyeLine, RiEyeOffLine, RiAtLine } from '@remixicon/react'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '@/services/auth'
import { validEmailRegex } from '@/lib/regex'
import useAlert from '@/hooks/useAlert'
import { Link } from 'react-router-dom'

const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Username required';
  } else if (values.username.length < 5) {
    errors.username = 'Username must be at least 5 characters';
  }

  if(!values.email){
    errors.password = 'Email required';
  }else if (!validEmailRegex.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.password) {
    errors.password = 'Password required';
  }else if(values.password.length < 5){
    errors.password = 'Password must be at least 5 characters';
  }
  if (values.password !== values.repeatPassword){
    errors.repeatPassword = "Password didn't match"
  }

  return errors;
};


const RegisterPage = () => {
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()
  const { showAlert } = useAlert()


  const formik = useFormik({
    initialValues: {
      email: "",
      username: "", 
      password: "",
      repeatPassword: ""
    },
    validate,
    onSubmit: (values, { setSubmitting }) => {
      // console.log(values)
      const { email, username, password } = values


        const handleRegist = async (value) => {
          try {
            const response = await registerUser(value)

            if (response.status !== 200){
              throw new Error("An error in occured")
            }

            showAlert("success", "Register succes, Please login to access your accout", 4000)
            setTimeout(() => {
              navigate("/login")
            }, 2000)
          } catch (error) {
            showAlert("error", error.response.data.message || "an error is occured", 4000)
            console.error(error)
          }finally{
            setSubmitting(false)
          }
        } 
        
      handleRegist({ email,username,password })
    }
  })


  


  return (
    <>
      <div className="card card-body bg-base-200 max-w-lg mx-auto">
          <h1 className='text-2xl mb-3 font-bold'>Register</h1>


          <form onSubmit={formik.handleSubmit} action="" className='space-y-4'>
            
            <div>
              <label className="input input-bordered flex items-center gap-2">
                <RiAtLine className="h-4 w-4 opacity-70"/>
                <input 
                  autoFocus
                  type="email"
                  className="grow" 
                  placeholder="Email"
                  name='email'
                  onChange={formik.handleChange} />
                </label>
                {formik.errors.email ? <span className='text-red-500 my-2'>{formik.errors.email}</span> : null }
            </div>
            <div>
              <label className="input input-bordered flex items-center gap-2">
                <RiUser2Fill className="h-4 w-4 opacity-70"/>
                <input 
                  type="text"
                  className="grow" 
                  placeholder="Username"
                  name='username'
                  onChange={formik.handleChange} />
                </label>
                {formik.errors.username ? <span className='text-red-500 my-2'>{formik.errors.username}</span> : null }
            </div>

            <div>
              <label className="input input-bordered flex items-center gap-2">
                <RiKey2Fill className="h-4 w-4 opacity-70"/>
                <input 
                  type={showPass ? "text" : "password"}
                  className="grow" 

                  placeholder="Password"
                  name='password'
                  onChange={formik.handleChange} />
                  <button 
                    onClick={() => setShowPass(!showPass)}
                    type='button'
                    className='btn-neutral'>
                      {showPass ? <RiEyeLine /> : <RiEyeOffLine /> }
                  </button>
              </label>
              {formik.errors.password ? <span className='text-red-500 my-2'>{formik.errors.password}</span> : null }
            </div>
            <div>
              <label className="input input-bordered flex items-center gap-2">
                <RiKey2Fill className="h-4 w-4 opacity-70"/>
                <input 
                  type={showPass ? "text" : "password"}
                  className="grow" 

                  placeholder="Reapeat password"
                  name='repeatPassword'
                  onChange={formik.handleChange} />
                  <button 
                    onClick={() => setShowPass(!showPass)}
                    type='button'
                    className='btn-neutral'>
                      {showPass ? <RiEyeLine /> : <RiEyeOffLine /> }
                  </button>
              </label>
              {formik.errors.repeatPassword ? <span className='text-red-500 my-2'>{formik.errors.repeatPassword}</span> : null }
            </div>

            <button 
              disabled={formik.isSubmitting}
              className='capitalize btn btn-primary w-full' 
              type='submit'>
                {formik.isSubmitting ? "Loading..." : "Register"}
              </button>
          </form>

          <div className="divider">Already have an account?</div>

          <Link to={"/login"} className='btn btn-secondary'>Login</Link>

      </div>
    </>
  )
}

export default RegisterPage