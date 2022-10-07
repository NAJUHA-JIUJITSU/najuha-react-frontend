import React from 'react'
import {useState, useEffect} from 'react';
import './profilesection.css'
import { useNavigate } from 'react-router-dom'

function Profilesection() {

    const [username, setUsername] = useState("나주하");

    return (
        <div className='Profilesection_wrapper'>
        <section className='Profilesection_left'>
            <div className='Profilesection_welcome'>
                <div className='Profilesection_welcome-center'>
                    <p><span className='Profilesection_welcome-center-username'>{username}</span>님<br></br>
                    안녕하세요</p>
                    <div className='Profilesection_welcome-center-btn'>
                        <p>내 프로필 관리</p>
                    </div>
                </div>
            </div>
            <div className='Profilesection_competitionCount'>
                <div className='Profilesection_competitionCount-box now'>
                    <di className='Profilesection_competitionCount-box-center'>
                        <p className='Profilesection_competitionCount-box-num'>3</p>
                        <p>실시간 대회</p>
                    </di>
                </div>
                <div className='Profilesection_competitionCount-box total'>
                    <di className='Profilesection_competitionCount-box-center'>
                        <p className='Profilesection_competitionCount-box-num'>24</p>
                        <p>총 대회신청</p>
                    </di>
                </div>
            </div>
            <div className='Profilesection_information'>
                <li>
                    <div className='Profilesection_information-btn'>대회신청목록</div>
                    <div className='Profilesection_information-btn'>내 프로필 관리</div>
                    <div className='Profilesection_information-btn'>개인정보처리방침</div>
                    <div className='Profilesection_information-btn'>이용약관</div>
                    <div className='Profilesection_information-btn'>버전정보</div>
                </li>
            </div>
        </section>
        <section className='Profilesection_right'></section>
        </div>
    )

}

export default Profilesection