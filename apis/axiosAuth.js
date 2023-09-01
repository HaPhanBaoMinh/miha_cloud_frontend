import { DJANGO_BASE_URL, SITE_BASE_URL } from '@/constants'
import axios from 'axios'
import Cookies from 'js-cookie'

const instanceAxios = axios.create({
  timeout: 30000,
})

// Get/Set token
instanceAxios.getAccessToken = () => {
  return Cookies.get('token', { domain: SITE_BASE_URL })
}

instanceAxios.getRefreshToken = () => {
  return Cookies.get('refresh', { domain: SITE_BASE_URL })
}

instanceAxios.getTimeExpires = () => {
  return Cookies.get('time_expires', { domain: SITE_BASE_URL })
}

instanceAxios.saveAccessToken = (token, timeExpires) => {
  Cookies.remove('token', { domain: SITE_BASE_URL })
  Cookies.remove('time_expires', { domain: SITE_BASE_URL })
  console.log(token)

  Cookies.set('token', token, { domain: SITE_BASE_URL })
  Cookies.set('time_expires', timeExpires, { domain: SITE_BASE_URL })
}

const refreshToken = async () => {
  try {
    const refresh = await instanceAxios.getRefreshToken()
    const res = await instanceAxios.post(DJANGO_BASE_URL + '/api/users/token/refresh/', {
      refresh: refresh
    })
    Cookies.set('token', res.data.access)
    Cookies.set('time_expires', res.data.time_expires)
  } catch (error) {
    console.log(error)
    window.location.href = `${SITE_BASE_URL}/login`
  }
}

// Before Request
instanceAxios.interceptors.request.use(
  async request => {
    if (request.url.includes('/login') || request.url.includes('/register') || request.url.includes('/token/refresh')) {
      return request
    }
    try {
      const timeExpired = await instanceAxios.getTimeExpires()
      const now = new Date().getTime()
      console.log('timeExpired:' + timeExpired + ' now:' + now)
      if (timeExpired * 1000 < now) {
        console.log('Token timeout!!!')
        await refreshToken()

        // Add token to headers
        const token = await instanceAxios.getAccessToken()
        request.headers.authorization = `Bearer ${token}`
        return request
      }
    } catch (error) {
      window.location.href = `${SITE_BASE_URL}/login`
      return Promise.reject(error)
    }

    // Add token to headers
    const token = await instanceAxios.getAccessToken()
    request.headers.authorization = `Bearer ${token}`
    return request
  },
  error => {
    return Promise.reject(error)
  }
)

export default instanceAxios
