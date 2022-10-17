import React, {useState} from 'react'
import './navbar.css'
import { useNavigate } from 'react-router-dom'
import Dropdown from './Dropdown'

function Navbar() {
    let [isHamburgerActive, setIsHamburgerActive] = useState(false)
    let [isnavmenuActive, setIsNavmenuActive] = useState(false)
    const [dropdownVisibility, setDropdownVisibility] = useState(false);
    let navigate = useNavigate();
        

    function hamburgerClick() {
        isHamburgerActive = !isHamburgerActive
        setIsHamburgerActive(isHamburgerActive);
        isnavmenuActive = !isnavmenuActive
        setIsNavmenuActive(isnavmenuActive);
    }



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
        <img class='login-icon' alt="벨트모양 로그인 아이콘" src="Assets/Group 로고.svg" onClick={()=>{
            setDropdownVisibility(!dropdownVisibility)
            console.log(dropdownVisibility);
            }}/>
        <div id='navbar-dropdown'>
        <Dropdown visibility={dropdownVisibility} >
            <ul>
                <li onClick={()=>{navigate('/Profilepage')}}>내 프로필</li>
                <li onClick={()=>{navigate('/Profilepage')}}>신청대회 목록</li>
                <li onClick={()=>{navigate('/login')}}>로그인 하기</li>
            </ul>
        </Dropdown>
        </div>    
    </header>
  )
}

export default Navbar