import API from "@/api/api"

export const getAllPhones = async () => {
   const response = await API.get("/phones")
   return response?.data
}
export const createPhoneInfo = async ({ 
   brand_id,
   image_url,
   model,
   price,
   release_date
}) => {
   return await API.post("/phones", { 
      brand_id,
      image_url,
      model,
      price,
      release_date
   })
}
export const updatePhoneInfo = async ({ 
   brand_id,
   image_url,
   model,
   price,
   release_date
}, phone_id) => {
   return await API.put(`/phones/${phone_id}`, { 
      brand_id,
      image_url,
      model,
      price,
      release_date
   })
}
export const createPhoneSpecs = async ({
   camera,
   memory,
   battery,
   network,
   operating_system,
   storage,
   additional_feature
}, phone_id) => {
   return await API.post(`/phones/${phone_id}/specification`, {
      camera,
      memory,
      battery,
      network,
      operating_system,
      storage,
      additional_feature
   })
}
export const UpdatePhoneSpecs = async ({
   camera,
   memory,
   battery,
   network,
   operating_system,
   storage,
   additional_feature
}, phone_id) => {
   return await API.put(`/phones/${phone_id}/specification`, {
      camera,
      memory,
      battery,
      network,
      operating_system,
      storage,
      additional_feature
   })
}


export const deletePhone = async (id) => {
   return await API.delete(`/phones/${id}`)
}