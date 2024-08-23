import React, { useEffect, useState } from 'react'
import { RiUser2Fill, RiKey2Fill, RiEyeLine, RiEyeOffLine, RiCloseLine, RiLoader2Line } from '@remixicon/react'
import { useFormik } from 'formik'
import API from '@/api/api'
import useAuth from '@/hooks/useAuth'
import useLocalStorage from '@/hooks/useLocalStorage'
import { useNavigate } from 'react-router-dom'
import { login } from '@/services/auth'
import { Link } from 'react-router-dom'


const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Required';
  } else if (values.username.length < 5) {
    errors.username = 'Must be at least 5 characters';
  }


  if (!values.password) {
    errors.password = 'Required';
  }

  return errors;
};


const LoginPage = () => {
  const [showPass, setShowPass] = useState(false)
  const [errorLogin, setErrorLogin] = useState(null)
  const [loginData, setLoginData] = useState({token: null, username: null})
  const { setAuth } = useAuth()
  const { setItem } = useLocalStorage(import.meta.env.VITE_LOCAL_AUTH_KEY)
  const navigate = useNavigate()

  useEffect(() => {
    let apiReqIntercep
    if(loginData.token){
      // insert jwt token to headers
      apiReqIntercep = API.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${loginData.token}`
        return config
      }, err => Promise.reject(err))
      getRoleFromToken(loginData.token)
    }

  }, [loginData])


  const getRoleFromToken = async (token) => {
    try {
      const response  = await API.get("/users/role")
      const { data } = response.data

      // console.log(data)

      const { email,id,username } = loginData.user

      const authData = {
        email,
        id,
        username,
        token,
        role: data.role_name,
      }

      setItem(authData)
      setAuth(authData)
      navigate("/")
    } catch (error) {
      console.error(error)
    }
  }


  const handleLogin = async (value, setSubmitting) => {
    try {
      const response = await login(value)
      const { data } = response.data
      // console.log(data)
      setLoginData(data)
    } catch (error) {
      setErrorLogin(error.response.data.message || "Terjadi Kesalahan")
      console.error(error)
    }finally{
      setSubmitting(false)
    }
  }

  const formik = useFormik({
    initialValues: {
      username: "", 
      password: ""
    },
    validate,
    onSubmit: (values, { setSubmitting }) => {
      handleLogin(values, setSubmitting)
    }
  })


  return (
    <>
      <div className="card card-body bg-base-200 max-w-lg mx-auto">
          {errorLogin &&
            <div className="badge badge-error gap-2 py-3 mx-auto">
              {errorLogin}
              <button type='button' onClick={() => setErrorLogin(null)}>
                <RiCloseLine />
              </button>
            </div>
          }
          <h1 className='text-2xl mb-3 font-bold'>Login</h1>


          <form onSubmit={formik.handleSubmit} action="" className='space-y-4'>
            
            <div>
              <label className="input input-bordered flex items-center gap-2">
                <RiUser2Fill className="h-4 w-4 opacity-70"/>
                <input 
                  autoFocus
                  type="text"
                  className="grow" 
                  placeholder="Username"
                  name='username'
                  onChange={formik.handleChange} />
                </label>
                {formik.errors.username ? <span className='my-2 text-red-500'>{formik.errors.username}</span> : null }
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
              {formik.errors.password ? <span className='my-2 text-red-500'>{formik.errors.password}</span> : null }
            </div>

            <button 
              className='capitalize btn btn-primary w-full' 
              disabled={formik.isSubmitting}
              type='submit'>
                {formik.isSubmitting ? "Loading..." : "Login"}
              </button>
          </form>

          <div className="divider">Don't have an account?</div>

          <Link to={"/register"} className='btn btn-secondary'>Register</Link>
      </div>
    </>
  )
}

export default LoginPage