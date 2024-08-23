import API from "@/api/api";

export const registerAdmin = async({ username, email, password }) => {
   return await API.post("/admins/register", { username, email, password })
}

// delete admin account, update user information(username,email) is at the users.js