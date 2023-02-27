import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './navbarNew.css'
import whiteProfile from '../src_assets/whiteProfile.svg'
import grayProfile from '../src_assets/grayProfile.svg'

function NavbarNew() {
  const [ScrollActive, setScrollActive] = useState(false)
  const [ScrollY, setScrollY] = useState(0) // window 의 pageYOffset값을 저장

  let navigate = useNavigate()

  function handleScroll() {
    console.log('스크롤 ' + ScrollY)
    setScrollY(window.pageYOffset)
  }

  useEffect(() => {
    function scrollListener() {
      window.addEventListener('scroll', handleScroll)
    } //  window 에서 스크롤을 감시 시작
    scrollListener() // window 에서 스크롤을 감시
    return () => {
      window.removeEventListener('scroll', handleScroll)
    } //  window 에서 스크롤을 감시를 종료
  })

  return (
    <div
      className="MainScroll_navWrapper"
      style={
        ScrollY > 4100
          ? { backgroundColor: 'white' }
          : { backgroundColor: '', border: 'none' }
      }>
      <div className="MainScroll_nav">
        <h1
          className="MainScroll_logo"
          onClick={() => {
            navigate('/')
          }}
          style={ScrollY > 4100 ? { color: 'black' } : {}}>
          NAJUHA
        </h1>
        <div className="MainScroll_list">
          <ul
            className="MainScroll_menu"
            style={ScrollY > 4100 ? { color: '#888888' } : {}}>
            <li
              onClick={() => {
                window.scrollTo(0, 0)
                navigate('/competition')
              }}>
              대회일정
            </li>
            <li
              onClick={() => {
                alert('세미나 일정은 아직 준비중입니다.')
              }}>
              세미나
            </li>
          </ul>

          <img
            class="MainScroll_profile"
            alt="벨트모양 로그인 아이콘"
            src={ScrollY > 4100 ? grayProfile : whiteProfile}></img>
        </div>
      </div>
    </div>
  )
}

export default NavbarNew
