import React from 'react'

const Comment = ({content}) => {
  return (
    <>
      <article className="w-full chat chat-end">
         <div className="w-full chat-bubble">{content}</div>
      </article>
    </>
  )
}

export default Comment