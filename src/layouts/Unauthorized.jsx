import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const Unauthorized = () => {

  const { auth } = useAuth()
  const navigate = useNavigate()

  return (
   <div className="hero bg-base-200 min-h-svh">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">401 Unauthorized</h1>
          <p className="py-6">
            You don't have access to this page 
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link className="btn btn-primary" to={"/"}>Go To Home Page</Link>
            {!auth?.token && <Link className="btn btn-secondary" to={"/login"}>Go To Login Page</Link>}
            {auth?.token && <button className="btn btn-secondary" type='button' onClick={() => navigate(-1)}>Back To Previous Page</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized