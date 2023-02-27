import React, { useEffect, useState } from 'react'
import './navbarNew.css'
import whiteBelt from '../src_assets/whiteBelt.svg'
import grayBelt from '../src_assets/grayBelt.svg'

function NavbarNew() {
  const [ScrollActive, setScrollActive] = useState(false)
  const [ScrollY, setScrollY] = useState(0) // window 의 pageYOffset값을 저장

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
          style={ScrollY > 4100 ? { color: 'black' } : {}}>
          NAJUHA
        </h1>
        <div className="MainScroll_list">
          <ul
            className="MainScroll_menu"
            style={ScrollY > 4100 ? { color: '#888888' } : {}}>
            {/* <li>대회일정</li>
            <li>세미나</li> */}
          </ul>
          <img
            class="MainScroll_belt"
            alt="벨트모양 로그인 아이콘"
            src={ScrollY > 4100 ? grayBelt : whiteBelt}
            style={
              ScrollY > 4100
                ? { backgroundColor: 'rgba(238, 238, 238, 0.48)' }
                : { backgroundColor: 'rgba(238, 238, 238, 0.01)' }
            }
          />
        </div>
      </div>
    </div>
  )
}

export default NavbarNew
