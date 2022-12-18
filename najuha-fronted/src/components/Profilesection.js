import React from 'react'
import {useState, useEffect} from 'react';
import './profilesection.css'
import axios from 'axios';
import ProfileTap from '../components/ProfileTap'
import { Cookies } from 'react-cookie';
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";


function Profilesection() {
    const [competitionApplications, setCompetitionApplications] = useState([]); //유저 신청 대회 가져오기
    const [isFullListedNow, setisFullListedNow] = useState(false);
    const [isFullListedLast, setisFullListedLast] = useState(false);
    const cookies = new Cookies();
    const xAccessToken = cookies.get("x-access-token");
    const { decodedToken, isExpired } = useJwt(xAccessToken);
    const navigate = useNavigate();


    async function getCompetitionApplication() {
        axios.get(`${process.env.REACT_APP_BACK_END_API}/users/competitionApplications`,
        {
            headers: {
                'x-access-token':  xAccessToken
            }
        })
        .then((res) => {
            console.log(res.data);
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

    //신청대회 데이터 파싱
    function applicationParsing(application){
        let id = application.Competition.id;
        let customerName = application.competitionPayment.customerName;
        let title = (application.Competition.title.length > 24) ? application.Competition.title.substr(0, 14) + '...' : application.Competition.title;
        let locations = application.Competition.location.split(' ');
        let location = locations[0];
        let amount = application.competitionPayment.amount;
        let doreOpen = application.Competition.doreOpen.substr(5,5).replace('-','.');
        let postUrl = application.Competition.CompetitionPoster.imageUrl;
        let isPayment = application.isPayment ? '결제완료' : '결제하기';
        // let divisionName = application.divisionName;
        // let belt = application.belt.charAt(0).toUpperCase() + application.belt.slice(1);
        // let uniform = (application.uniform = "gi") ? '기-' : '노기-';
        // let weight = application.weight + 'kg';
      
        return {
            'id' : id,
            'customerName' : customerName,
            'title': title,
            'location': location,
            'amount' : amount,
            'doreOpen': doreOpen,
            'postUrl' : postUrl,
            'isPayment': isPayment,
        }
    }

    //실시간 대회
    function renderCompetition(){
        return competitionApplications.map((application) => {
            let curApplication = applicationParsing(application);
            let today = new Date();
            
            //날짜가 오늘을 기준으로 지났으면 안보여주기
            if( today > new Date(application.Competition.doreOpen)) {
                return ;
            }
            return(
                <tbody>
                        <tr className='Profilesection_PcTable'>
                            <td>{curApplication.doreOpen}</td>
                            <td>{curApplication.location}</td>
                            <td>{curApplication.title}</td>
                            <td>{curApplication.divisionName}</td>
                            <td>{curApplication.belt}</td>
                            <td>{curApplication.weight}</td>
                            <td>{curApplication.isPayment}</td>
                            <td className='payInfo'><button id='payInfoBtn'>상세정보</button></td>
                        </tr>
                        <tr className='Profilesection_MobileTable'>
                            <td><div id='Profilesection_tableDate'><p>{curApplication.doreOpen}</p></div></td>
                            <td>{curApplication.location}</td>
                            <td>{curApplication.title}</td>
                            <td>{curApplication.divisionName}</td>
                        </tr>
                        <tr className='Profilesection_MobileTable Profilesection_odd'>
                            <td>{curApplication.belt}</td>
                            <td>{curApplication.weight}</td>
                            <td>{curApplication.isPayment}</td>
                            <td className='payInfo'><button id='payInfoBtn'>상세정보</button></td>
                        </tr>
                </tbody>
            )
        })
    }

    //지난 대회
    function renderLastCompetition(){
        let cnt = 0;
        return competitionApplications.map((application) => {
            let curApplication = applicationParsing(application);
            let today = new Date();
            if( today < new Date(application.Competition.doreOpen)) {
                return ;
            }
            cnt++;
            if(!isFullListedLast && cnt>3) {
                return ;
            }
            return(
                <tbody>
                        <tr className='Profilesection_PcTable'>
                            <td>{curApplication.doreOpen}</td>
                            <td>{curApplication.location}</td>
                            <td>{curApplication.title}</td>
                            <td>{curApplication.divisionName}</td>
                            <td>{curApplication.belt}</td>
                            <td>{curApplication.weight}</td>
                            <td>{curApplication.isPayment}</td>
                            <td className='payInfo'><button id='payInfoBtn'>상세정보</button></td>
                        </tr>
                        <tr className='Profilesection_MobileTable'>
                            <td><div id='Profilesection_tableDate'><p>{curApplication.doreOpen}</p></div></td>
                            <td>{curApplication.location}</td>
                            <td>{curApplication.title}</td>
                            <td>{curApplication.divisionName}</td>
                        </tr>
                        <tr className='Profilesection_MobileTable Profilesection_odd'>
                            <td>{curApplication.belt}</td>
                            <td>{curApplication.weight}</td>
                            <td>{curApplication.isPayment}</td>
                            <td className='payInfo'><button id='payInfoBtn'>상세정보</button></td>
                        </tr>
                </tbody>
            )

        })
    }

    //탭 클릭
    function isClicked() {

    }

    function ChangeIsFullListedNow() {
        setisFullListedNow(!isFullListedNow);
    }

    function ChangeIsFullListedLast() {
        setisFullListedLast(!isFullListedLast);
    }

    useEffect(() => {
        if(decodedToken){ // 레벨 1인 유저가 들어오면 다시 수정페이지로 리다이렉트
            if(decodedToken.userLevel == 1){
                alert('회원가입을 완료해주세요');
                navigate('/UserInfopage')
            }
        }

        getCompetitionApplication();
    }, [decodedToken])


    return (
        <div className='Profilesection_wrapper'>
            <ProfileTap/>
            <section className='Profilesection_right'>
                <h2>대회신청 목록</h2>
                <ul className='Profilesection_competitonNav'>
                    <li className='Profilesection_active'>개인 신청</li>
                    <li>단체 신청</li>
                    <li>지난 대회</li>
                </ul>
                <hr className='Profilesection_hr'/>
            </section>
        </div>
    )

}

export default Profilesection