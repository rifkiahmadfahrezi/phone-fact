import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'

import { RiAccountCircleLine, RiMenuLine,RiCloseLine } from '@remixicon/react'
import { logout } from '@/services/auth'
import ThemeChanger from './ThemeChanger'
import { cn } from '@/utils/styling'

const publicMenu = [ "/", "/phones", "/brands" ] // public
const adminMenu = [ "/dashboard" ] // admin only

const Navbar = ({className, ...props}) => {
   const { auth } = useAuth()
   

   const handleLogout = () => {
      if(confirm("Logout?")){
         logout()
      }
   }

  return (
   <>
      <div className="drawer">
      <input id="navbar" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
         {/* Navbar */}
         <nav className={cn(`navbar bg-white text-white-content dark:bg-base-300 dark:text-base-content w-full z-50 ${className}`)} {...props}>
            <div className="mx-2 flex-1 px-2">
               <Link className="btn btn-ghost text-base md:text-xl" to={"/"}>
                  <img className='rotate-12' src="/favicon-32x32.png" alt="" />
                  <span className='hidden md:block'>PhoneFact</span>
               </Link>
            </div>
            <div className="flex-none lg:hidden space-x-3">
               {/* mobile menu */}
              
               {(auth?.token) && 
                  <>     
                     <div className="dropdown dropdown-hover dropdown-end">
                        <div tabIndex={0} role="button" className="btn m-1">
                           <RiAccountCircleLine />
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 text-base-content rounded-box z-[1] w-52 p-2 shadow flex flex-col gap-2 ">
                           <li>
                              <Link to={`users/${auth?.id}/profile`} className='capitalize'>profile</Link>
                           </li>
                           <li>
                              <button 
                                 onClick={() => handleLogout()}
                                 className='btn btn-sm btn-error'>Logout</button>
                           </li>
                        </ul>
                     </div>
                     
                  </>
               }
                <ThemeChanger />
            <label htmlFor="navbar" aria-label="open sidebar" className="btn btn-square btn-ghost">
                  <RiMenuLine />
            </label>
            </div>
            <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal flex gap-3 items-center">
               {/*  on desktop menu */}
               {publicMenu.map(menu => (
                     <li key={menu}>
                        <Link to={menu} className='capitalize'>{menu == "/" ? "home" : menu.replace("/", "")}</Link>
                     </li>
                  ))
               }
               {(auth?.token && auth?.role?.toLowerCase() === "admin") && 
                  adminMenu.map(menu => (
                     <li key={menu}>
                        <Link to={menu} className='capitalize'>{menu.replace("/", "")}</Link>
                     </li>
                  ))
               }
               {!auth?.token &&
                  <>
                     <li>
                        <Link to={"/login"} className='capitalize btn'>login</Link>
                     </li>
                     <li>
                        <Link to={"/register"} className='capitalize btn btn-primary'>register</Link>
                     </li>
                  </>
               }
               <li><ThemeChanger /></li>
               {(auth?.token) && 
                  <>     
                     <div className="dropdown dropdown-hover dropdown-end">
                        <div tabIndex={0} role="button" className="btn m-1">
                           <RiAccountCircleLine />
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow flex flex-col gap-2 ">
                           <li>
                              <Link to={`/users/${auth?.id}/profile`} className='capitalize'>profile</Link>
                           </li>
                           <li>
                              <button 
                                 onClick={() => handleLogout()}
                                 className='btn btn-sm btn-error'>Logout</button>
                           </li>
                        </ul>
                     </div>
                     
                  </>
               }
            </ul>
            </div>
         </nav>
      </div>
      <div className="drawer-side z-50">
         {/* drawer mobile menu */}
         <label htmlFor="navbar" aria-label="close sidebar" className="drawer-overlay"></label>
         <ul className="menu flex flex-col relative  bg-base-200 min-h-full w-full gap-2  max-w-80 p-4">
            <div className="mt-24 space-y-2">
                <label htmlFor="navbar" aria-label="close sidebar" className="absolute top-4 right-4 btn btn-outline btn-circle">
               <RiCloseLine />
            </label>
               {publicMenu.map(menu => (
                     <li className='w-full text-center' key={menu}>
                        <Link to={menu} className='capitalize text-base'>{menu == "/" ? "home" : menu.replace("/", "")}</Link>
                     </li>
                  ))
               }
               
               {(auth?.token && auth?.role?.toLowerCase() === "admin") && 
                  adminMenu.map(menu => (
                     <li className='w-full text-center' key={menu}>
                        <Link to={menu} className='capitalize text-base'>{menu.replace("/", "")}</Link>
                     </li>
                  ))
               }
               
               {!auth?.token &&
                  <>
                     <li className='text-center'>
                        <Link 
                           to={"/login"} 
                           className=' capitalize btn btn-neutral'>login</Link>
                     </li>
                     <li className='text-center'>
                        <Link 
                           to={"/register"} 
                           className=' capitalize btn btn-primary'>register</Link>
                     </li>
                  </>
               }
            </div>
         </ul>
      </div>
      </div>
   </>

  )
}

export default Navbar