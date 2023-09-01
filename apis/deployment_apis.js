import { DJANGO_BASE_URL } from '@/constants'
import instanceAxios from '@/apis/axiosAuth'

const deploymentAxios = instanceAxios
const BASE_URL = DJANGO_BASE_URL + '/api/deployment/'

export const packageListAPI = () => {
  return deploymentAxios.get(BASE_URL + 'packages/')
}

export const loginGithubAccountAPI = (data) => {
  return deploymentAxios.post(BASE_URL + 'create-github-access-token/', data)
}

export const getGitHubReposAPI = () => {
  return deploymentAxios.get(BASE_URL + 'github-repo/')
}

export const getGitHubUserAPI = () => {
  return deploymentAxios.get(BASE_URL + 'github-user/')
}

export const createDeploymentAPI = (data) => {
  return deploymentAxios.post(BASE_URL + 'create-deployment/', data)
}

export const getDeploymentDetailAPI = (params) => {
  return deploymentAxios.get(BASE_URL + 'deployment-detail/', { params })
}

export const getDeploymentListAPI = () => {
  return deploymentAxios.get(BASE_URL + 'deployment-list/')
}

export const getRuntimeListAPI = (params) => {
  return deploymentAxios.get(BASE_URL + 'runtime-list/', { params })
}

export const getPackageListAPI = (params) => {
  return deploymentAxios.get(BASE_URL + 'package-list/', { params })
}

export const getLogsListAPI = (params) => {
  return deploymentAxios.get(BASE_URL + 'deployment-log/', { params })
}

export const updateDeploymentSettingsAPI = (data) => {
  return deploymentAxios.post(BASE_URL + 'update-deployment/', data)
}

export const getServicesAPI = () => {
  return deploymentAxios.get(BASE_URL + 'service-list/')
}
