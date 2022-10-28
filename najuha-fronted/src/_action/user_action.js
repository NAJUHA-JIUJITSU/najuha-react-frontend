import axios from 'axios';
import {
    LOGIN_USER,
    AUTH_USER
} from './types'
import { Cookies } from 'react-cookie';


export async function LoginUser(url, dataTosubmit){
    const cookies = new Cookies();

    const request = await axios
    .post(url, {
        code: dataTosubmit.code,

    })
    .then((res) => {
        cookies.set('x-access-token', res.data.result, { path: '/', overwrite: true})
        alert('로그인에 성공하셨습니다.')
        return res;
    })
    .catch((err) => {
        console.log(err)
        alert('로그인에 실패하셨습니다.')
    })
    return {
        type: LOGIN_USER,
        payload: request.data
    }
}

export async function Auth(token){

    const request = await axios.get(`${process.env.REACT_APP_BACK_END_API}/auth`, {
        headers: {
            'x-access-token': token
        }
    })
    .then((res) => {
        return res;
    })
    .catch((err) => {
        return err.response;
    })
    return {
        type: AUTH_USER,
        payload: request.data
    }
}