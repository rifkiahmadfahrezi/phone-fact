import API from "@/api/api";

export const createBrand = async ({ name, logo_url, description }) =>{
   return await API.post("/brands", { name, logo_url, description })
} 

export const updateBrand = async ({ name, logo_url, description }, id) =>{
   return await API.put(`/brands/${id}`, { name, logo_url, description })
} 
export const deleteBrand = async (id) =>{
   return await API.delete(`/brands/${id}`)
} 
