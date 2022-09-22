import React, {useState} from 'react'
import './navbar.css'


function Navbar() {
    let [isHamburgerActive, setIsHamburgerActive] = useState(false)
    let [isnavmenuActive, setIsNavmenuActive] = useState(false)

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
        <h1 class="logo">NAJUHA</h1>
        <ul class={`category nav-menu ${isnavmenuActive ? 'active' : ''}`}>
            <li class="category-competition nav-item">
                <a href="../competition/competition.html">대회일정</a>
            </li>
            <li class="category-seminar nav-items">
                <a>세미나</a>
            </li>
        </ul> 
        <img class='login-icon' alt="벨트모양 로그인 아이콘" src="Assets/Group 로고.svg"/>
    
    </header>
  )
}

export default Navbar