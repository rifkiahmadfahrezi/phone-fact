import { Outlet } from "react-router-dom"
import Navbar from "@/components/Navbar"
import { Link } from "react-router-dom"
import { 
    RiGroupLine,
    RiUser2Fill,
    RiSmartphoneLine,
    RiMessage2Line,
    RiDashboardFill,
    RiMenuFill,
    RiCloseLine,
    RiPriceTag3Line,
    RiWechatLine
} from "@remixicon/react"
import { useLocation } from "react-router-dom"
import { cn } from "@/utils/styling"
import { Suspense } from "react"
import Preloader2 from "@/components/Preloader2"

const dashboardMenu = [
  {
    text: "dashboard",
    link: "/dashboard",
    icon: <RiDashboardFill />
  },
  {
    text: "admins",
    link: "/dashboard/admins",
    icon: <RiUser2Fill />
  },
  {
    text: "users",
    link: "/dashboard/users",
    icon: <RiGroupLine />
  },
  {
    text: "brands",
    link: "/dashboard/brands",
    icon: <RiPriceTag3Line />
  },
  {
    text: "phones",
    link: "/dashboard/phones",
    icon: <RiSmartphoneLine />
  },
  {
    text: "reviews",
    link: "/dashboard/reviews",
    icon: <RiMessage2Line />
  },
  {
    text: "comments",
    link: "/dashboard/comments",
    icon: <RiWechatLine />
  },
] 

const DashboardLayout = () => {
  const { pathname } = useLocation()
  const isActive = (path) => {
      return path === "/dashboard" && pathname !== "/dashboard"
      ? false
      : pathname === path || pathname.startsWith(path + '/');
  }
  return (
    <>
      <Navbar />
        <div className="drawer lg:drawer-open min-h-svh">
         <input id="dashboard-menu" type="checkbox" className="drawer-toggle" />
         <div className="drawer-content mt-16 lg:mt-5 lg:mr-5">
            {/* Page content here */}
            <label htmlFor="dashboard-menu" className="btn btn-primary drawer-button lg:hidden absolute top-5 left-5 btn-circle">
              <RiMenuFill />
            </label>
            <main className='lg:w-full mx-auto mt-4 p-5 min-h-fit mb-36 max-w-screen-xl card card-body bg-white dark:bg-base-200 shadow'>
                <Suspense fallback={ <Preloader2/> }>
                  <Outlet />
                </Suspense>
            </main>
         </div>
         <aside className="drawer-side mr-5 z-[99]">
            <label htmlFor="dashboard-menu" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-white  dark:bg-base-300 text-base-content min-h-screen w-80 space-y-2 p-4">
            <label htmlFor="dashboard-menu" aria-label="close sidebar" className="inherit lg:hidden ml-auto my-5 btn btn-error btn-circle btn-outline">
                <RiCloseLine />
            </label>
              {dashboardMenu.map((menu, i) => (
                <li key={i}>  
                  <Link 
                    preventScrollReset={false}
                    className={cn(
                      'capitalize text-base flex items-center justify-start gap-4 py-4',
                      isActive(menu.link) && 'bg-primary/45 hover:bg-primary/75 dark:bg-primary/45 dark:hover:bg-primary/75 dark:text-white'
                    )} 
                    to={menu.link}>
                    {menu.icon}  
                    {menu.text}
                    </Link>
                </li>
              ))}
            </ul>
         </aside>
      </div>
    </>
  )
}

export default DashboardLayout