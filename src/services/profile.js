import API from "@/api/api";

// update user/admin profile ID is taken from the JWT
export const updateProfile = async ({
  biodata,
  birthday,
  full_name,
  image_url
}) => {
return await API.put("/profiles", {
    biodata,
    birthday,
    full_name,
    image_url
  })
}
// create user/admin profile ID is taken from the JWT
export const createProfile = async ({
  biodata,
  birthday,
  full_name,
  image_url
}) => {
return await API.post("/profiles", {
    biodata,
    birthday,
    full_name,
    image_url
  })
}
