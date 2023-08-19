import React from 'react'
import { BRAND_NAME, SITE_BASE_URL } from '@/constants'
import { NextSeo } from 'next-seo'
import 'swiper/css'
import 'swiper/css/pagination'
import { useEffectOnce } from 'react-use'
import { getDeploymentListAPI } from '@/apis/deployment_apis'
import { DotStatus, getDeployStatus } from '@/utils'
import { BsThreeDots } from 'react-icons/bs'
import { LoadingSpin } from '@/components/common/Loading'
import { v4 as uuidv4 } from 'uuid'
import TimeAgo from 'react-timeago'
import { useRouter } from 'next/router'

function Index ({ jobs, ...props }) {
  const pageTitle = 'MIHA CLOUD - Dịch vụ đám mây'
  const pageDesc = 'Dự án khởi nghiệp đầu tiên của  chúng tôi - MIHA CLOUD - Dịch vụ đám mây'
  const [loading, setLoading] = React.useState(false)
  const [deployments, setDeployments] = React.useState(null)
  const router = useRouter()

  useEffectOnce(() => {
    setLoading(true)
    getDeploymentListAPI().then(res => {
      setLoading(false)
      console.log(res)
      if (res.data.ok) {
        setDeployments(res.data.data)
      }
    }).catch(err => {
      console.log(err)
      setLoading(false)
    })
  })

  const onClickDeployment = (deployment) => {
    router.push(`/${deployment.service_name}/[code]`, `/${deployment.service_name}/${deployment.code}`)
  }

  if (loading || !deployments) {
    return (
      <div className='container mx-auto py-8 h-[70vh]'>
        <LoadingSpin />
      </div>
    )
  }

  return (
    <>
      <NextSeo
        title={`${pageTitle} - ${BRAND_NAME}`}
        description={pageDesc}
        canonical={SITE_BASE_URL}
      />
      <div className='container mx-auto py-8'>
        <h2 className='text-secondary text-xl font-semibold'>Overview</h2>
        <div className='relative rounded-xl overflow-auto'>
          <div className='shadow-sm overflow-hidden my-8'>
            <table className='border-collapse table-auto w-full text-sm'>
              <thead>
                <tr>
                  <th
                    className='border-b dark:border-slate-600 font-medium pt-0 pb-3 text-left px-3'
                  >NAME
                  </th>
                  <th
                    className='border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-left'
                  >STATUS
                  </th>
                  <th
                    className='border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-left'
                  >TYPE
                  </th>
                  <th
                    className='border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-left'
                  >LAST DEPLOYED
                  </th>
                  <th
                    className='border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-left'
                  />
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-slate-800'>
                {
                  deployments?.map(item => <DeploymentRow onClick={() => onClickDeployment(item)} deployment={item} key={uuidv4()} />)
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Index

function DeploymentRow ({ deployment, ...props }) {
  return (
    <tr className='hover:bg-gray-100 hover:cursor-pointer' {...props} >
      <td
        className='border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-3'
      >
        {deployment?.name}
      </td>
      <td
        className='border-b border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400'
      >
        <span className='bg-gray-200 py-1 w-fit px-2 t text-black font-semibold gap-1 rounded h-fit flex items-center'>
          <DotStatus status={deployment.status} /> {getDeployStatus(deployment.status)}
        </span>
      </td>
      <td
        className='border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400'
      >
        Static Site
      </td>
      <td
        className='border-b border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400'
      >
        <TimeAgo date={deployment?.lasted_deploy} />
      </td>
      <td
        className='border-b border-slate-100 dark:border-slate-700 text-right text-slate-500'
      >
        <BsThreeDots className='text-xl ' />
      </td>
    </tr>
  )
}


