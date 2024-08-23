

const useLocalStorage = ( key ) => {

   const getItem = () => {
      return JSON.parse(localStorage.getItem(key) || 'null')
   }

   const setItem = (value) => {
      localStorage.setItem(key, JSON.stringify(value))
   }

   const removeItem = () => {
      localStorage.removeItem(key)
   }

  return { getItem, setItem, removeItem }
}

export default useLocalStorage