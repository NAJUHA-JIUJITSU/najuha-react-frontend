import React from 'react'
import {useState, useEffect} from 'react';
import './profilesection.css'
import axios from 'axios';
import ProfileTap from '../components/ProfileTap'

function Profilesection() {
    const [competitionApplications, setCompetitionApplications] = useState([]);
    const [isFullListedNow, setisFullListedNow] = useState(false);
    const [isFullListedLast, setisFullListedLast] = useState(false);

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

    function applicationParsing(application){
        let doreOpen = application.Competition.doreOpen.substr(5,5).replace('-','.');
        let locations = application.Competition.location.split(' ');
        let location = locations[0]
        let title = (application.Competition.title.length > 24) ? application.Competition.title.substr(0, 14) + '...' : application.Competition.title;
        let divisionName = application.divisionName;
        let belt = application.belt.charAt(0).toUpperCase() + application.belt.slice(1);
        let uniform = (application.uniform = "gi") ? '기-' : '노기-';
        let weight = application.weight + 'kg';
        let isPayment = application.isPayment ? '결제완료' : '미결제';
       
        return {
            'doreOpen': doreOpen,
            'location': location,
            'title': title,
            'divisionName': uniform + divisionName,
            'belt': belt,
            'weight': weight,
            'isPayment': isPayment,
        }
    }

    function renderCompetition(){
        let cnt = 0;
        return competitionApplications.map((application) => {
            let curApplication = applicationParsing(application);
            let today = new Date();
            if( today > new Date(application.Competition.doreOpen)) {
                return ;
            }
            cnt++;
            if(!isFullListedNow && cnt>3) {
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

    function ChangeIsFullListedNow() {
        setisFullListedNow(!isFullListedNow);
    }

    function ChangeIsFullListedLast() {
        setisFullListedLast(!isFullListedLast);
    }

    useEffect(() => {
        getCompetitionApplication();
    }, [])


    return (
        <div className='Profilesection_wrapper'>
            <ProfileTap/>
            <section className='Profilesection_right'>
                <h2>대회신청목록</h2>
                <div className='Profilesection_myCompetitionList nowList'>
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
                </div>
            </section>
        </div>
    )

}

export default Profilesection