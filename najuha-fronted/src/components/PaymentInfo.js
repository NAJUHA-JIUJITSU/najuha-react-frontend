import React from 'react'
import { useState, useEffect } from 'react'
import './paymentInfo.css'
import { Cookies } from 'react-cookie'
import { useJwt } from 'react-jwt'
import { useNavigate, useParams } from 'react-router-dom'
import { Collapse } from 'react-collapse'
import { useSpring, animated } from 'react-spring'
import samplePoster from '../src_assets/samplePoster.png'
import {
  getAdminCompetitionApplicationList,
  deleteAdminApplicationPayment,
} from '../apis/api/admin'

function PaymentInfo() {
  const [competitionApplicationInfo, setCompetitionApplicationInfo] = useState(
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
  const [selectedRowIndex, setSelectedRowIndex] = useState(null)

  const params = useParams() // ex) id: 1

  let competitionPayAmount //대회 총 결제 금액
  let userPayAmount //유저별 결제 금액 합계
  let userRealPayAmount //유저별 진짜 총 결제 금액 (할인적용)

  //서버에서 대회신청 상세정보 가져오기
  async function getCompetitionApplicationInfo() {
    const res = await getAdminCompetitionApplicationList(params.id)
    if (res) {
      setCompetitionApplicationInfo(parseApplication(res.data.result))
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
  function parseApplication(application) {
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

  //유저 클릭
  function idClick(id) {
    if (selectedRowIndex === id) {
      setSelectedRowIndex(null)
    } else {
      setSelectedRowIndex(id)
    }
  }

  function renderCompetitionApplicationList() {
    competitionPayAmount = 0
    return (
      <tbody>
        {competitionApplicationList.map((application, i) => {
          competitionPayAmount += application.competitionPayment.amount
          return (
            <React.Fragment key={application.id}>
              <tr
                className="PaymentInfo_tableHover"
                onClick={() => {
                  idClick(application.id)
                }}
              >
                <td>{i + 1}</td>
                <td>{application.User.kakaoName}</td>
                <td>{application.User.UserInfo.fullName || 'NaN'}</td>
                <td>{application.User.UserInfo.phoneNumber || 'NaN'}</td>
                <td>{application.isGroup ? '단체' : '개인'}</td>
                <td>{application.competitionPayment.amount}</td>
                <td>{application.competitionPayment.id}</td>
                <td>{application.competitionPayment.orderId}</td>
              </tr>
              {renderInsideCompetitionApplicationListInfo(application)}
            </React.Fragment>
          )
        })}
      </tbody>
    )
  }

  // 환불 버튼
  function refundButton(application) {
    console.log(application)
    const confirmMessage =
      '정말로 다음 결제 정보로 환불하시겠습니까?\n' +
      `카카오이름: ${application.User.kakaoName}\n` +
      `프로필이름: ${application.User.UserInfo.fullName}\n` +
      `결제 ID: ${application.competitionPayment.id}\n` +
      `결제 금액: ${application.competitionPayment.amount}원`

    return (
      <button
        onClick={() => {
          if (window.confirm(confirmMessage))
            refund(application.competitionPayment.orderId)
        }}
        style={{ color: 'red', marginLeft: '16px' }}
      >
        환불
      </button>
    )
  }

  function renderInsideCompetitionApplicationListInfo(application) {
    let normal = 0
    let amount = 0
    let discount = 0

    return (
      <tr>
        <td colSpan="8">
          <Collapse isOpened={selectedRowIndex === application.id}>
            <animated.div>
              <div className="PaymentInfo_listInfo">
                <div className="PaymentInfo_listInfoTitle">
                  <h2>
                    팀 이름
                    <span>
                      {application.CompetitionApplicationInfos[0].team}
                    </span>
                  </h2>
                  <h2>
                    대표번호
                    <span>
                      {application.CompetitionApplicationInfos[0].phoneNumber}
                    </span>
                  </h2>
                </div>
                <table>
                  <tr>
                    <th>No.</th>
                    <th>선수명</th>
                    <th>생년월일</th>
                    <th>성별</th>
                    <th>기/노기</th>
                    <th>부문</th>
                    <th>벨트</th>
                    <th>체급</th>
                    <th>결제가격</th>
                    <th>참가비</th>
                    <th>할인가격</th>
                  </tr>
                  {application.CompetitionApplicationInfos.map((info, i) => {
                    normal += info.priceTag.normal
                    amount += info.priceTag.amount
                    discount +=
                      info.priceTag.earlyBird +
                      info.priceTag.withGi +
                      info.priceTag.withOther
                    return (
                      <tr key={info.id}>
                        <td>{i + 1}</td>
                        <td>{info.playerName}</td>
                        <td>{info.playerBirth}</td>
                        <td>{info.gender == 'male' ? '남자' : '여자'}</td>
                        <td>{info.uniform == 'gi' ? '기' : '노기'}</td>
                        <td>{info.divisionName}</td>
                        <td>{info.belt}</td>
                        <td>{info.weight}kg</td>
                        <td>{info.priceTag.amount}원</td>
                        <td>{info.priceTag.normal}원</td>
                        <td>
                          {info.priceTag.earlyBird +
                            info.priceTag.withGi +
                            info.priceTag.withOther}
                          원
                        </td>
                      </tr>
                    )
                  })}
                </table>
                <div className="PaymentInfo_listInfoPay">
                  <h2>
                    결제가격 합 <span>{amount}원</span>
                  </h2>
                  <h2>
                    참가비 합 <span>{normal}원</span>
                  </h2>
                  <h2>
                    할인가격 합 <span>{discount}원</span>
                  </h2>
                  {refundButton(application)}
                </div>
              </div>
            </animated.div>
          </Collapse>
        </td>
      </tr>
    )
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
              <th>kakao이름</th>
              <th>프로필이름</th>
              <th>핸드폰 번호</th>
              <th>개인/단체</th>
              <th>결제금액</th>
              <th>결제ID</th>
              <th>주문번호</th>
            </tr>
            {renderCompetitionApplicationList()}
          </table>
          <h2>
            총 결제금액 <span>{competitionPayAmount}원</span>
          </h2>
        </div>
      </div>
    </div>
  )
}

export default PaymentInfo
