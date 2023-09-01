import React, { Fragment, useContext } from 'react'
import styled from '@emotion/styled'
import tw from 'twin.macro'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Logo from '../img/logo4.svg'
import classnames from 'classnames'
import SiteFooter from './SiteFooter'
import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'
import { BRAND_NAME, OG_TITLE } from '@/constants'
import {
  AiOutlineCreditCard,
  AiOutlineDashboard,
  AiOutlineExport,
  AiOutlineLayout,
  AiOutlineSetting,
  AiOutlineCloudServer
} from 'react-icons/ai'
import { PiUserCircleLight } from 'react-icons/pi'
import { IoIosArrowDown } from 'react-icons/io'
import AuthContext from '@/context/AuthProvider'
import { getMyProfileAPI } from '@/apis/user_apis'
import { useEffectOnce } from 'react-use'
import { LoadingSpin } from '@/components/common/Loading'
import Cookies from 'js-cookie'
import { HiPlus } from 'react-icons/hi'
import { getServicesAPI } from '@/apis/deployment_apis'
import { v4 as uuidv4 } from 'uuid'

const ignoreHeaderURLsList = [
  'rgx:^/auth',
  'rgx:^/lien-ket'
]


const Toast = dynamic(() => import('./Toast'), { ssr: false })
const GoTop = dynamic(() => import('./GoTop'), { ssr: false })

function SiteLayout (props) {
  const router = useRouter()
  const { Auth, setAuth } = useContext(AuthContext)
  const [loading, setLoading] = React.useState(false)
  const [serviceList, setServiceList] = React.useState([])


  for (const i of ignoreHeaderURLsList) {
    if (i.startsWith('rgx')) {
      const rgxStr = i.split(':')[1]
      if (router.pathname.match(new RegExp(rgxStr))) {
        return <>{props.children}</>
      }
    } else if (i === router.pathname) return <>{props.children}</>
  }

  const getMyProfile = async () => {
    if (window.location.href.includes('/login') || window.location.href.includes('/register')) {
      setAuth({ is_auth: false })
      return null
    }
    await getMyProfileAPI().then((res) => {
      setAuth(res.data)
    }).catch((err) => {
      console.log(err)
      router.push('/login')
      setAuth(null)
    })
  }

  const onLogout = () => {
    setAuth({ is_auth: false })
    Cookies.remove('token')
    Cookies.remove('refresh')
    Cookies.remove('time_expires')
    router.push('/login')
  }

  const getServices = async () => {
    await getServicesAPI().then((res) => {
      const response = res.data
      setServiceList(response.data)
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffectOnce(() => {
    getMyProfile()
    getServices()
  })

  return (
    <>
      <Header>
        <div className='container mx-auto max-w-[1280px]'>
          <div className='flex items-center'>
            <Link
              href='/'
              aria-label='home'
              className='hidden lg:inline-flex rounded active:outline-dashed'
            >
              <Logo height={40} className='text-gray-800' />
            </Link>
            {/* Desktop */}
            <nav className='hidden lg:block ml-2'>
              <TopNavButton href='/'>
                Dashboard
              </TopNavButton>
              <TopNavButton href='/package'>
                Packages
              </TopNavButton>
            </nav>
            <div className='grow' />
            {
              !Auth
                ? <nav className='hidden lg:flex items-center ml-auto '>
                  <LoadingSpin />
                  </nav>
                : !Auth.is_auth
                    ? <nav className='hidden lg:flex items-center ml-auto '>
                      <div className='bg-secondary border-black border-2 font-semibold active:font-semibold active:outline-dashed'>
                        <TopNavButton href='/login/'>
                          Login
                        </TopNavButton>
                      </div>
                      </nav>
                    : <div className='hidden lg:flex gap-2 lg:max-w-[25%]'>
                      <Menu as='div' className='relative inline-block text-left w-full'>
                        <div className='w-full h-full flex items-center'>
                          <Menu.Button className='w-full bg-secondary border-black border-2 px-2 py-1 flex gap-1 justify-center items-center font-semibold active:font-semibold active:outline-dashed'>
                            <span>NEW</span>
                            <HiPlus />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter='transition ease-out duration-100'
                          enterFrom='transform opacity-0 scale-95'
                          enterTo='transform opacity-100 scale-100'
                          leave='transition ease-in duration-75'
                          leaveFrom='transform opacity-100 scale-100'
                          leaveTo='transform opacity-0 scale-95'
                        >
                          <Menu.Items>
                            <div className='absolute p-2 right-0 w-56 mt-1 origin-top-right bg-white divide-y divide-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                              {
                                serviceList.map((item, index) =>
                                  <Menu.Item key={uuidv4()} >
                                    {({ active }) => (
                                      <Link
                                        className={`${
                                          active ? 'bg-gray-100' : 'text-gray-900'
                                        } group flex items-center w-full px-3 py-2 text-sm`}
                                        href={`/select-repo?type=${item?.slug}`}
                                        title='Create new package'
                                      >
                                        <AiOutlineLayout className='w-5 h-5' />
                                        <span className='ml-2'>{item?.name}</span>
                                      </Link>
                                    )}
                                  </Menu.Item>
                                )
                              }

                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                      <Menu as='div' className='relative inline-block text-left w-full'>
                        <div className='w-full h-full flex items-center'>
                          <Menu.Button className='w-full flex justify-center items-center'>
                            <PiUserCircleLight className='w-7 h-7 mx-1' />
                            <p className='max-w-[70%] mr-1 overflow-hidden text-base overflow-ellipsis h-full text-start flex items-center'>{Auth.username}</p>
                            <IoIosArrowDown className='w-4 h-4' />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter='transition ease-out duration-100'
                          enterFrom='transform opacity-0 scale-95'
                          enterTo='transform opacity-100 scale-100'
                          leave='transition ease-in duration-75'
                          leaveFrom='transform opacity-100 scale-100'
                          leaveTo='transform opacity-0 scale-95'
                        >
                          <Menu.Items>
                            <div className='absolute p-2 right-0 w-56 mt-1 origin-top-right bg-white divide-y divide-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${
                                        active ? 'bg-gray-100' : 'text-gray-900'
                                      } group flex items-center w-full px-3 py-2 text-sm`}
                                  >
                                    <AiOutlineSetting className='w-5 h-5' />
                                    <span className='ml-2'>Settings</span>
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`${
                                        active ? 'bg-gray-100' : 'text-gray-900'
                                      } group flex items-center w-full px-3 py-2 text-sm`}
                                  >
                                    <AiOutlineCreditCard className='w-5 h-5' />
                                    <span className='ml-2'>Billing</span>
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={onLogout}
                                    className={`${
                                        active ? 'bg-gray-100' : 'text-gray-900'
                                      } group flex items-center w-full px-3 py-2 text-sm`}
                                  >
                                    <AiOutlineExport className='w-5 h-5 text-secondary' />
                                    <span className='ml-2 text-secondary'>Logout</span>
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                      </div>
            }
          </div>

          {/* Mobile */}
          <div className='lg:hidden'>
            <Menu>
              <div className='flex py-1 items-center justify-between'>
                <Link
                  href='/'
                  className='rounded inline-flex active:outline-dashed'
                >
                  <Logo height={40} className='text-gray-800' aria-label='home' />
                </Link>
                {
                  !Auth
                    ? <nav className='lg:hidden items-center ml-auto '>
                      <LoadingSpin />
                    </nav>
                    : !Auth.is_auth
                        ? <nav className='lg:hidden items-center ml-auto '>
                        <div className='bg-secondary border-black border-2 font-semibold active:font-semibold active:outline-dashed'>
                          <TopNavButton href='/login/'>
                            Login
                          </TopNavButton>
                        </div>
                      </nav>
                        : <div className='lg:hidden gap-2 lg:max-w-[25%] flex'>
                        <Menu as='div' className='relative inline-block text-left w-full'>
                          <div className='w-full h-full flex items-center'>
                            <Menu.Button className='w-full flex justify-center items-center'>
                              <PiUserCircleLight className='w-7 h-7 mx-1' />
                              <p className='max-w-[70%] mr-1 overflow-hidden text-base overflow-ellipsis h-full text-start flex items-center'>{Auth.username}</p>
                              <IoIosArrowDown className='w-4 h-4' />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter='transition ease-out duration-100'
                            enterFrom='transform opacity-0 scale-95'
                            enterTo='transform opacity-100 scale-100'
                            leave='transition ease-in duration-75'
                            leaveFrom='transform opacity-100 scale-100'
                            leaveTo='transform opacity-0 scale-95'
                          >
                            <Menu.Items>
                              <div className='absolute p-2 right-0 w-64 mt-1 origin-top-right bg-white divide-y divide-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      href='/select-repo?type=static'
                                      title='Create new package'
                                      className={`${
                                        active ? 'bg-gray-100' : 'text-gray-900'
                                      } group flex items-center w-full px-3 py-2 text-sm`}
                                    >
                                      <AiOutlineLayout className='w-5 h-5' />
                                      <span className='ml-2'>Static Site</span>
                                    </Link>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      href='/'
                                      title='Dashboard'
                                      className={`${
                                        active ? 'bg-gray-100' : 'text-gray-900'
                                      } group flex items-center w-full px-3 py-2 text-sm`}
                                    >
                                      <AiOutlineDashboard className='w-5 h-5' />
                                      <span className='ml-2'>Dashboard</span>
                                    </Link>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      className={`${
                                        active ? 'bg-gray-100' : 'text-gray-900'
                                      } group flex items-center w-full px-3 py-2 text-sm`}
                                    >
                                      <AiOutlineSetting className='w-5 h-5' />
                                      <span className='ml-2'>Settings</span>
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      className={`${
                                        active ? 'bg-gray-100' : 'text-gray-900'
                                      } group flex items-center w-full px-3 py-2 text-sm`}
                                    >
                                      <AiOutlineCreditCard className='w-5 h-5' />
                                      <span className='ml-2'>Billing</span>
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={onLogout}
                                      className={`${
                                        active ? 'bg-gray-100' : 'text-gray-900'
                                      } group flex items-center w-full px-3 py-2 text-sm`}
                                    >
                                      <AiOutlineExport className='w-5 h-5 text-secondary' />
                                      <span className='ml-2 text-secondary'>Logout</span>
                                    </button>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                }
              </div>

              <Menu.Items className='flex flex-col bg-gray-200'>
                <Menu.Item>
                  {({ active }) => (
                    <TopNavButton href='/sang-tac/'>
                      Sáng tác
                    </TopNavButton>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <TopNavButton href='/thao-luan/'>
                      Thảo luận
                    </TopNavButton>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <TopNavButton href='/gioi-thieu/'>
                      Giới thiệu
                    </TopNavButton>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <TopNavButton href='/danh-sach/'>
                      Danh sách truyện
                    </TopNavButton>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
        <h1 className='hidden'>{BRAND_NAME} - {OG_TITLE}</h1>
      </Header>
      <Div>
        {props.children}
      </Div>

      <SiteFooter />
      <GoTop />
      <Toast />
    </>
  )
}

export default SiteLayout

// const UserNavButton = ({ href, children, ...otherProps }) => {
//   return (
//
//   )
// }

const TopNavButton = ({ href, children, ...otherProps }) => {
  const router = useRouter()
  return (
    <MenuButton
      href={href}
      color='inherit'
      className={classnames({ active: href.replace(/\//g, '') === router.pathname.split('/')[1] })}
      {...otherProps}
    >
      {children}
    </MenuButton>
  )
}

// language=SCSS prefix=*{ suffix=}
const MenuButton = styled(Link)`
  ${tw`
    px-3
    py-1
    inline-flex
    rounded
    hover:underline
    text-sm
  `}
  &.active {
    ${tw`
      font-bold
      // text-secondary
      underline
    `}
  }
`

const Header = styled.div`
  ${tw`
    w-[100%]
    bg-primary
    sticky
    p-2
  `}
`
const Div = styled.div`
  ${tw`
    w-[100%]
  `}
`
