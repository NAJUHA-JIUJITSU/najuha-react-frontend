import React from 'react'
import {useState, useEffect} from 'react';
import './profileInfo.css'
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useJwt } from "react-jwt";
import { useNavigate, useParams } from "react-router-dom";

function ProfileInfo() {
    const [competitionApplicationInfo, setcompetitionApplicationInfo] = useState([]); //유저 신청 대회 상세정보 가져오기
    const cookies = new Cookies();
    const xAccessToken = cookies.get("x-access-token");
    const { decodedToken, isExpired } = useJwt(xAccessToken);
    const navigate = useNavigate();

    const params = useParams(); // ex) id: 1
    console.log('대회 id: ' + params.id)

    //서버에서 대회상세정보 가져오기
    async function getCompetitionApplicationInfo() {
        axios.get(`${process.env.REACT_APP_BACK_END_API}/users/competitionApplications/${params.id}`,
        {
            headers: {
                'x-access-token':  xAccessToken
            }
        })
        .then((res) => {
            console.log('불러온 데이터: ' + res.data.result);
            setcompetitionApplicationInfo(res.data.result);
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

        let id = application.id;
        let host = application.Competition.host;
        let title = (application.Competition.title.length > 44) ? application.Competition.title.substr(0, 24) + '...' : application.Competition.title;
        let locations = application.Competition.location.split(' ');
        let location = locations[0];
        let amount = ( today > new Date(application.Competition.earlyBirdDeadline) ) ? application.expectedPrice.earlyBirdFalse : application.expectedPrice.earlyBirdTrue;
        let doreOpen = application.Competition.doreOpen.substr(5,5).replace('-','.');
        let day = getDayOfWeek(application.Competition.doreOpen);
        let registrationDeadline = ( today > new Date(application.Competition.registrationDeadline) ) ? false : true;
        let postUrl = ( application.Competition.CompetitionPoster ) ? application.Competition.CompetitionPoster.imageUrl : 'Assets/samplePoster.png';
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
    
    useEffect(() => {
        if(decodedToken){ // 레벨 1인 유저가 들어오면 다시 수정페이지로 리다이렉트
            if(decodedToken.userLevel == 1){
                alert('회원가입을 완료해주세요');
                navigate('/UserInfopage')
            }
        }

        getCompetitionApplicationInfo();
    }, [decodedToken])


    return (
        <div className='ProfileInfo_wrapper'>
            <div className='ProfileInfo_title'>
                <h2>인천시 회장배 주짓수 대회</h2>
            </div>
            <div className='ProfileInfo_competition'>
                <div className='ProfileInfo_competition_Left'>
                    이미지
                    <img src='Assets/samplePoster.png' alt='대회포스터'></img>
                </div>
                <div className='ProfileInfo_competition_Right'>
                    <div className='ProfileInfo_competition_date'>
                        <h3>대회 날짜</h3>
                        <p>22.11.04(월)</p>
                    </div>
                    <div className='ProfileInfo_competition_date'>
                        <h3>대회 장소</h3>
                        <p>서울, 88 체육관인데 두 줄로 이렇게까지 넘어가면</p>
                    </div>
                    <div className='ProfileInfo_competition_date'>
                        <h3>얼리버드 마감</h3>
                        <p>22.11.04(월)</p>
                    </div>
                    <div className='ProfileInfo_competition_date'>
                        <h3>참가신청 마감</h3>
                        <p>22.11.04(월)</p>
                    </div>
                    <div className='ProfileInfo_competition_date'>
                        <h3>신청자 명단</h3>
                        <p>22.11.04(월)</p>
                    </div>
                    <div className='ProfileInfo_competition_date'>
                        <h3>대진표 공개</h3>
                        <p>22.11.04(월)</p>
                    </div>
                </div>
            </div>
            <div className='ProfileInfo_user'>
                <h2>대표 정보</h2>
                <div className='ProfileInfo_userInfo_Wrap'>
                    <div className='ProfileInfo_userInfo ProfileInfo_userInfo_team'>
                        <h3>팀 이름</h3>
                        <p>김포 골든라이언</p>
                    </div>
                    <div className='ProfileInfo_userInfo'>
                        <h3>대표 번호</h3>
                        <p>010-1234-1234</p>
                    </div>
                </div> 
            </div>
            <div className='ProfileInfo_userList'>
                <h2>신청자 명단(단체)</h2>
                <table>
                    <tr>
                        <td>No.</td>
                        <td>이름</td>
                        <td>생년월일</td>
                        <td>성별</td>
                        <td>기/노기</td>
                        <td>부문</td>
                        <td>벨트</td>
                        <td>체급</td>
                        <td>참가비</td>
                    </tr>
                </table>
            </div>
        </div>
    )
}

export default ProfileInfo