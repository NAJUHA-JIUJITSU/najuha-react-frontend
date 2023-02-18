import React, {useState, useEffect} from 'react'
import './navbar.css'
import { useNavigate } from 'react-router-dom'
import Dropdown from './Dropdown'
import belticon from '../src_assets/Group 로고.svg';
import { useCookies } from 'react-cookie';

function Navbar() {
    let [isHamburgerActive, setIsHamburgerActive] = useState(false)
    let [isnavmenuActive, setIsNavmenuActive] = useState(false)
    const [dropdownVisibility, setDropdownVisibility] = useState(false);
    const restApiKey = process.env.REACT_APP_REST_API_KEY
    const redirectUri = process.env.REACT_APP_REDIRECT_URI
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${restApiKey}&redirect_uri=${redirectUri}&response_type=code`;
    let navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(["x-access-token"]);
        
    function hamburgerClick() {
        isHamburgerActive = !isHamburgerActive
        setIsHamburgerActive(isHamburgerActive);
        isnavmenuActive = !isnavmenuActive
        setIsNavmenuActive(isnavmenuActive);
    }

    let logout = () => {
        removeCookie('x-access-token', {path: '/'})
        alert('로그아웃이 완료되었습니다.')
        setDropdownVisibility(false)
        navigate('/');
    }

    useEffect(() => {
        console.log(cookies['x-access-token']);
    },[cookies['x-access-token']])



  return (
    <header class="navbar">
        <div class={`hamburger ${isHamburgerActive ? 'active' : ''}`} onClick={hamburgerClick}>
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>
        <h1 class="logo" onClick={()=>{navigate('/')}}>NAJUHA</h1>
        <ul class={`category nav-menu ${isnavmenuActive ? 'active' : ''}`}>
            <li class="category-competition nav-item">
                <p onClick={()=>{navigate('/competition')}}>대회일정</p>
            </li>
            <li class="category-seminar nav-item">
                <p>세미나</p>
            </li>
        </ul> 
        <img class='login-icon' alt="벨트모양 로그인 아이콘" src={belticon} onClick={()=>{
            setDropdownVisibility(!dropdownVisibility)
            console.log(dropdownVisibility);
            }}/>
        <div id='navbar-dropdown'>
        <Dropdown visibility={dropdownVisibility} >
            <ul>
                <li onClick={()=>{navigate('/ProfilepageToggle')}}>내 프로필</li>
                <li onClick={()=>{navigate('/Profilepage')}}>신청대회 목록</li>
                {cookies['x-access-token'] == undefined ? <li onClick={()=>{window.location.href = kakaoAuthURL}}>로그인 하기</li> 
                : <li onClick={logout}>로그아웃 하기</li>}
            </ul>
        </Dropdown>
        </div>    
    </header>
  )
}

export default Navbar