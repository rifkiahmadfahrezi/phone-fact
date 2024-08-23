import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <>
      <div className="hero bg-white dark:bg-base-200 min-h-svh">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold">404 Page Not Found</h1>
            <p className="py-6">
              The page you're looking for is not exist
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link className="btn btn-primary" to={"/"}>Go To Home Page</Link>
              <button className="btn btn-secondary" type='button' onClick={() => navigate(-1)}>Back To Previous Page</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFound