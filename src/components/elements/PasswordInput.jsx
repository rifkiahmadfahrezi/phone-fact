import { cn } from "@/utils/styling"
import { useState } from "react"
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react"

const PasswordInput = ({ className, ...props }) => {
   const [showPass, setShowPass] = useState(false)

  return (
  <>
    <div className="input input-bordered flex items-center gap-2">
      <input 
         {...props}
         type={showPass ? "text" : "password"}
         className={cn(`grow ${className}`)}  />
      <button 
      onClick={() => setShowPass(!showPass)}
      type='button'
      className='btn-neutral'>
         {showPass ? <RiEyeLine /> : <RiEyeOffLine /> }
      </button>
    </div>
  </>
  )
}

export default PasswordInput