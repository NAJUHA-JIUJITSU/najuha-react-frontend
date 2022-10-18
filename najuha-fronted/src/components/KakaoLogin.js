import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Cookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

const KakaoLogin = () => {
    const endPoint = process.env.REACT_APP_BACKEND_SERVER_ENDPOINT + "/auth/kakao";
    const cookies = new Cookies();
    let navigate = useNavigate();

    useEffect(() => {
        let params = new URL(document.location.toString()).searchParams;
        let code = params.get("code");


        axios
        .post(endPoint, {
            code: code,

        })
        .then((res) => {
            cookies.set('x-access-token', res.data.result, { path: '/', overwrite: true})
            navigate('/')
            alert('로그인에 성공하셨습니다.')
        })
        .catch((err) => {
            console.log(err)
            navigate('/')
            alert('로그인에 실패하셨습니다.')
        })
  }, []);

	// 회원가입후 프로필 기입이 필수이기 때문에 프로필 수정 유도 
	// 프로필 수정까지 마치고 다른기능 사용 가능
  return;
};

export default KakaoLogin;