import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const KakaoLogin = () => {
    const endPoint = process.env.REACT_APP_BACKEND_SERVER_ENDPOINT + "/auth/kakao";
  const [token, setToken] = useState("react");

  useEffect(() => {
    let params = new URL(document.location.toString()).searchParams;
    let code = params.get("code");
		//console.log(code);

    axios
      .post(endPoint, {
        code: code,
      })
      .then((res) => {
        setToken(res.data.result);
      });
  }, []);

	// 회원가입후 프로필 기입이 필수이기 때문에 프로필 수정 유도 
	// 프로필 수정까지 마치고 다른기능 사용 가능
  return;
};

export default KakaoLogin;