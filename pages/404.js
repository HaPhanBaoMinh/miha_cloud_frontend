import Link from 'next/link'
import Image from 'next/image'
import Image1 from '../img/fairytales_96.png'

export default function Custom404 () {
  return (
    <div className='container px-4 mx-auto py-12'>
      <div className='flex flex-col items-center'>
        <div>
          <Image
            src={Image1}
            alt=''
            className='no-drag no-select'
            width={160}
          />
        </div>
        <div className='mt-6 font-bold text-3xl heading-font'>
          Lỗi 404 - Không tìm thấy trang truy vấn
        </div>
        <div className='mt-4'>
          <Link href='/' className='btn btn-outline btn-primary'>
            Trở về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
