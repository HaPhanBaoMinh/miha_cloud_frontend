import React from 'react'
import MenCard from '../img/men-card.svg'
import Link from 'next/link'

function MessagePage ({ msg, ...props }) {
  return (
    <div>
      <div className='container px-4 mx-auto py-12'>
        <div className='flex flex-col items-center'>
          <div>
            <MenCard width={100} />
          </div>
          <div className='mt-6 text-xl'>
            {msg || ''}
          </div>
          <div className='flex mt-4'>
            <Link href='/' className='btn btn-primary'>
              Đi đến trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessagePage
