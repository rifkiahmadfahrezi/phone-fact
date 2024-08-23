import API from "@/api/api";

export const createReview = async ({ rating, content }, phone_id) => {
   return await API.post(`/phones/${phone_id}/reviews`, { rating, content })
}
export const updateReview = async ({ rating, content }, review_id) => {
   return await API.put(`/reviews/${review_id}`, { rating, content })
}

export const deleteReview = async (review_id) => {
   return await API.delete(`/reviews/${review_id}`)
}