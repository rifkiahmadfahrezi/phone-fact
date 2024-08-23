import React from 'react'
import Navbar from '@/components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '@/components/Footer'

const MainLayout = () => {

  return (
    <>
      <Navbar />
      <main className='max-w-screen-lg w-full mx-auto mt-4 px-3 min-h-svh'>
         <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default MainLayout