import React from 'react'

function SubmitButton ({ onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      className='bg-primary w-full py-2 border-2 border-black text-black font-semibold active:outline-dashed'
      {...props}
    >
      {props.children}
    </button>
  )
}

export default SubmitButton
