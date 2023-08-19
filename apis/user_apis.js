import axios from 'axios'
import { DJANGO_BASE_URL } from '@/constants'
import instanceAxios from '@/apis/axiosAuth'

const usersAxios = axios.create({
  baseURL: DJANGO_BASE_URL + '/api/users/',
  timeout: 30000
})

const userAuthAxios = instanceAxios
const BASE_URL = DJANGO_BASE_URL + '/api/users/'
export const loginAPI = (data) => {
  return usersAxios.post('token/', data)
}

export const getMyProfileAPI = () => {
  return userAuthAxios.get(BASE_URL + 'get-my-profile/')
}
