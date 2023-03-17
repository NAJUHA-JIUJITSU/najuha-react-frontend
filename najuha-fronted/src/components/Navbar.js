import React, { useState, useEffect, useRef } from 'react'
import './navbar.css'
import { useNavigate } from 'react-router-dom'
import Dropdown from './Dropdown'
import whiteProfile from '../src_assets/whiteProfile.png'
import blackBelt from '../src_assets/blackBelt.png'
import { useCookies } from 'react-cookie'

function Navbar() {
  let [isHamburgerActive, setIsHamburgerActive] = useState(false)
  let [isnavmenuActive, setIsNavmenuActive] = useState(false)
  let [location, setLocation] = useState('')
  const [dropdownVisibility, setDropdownVisibility] = useState(false)
  const restApiKey = process.env.REACT_APP_REST_API_KEY
  const redirectUri = process.env.REACT_APP_REDIRECT_URI
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${restApiKey}&redirect_uri=${redirectUri}&response_type=code`
  const [cookies, setCookie, removeCookie] = useCookies(['x-access-token'])

  const beltDropdownRef = useRef(null)
  let navigate = useNavigate()

  useEffect(() => {
    let location = window.location.href.slice(-11)
    if (location === 'competition') {
      setLocation('competition')
    }
  })

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

  return (
    <div
      id="Navbar_wrapper"
      className="MainScroll_navWrapper"
      style={{ backgroundColor: 'white' }}
    >
      <div id="Navbar_nav" className="MainScroll_nav">
        <div
          id="Navbar_hamburger"
          className={`MainScroll_hamburger ${
            isHamburgerActive ? 'active' : ''
          }`}
          onClick={hamburgerClick}
        >
          <span
            className="MainScroll_bar"
            style={{ backgroundColor: '#888888' }}
          ></span>
          <span
            className="MainScroll_bar"
            style={{ backgroundColor: '#888888' }}
          ></span>
          <span
            className="MainScroll_bar"
            style={{ backgroundColor: '#888888' }}
          ></span>
        </div>
        <div
          className={`MainScroll_hamburgerblack ${
            isHamburgerActive ? 'active' : ''
          }`}
        >
          <div
            className={`MainScroll_hamburgermenu ${
              isHamburgerActive ? 'active' : ''
            }`}
          >
            <div className="MainScroll_hamburgerlist">
              <ul>
                <li
                  onClick={() => {
                    window.scrollTo(0, 0)
                    navigate('/competition')
                  }}
                  style={
                    location === 'competition' ? { fontWeight: '500' } : {}
                  }
                >
                  대회일정
                </li>
                <li
                  onClick={() => {
                    alert('세미나 일정은 준비중입니다.')
                  }}
                >
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
          style={{ color: 'black' }}
        >
          NAJUHA
        </h1>
        <div className="MainScroll_list">
          <ul className="MainScroll_menu" style={{ color: 'black' }}>
            <li
              onClick={() => {
                window.scrollTo(0, 0)
                navigate('/competition')
              }}
              style={location === 'competition' ? { fontWeight: '500' } : {}}
            >
              대회일정
            </li>
            <li
              onClick={() => {
                alert('세미나 일정은 준비중입니다.')
              }}
            >
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
              cookies['x-access-token'] == undefined ? whiteProfile : blackBelt
            }
          ></img>
          <div id="profile-dropdown">
            <Dropdown visibility={dropdownVisibility}>
              <ul>
                <li
                  onClick={() => {
                    window.scrollTo(0, 0)
                    navigate('/Profilepage', { state: 'UserInfoToggle' })
                  }}
                >
                  내 프로필
                </li>
                <li
                  onClick={() => {
                    window.scrollTo(0, 0)
                    navigate('/Profilepage', { state: 'UserApplicationList' })
                  }}
                >
                  신청대회 목록
                </li>
                {cookies['x-access-token'] == undefined ? (
                  <li
                    onClick={() => {
                      window.location.href = kakaoAuthURL
                    }}
                  >
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

export default Navbar
