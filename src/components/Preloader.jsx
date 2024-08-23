import { Loading } from "react-daisyui"

const Preloader = () => {
  return (
    <div className='fixed inset-0 w-screen h-svh grid place-items-center bg-base-100 z-[9999]'>
      <div>
         <Loading size="lg"/>
         <span className="sr-only">Loading the page, please wait</span>
      </div>
    </div>
  )
}

export default Preloader