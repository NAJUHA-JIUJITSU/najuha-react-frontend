//import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const TossSuccess = () => {
  const navigate = useNavigate();
  let orderId = new URL(window.location.href).searchParams.get("orderId");
  let paymentKey = new URL(window.location.href).searchParams.get("paymentKey");
  let amount = new URL(window.location.href).searchParams.get("amount");

  const backBaseUrl = process.env.REACT_APP_BACK_END_API;

  useEffect(() => {
    axios
      .post(
        backBaseUrl +
          `/payments/approval?paymentKey=${paymentKey}&amount=${amount}&orderId=${orderId}`
      )
      .then((res) => {
        console.log(res)
        window.alert(`결제가 완료되었습니다. 결제 금액: ${res.data.result.totalAmount}`);
        navigate("/payment/success");
      })
      .catch((err) => {
        console.log(err);
        window.alert("결제에 실패하였습니다.");
        navigate("/payment/fail");
      });
  });
};

export default TossSuccess;