import React, { useState } from 'react'
import { getDeploymentDetailAPI } from '@/apis/deployment_apis'
import { useRouter } from 'next/router'
import { useEffectOnce } from 'react-use'
import { AiOutlineGithub } from 'react-icons/ai'
import Link from 'next/link'
import { DotStatus, getDeployStatus, SplitGithubUrl } from '@/utils'
import { FaCodeBranch } from 'react-icons/fa'
import { HiOutlineClipboardCopy } from 'react-icons/hi'
import copy from 'copy-to-clipboard'
import { LoadingSpin } from '@/components/common/Loading'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import { DJANGO_BASE_WS } from '@/constants'
import dynamic from 'next/dynamic'
import classnames from 'classnames'
import styled from '@emotion/styled'
import tw from 'twin.macro'
import DeploymentSettings from '@/components/Settings'

const Terminal = dynamic(() => import('@/components/Terminal'), { ssr: false })

function DeploymentDetail ({ serviceName }) {
  const [deployment, setDeployment] = useState()
  const [loading, setLoading] = useState()
  const router = useRouter()
  const [status, setStatus] = useState('S')
  const [selectTab, setSelectTab] = useState('logs')

  const getDeploymentDetail = async () => {
    setLoading(true)
    await getDeploymentDetailAPI({ code: router.query?.code }).then(res => {
      const deploymentData = res.data.data
      setDeployment(deploymentData)
      setStatus(deploymentData?.status)
      return deploymentData
    }).then(deploymentData => {
      connectSocket(`${DJANGO_BASE_WS}/ws/deployment/${deploymentData.name}`)
    }).catch(e => {
      console.log(e)
    }).finally(() => {
      setLoading(false)
    })
  }

  useEffectOnce(() => {
    getDeploymentDetail()
  })

  const connectSocket = (url) => {
    const socket = new W3CWebSocket(url)
    socket.onmessage = (message) => {
      const data = JSON.parse(message.data)
      setStatus(data.status)
    }
  }

  const copyToClipboard = (url) => {
    copy(url)
  }

  if (loading || !deployment) {
    return (
      <div className='container mx-auto py-8 h-[70vh]'>
        <LoadingSpin />
      </div>
    )
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='grid grid-cols-12'>
        <div className='col-span-9 flex flex-col gap-1'>
          <p className='uppercase flex gap-1 text-secondary '>{serviceName}</p>
          <div className='py-1 flex gap-3 items-center'>
            <h2 className='text-xl font-semibold'>{deployment?.name}</h2>
            <span className='py-0.5 px-3 font-semibold bg-secondary rounded'>{deployment?.package_name}</span>
          </div>
          <Link href={`${deployment?.git_url}/tree/${deployment?.git_branch}`} title='github url' className='flex hover:underline gap-1 items-center font-medium py-1'>
            <AiOutlineGithub className='text-xl' />
            <p className='flex items-center'>
              {SplitGithubUrl(deployment?.git_url).username} / {SplitGithubUrl(deployment?.git_url).repoName}
            </p>
            <FaCodeBranch />
            <p>{deployment?.git_branch}</p>
          </Link>
          <div className='flex gap-1 items-center'>
            <Link href={deployment?.host_url} target='_blank' title='host name' className='text-secondary font-medium hover:underline' rel='noreferrer'>
              {deployment?.host_url}
            </Link>
            <HiOutlineClipboardCopy onClick={() => copyToClipboard('/')} className='h-5 w-5 text-secondary hover:cursor-pointer active:outline' />
          </div>
        </div>
        <div className='col-span-3 flex justify-end'>
          <span className='bg-gray-200 py-1 px-2 gap-1 rounded h-fit flex items-center'>
            <DotStatus status={status} /> {getDeployStatus(status)}
          </span>
        </div>
      </div>
      <div className='grid grid-cols-12 pt-5'>
        <div className='col-span-3 pt-2 flex gap-2 flex-col items-start '>
          <SiteButton onClick={() => setSelectTab('logs')} className={`${classnames({ active: selectTab === 'logs' })}`}>
            Build logs
          </SiteButton>
          <SiteButton onClick={() => setSelectTab('settings')} className={`${classnames({ active: selectTab === 'settings' })}`}>
            Settings
          </SiteButton>
        </div>
        <div className='col-span-9 px-10 flex gap-3 flex-col justify-end'>
          {selectTab === 'logs' && <Terminal deploymentCode={deployment?.code} buildNumber={deployment?.build_time} lastedDeploy={deployment?.lasted_deploy} status={status} />}
          {selectTab === 'settings' && <DeploymentSettings deployment={deployment} serviceName={serviceName} />}
        </div>
      </div>
    </div>
  )
}

const SiteButton = styled.button`
  ${tw`
    hover:bg-gray-50
    font-semibold
    transition-all 
    text-base 
    w-full 
    px-3 
    text-start 
    py-2
    rounded
  `}
  &.active {
    ${tw`
      bg-gray-200
    `}
  }
`

const getServicesName = (query) => {
  if (query === 'static') return 'static site'
  return 'service'
}

export async function getServerSideProps (context) {
  const { query } = context
  return {
    props: {
      serviceName: getServicesName(query.service)
    }
  }
}

export default DeploymentDetail
