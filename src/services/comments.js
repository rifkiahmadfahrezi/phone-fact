import API from "@/api/api"

export const createComment = async ({ content }, review_id) => {
   return await API.post(`/reviews/${review_id}/comments`, { content })
}

export const updateComment = async ({ content }, comment_id) => {
   return await API.put(`/comments/${comment_id}`, { content })
}

// for comments owner
export const deleteComment = async (comment_id) => {
   return await API.delete(`/comments/${comment_id}`)
}

// for admin only
export const deleteCommentAdmin = async (comment_id) => {
   return await API.delete(`/comments/${comment_id}/admin`)
}