import React from 'react'
import {useState, useEffect} from 'react';
import './userInfo.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

function UserInfo() {
    const [username, setUsername] = useState("나주하");
    const [competitionApplications, setCompetitionApplications] = useState([]);
    const [userInfo, serUserInfo] = useState([]);

    let navigate = useNavigate();

    function renderCompetitonNowCount() {
        let nowCnt = 0;
        competitionApplications.map((application) => {
            let competitionDate = new Date(application.Competition.doreOpen);
            let today = new Date();
            if( today <= competitionDate) {
                nowCnt++;
            }
        })
        return (
            <p className='Profilesection_competitionCount-box-num'>{nowCnt}</p>
        )
    }

    function renderCompetitonTotalCount() {
        let totalCnt = competitionApplications.length
        return (
         <p className='Profilesection_competitionCount-box-num'>{totalCnt}</p>
        )
    }

    async function getCompetitionApplication() {
        axios.get(`${process.env.REACT_APP_BACK_END_API}/users/competitionApplications`,
        {
            headers: {
                'x-access-token':  process.env.REACT_APP_BACK_END_TOKEN
            }
        })
        .then((res) => {
            setCompetitionApplications(res.data.result);
            console.log(res.data.message);
        })
        .catch((err) => {
            console.log(err);
            console.log(err.response.status);
            console.log(err.response.data.message);
        })
        return ;
    }

    async function getUsers() {
        axios.get(`${process.env.REACT_APP_BACK_END_API}/users`,
        {
            headers: {
                'x-access-token':  process.env.REACT_APP_BACK_END_TOKEN
            }
        })
        .then((res) => {
            setUsername(res.data.result.userInfo.fullName);
            serUserInfo(res.data.result.userInfo);
            console.log(res.data.message);
        })
        .catch((err) => {
            console.log(err);
            console.log(err.response.status);
            console.log(err.response.data.message);
        })
        return ;
    }

    function userParsing(userInfo) {
        let fullName = userInfo.fullName;
        let email = userInfo.email;
        let phoneNumber = userInfo.phoneNumber;
        let gender = (userInfo.gender = 'male') ? '남자' : '여자';
        let belt = userInfo.belt;
        let weight = userInfo.weight + 'kg';

        return {
            'fullName' : fullName,
            'email' : email,
            'phoneNumber' : phoneNumber,
            'gender' : gender,
            'belt' : belt,
            'weight' : weight
        }
    }

    function userForm() {
        let user = userParsing(userInfo);

        return (
            <div className='UserInfo_Boxs'>
                <div className='UserInfo_infoBox'>
                    <span>이름</span>
                    <p>{user.fullName}</p>
                </div>
                <div className='UserInfo_infoBox'>
                    <span>성별</span>
                    <p>{user.gender}</p>
                </div>
                <div className='UserInfo_infoBox'>
                    <span>휴대폰</span>
                    <p>{user.phoneNumber}</p>
                </div>
                <div className='UserInfo_infoBox'>
                    <span>이메일</span>
                    <p>{user.email}</p>
                </div>
                <div className='UserInfo_infoBox'>
                    <span>벨트</span>
                    <p>{user.belt}</p>
                </div>
                <div className='UserInfo_infoBox'>
                    <span>체급</span>
                    <p>{user.weight}</p>
                </div>
            </div>
        )
    }

    useEffect(() => {
        getUsers();
        getCompetitionApplication();
    }, [])

    return (
        <div className='UserInfo_wrapper'>
            <section className='UserInfo_left'>
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
                        {renderCompetitonNowCount()}
                        <p>실시간 대회신청</p>
                    </div>
                </div>
                <div className='Profilesection_competitionCount-box totalCnt'>
                    <div className='Profilesection_competitionCount-box-center'>
                        {renderCompetitonTotalCount()}
                        <p>총 대회신청</p>
                    </div>
                </div>
            </div>
            <div className='Profilesection_information'>
                <li>
                    <div className='Profilesection_information-btn' onClick={()=>{navigate('/Profilepage')}}>대회신청목록</div>
                    <div className='Profilesection_information-btn' onClick={()=>{navigate('/UserInfopage')}}>내 프로필 관리</div>
                    <div className='Profilesection_information-btn'>개인정보처리방침</div>
                    <div className='Profilesection_information-btn'>이용약관</div>
                    <div className='Profilesection_information-btn'>버전정보</div>
                </li>
            </div>
        </section>
            <div className='UserInfo_right'>
                <h2>내 프로필 관리</h2>
                {userForm()}
                <button className='UserInfo_updateBtn'>수정하기</button>
            </div>
        </div>
    )
}

export default UserInfo