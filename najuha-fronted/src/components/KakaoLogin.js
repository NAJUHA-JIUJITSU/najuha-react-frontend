import React from "react";
import { useEffect, useState } from "react";
import {useDispatch} from 'react-redux';
import { LoginUser } from "../_action/user_action";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Cookies } from 'react-cookie';
// import jwt from 'jsonwebtoken';
const KakaoLogin = () => {
    const dispatch = useDispatch();
    const endPoint = process.env.REACT_APP_BACKEND_SERVER_ENDPOINT + "/auth/kakao";
    let navigate = useNavigate();
    // let userLevel = useSelector((user) => user);
    useEffect(() => {
        let params = new URL(document.location.toString()).searchParams;
        let code = params.get("code");

        let body = {
            code: code
        }
        dispatch(LoginUser(endPoint, body))
            .then(res => {
                console.log(res.payload)
                if(res.payload.isSuccess && res.payload.result.userLevel === 1)
                    navigate('/UserInfopage');
                else
                    navigate('/');

                return ; 
            })
            .catch(err => {
                console.log(err)
                navigate('/');
            })
  }, []);

	// 회원가입후 프로필 기입이 필수이기 때문에 프로필 수정 유도 
	// 프로필 수정까지 마치고 다른기능 사용 가능
  return;
};

export default KakaoLogin;