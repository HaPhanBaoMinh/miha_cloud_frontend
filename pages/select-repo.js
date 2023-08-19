import { AiOutlineGithub, AiOutlineLock, AiOutlineUser } from 'react-icons/ai'
import { GITHUB_CLIENT_ID } from '@/constants'
import { useEffectOnce } from 'react-use'
import { getGitHubReposAPI, getGitHubUserAPI, loginGithubAccountAPI } from '@/apis/deployment_apis'
import { LoadingSpin } from '@/components/common/Loading'
import React, { useState, Fragment } from 'react'
import { BsDot } from 'react-icons/bs'
import TimeAgo from 'react-timeago'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
function SelectRepoPage ({ serviceName }) {
  const [loading, setLoading] = useState(false)
  const [githubRepos, setGithubRepos] = useState(null)
  const [githubUser, setGithubUser] = useState(null)
  const router = useRouter()

  useEffectOnce(() => {
    const query = new URLSearchParams(window.location.search)
    const code = query.get('code')
    if (code) {
      loginGithubAccount(code)
    } else {
      getGithubRepos()
    }
    getGithubUser()
  })

  const loginGithubAccount = async (code) => {
    setLoading(true)
    loginGithubAccountAPI({ code }).then(res => {
      getGitHubReposAPI().then(res => {
        setGithubRepos(res.data.data)
        setLoading(false)
      })
    })
  }

  const getGithubRepos = async () => {
    setLoading(true)
    getGitHubReposAPI().then(res => {
      setGithubRepos(res.data.data)
      setLoading(false)
    })
  }

  const getGithubUser = async () => {
    getGitHubUserAPI().then(res => {
      setGithubUser(res.data.data)
    })
  }

  const selectRepo = (repo) => {
    console.log(repo)
    // eslint-disable-next-line no-undef
    localStorage.setItem('selectedRepo', JSON.stringify(repo))
    router.push(`/${router.query.type}/new`)
  }

  const githubAuth = () => {
    if (loading) return
    window.location.href = 'https://github.com/login/oauth/authorize?client_id=' + GITHUB_CLIENT_ID + '&scope=repo'
  }

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-2xl'>Create new <span className='text-secondary font-semibold'>{serviceName}</span></h1>
      <p>Connect your Git repository or use an existing public repository URL.</p>
      <div className='grid grid-cols-12 py-3 gap-5'>
        <div className='lg:col-span-8 md:col-span-6 col-span-12 outline rounded p-3 min-h-[350px]'>
          <p className='font-semibold text-lg'>Connect a repository</p>
          <div className='mt-3 h-[80%] flex flex-col justify-start  overflow-scroll max-h-[360px] items-center border'>
            {/* eslint-disable-next-line multiline-ternary */}
            {!githubRepos ? <button
              onClick={githubAuth}
              className='flex items-center m-auto justify-center w-fit gap-2 p-3 border-2 border-black rounded hover:bg-gray-100 cursor-pointer'
                            >
              {
                    loading
                      ? <LoadingSpin />
                      : <>
                        <AiOutlineGithub className='text-xl' />
                        <span>GitHub</span>
                      </>
                  }
                            </button>
              // eslint-disable-next-line react/jsx-key
              : githubRepos.map(repo => <GithubRepo repo={repo} key={uuidv4()} onClick={() => selectRepo(repo)} />)}
          </div>
        </div>
        <div className='lg:col-span-4 md:col-span-6 col-span-12'>
          <div className='flex gap-1 items-center pb-2'>
            <AiOutlineGithub className='text-2xl' />
          </div>
          <GithubUser user={githubUser} />
        </div>
      </div>
    </div>
  )
}

export default SelectRepoPage

const getServicesName = (query) => {
  if (query === 'static') return 'Static Site'
  if (query === 'web-service') return 'Web Service'
  return 'Service'
}

export async function getServerSideProps (context) {
  const { query } = context
  return {
    props: {
      serviceName: getServicesName(query.type)
    }
  }
}

const GithubRepo = ({ repo, onClick, ...props }) => {
  return (
    <div className='flex items-center gap-2 border-b w-full p-2'>
      <AiOutlineGithub className='text-xl' />
      <span>{repo?.full_name}</span>
      {repo?.private && <AiOutlineLock />}
      <BsDot />
      <span>
        <TimeAgo date={repo?.created_at} />
      </span>

      <div className='grow' />
      <button onClick={onClick} className='btn btn-primary bg-secondary py-2 px-3 font-semibold border border-black active:outline-dashed'>Connect</button>
    </div>
  )
}

const GithubUser = ({ user = null, ...props }) => {
  if (!user) return

  return (
    <div className='flex items-center gap-2 text-black font-semibold' {...props}>
      <img className='w-8 h-8 rounded-full' src={user?.avatar_url} alt='Github avatar' />
      <div>
        <Link href={user?.url} title='github account hover:underline'> @{user?.login} </Link>
        <div className='flex items-center gap-0.5'>
          <AiOutlineUser />
          <span className='text-sm font-normal'> {user?.name} </span>
        </div>
      </div>
    </div>
  )
}
