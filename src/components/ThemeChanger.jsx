import React, { useLayoutEffect, useState } from 'react'
import { RiSunLine, RiMoonFill } from '@remixicon/react'
import useLocalStorage from '@/hooks/useLocalStorage'

// business = dark
// corporate = light

const ThemeChanger = () => {
   const { getItem, setItem } = useLocalStorage("theme")
   const [theme, setTheme] = useState(getItem() || "business")

   const changeTheme = () => {
      theme === "business" ? setTheme("corporate") : setTheme("business")
   }


   useLayoutEffect(() => {
      if(theme){
         setItem(theme)
         document.documentElement.setAttribute("data-theme", theme)
         theme === "business"
         ?  document.documentElement.classList.add("dark")
         : document.documentElement.classList.remove("dark")
      }
   },[theme])

  return (
   <button 
      className={`swap swap-rotate ${theme === "business" ? "swap-active" : ""}`} 
      title="Change Theme" 
      onClick={changeTheme}
   >
      <RiSunLine className="swap-on group-hover:animate-[spin_2s_infinite_alternate-reverse]" />
      <RiMoonFill className="swap-off group-hover:animate-wiggle" />
   </button>
  )
}

export default ThemeChanger