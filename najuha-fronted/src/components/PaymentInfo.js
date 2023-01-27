import React from 'react'
import {useState, useEffect} from 'react';
import './paymentInfo.css'
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { useJwt } from "react-jwt";
import { useNavigate, useParams } from "react-router-dom";
import samplePoster from "../src_assets/samplePoster.png";


function PaymentInfo() {
    const [competitionApplicationInfo, setcompetitionApplicationInfo] = useState([]); //유저 신청 대회 상세정보 가져오기
    const [competitionApplicationList, setCompetitionApplicationList] = useState([]); //유저 신청 대회 유저 리스트 가져오기
    const cookies = new Cookies();
    const xAccessToken = cookies.get("x-access-token");
    const { decodedToken, isExpired } = useJwt(xAccessToken);
    const navigate = useNavigate();

    const params = useParams(); // ex) id: 1
    console.log('대회 id: ' + params.id)

    //서버에서 대회상세정보 가져오기
    async function getCompetitionApplicationInfo() {
        axios.get(`${process.env.REACT_APP_BACK_END_API}/admin/competitions/${params.id}`,
        {
            headers: {
                'x-access-token':  xAccessToken
            }
        })
        .then((res) => {
            setCompetitionApplicationList(res.data.result);
            console.log('데이터: '+res.data.result)
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

    //핸드폰 숫자 사이 하이픈 넣기
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
        let id = application.id;
        let title =  application.Competition.title;

        let postUrl = ( application.Competition.CompetitionPoster ) ? application.Competition.CompetitionPoster.imageUrl : samplePoster;
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
        let amount = application.expectedPrice.normalPrice;
        let isPay = ( application.competitionPayment===null ) ? "예상 결제금액" : "총 결제금액";

        //버튼 렌더에 필요한 정보
        let competitionPayment = application.competitionPayment;
        let status = (application.competitionPayment)? application.competitionPayment.status : ' ';
        let today = new Date();
        let CheckRegistrationDeadline = ( today > new Date(application.Competition.registrationDeadline) ) ? false : true; //false면 신청마감
        let CheckDoreOpen = ( today > new Date(application.Competition.doreOpen) ) ? false : true; //false면 대회날짜 지남
       


      
        return {
            'id' : id,
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
            'amount' : amount,
            'isPay' : isPay,

            //버튼 렌더에 필요한 정보
            'competitionPayment' : competitionPayment,
            'status' : status,
            'CheckRegistrationDeadline' : CheckRegistrationDeadline,
            'CheckDoreOpen' : CheckDoreOpen,



        }
    }


    //(오칸 코드) 테이블 렌더
    function renderCompetitionApplicationList(){
        return competitionApplicationList.map((application, i) => {
          return(
            <ul key={i} className='CompetitionApplyTeamForm-bottom-table-row'>
                        <li>{i+1}</li>
                        <li>{application.playerName}</li>
                        <li>{application.playerBirth}</li>
                        <li>{application.gender == 'female' ? '여자' : '남자'}</li>
                        <li>{application.uniform == 'gi' ? '기' : '노기'}</li>
                        <li>{application.divisionName}</li>
                        <li>{application.belt}</li>
                        <li>{application.weight}</li>
                        <li>{application.pricingPolicy.normal}원</li>
            </ul>
          )
        })
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
        <div className='PaymentInfo_wrapper'>
            <h2>페이먼트 인포!!</h2>
        </div>
    )
}

export default PaymentInfo