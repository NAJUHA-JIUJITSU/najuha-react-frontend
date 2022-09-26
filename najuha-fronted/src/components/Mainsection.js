import React from 'react'
import './mainsection.css'

function Mainsection() {
  return (
    <>
        <div class="wrapper">
            <section class="left-content">
                <div class="content-title">
                    <h1><strong>나</strong>는</h1><br/>
                    <h1><strong>주</strong>짓수가</h1><br/>
                    <h1><strong>하</strong>고싶다</h1>
                </div>
                <div class="left-content-bar"></div>
                <div class="content-button" >
                    <h2><a href="../competition/competition.html">대회일정바로가기</a></h2>
                    <img class='competition-icon' src="Assets/대회일정바로가기.svg" alt="대회일정바로가기아이콘"/>
                </div>
            </section>
            <section class='right-content'>
                <div class="right-content-img"></div>
            </section>
        </div>
    </>
  )
}

export default Mainsection