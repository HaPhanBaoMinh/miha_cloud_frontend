import React, { useState } from 'react'
import { LoadingSpin } from '@/components/common/Loading'
import { Button } from '@/components/buttons'
import { Form, Input } from 'antd'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { updateDeploymentSettingsAPI } from '@/apis/deployment_apis'
import { toast } from 'react-toastify'
import { useEffectOnce } from 'react-use'

function EnvironmentSettings ({ deployment }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffectOnce(() => {
    let env = []
    for (const key in deployment.env) {
      env = [...env, { key, value: deployment.env[key] }]
    }
    form.setFieldsValue({
      values: env
    })
  })

  const onFinish = async (values) => {
    setLoading(true)
    if (loading || values.values.length === 0) return
    const data = {
      update: 'env',
      code: deployment.code,
      env: values.values
    }
    updateDeploymentSettingsAPI(data).then(res => {
      setLoading(false)
      if (res.data.ok) {
        toast.success(res.data.msg)
      } else {
        toast.error(res.data.msg)
      }
    }).catch(err => {
      console.log(err)
      setLoading(false)
    })
  }

  return (
    <>
      <div className=''>
        <p className='text-xl font-semibold'>Environment Settings</p>
      </div>
      <Form
        form={form}
        layout='horizontal'
        onFinish={onFinish}
      >
        <Form.List
          name='values'
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  required={false}
                  key={field.key}
                  style={{ marginBottom: '15px' }}
                >
                  <div className='flex gap-3'>
                    <Form.Item initialValue='' name={[field.name, 'key']} style={{ marginBottom: '0px', width: '45%' }}>
                      <Input placeholder='key' style={{ border: '1px solid black', borderRadius: '0' }} />
                    </Form.Item>
                    <Form.Item initialValue='' name={[field.name, 'value']} style={{ marginBottom: '0px', width: '45%' }}>
                      <Input placeholder='value' style={{ border: '1px solid black', borderRadius: '0' }} />
                    </Form.Item>
                    <div className=' h-full'>
                      <Button onClick={() => remove(index)}>
                        <RiDeleteBin5Line className='text-xl mx-3' />
                      </Button>
                    </div>
                  </div>
                </Form.Item>
              ))}
              <Form.Item style={{ marginBottom: '15px' }}>
                <div className='w-fit'>
                  <Button onClick={() => add()}>
                    Add Environment Variable
                  </Button>
                </div>
              </Form.Item>
            </>

          )}
        </Form.List>
        {/* eslint-disable-next-line react/jsx-handler-names */}
        <Button onClick={form.submit} htmltype='submit' className='bg-primary w-fit hover:cursor-pointer py-2 px-3 border-2 border-black text-black font-semibold active:outline-dashed'>
          <span className='text-base'>
            {loading ? <LoadingSpin /> : 'Save'}
          </span>
        </Button>
      </Form>
    </>
  )
}

export default EnvironmentSettings


