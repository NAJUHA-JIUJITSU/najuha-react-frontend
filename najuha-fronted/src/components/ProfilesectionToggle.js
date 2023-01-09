import React from 'react'
import {useState, useEffect} from 'react';
import './profilesectionToggle.css'
import axios from 'axios';
import ProfileTap from '../components/ProfileTap'
import { Cookies } from 'react-cookie';
import { useJwt } from "react-jwt";
import { useNavigate } from "react-router-dom";
import rightArrow from "../src_assets/rightArrow.svg";
import xIcon from "../src_assets/x.svg";
import samplePoster from "../src_assets/samplePoster.png";

function ProfilesectionToggle() {
    const [competitionApplications, setCompetitionApplications] = useState([]); //유저 신청 대회 가져오기
    const [clickedList, setclickedList] = useState('person');
    const [active, setActive] = useState(['Profilesection_active', '', '']);
    const cookies = new Cookies();
    const xAccessToken = cookies.get("x-access-token");
    const { decodedToken, isExpired } = useJwt(xAccessToken);
    const navigate = useNavigate();

    // async function getCompetitionApplication() {
    //     axios.get(`${process.env.REACT_APP_BACK_END_API}/users/competitionApplications`,
    //     {
    //         headers: {
    //             'x-access-token':  xAccessToken
    //         }
    //     })
    //     .then((res) => {
    //         setCompetitionApplications(res.data.result);
    //         console.log(res.data.message);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         console.log(err.response.status);
    //         console.log(err.response.data.message);
    //     })
    //     return ;
    // }

    // function applicationParsing(application){
    //     let doreOpen = application.Competition.doreOpen.substr(5,5).replace('-','.');
    //     let locations = application.Competition.location.split(' ');
    //     let location = locations[0]
    //     let title = (application.Competition.title.length > 24) ? application.Competition.title.substr(0, 14) + '...' : application.Competition.title;
    //     let divisionName = application.divisionName;
    //     let belt = application.belt.charAt(0).toUpperCase() + application.belt.slice(1);
    //     let uniform = (application.uniform = "gi") ? '기-' : '노기-';
    //     let weight = application.weight + 'kg';
    //     let isPayment = application.isPayment ? '결제완료' : '미결제';
       
    //     return {
    //         'doreOpen': doreOpen,
    //         'location': location,
    //         'title': title,
    //         'divisionName': uniform + divisionName,
    //         'belt': belt,
    //         'weight': weight,
    //         'isPayment': isPayment,
    //     }
    // }

    // function renderCompetition(){
    //     let cnt = 0;
    //     return competitionApplications.map((application) => {
    //         let curApplication = applicationParsing(application);
    //         let today = new Date();
    //         if( today > new Date(application.Competition.doreOpen)) {
    //             return ;
    //         }
    //         cnt++;
    //         if(!isFullListedNow && cnt>3) {
    //             return ;
    //         }
    //         return(
    //             <tbody>
    //                     <tr className='Profilesection_PcTable'>
    //                         <td>{curApplication.doreOpen}</td>
    //                         <td>{curApplication.location}</td>
    //                         <td>{curApplication.title}</td>
    //                         <td>{curApplication.divisionName}</td>
    //                         <td>{curApplication.belt}</td>
    //                         <td>{curApplication.weight}</td>
    //                         <td>{curApplication.isPayment}</td>
    //                         <td className='payInfo'><button id='payInfoBtn'>상세정보</button></td>
    //                     </tr>
    //                     <tr className='Profilesection_MobileTable'>
    //                         <td><div id='Profilesection_tableDate'><p>{curApplication.doreOpen}</p></div></td>
    //                         <td>{curApplication.location}</td>
    //                         <td>{curApplication.title}</td>
    //                         <td>{curApplication.divisionName}</td>
    //                     </tr>
    //                     <tr className='Profilesection_MobileTable Profilesection_odd'>
    //                         <td>{curApplication.belt}</td>
    //                         <td>{curApplication.weight}</td>
    //                         <td>{curApplication.isPayment}</td>
    //                         <td className='payInfo'><button id='payInfoBtn'>상세정보</button></td>
    //                     </tr>
    //             </tbody>
    //         )
    //     })
    // }

    // function renderLastCompetition(){
    //     let cnt = 0;
    //     return competitionApplications.map((application) => {
    //         let curApplication = applicationParsing(application);
    //         let today = new Date();
    //         if( today < new Date(application.Competition.doreOpen)) {
    //             return ;
    //         }
    //         cnt++;
    //         if(!isFullListedLast && cnt>3) {
    //             return ;
    //         }
    //         return(
    //             <tbody>
    //                     <tr className='Profilesection_PcTable'>
    //                         <td>{curApplication.doreOpen}</td>
    //                         <td>{curApplication.location}</td>
    //                         <td>{curApplication.title}</td>
    //                         <td>{curApplication.divisionName}</td>
    //                         <td>{curApplication.belt}</td>
    //                         <td>{curApplication.weight}</td>
    //                         <td>{curApplication.isPayment}</td>
    //                         <td className='payInfo'><button id='payInfoBtn'>상세정보</button></td>
    //                     </tr>
    //                     <tr className='Profilesection_MobileTable'>
    //                         <td><div id='Profilesection_tableDate'><p>{curApplication.doreOpen}</p></div></td>
    //                         <td>{curApplication.location}</td>
    //                         <td>{curApplication.title}</td>
    //                         <td>{curApplication.divisionName}</td>
    //                     </tr>
    //                     <tr className='Profilesection_MobileTable Profilesection_odd'>
    //                         <td>{curApplication.belt}</td>
    //                         <td>{curApplication.weight}</td>
    //                         <td>{curApplication.isPayment}</td>
    //                         <td className='payInfo'><button id='payInfoBtn'>상세정보</button></td>
    //                     </tr>
    //             </tbody>
    //         )

    //     })
    // }

    // function ChangeIsFullListedNow() {
    //     setisFullListedNow(!isFullListedNow);
    // }

    // function ChangeIsFullListedLast() {
    //     setisFullListedLast(!isFullListedLast);
    // }

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

    //요일 값 구하기
    function getDayOfWeek(날짜문자열){ //ex) getDayOfWeek('2022-06-13')

        const week = ['일', '월', '화', '수', '목', '금', '토'];
    
        const dayOfWeek = week[new Date(날짜문자열).getDay()];
    
        return dayOfWeek;
    
    }

    //신청대회 데이터 파싱
    function applicationParsing(application){
        let today = new Date();

        let id = application.Competition.id;
        let host = application.Competition.host;
        let title = (application.Competition.title.length > 44) ? application.Competition.title.substr(0, 24) + '...' : application.Competition.title;
        let locations = application.Competition.location.split(' ');
        let location = locations[0];
        let amount = ( today > new Date(application.Competition.earlyBirdDeadline) ) ? application.expectedPrice.earlyBirdFalse : application.expectedPrice.earlyBirdTrue;
        let doreOpen = application.Competition.doreOpen.substr(5,5).replace('-','.');
        let day = getDayOfWeek(application.Competition.doreOpen);
        let registrationDeadline = ( today > new Date(application.Competition.registrationDeadline) ) ? false : true;
        let postUrl = ( application.Competition.CompetitionPoster ) ? application.Competition.CompetitionPoster.imageUrl : samplePoster;
        let isPayment = application.isPayment ? '결제완료' : '결제하기';
        let isGroup = application.isGroup;
        let costMsg = application.isPayment ? '예상 결제금액' : '총 결제금액';
        let payCss = (isPayment == '결제하기' && registrationDeadline == true) ? 'Profilesection_costLayout Profilesection_payCss' : 'Profilesection_costLayout';
        // let divisionName = application.divisionName;
        // let belt = application.belt.charAt(0).toUpperCase() + application.belt.slice(1);
        // let uniform = (application.uniform = "gi") ? '기-' : '노기-';
        // let weight = application.weight + 'kg';
      
        return {
            'id' : id,
            'host' : host,
            'title': title,
            'location': location,
            'amount' : amount, //위에서 오늘날짜랑 비교해서 얼리버드 할인 알아서 적용한 값
            'doreOpen': doreOpen,
            'day' : day,
            'registrationDeadline' : registrationDeadline, //false면 신청마감
            'isPayment': ( registrationDeadline ) ? isPayment : '신청마감',
            'isGroup' : isGroup, //false 면 개인, true면 단체
            'costMsg' : costMsg,
            'payCss' : payCss,
            'postUrl' : postUrl,
        }
    }

    //실시간 대회 렌더
    function renderCompetition(){
        return competitionApplications.map((application) => {
            let curApplication = applicationParsing(application);
            let today = new Date();
            
            if(clickedList == 'person') {
                //날짜가 오늘을 기준으로 지났으면 안보여주기
                if( today > new Date(application.Competition.doreOpen) ) {
                    return ;
                }
                //단체신청이면 안보여주기
                if( curApplication.isGroup ) {
                    return ;
                }
            }
            if(clickedList == 'group') {
                //날짜가 오늘을 기준으로 지났으면 안보여주기(오늘은 보여줌)
                if( today >= new Date(application.Competition.doreOpen) ) {
                    return ;
                }
                //개인신청이면 안보여주기
                if( !curApplication.isGroup ) {
                    return ;
                }
            }

            if(clickedList == 'last') {
                //날짜가 오늘을 기준으로 안지났으면 안보여주기
                if( today < new Date(application.Competition.doreOpen) ) {
                    return ;
                }
            }

            return(
                <div>
                    <div>
                        <div className='Profilesection_competitoninfo'>
                            <a>대회신청내역 상세보기</a>
                            <img src={rightArrow} alt='이동 화살표'></img>
                        </div>
                        <div className= 'Profilesection_competitonbox'>
                            <div className= 'Profilesection_boxLeft'>
                                <img src={curApplication.postUrl} alt='대회포스터'></img>
                                <p className= 'Profilesection_posterBlack'></p>
                                <h3>{curApplication.doreOpen}({curApplication.day})</h3>
                            </div>
                            <div className= 'Profilesection_boxRight'>
                                <img src={xIcon} alt='삭제 아이콘' className= 'Profilesection_boxDelete'></img>
                                <div className= 'Profilesection_boxRightTitle'>
                                    <h4>신청인<span>{curApplication.host}</span></h4>
                                    <h3>{curApplication.title}</h3>
                                    <p>{curApplication.location}</p>
                                </div>
                            </div>
                        </div>
                        <div className= 'Profilesection_boxRightCost'>
                            <div className={curApplication.payCss}>
                                <h3>{curApplication.costMsg}</h3>
                                <p>{curApplication.amount}</p>
                                <button className= 'Profilesection_costBtn'>{curApplication.isPayment}</button>
                            </div>
                        </div>
                    </div>
                    
                    <hr className='Profilesection_competitonHr'/>
                </div>
               
            )
        })
    }

    //탭 클릭
    function isClicked(list, i) {
        let reset = ['', '', ''];
        reset[i] = 'Profilesection_active';
        setActive(reset);
        setclickedList(list);
        console.log(clickedList);
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
        <div className='ProfilesectionToggle_wrapper'>
            <ProfileTap/>
            <section className='ProfilesectionToggle_right'>
                <h2>대회신청목록</h2>
                <ul className='Profilesection_competitonNav'>
                    <li className={active[0]} onClick={() => isClicked('person', 0)}>개인 신청</li>
                    <li className={active[1]} onClick={() => isClicked('group', 1)}>단체 신청</li>
                    <li className={active[2]} onClick={() => isClicked('last', 2)}>지난 대회</li>
                </ul>
                <hr className='Profilesection_hr'/>
                <div className='Profilesection_competitonList'>
                    {renderCompetition()}
                </div>
                {/* <div className='Profilesection_myCompetitionList nowList'>
                    <div className='Profilesection_tableName'>
                        <h3>실시간 대회신청</h3>
                        <p onClick={ChangeIsFullListedNow}>전체보기<img src='Assets/arrow_right.svg' alt='오른쪽 화살표'></img></p>
                    </div>
                    <table>
                        <thead className='Profilesection_thead'>
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
                        {renderCompetition()}
                    </table>
                </div>
                <div className='Profilesection_myCompetitionList totlaList'>
                    <h3>총 대회신청</h3>
                    <p onClick={ChangeIsFullListedLast}>전체보기<img src='Assets/arrow_right.svg' alt='오른쪽 화살표'></img></p>
                    <table>
                        <thead className='Profilesection_thead'>
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
                        {renderLastCompetition()}
                    </table>
                </div> */}
            </section>
        </div>
    )

}

export default ProfilesectionToggle