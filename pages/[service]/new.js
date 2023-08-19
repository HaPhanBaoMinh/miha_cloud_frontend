import React, { useState } from 'react'
import { useEffectOnce } from 'react-use'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Form, Input, Select } from 'antd'
import SubmitButton from '@/components/buttons'
import { LoadingSpin } from '@/components/common/Loading'
import { createDeploymentAPI, getPackageListAPI, getRuntimeListAPI } from '@/apis/deployment_apis'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
function NewServicePage ({ serviceName }) {
  const [selectedRepo, setSelectedRepo] = useState(null)
  const router = useRouter()
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState(false)
  const { Option } = Select
  const [selectedRunTime, setSelectedRunTime] = useState(null)
  const [runtimeList, setRuntimeList] = useState(null)
  const [loadingRuntime, setLoadingRuntime] = useState(false)
  const [loadingPackage, setLoadingPackage] = useState(false)
  const [packageList, setPackageList] = useState(null)
  const [selectedPackageCode, setSelectedPackageCode] = useState(null)

  useEffectOnce(() => {
    // eslint-disable-next-line no-undef
    const selectedRepo = JSON.parse(localStorage.getItem('selectedRepo'))
    setSelectedRepo(selectedRepo)
    if (!selectedRepo) router.push('/select-repo')
    getRuntimeList()
    getPackageList()
  })

  const getRuntimeList = () => {
    setLoadingRuntime(true)
    getRuntimeListAPI({ type: router.query.service }).then(res => {
      // setLoadingRuntime(false)
      const response = res.data
      if (response.ok) {
        setRuntimeList(response.data)
        setSelectedRunTime(response.data[0].code)
        setLoadingRuntime(false)
      }
    }).catch(err => {
      setLoadingRuntime(false)
      console.log(err)
    })
  }

  const getPackageList = () => {
    setLoadingPackage(true)
    getPackageListAPI({ type: router.query.service }).then(res => {
      const response = res.data
      if (response.data.length > 0) {
        setSelectedPackageCode(response.data[0].code)
      }
      if (response.ok) {
        setPackageList(response.data)
      }
      setLoadingPackage(false)
    }).catch(err => {
      console.log(err)
    })
  }

  const onCreateService = async (values) => {
    setLoading(true)
    // router.push('/static/[id]', '/static/123')
    const data = {
      ...values,
      githubURL: selectedRepo.url,
      serviceType: router.query.service,
      packageCode: selectedPackageCode,
      runtimeCode: selectedRunTime
    }
    createDeploymentAPI(data).then(res => {
      setLoading(false)
      if (res.data.ok) {
        router.push(`/${router.query.service}/[code]`, `/${router.query.service}/${res.data.code}`)
      } else {
        toast(res.data.msg, { type: 'error' })
      }
      // router.push('/dashboard')
    }).catch(err => {
      console.log(err)
      setLoading(false)
    })
  }

  return (
    <div className='container md:mx-auto py-8 font-semibold px-2 md:px-0'>
      <h1 className='text-2xl'>
        You are deploying a {serviceName} for
        {selectedRepo
          ? <Link title='github-url' target='_blank' href={selectedRepo?.url} className='text-secondary hover:underline' rel='noreferrer'> {selectedRepo?.full_name} </Link>
          : <span>loading...</span>}
      </h1>
      <Form
        form={form}
        layout='horizontal'
        style={{ marginTop: '30px' }}
        requiredMark={false}
        initialValues={{
          name: '',
          branch: 'main',
          root: '',
          buildCommand: 'yarn build',
          startCommand: 'yarn start',
          publishDirectory: 'build',
          projectPort: '3000',
          installCommand: 'yarn'
        }}
        onFinish={onCreateService}
      >

        <Form.Item
          rules={[{ required: true, message: 'Please provide your project name!' }]}
          label={
            <div style={{ display: 'flex', alignItems: 'start', flexDirection: 'column', height: '30px' }}>
              <span style={{ fontWeight: 500, marginRight: '5px' }}>Name</span>
              <span style={{ fontSize: '12px', color: 'gray' }}>A unique name for your {serviceName}.</span>
            </div>
          }
          name='name'
          style={{ marginBottom: '25px' }}
          labelCol={{ span: 7, style: { paddingBottom: 0, fontWeight: 500, textAlign: 'start', display: 'flex', alignItems: 'center', height: '60px' } }}
          wrapperCol={{ span: 24 }}
        >
          <Input placeholder='service-name-example' style={{ border: '1px solid black', borderRadius: '0' }} />
        </Form.Item>

        {router.query.service === 'web-service' && <Form.Item
          rules={[{ required: true, message: 'Please provide your project port!' }]}
          label={
            <div style={{ display: 'flex', alignItems: 'start', flexDirection: 'column', height: '30px' }}>
              <span style={{ fontWeight: 500, marginRight: '5px' }}>Project port</span>
              <span style={{ fontSize: '12px', color: 'gray' }}> Port using in your project </span>
            </div>
          }
          name='projectPort'
          style={{ marginBottom: '25px' }}
          labelCol={{
            span: 7,
            style: {
              paddingBottom: 0,
              fontWeight: 500,
              textAlign: 'start',
              display: 'flex',
              alignItems: 'center',
              height: '60px'
            }
          }}
          wrapperCol={{ span: 24 }}
        >
          <Input placeholder='' style={{ border: '1px solid black', borderRadius: '0' }} />
        </Form.Item>}

        {router.query.service === 'web-service' && <Form.Item
          rules={[{ required: true, message: 'Please provide your project port!' }]}
          label={
            <div style={{ display: 'flex', alignItems: 'start', flexDirection: 'column', height: '30px' }}>
              <span style={{ fontWeight: 500, marginRight: '5px' }}>Runtime</span>
              <span style={{ fontSize: '12px', color: 'gray' }}> The runtime for your web service. </span>
            </div>
          }
          style={{ marginBottom: '25px' }}
          labelCol={{
            span: 7,
            style: {
              paddingBottom: 0,
              fontWeight: 500,
              textAlign: 'start',
              display: 'flex',
              alignItems: 'center',
              height: '60px'
            }
          }}
          wrapperCol={{ span: 24 }}
                                                   >
          <Select
            value={selectedRunTime}
            onChange={value => setSelectedRunTime(value)}
            loading={loadingRuntime}
            style={{ border: '1px solid black', borderRadius: '0', outline: 'none', fontWeight: 500 }}
          >
            {runtimeList?.map((item, index) => (
              <Option key={index} value={item.code}>{item.name}</Option>
            ))}
          </Select>
        </Form.Item>}

        <Form.Item
          rules={[{ required: true, message: 'Please provide your branch!' }]}
          label={
            <div style={{ display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
              <span style={{ fontWeight: 500, marginRight: '5px' }}>Branch</span>
              <span style={{ fontSize: '12px', color: 'gray' }}>The repository branch used for your {serviceName}.</span>
            </div>
          }
          name='branch'
          style={{ marginBottom: '25px' }}
          labelCol={{ span: 7, style: { paddingBottom: 0, fontWeight: 500, textAlign: 'start', display: 'flex', alignItems: 'center', height: '60px' } }}
          wrapperCol={{ span: 24 }}
        >
          <Input placeholder='service-name-example' style={{ border: '1px solid black', borderRadius: '0' }} />
        </Form.Item>

        {router.query.service === 'static' && <Form.Item
          rules={[{ required: false }]}
          label={
            <div style={{ display: 'flex', alignItems: 'start', flexDirection: 'column', maxWidth: '350px' }}>
              <span style={{ fontWeight: 500, marginRight: '5px' }}>Root Directory <span
                className='font-extrathin text-sm text-gray-500'
                                                                                   >
                (Optional)
              </span>
              </span>
              <span style={{ fontSize: '12px', color: 'gray', display: 'inline-block', whiteSpace: 'pre-wrap' }}>Defaults to repository root. When you specify a root directory that is different from your repository root, Render runs all your commands in the specified directory and ignores changes outside the directory.</span>
            </div>
          }
          name='root'
          style={{ marginBottom: '25px' }}
          labelCol={{
            span: 7,
            style: {
              paddingBottom: 0,
              fontWeight: 500,
              textAlign: 'start',
              display: 'flex',
              alignItems: 'center',
              height: '110px'
            }
          }}
          wrapperCol={{ span: 24 }}
                                              >
          <Input placeholder='e.g src' style={{ border: '1px solid black', borderRadius: '0' }} />
        </Form.Item>}

        <Form.Item
          rules={[{ required: false }]}
          label={
            <div style={{ display: 'flex', alignItems: 'start', flexDirection: 'column', maxWidth: '350px' }}>
              <span style={{ fontWeight: 500, marginRight: '5px' }}>Build Command</span>
              <span style={{ fontSize: '12px', color: 'gray', display: 'inline-block', whiteSpace: 'pre-wrap' }}>This command runs in the root directory of your repository when a new version of your code is pushed, or when you deploy manually. It is typically a script that installs libraries, runs migrations, or compiles resources needed by your app.</span>
            </div>
          }
          name='buildCommand'
          style={{ marginBottom: '25px' }}
          labelCol={{
            span: 7,
            style: {
              paddingBottom: 0,
              fontWeight: 500,
              textAlign: 'start',
              display: 'flex',
              alignItems: 'center',
              height: '110px'
            }
          }}
          wrapperCol={{ span: 24 }}
                                              >
          <Input placeholder='' style={{ border: '1px solid black', borderRadius: '0' }} />
        </Form.Item>

        <Form.Item
          rules={[{ required: true, message: 'Please provide your start command' }]}
          label={
            <div style={{ display: 'flex', alignItems: 'start', flexDirection: 'column', height: '30px' }}>
              <span style={{ fontWeight: 500, marginRight: '5px' }}>Start Command</span>
              <span style={{ fontSize: '12px', color: 'gray' }}>This command use to run your project</span>
            </div>
          }
          name='startCommand'
          style={{ marginBottom: '25px' }}
          labelCol={{ span: 7, style: { paddingBottom: 0, fontWeight: 500, textAlign: 'start', display: 'flex', alignItems: 'center', height: '60px' } }}
          wrapperCol={{ span: 24 }}
        >
          <Input placeholder='' style={{ border: '1px solid black', borderRadius: '0' }} />
        </Form.Item>

        <Form.Item
          rules={[{ required: false }]}
          label={
            <div style={{ display: 'flex', alignItems: 'start', flexDirection: 'column', maxWidth: '350px' }}>
              <span style={{ fontWeight: 500, marginRight: '5px' }}>Install Libraries Command</span>
              <span style={{ fontSize: '12px', color: 'gray', display: 'inline-block', whiteSpace: 'pre-wrap' }}>Command to install libraries</span>
            </div>
          }
          name='installCommand'
          style={{ marginBottom: '25px' }}
          labelCol={{ span: 7, style: { paddingBottom: 0, fontWeight: 500, textAlign: 'start', display: 'flex', alignItems: 'center', height: '100px' } }}
          wrapperCol={{ span: 24 }}
        >
          <Input placeholder='e.g build' style={{ border: '1px solid black', borderRadius: '0' }} />
        </Form.Item>

        <div className='pb-10'>
          <div className='w-full grid grid-cols-12 px-3'>
            <p className='col-span-5'>NAME</p>
            <p className='col-span-2 text-center'>RAM</p>
            <p className='col-span-2 text-center'>CPU</p>
            <p className='col-span-3 text-end'>PRICE</p>
          </div>
          {
            loadingPackage ? <LoadingSpin /> : packageList?.map(item => <PackageRow pack={item} key={uuidv4()} onClick={() => setSelectedPackageCode(item?.code)} isSelected={selectedPackageCode === item?.code} />)
          }
        </div>

        <Form.Item>
          <SubmitButton htmltype='submit' className='bg-primary py-2 px-3 border-2 border-black text-black font-semibold active:outline-dashed w-auto'>
            <span className='text-base'>
              {loading ? <LoadingSpin /> : `Create ${serviceName}`}
            </span>
          </SubmitButton>
        </Form.Item>
      </Form>
    </div>
  )
}

function PackageRow ({ pack, onClick, isSelected, ...props }) {
  return (
    <div onClick={onClick} className={`w-full grid grid-cols-12 border ${isSelected && 'border-secondary'} rounded-md ${isSelected && 'bg-opacity'} hover:cursor-pointer hover:opacity-80 py-3 mt-2 px-3`}>
      <div className='col-span-5 flex items-center'>
        {isSelected
          ? <div className='w-4 h-4 rounded-full border-solid border-indigo-600 border-4' />
          : <div className='w-4 h-4 rounded-full border-solid border-slate-400 border-[1.5px]' />}
        <span className='ml-2'>{pack?.name}</span>
      </div>
      <p className='col-span-2 text-center'>{pack?.ram}</p>
      <p className='col-span-2 text-center'>{pack?.cpu}</p>
      <p className='col-span-3 text-end'>{pack?.price} / month</p>
    </div>
  )
}

export default NewServicePage

const getServicesName = (query) => {
  if (query === 'static') return 'static site'
  if (query === 'web-service') return 'web service'
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
