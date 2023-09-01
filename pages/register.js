import React from 'react'
import { NextSeo } from 'next-seo'
import { BRAND_NAME, SITE_BASE_URL } from '@/constants'
import { Form, Input } from 'antd'
import SubmitButton from '@/components/buttons'
import { LoadingSpin } from '@/components/common/Loading'
import { AiFillGithub, AiOutlineGoogle } from 'react-icons/ai'
import Link from 'next/link'
import { loginAPI } from '@/apis/user_apis'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

function RegisterPage () {
  const pageTitle = 'MIHA CLOUD - Dịch vụ đám mây'
  const pageDesc = 'Đăng kí'
  const router = useRouter()
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)

  const onLogin = (values) => {
    const p = {
      ...values
    }
    setLoading(true)
    loginAPI(p).then((res) => {
      setLoading(false)
      toast.success(`Welcome ${res.data.username}!`)
      Cookies.set('token', res.data.access)
      Cookies.set('refresh', res.data.refresh)
      Cookies.set('time_expires', res.data.time_expires)

      // eslint-disable-next-line no-undef
      setTimeout(() => {
        return router.push('/')
      }, 1000)
      // eslint-disable-next-line node/handle-callback-err
    }).catch((err) => {
      console.log(err)
      toast.error('Username or password is incorrect!')
      setLoading(false)
    })
  }

  return (
    <>
      <NextSeo
        title={`${pageTitle} - ${BRAND_NAME}`}
        description={pageDesc}
        canonical={SITE_BASE_URL}
      />
      <div className='container mx-auto'>
        <div className='grid grid-cols-12 py-5'>
          <div className='col-span-0 sm:col-span-2 lg:col-span-4' />
          <div className='col-span-12 sm:col-span-8 lg:col-span-4 h-[550px] flex flex-col items-center justify-start gap-3'>
            <h1 className='text-xl pt-5 pb-2 font-semibold text-secondary'>Sign in to MIHA CLOUD</h1>

            <Form
              layout='vertical'
              style={{ width: '100%' }}
              name='form-login'
              form={form}
              initialValues={{
                username: '',
                password: ''
              }}
              onFinish={onLogin}
            >
              <Form.Item
                rules={[{ required: true, message: 'Please provide your username!' }]}
                label='Username' name='username'
                style={{ marginBottom: '15px' }} labelCol={{ span: 24, style: { paddingBottom: 0, fontWeight: 500 } }}
              >
                <Input placeholder='username example' style={{ border: '2px solid black', borderRadius: '0' }} />
              </Form.Item>
              <Form.Item
                rules={[{ required: true, message: 'Please provide your password!' }]}
                label='Password' name='password'
                labelCol={{ span: 24, style: { paddingBottom: 0, fontWeight: 500 } }}
              >
                <Input placeholder='correct horse battery staple' style={{ border: '2px solid black', borderRadius: '0' }} />
              </Form.Item>
              <Form.Item>
                <SubmitButton htmltype='submit'>
                  <span className='text-base'>
                    {loading ? <LoadingSpin /> : 'Sign in'}
                  </span>
                </SubmitButton>
              </Form.Item>
            </Form>

            <div className='w-full flex items-center pb-5 justify-between'>
              <div className='border-t border-black h-0 w-[40%]' />
              <span className='col-span-2 text-base font-semibold'>
                OR
              </span>
              <div className='border-t border-black h-0 w-[40%]' />
            </div>

            <div className='w-full h-[40px] mb-5 flex gap-5'>
              <div className='flex items-center w-[50%] border-2 border-black justify-center gap-2 hover:cursor-pointer active:outline-dashed'>
                <AiFillGithub className='w-[30px] h-[30px]' />
                <span className='text-sm'>Github</span>
              </div>

              <div className='flex items-center w-[50%] border-2 border-black justify-center gap-2 hover:cursor-pointer active:outline-dashed'>
                <AiOutlineGoogle className='w-[30px] h-[30px]' />
                <span className='text-sm'>Google</span>
              </div>
            </div>

            <div className='flex gap-1'>
              <span className='text-base font-semibold'>Don't have an account?</span>
              <Link href='/register' title='register' className='text-base font-semibold text-secondary hover:underline'>Sign up</Link>
            </div>
            <div className='flex gap-1'>
              <span className='text-sm italic text-gray-400 '>Forgot your password?</span>
              <Link href='/password-reset' title='password reset' className='text-sm underline italic hover:underline'>Reset it</Link>
            </div>

          </div>
          <div className='col-span-0 sm:col-span-2 lg:col-span-4' />
        </div>
      </div>
    </>
  )
}

export default RegisterPage
