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

export function Button ({ onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className='hover:cursor-pointer w-full py-2 px-3 border-2 border-black text-black font-semibold active:outline-dashed'
      {...props}
    >
      {props.children}
    </div>
  )
}

export default SubmitButton
