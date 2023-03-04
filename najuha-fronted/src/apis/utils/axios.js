import axios from 'axios'
import { Cookies } from 'react-cookie'

const BASE_URL = process.env.REACT_APP_BACK_END_API
const cookies = new Cookies()

const axiosApi = (url, method, data) => {
  return axios({
    url: BASE_URL + url,
    method: method,
    data: data,
  })
}

const axiosApiWithToken = (url, method, data) => {
  const token = cookies.get('x-access-token')
  return axios({
    url: BASE_URL + url,
    method: method,
    data: data,
    headers: {
      'x-access-token': token,
    },
  })
}

export { axiosApi, axiosApiWithToken }
