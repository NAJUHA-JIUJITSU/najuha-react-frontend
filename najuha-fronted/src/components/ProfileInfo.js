import React from 'react'
import {useState, useEffect} from 'react';
import './profileInfo.css'
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useJwt } from "react-jwt";
import { useNavigate, useParams } from "react-router-dom";
import arrowLeftIcon from "../src_assets/arrow_left.svg";

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
            setcompetitionApplicationInfo(applicationParsing(res.data.result));
            console.log('파싱한 데이터: ' + competitionApplicationInfo)
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

    function autoHypenPhone(str){
        let tmp = '';
        if( str.length < 4){
            return str;
        }else if(str.length < 7){
            tmp += str.substr(0, 3);
            tmp += '-';
            tmp += str.substr(3);
            return tmp;
        }else if(str.length < 11){
            tmp += str.substr(0, 3);
            tmp += '-';
            tmp += str.substr(3, 3);
            tmp += '-';
            tmp += str.substr(6);
            return tmp;
        }else{              
            tmp += str.substr(0, 3);
            tmp += '-';
            tmp += str.substr(3, 4);
            tmp += '-';
            tmp += str.substr(7);
            return tmp;
        }
    
        return str;
  }
    
     //신청대회 데이터 파싱
    function applicationParsing(application){
        let title =  application.Competition.title;

        let postUrl = ( application.Competition.CompetitionPoster ) ? application.Competition.CompetitionPoster.imageUrl : 'Assets/samplePoster.png';
        let doreOpen = application.Competition.doreOpen.substr(0,10).replace('-','.').replace('-','.');
        let doreOpenDay = getDayOfWeek(application.Competition.doreOpen);
        let location = application.Competition.location;
        let earlyBirdDeadline = application.Competition.earlyBirdDeadline.substr(0,10).replace('-','.').replace('-','.');
        let earlyBirdDeadlineDay = getDayOfWeek(application.Competition.earlyBirdDeadline);
        let registrationDeadline = application.Competition.registrationDeadline.substr(0,10).replace('-','.').replace('-','.');
        let registrationDeadlineDay = getDayOfWeek(application.Competition.registrationDeadline);
        let applicantTableOpenDate = application.Competition.applicantTableOpenDate.substr(0,10).replace('-','.').replace('-','.');
        let applicantTableOpenDateDay = getDayOfWeek(application.Competition.applicantTableOpenDate);
        let tournamentTableOpenDate = application.Competition.tournamentTableOpenDate.substr(0,10).replace('-','.').replace('-','.');
        let tournamentTableOpenDateDay = getDayOfWeek(application.Competition.tournamentTableOpenDate);

        let team = application.CompetitionApplicationInfos[0].team;
        let phoneNumber = autoHypenPhone(application.CompetitionApplicationInfos[0].phoneNumber);

        let isGroup = ( application.isGroup ) ?  "단체" : "개인";


      
        return {
            'title': title,

            'postUrl' : postUrl,
            'doreOpen' : doreOpen + '(' + doreOpenDay + ')',
            'location': location + '엄청 엄청 긴 대회라서 두 줄로 표시해야 한다고오오오',
            'earlyBirdDeadline' : earlyBirdDeadline + '(' + earlyBirdDeadlineDay + ')',
            'registrationDeadline' : registrationDeadline + '(' + registrationDeadlineDay + ')',
            'applicantTableOpenDate' : applicantTableOpenDate + '(' + applicantTableOpenDateDay + ')',
            'tournamentTableOpenDate' : tournamentTableOpenDate + '(' + tournamentTableOpenDateDay + ')',

            'team' : team,
            'phoneNumber' : phoneNumber,
            'isGroup' : isGroup,
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
                <a onClick={()=>{navigate(`/Profilepage/`)}}><img src={arrowLeftIcon} alt='이전으로 돌아가기'></img></a>
                <h2>{competitionApplicationInfo.title}</h2>
            </div>
            <div className='ProfileInfo_competition'>
                <div className='ProfileInfo_competition_Left'>
                    <img src={competitionApplicationInfo.postUrl} alt='대회포스터'></img>
                </div>
                <div className='ProfileInfo_competition_Right'>
                    <div className='ProfileInfo_competition_date'>
                        <h3>대회 날짜</h3>
                        <p>{competitionApplicationInfo.doreOpen}</p>
                    </div>
                    <div className='ProfileInfo_competition_date'>
                        <h3>대회 장소</h3>
                        <p>{competitionApplicationInfo.location}</p>
                    </div>
                    <div className='ProfileInfo_competition_date'>
                        <h3>얼리버드 마감</h3>
                        <p>{competitionApplicationInfo.earlyBirdDeadline}</p>
                    </div>
                    <div className='ProfileInfo_competition_date'>
                        <h3>참가신청 마감</h3>
                        <p>{competitionApplicationInfo.registrationDeadline}</p>
                    </div>
                    <div className='ProfileInfo_competition_date'>
                        <h3>신청자 명단</h3>
                        <p>{competitionApplicationInfo.applicantTableOpenDate}</p>
                    </div>
                    <div className='ProfileInfo_competition_date'>
                        <h3>대진표 공개</h3>
                        <p>{competitionApplicationInfo.tournamentTableOpenDate}</p>
                    </div>
                </div>
            </div>
            <div className='ProfileInfo_user'>
                <h2>대표 정보</h2>
                <div className='ProfileInfo_userInfo_Wrap'>
                    <div className='ProfileInfo_userInfo ProfileInfo_userInfo_team'>
                        <h3>팀 이름</h3>
                        <p>{competitionApplicationInfo.team}</p>
                    </div>
                    <div className='ProfileInfo_userInfo'>
                        <h3>대표 번호</h3>
                        <p>{competitionApplicationInfo.phoneNumber}</p>
                    </div>
                </div> 
            </div>
            <div className='ProfileInfo_userList'>
                <h2>신청자 명단({competitionApplicationInfo.isGroup})</h2>
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