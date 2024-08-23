import API from "@/api/api"

export const login = async({ username, password }) => {
   return await API.post("/auth/login", { username, password })
}
export const registerUser = async({ email, username, password }) => {
   return await API.post("/auth/register", { email, username, password })
}

export const logout = () => {
   localStorage.removeItem(import.meta.env.VITE_LOCAL_AUTH_KEY)
   window.location.reload()
}

export const changePassword = async ({ current_password, new_password }) => {
   return await API.put("/auth/change-password", { current_password, new_password } )
}