import React from 'react'

function Span ({ boldText, underlineText, ...props }) {
  return (
    <p className='flex gap-2 text-base items-center'>
      {boldText && <span className='bg-dark_main-100 text-white font-extrabold px-2 py-1'>{boldText}</span>}
      {underlineText &&
        <span
          className='text-dark_main-100 dark:text-white border-b-2 border-dark_main-100 dark:border-white font-extrabold'
        >{underlineText}
        </span>}
    </p>
  )
}

export default Span
