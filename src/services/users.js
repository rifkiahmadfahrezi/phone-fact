import API from "@/api/api";

// updating user information for user and admin role
export const updateUserInfo = ({ username, email }) => {
   return API.put("/users", { username, email })
}

// delete user account by id (ADMIN ONLY)
export const deleteUserByID = async (id) => {
   if (!id) throw new Error("ID cannot be empty")
   return await API.delete(`/users/${id}`)
}

// will delete user's own account, User ID is taken from JWT
export const deleteMyAccount = ({ password }) => {
   return API.delete(`/users`, { data : { password } })
}