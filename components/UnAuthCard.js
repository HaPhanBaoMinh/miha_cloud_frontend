import React from 'react'
import Player1 from '../img/fairytales_73.png'
import Link from 'next/link'
import Image from 'next/image'

function UnAuthCard (props) {
  return (
    <div>
      <div className='container px-4 mx-auto py-12'>
        <div className='flex flex-col items-center'>
          <div>
            <Image
              src={Player1}
              alt=''
              width={300}
              className='no-drag no-select'
            />
          </div>
          <h1 className='mt-6 text-xl'>
            Bạn cần đăng nhập để truy cập trang này!
          </h1>
          <div className='flex mt-4'>
            <Link href='/account/login/' className='text-primary-600'>
              Đăng Nhập / Đăng Ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnAuthCard
