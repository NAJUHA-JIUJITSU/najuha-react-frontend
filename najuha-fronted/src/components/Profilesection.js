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
                        <p>내 프로필 관리<img src='Assets/arrow_right.svg' alt='오른쪽 화살표'></img></p>
                    </div>
                </div>
            </div>
            <div className='Profilesection_competitionCount'>
                <div className='Profilesection_competitionCount-box nowCnt'>
                    <div className='Profilesection_competitionCount-box-center'>
                        <p className='Profilesection_competitionCount-box-num'>3</p>
                        <p>실시간 대회신청</p>
                    </div>
                </div>
                <div className='Profilesection_competitionCount-box totalCnt'>
                    <div className='Profilesection_competitionCount-box-center'>
                        <p className='Profilesection_competitionCount-box-num'>24</p>
                        <p>총 대회신청</p>
                    </div>
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
        <section className='Profilesection_right'>
            <h2>대회신청목록</h2>
            <div className='Profilesection_myCompetitionList nowList'>
                <h3>실시간 대회신청</h3>
                <p>전체보기<img src='Assets/arrow_right.svg' alt='오른쪽 화살표'></img></p>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Champitonship</th>
                            <th>참가부</th>
                            <th>벨트</th>
                            <th>체급</th>
                            <th>결제내역</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>09.27</td>
                            <td>서울</td>
                            <td>예거스챔피언쉽 로컬대회 송도 오픈</td>
                            <td>마스터1</td>
                            <td>블루</td>
                            <td>-76.0kg</td>
                            <td>결제완료</td>
                            <td className='payInfo'><button id='payInfoBtn'>상세정보</button></td>
                        </tr>
                        <tr>
                            <td>09.27</td>
                            <td>서울</td>
                            <td>예거스챔피언쉽 로컬대회 송도 오픈</td>
                            <td>마스터1</td>
                            <td>블루</td>
                            <td>-76.0kg</td>
                            <td>결제완료</td>
                            <td className='payInfo'><button id='payInfoBtn'>상세정보</button></td>
                        </tr>
                        <tr>
                            <td>09.27</td>
                            <td>서울</td>
                            <td>예거스챔피언쉽 로컬대회 송도 오픈</td>
                            <td>마스터1</td>
                            <td>블루</td>
                            <td>-76.0kg</td>
                            <td>결제완료</td>
                            <td className='payInfo'><button id='payInfoBtn'>상세정보</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='Profilesection_myCompetitionList totlaList'>
                <h3>총 대회신청</h3>
                <p>전체보기<img src='Assets/arrow_right.svg' alt='오른쪽 화살표'></img></p>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Champitonship</th>
                            <th>참가부</th>
                            <th>벨트</th>
                            <th>체급</th>
                            <th>결제내역</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>09.27</td>
                            <td>서울</td>
                            <td>예거스챔피언쉽 로컬대회 송도 오픈</td>
                            <td>마스터1</td>
                            <td>블루</td>
                            <td>-76.0kg</td>
                            <td>결제완료</td>
                            <td className='payInfo'><button id='payInfoBtn'>상세정보</button></td>
                        </tr>
                        <tr>
                            <td>09.27</td>
                            <td>서울</td>
                            <td>예거스챔피언쉽 로컬대회 송도 오픈</td>
                            <td>마스터1</td>
                            <td>블루</td>
                            <td>-76.0kg</td>
                            <td>결제완료</td>
                            <td className='payInfo'><button id='payInfoBtn'>상세정보</button></td>
                        </tr>
                        <tr>
                            <td>09.27</td>
                            <td>서울</td>
                            <td>예거스챔피언쉽 로컬대회 송도 오픈</td>
                            <td>마스터1</td>
                            <td>블루</td>
                            <td>-76.0kg</td>
                            <td>결제완료</td>
                            <td className='payInfo'><button id='payInfoBtn'>상세정보</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
        </div>
    )

}

export default Profilesection