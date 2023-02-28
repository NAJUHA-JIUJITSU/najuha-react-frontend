import React from 'react'
import './mainsection.css'
import { useNavigate } from 'react-router-dom'
import arrow from '../src_assets/대회일정바로가기.svg'

function Mainsection() {
  let navigate = useNavigate()

  return (
    <>
      <div className="wrapper">
        <section className="left-content">
          <div className="content-title">
            <h1>
              <strong>나</strong>는
            </h1>
            <br />
            <h1>
              <strong>주</strong>짓수가
            </h1>
            <br />
            <h1>
              <strong>하</strong>고싶다
            </h1>
          </div>
          <div className="left-content-bar"></div>
          <div
            className="content-button"
            onClick={() => {
              navigate('/competition')
            }}
          >
            <h2>대회일정바로가기</h2>
            <img
              className="competition-icon"
              src={arrow}
              alt="대회일정바로가기아이콘"
            />
          </div>
        </section>
        <section className="right-content">
          <div className="right-content-img"></div>
        </section>
      </div>
    </>
  )
}

export default Mainsection
