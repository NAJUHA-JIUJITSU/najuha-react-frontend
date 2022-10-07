import React, {useState} from 'react'
import './navbar.css'
import { useNavigate } from 'react-router-dom'

function Navbar() {
    let [isHamburgerActive, setIsHamburgerActive] = useState(false)
    let [isnavmenuActive, setIsNavmenuActive] = useState(false)
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
        <img class='login-icon' alt="벨트모양 로그인 아이콘" src="Assets/Group 로고.svg" onClick={()=>{navigate('/Profilepage')}}/>
    
    </header>
  )
}

export default Navbar