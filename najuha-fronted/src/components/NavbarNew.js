import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './navbarNew.css'
import Dropdown from './Dropdown'
import whiteProfile from '../src_assets/whiteProfile.png'
import grayProfile from '../src_assets/grayProfile.png'
import whiteBelt from '../src_assets/whiteBelt.png'
import blackBelt from '../src_assets/blackBelt.png'
import { useCookies } from 'react-cookie'

function NavbarNew() {
  const [ScrollActive, setScrollActive] = useState(false)
  const [ScrollY, setScrollY] = useState(0) // window 의 pageYOffset값을 저장
  let [isHamburgerActive, setIsHamburgerActive] = useState(false)
  let [isnavmenuActive, setIsNavmenuActive] = useState(false)
  const [dropdownVisibility, setDropdownVisibility] = useState(false)
  const restApiKey = process.env.REACT_APP_REST_API_KEY
  const redirectUri = process.env.REACT_APP_REDIRECT_URI
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${restApiKey}&redirect_uri=${redirectUri}&response_type=code`
  const [cookies, setCookie, removeCookie] = useCookies(['x-access-token'])

  let navigate = useNavigate()
  const beltDropdownRef = useRef(null)

  function hamburgerClick() {
    isHamburgerActive = !isHamburgerActive
    setIsHamburgerActive(isHamburgerActive)
    isnavmenuActive = !isnavmenuActive
    setIsNavmenuActive(isnavmenuActive)
  }

  let logout = () => {
    removeCookie('x-access-token', { path: '/' })
    alert('로그아웃이 완료되었습니다.')
    setDropdownVisibility(false)
    navigate('/')
  }

  //외부 클릭시 드랍다운 닫히기
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        dropdownVisibility &&
        beltDropdownRef.current &&
        !beltDropdownRef.current.contains(event.target)
      ) {
        setDropdownVisibility(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [dropdownVisibility])

  function handleScroll() {
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
        <div
          className={`MainScroll_hamburger ${
            isHamburgerActive ? 'active' : ''
          }`}
          onClick={hamburgerClick}>
          <span
            className="MainScroll_bar"
            style={
              ScrollY > 4100 || isHamburgerActive
                ? { backgroundColor: '#888888' }
                : { backgroundColor: 'white' }
            }></span>
          <span
            className="MainScroll_bar"
            style={
              ScrollY > 4100 || isHamburgerActive
                ? { backgroundColor: '#888888' }
                : { backgroundColor: 'white' }
            }></span>
          <span
            className="MainScroll_bar"
            style={
              ScrollY > 4100 || isHamburgerActive
                ? { backgroundColor: '#888888' }
                : { backgroundColor: 'white' }
            }></span>
        </div>
        <div
          className={`MainScroll_hamburgerblack ${
            isHamburgerActive ? 'active' : ''
          }`}>
          <div
            className={`MainScroll_hamburgermenu ${
              isHamburgerActive ? 'active' : ''
            }`}>
            <div className="MainScroll_hamburgerlist">
              <ul>
                <li
                  onClick={() => {
                    window.scrollTo(0, 0)
                    navigate('/competition')
                  }}>
                  대회일정
                </li>
                <li
                  onClick={() => {
                    alert('세미나 일정은 준비중입니다.')
                  }}>
                  세미나
                </li>
              </ul>
            </div>
          </div>
        </div>
        <h1
          className="MainScroll_logo"
          onClick={() => {
            window.location.replace('/')
          }}
          style={ScrollY > 4100 ? { color: 'black' } : {}}>
          NAJUHA
        </h1>
        <div className="MainScroll_list">
          <ul
            className="MainScroll_menu"
            style={ScrollY > 4100 ? { color: 'black' } : {}}>
            <li
              onClick={() => {
                window.scrollTo(0, 0)
                navigate('/competition')
              }}>
              대회일정
            </li>
            <li
              onClick={() => {
                alert('세미나 일정은 준비중입니다.')
              }}>
              세미나
            </li>
          </ul>

          <img
            className="MainScroll_profile"
            alt="벨트모양 로그인 아이콘"
            ref={beltDropdownRef}
            onClick={() => {
              setDropdownVisibility(!dropdownVisibility)
            }}
            src={
              ScrollY > 4100
                ? cookies['x-access-token'] == undefined
                  ? whiteProfile
                  : blackBelt
                : cookies['x-access-token'] == undefined
                ? grayProfile
                : whiteBelt
            }></img>
          <div id="profile-dropdown">
            <Dropdown visibility={dropdownVisibility}>
              <ul>
                <li
                  onClick={() => {
                    window.scrollTo(0, 0)
                    navigate('/Profilepage', { state: 'UserInfoToggle' })
                  }}>
                  내 프로필
                </li>
                <li
                  onClick={() => {
                    window.scrollTo(0, 0)
                    navigate('/Profilepage', { state: 'UserApplicationList' })
                  }}>
                  신청대회 목록
                </li>
                {cookies['x-access-token'] == undefined ? (
                  <li
                    onClick={() => {
                      window.location.href = kakaoAuthURL
                    }}>
                    로그인 하기
                  </li>
                ) : (
                  <li onClick={logout}>로그아웃 하기</li>
                )}
              </ul>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavbarNew
