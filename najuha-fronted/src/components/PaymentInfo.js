import React from 'react'
import { useState, useEffect } from 'react'
import './paymentInfo.css'
import { Cookies } from 'react-cookie'
import { useJwt } from 'react-jwt'
import { useNavigate, useParams } from 'react-router-dom'
import samplePoster from '../src_assets/samplePoster.png'
import {
  getAdminCompetitionApplicationList,
  deleteAdminApplicationPayment,
} from '../apis/api/admin'

function PaymentInfo() {
  const [competitionApplicationInfo, setcompetitionApplicationInfo] = useState(
    []
  ) //유저 신청 대회 상세정보 가져오기
  const [competitionApplicationList, setCompetitionApplicationList] = useState(
    []
  ) //유저 신청 대회 유저 리스트 가져오기
  const [clickID, setclickID] = useState(0) //클릭한 유저 신청 대회 id
  const cookies = new Cookies()
  const xAccessToken = cookies.get('x-access-token')
  const { decodedToken, isExpired } = useJwt(xAccessToken)
  const navigate = useNavigate()

  const params = useParams() // ex) id: 1

  let competitionPayAmount //대회 총 결제 금액
  let userPayAmount //유저별 결제 금액 합계
  let userRealPayAmount //유저별 진짜 총 결제 금액 (할인적용)

  //서버에서 대회신청 상세정보 가져오기
  async function getCompetitionApplicationInfo() {
    const res = await getAdminCompetitionApplicationList(params.id)
    if (res) {
      setcompetitionApplicationInfo(applicationParsing(res.data.result))
      setCompetitionApplicationList(res.data.result.competitionApplications)
    }
  }

  //요일 값 구하기
  function getDayOfWeek(날짜문자열) {
    //ex) getDayOfWeek('2022-06-13')

    const week = ['일', '월', '화', '수', '목', '금', '토']

    const dayOfWeek = week[new Date(날짜문자열).getDay()]

    return dayOfWeek
  }

  //신청대회 데이터 파싱
  function applicationParsing(application) {
    let id = application.competition.id
    let title = application.competition.title

    let postUrl = application.competition.CompetitionPoster
      ? application.competition.CompetitionPoster.imageUrl
      : samplePoster
    let doreOpen = application.competition.doreOpen
      .substr(0, 10)
      .replace('-', '.')
      .replace('-', '.')
    let doreOpenDay = getDayOfWeek(application.competition.doreOpen)
    let location = application.competition.location
    let earlyBirdDeadline = application.competition.earlyBirdDeadline
      .substr(0, 10)
      .replace('-', '.')
      .replace('-', '.')
    let earlyBirdDeadlineDay = getDayOfWeek(
      application.competition.earlyBirdDeadline
    )
    let registrationDeadline = application.competition.registrationDeadline
      .substr(0, 10)
      .replace('-', '.')
      .replace('-', '.')
    let registrationDeadlineDay = getDayOfWeek(
      application.competition.registrationDeadline
    )
    let applicantTableOpenDate = application.competition.applicantTableOpenDate
      .substr(0, 10)
      .replace('-', '.')
      .replace('-', '.')
    let applicantTableOpenDateDay = getDayOfWeek(
      application.competition.applicantTableOpenDate
    )
    let tournamentTableOpenDate =
      application.competition.tournamentTableOpenDate
        .substr(0, 10)
        .replace('-', '.')
        .replace('-', '.')
    let tournamentTableOpenDateDay = getDayOfWeek(
      application.competition.tournamentTableOpenDate
    )

    return {
      id: id,
      title: title,
      postUrl: postUrl,

      doreOpen: doreOpen + '(' + doreOpenDay + ')',
      location: location,
      earlyBirdDeadline: earlyBirdDeadline + '(' + earlyBirdDeadlineDay + ')',
      registrationDeadline:
        registrationDeadline + '(' + registrationDeadlineDay + ')',
      applicantTableOpenDate:
        applicantTableOpenDate + '(' + applicantTableOpenDateDay + ')',
      tournamentTableOpenDate:
        tournamentTableOpenDate + '(' + tournamentTableOpenDateDay + ')',
    }
  }

  //왼쪽 테이블 렌더
  function renderCompetitionApplicationList() {
    competitionPayAmount = 0
    return competitionApplicationList.map((application, i) => {
      competitionPayAmount += application.competitionPayment.amount
      return (
        <tr
          className="PaymentInfo_tableHover"
          onClick={() => {
            idClick(application.id)
          }}
        >
          <td>{i + 1}</td>
          <td>{application.User.UserInfo.fullName}</td>
          <td>{application.User.UserInfo.phoneNumber}</td>
          <td>{application.isGroup ? '단체' : '개인'}</td>
          <td>{application.competitionPayment.amount}</td>
          <td>{application.competitionPayment.id}</td>
          <button
            onClick={() => {
              if (window.confirm('정말로 환불하시겠습니까?'))
                refund(application.competitionPayment.orderId)
            }}
            style={{ color: 'red' }}
          >
            환불
          </button>
        </tr>
      )
    })
  }

  //유저 클릭
  function idClick(id) {
    setclickID(id)
  }

  //오른쪽 테이블 렌더
  function renderCompetitionApplicationListInfo() {
    userPayAmount = 0
    userRealPayAmount = 0
    return competitionApplicationList.map(parentApplication => {
      if (parentApplication.id == clickID) {
        userRealPayAmount = parentApplication.competitionPayment.amount
        return parentApplication.CompetitionApplicationInfos.map(
          (application, i) => {
            userPayAmount += application.pricingPolicy.normal
            return (
              <tr>
                <td>{i + 1}</td>
                <td>{application.playerName}</td>
                <td>{application.playerBirth}</td>
                <td>{application.gender == 'male' ? '남자' : '여자'}</td>
                <td>{application.uniform == 'gi' ? '기' : '노기'}</td>
                <td>{application.divisionName}</td>
                <td>{application.belt}</td>
                <td>{application.weight}kg</td>
                <td>{application.pricingPolicy.normal}원</td>
              </tr>
            )
          }
        )
      }
      return
    })
  }

  //오른쪽 대표 정보 렌더
  function renderCompetitionApplicationListInfoTitle() {
    return competitionApplicationList.map(application => {
      if (application.id == clickID) {
        return (
          <div className="PaymentInfo_listInfoTitle">
            <h2>
              팀 이름
              <span>{application.CompetitionApplicationInfos[0].team}</span>
            </h2>
            <h2>
              대표번호
              <span>
                {application.CompetitionApplicationInfos[0].phoneNumber}
              </span>
            </h2>
          </div>
        )
      }
      return
    })
  }

  //환불 함수
  async function refund(orderId) {
    await deleteAdminApplicationPayment(orderId)
    getCompetitionApplicationInfo()
  }

  useEffect(() => {
    if (decodedToken) {
      // 레벨 1인 유저가 들어오면 다시 수정페이지로 리다이렉트
      if (decodedToken.userLevel == 1) {
        alert('회원가입을 완료해주세요')
        navigate('/UserInfopage')
      }
    }
    getCompetitionApplicationInfo()
  }, [decodedToken])

  return (
    <div className="PaymentInfo_wrapper">
      <div className="PaymentInfo_top">
        <div className="ProfileInfo_title">
          <h2>{competitionApplicationInfo.title}</h2>
        </div>
        <div className="ProfileInfo_competition">
          <div className="ProfileInfo_competition_Left">
            <img
              src={competitionApplicationInfo.postUrl}
              alt="대회포스터"
            ></img>
          </div>
          <div className="ProfileInfo_competition_Right">
            <div className="ProfileInfo_competition_date">
              <h3>대회 날짜</h3>
              <p>{competitionApplicationInfo.doreOpen}</p>
            </div>
            <div className="ProfileInfo_competition_date">
              <h3>대회 장소</h3>
              <p>{competitionApplicationInfo.location}</p>
            </div>
            <div className="ProfileInfo_competition_date">
              <h3>얼리버드 마감</h3>
              <p>{competitionApplicationInfo.earlyBirdDeadline}</p>
            </div>
            <div className="ProfileInfo_competition_date">
              <h3>참가신청 마감</h3>
              <p>{competitionApplicationInfo.registrationDeadline}</p>
            </div>
            <div className="ProfileInfo_competition_date">
              <h3>신청자 명단</h3>
              <p>{competitionApplicationInfo.applicantTableOpenDate}</p>
            </div>
            <div className="ProfileInfo_competition_date">
              <h3>대진표 공개</h3>
              <p>{competitionApplicationInfo.tournamentTableOpenDate}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="PaymentInfo_bottom">
        <div className="PaymentInfo_list">
          <table>
            <tr>
              <th>No.</th>
              <th>결제자</th>
              <th>핸드폰 번호</th>
              <th>개인/단체</th>
              <th>결제금액</th>
              <th>결제ID</th>
            </tr>
            {renderCompetitionApplicationList()}
          </table>
          <h2>
            총 결제금액 <span>{competitionPayAmount}원</span>
          </h2>
        </div>
        <div className="PaymentInfo_listInfo">
          {renderCompetitionApplicationListInfoTitle()}
          <table>
            <tr>
              <th>No.</th>
              <th>이름</th>
              <th>생년월일</th>
              <th>성별</th>
              <th>기/노기</th>
              <th>부문</th>
              <th>벨트</th>
              <th>체급</th>
              <th>참가비</th>
            </tr>
            {renderCompetitionApplicationListInfo()}
          </table>
          <div className="PaymentInfo_listInfoPay">
            <h2>
              할인금액 <span>{userPayAmount - userRealPayAmount}원</span>
            </h2>
            <h2>
              총 합계 <span>{userRealPayAmount}원</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentInfo
