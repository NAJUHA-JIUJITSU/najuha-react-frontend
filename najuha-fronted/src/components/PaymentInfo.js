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
  patchAdminCompetitionApplicationInfo,
  patchAdminCompetitionApplicationPaymentStatus,
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
  const [editingRow, setEditingRow] = useState(null)
  const [updatedValue, setUpdatedValue] = useState({})
  const [paymentFilter, setPaymentFilter] = useState(true)
  const [openAll, setOpenAll] = useState(false)

  const params = useParams() // ex) id: 1

  const s3EndPoint = process.env.REACT_APP_S3_END_POINT

  let competitionPayAmount //대회 총 결제 금액

  //서버에서 대회신청 상세정보 가져오기
  async function getCompetitionApplicationInfo(paymentFilter) {
    const res = await getAdminCompetitionApplicationList(
      params.id,
      paymentFilter
    )
    if (res) {
      setCompetitionApplicationInfo(parseApplication(res.data.result))
      setCompetitionApplicationList(res.data.result.competitionApplications)
    }
  }

  const saveChangesApplicationInfo = async info => {
    const updatedData = {
      competitionId: params.id,
      team: updatedValue.team || info.team,
      playerName: updatedValue.playerName || info.playerName,
      phoneNumber: updatedValue.phoneNumber || info.phoneNumber,
      playerBirth: updatedValue.playerBirth || info.playerBirth,
      phoneNumber: updatedValue.phoneNumber || info.phoneNumber,
      uniform: updatedValue.uniform || info.uniform,
      gender: updatedValue.gender || info.gender,
      divisionName: updatedValue.divisionName || info.divisionName,
      belt: updatedValue.belt || info.belt,
      weight: updatedValue.weight || info.weight,
      team: updatedValue.team || info.team,
    }

    const res = await patchAdminCompetitionApplicationInfo(info.id, updatedData)

    let tmp = [...competitionApplicationList]
    for (let i = 0; i < tmp.length; i++) {
      for (let j = 0; j < tmp[i].CompetitionApplicationInfos.length; j++) {
        if (tmp[i].CompetitionApplicationInfos[j].id === info.id) {
          tmp[i].CompetitionApplicationInfos[j] = res.data.result
        }
      }
    }

    setCompetitionApplicationList(tmp)

    setUpdatedValue({})
    setEditingRow(null)
  }

  const changePaymentStatus = async (id, isPayment) => {
    const res = await patchAdminCompetitionApplicationPaymentStatus(
      id,
      isPayment
    )
    if (res) {
      getCompetitionApplicationInfo(paymentFilter)
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
  function formatDate(dateString) {
    return dateString.substr(0, 10).replace('-', '.').replace('-', '.')
  }

  function formatDateWithDay(dateString) {
    const formattedDate = formatDate(dateString)
    const dayOfWeek = getDayOfWeek(dateString)
    return `${formattedDate}(${dayOfWeek})`
  }

  function parseApplication(application) {
    const { competition } = application
    const {
      id,
      title,
      CompetitionPoster,
      doreOpen,
      location,
      earlyBirdDeadline,
      registrationDeadline,
      applicantTableOpenDate,
      tournamentTableOpenDate,
    } = competition

    const postUrl = CompetitionPoster
      ? `${s3EndPoint}/${CompetitionPoster.imageKey}`
      : samplePoster

    return {
      id,
      title,
      postUrl,
      doreOpen: formatDateWithDay(doreOpen),
      location,
      earlyBirdDeadline: formatDateWithDay(earlyBirdDeadline),
      registrationDeadline: formatDateWithDay(registrationDeadline),
      applicantTableOpenDate: formatDateWithDay(applicantTableOpenDate),
      tournamentTableOpenDate: formatDateWithDay(tournamentTableOpenDate),
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
          competitionPayAmount += application?.competitionPayment?.amount || 0
          return (
            <React.Fragment key={application.id}>
              <tr
                className="PaymentInfo_tableHover"
                onClick={() => {
                  idClick(application.id)
                }}
              >
                <td>
                  {i + 1}
                  {application.CompetitionApplicationInfos.length > 4 &&
                  application.isGroup === false
                    ? ' (개인신청 4개 초과)'
                    : ''}
                </td>
                <td>{application.User.kakaoName}</td>
                <td>{application.User.UserInfo.fullName || 'NaN'}</td>
                <td>{application.User.UserInfo.phoneNumber || 'NaN'}</td>
                <td>{application.isGroup ? '단체' : '개인'}</td>
                <td>{application?.competitionPayment?.amount || 'NaN'}</td>
                <td>{application?.competitionPayment?.id || 'NaN'}</td>
                <td>{application?.competitionPayment?.orderId || 'NaN'}</td>
              </tr>
              {(selectedRowIndex === application.id || openAll) && (
                <tr>
                  <td colSpan="8">
                    <Collapse
                      isOpened={selectedRowIndex === application.id || openAll}
                    >
                      {renderInsideCompetitionApplicationListInfo(application)}
                    </Collapse>
                  </td>
                </tr>
              )}
            </React.Fragment>
          )
        })}
      </tbody>
    )
  }

  // 환불 버튼
  function refundButton(application) {
    const confirmMessage =
      '정말로 다음 결제 정보로 환불하시겠습니까?\n' +
      `카카오이름: ${application.User.kakaoName}\n` +
      `프로필이름: ${application.User.UserInfo.fullName}\n` +
      `결제 ID: ${application?.competitionPayment?.id}\n` +
      `결제 금액: ${application?.competitionPayment?.amount}원`

    const applicationInfoIds = []
    for (const info of application.CompetitionApplicationInfos) {
      if (info.status === 'ACTIVE') applicationInfoIds.push(info.id)
    }

    return (
      <button
        onClick={() => {
          if (window.confirm(confirmMessage))
            refund(application?.competitionPayment?.orderId, applicationInfoIds)
        }}
        style={{ color: 'red', height: '30px', marginTop: '15px' }}
      >
        환불
      </button>
    )
  }

  // 부분 환불 버튼
  function PartialRefundButton({ orderId, applicationInfo }) {
    const confirmMessage =
      '정말로 환불하시겠습니까?\n' +
      `applicationInfoId: ${applicationInfo.id}\n` +
      `playerName: ${applicationInfo.playerName}\n` +
      `uniform: ${applicationInfo.uniform}\n` +
      `gender: ${applicationInfo.gender}` +
      `divisionName: ${applicationInfo.divisionName}\n` +
      `belt: ${applicationInfo.belt}\n` +
      `weight: ${applicationInfo.weight}\n`

    const applicationInfoIds = [applicationInfo.id]

    return (
      <button
        onClick={() => {
          if (window.confirm(confirmMessage))
            refund(orderId, applicationInfoIds)
        }}
        style={{ color: 'red' }}
      >
        환불
      </button>
    )
  }

  function changePaymentStatusButton(application, newStatus) {
    const confirmMessage =
      `정말로 다음 결제 정보로 변경하시겠습니까?\n` +
      `applicationid: ${application.id}\n` +
      `변경될 상태: ${newStatus ? '결제완료' : '미결제'}`

    return (
      <button
        onClick={() => {
          if (window.confirm(confirmMessage))
            changePaymentStatus(application.id, newStatus)
        }}
      >
        {newStatus ? '결제완료 상태로 변경' : '미결제 상태로 변경'}
      </button>
    )
  }

  function renderInsideCompetitionApplicationListInfo(application) {
    const getTotalAmounts = info => {
      let normal = info?.priceTag?.normal
      let amount = info?.priceTag?.amount
      let discount =
        info?.priceTag?.earlyBird +
        info?.priceTag?.withGi +
        info?.priceTag?.withOther
      return { normal, amount, discount }
    }

    const renderInfoTableRow = (info, i) => {
      const { normal, amount, discount } = getTotalAmounts(info)
      const isEditing = editingRow === info.id
      const isCancelled = info.status === 'CANCELED'

      return (
        <tr
          key={info.id}
          style={{ backgroundColor: isCancelled ? 'lightgray' : 'white' }}
        >
          <td>{i + 1}</td>
          <td>
            {editingRow === info.id ? (
              <input
                type="text"
                value={
                  updatedValue.team !== undefined
                    ? updatedValue.team
                    : info.team
                }
                onChange={e =>
                  setUpdatedValue({
                    ...updatedValue,
                    team: e.target.value,
                  })
                }
              />
            ) : (
              info.team
            )}
          </td>
          <td>
            {editingRow === info.id ? (
              <input
                type="text"
                value={
                  updatedValue.playerName !== undefined
                    ? updatedValue.playerName
                    : info.playerName
                }
                onChange={e =>
                  setUpdatedValue({
                    ...updatedValue,
                    playerName: e.target.value,
                  })
                }
              />
            ) : (
              info.playerName
            )}
          </td>
          <td>
            {editingRow === info.id ? (
              <input
                type="text"
                value={
                  updatedValue.phoneNumber !== undefined
                    ? updatedValue.phoneNumber
                    : info.phoneNumber
                }
                onChange={e =>
                  setUpdatedValue({
                    ...updatedValue,
                    phoneNumber: e.target.value,
                  })
                }
              />
            ) : (
              info.phoneNumber
            )}
          </td>
          <td>
            {editingRow === info.id ? (
              <input
                type="text"
                value={
                  updatedValue.playerBirth !== undefined
                    ? updatedValue.playerBirth
                    : info.playerBirth
                }
                onChange={e =>
                  setUpdatedValue({
                    ...updatedValue,
                    playerBirth: e.target.value,
                  })
                }
              />
            ) : (
              info.playerBirth
            )}
          </td>
          <td>
            {editingRow === info.id ? (
              <input
                type="text"
                value={
                  updatedValue.gender !== undefined
                    ? updatedValue.gender
                    : info.gender
                }
                onChange={e =>
                  setUpdatedValue({
                    ...updatedValue,
                    gender: e.target.value,
                  })
                }
              />
            ) : (
              info.gender
            )}
          </td>
          <td>
            {editingRow === info.id ? (
              <input
                type="text"
                value={
                  updatedValue.uniform !== undefined
                    ? updatedValue.uniform
                    : info.uniform
                }
                onChange={e =>
                  setUpdatedValue({
                    ...updatedValue,
                    uniform: e.target.value,
                  })
                }
              />
            ) : (
              info.uniform
            )}
          </td>
          <td>
            {editingRow === info.id ? (
              <input
                type="text"
                value={
                  updatedValue.divisionName !== undefined
                    ? updatedValue.divisionName
                    : info.divisionName
                }
                onChange={e =>
                  setUpdatedValue({
                    ...updatedValue,
                    divisionName: e.target.value,
                  })
                }
              />
            ) : (
              info.divisionName
            )}
          </td>
          <td>
            {editingRow === info.id ? (
              <input
                type="text"
                value={
                  updatedValue.belt !== undefined
                    ? updatedValue.belt
                    : info.belt
                }
                onChange={e =>
                  setUpdatedValue({
                    ...updatedValue,
                    belt: e.target.value,
                  })
                }
              />
            ) : (
              info.belt
            )}
          </td>
          <td>
            {editingRow === info.id ? (
              <input
                type="text"
                value={
                  updatedValue.weight !== undefined
                    ? updatedValue.weight
                    : info.weight
                }
                onChange={e =>
                  setUpdatedValue({
                    ...updatedValue,
                    weight: e.target.value,
                  })
                }
              />
            ) : (
              info.weight
            )}
          </td>
          <td>{amount || 0}원</td>
          <td>{normal || 0}원</td>
          <td>{discount || 0}원</td>
          <td>
            {!isCancelled && isEditing ? (
              <>
                <button onClick={() => saveChangesApplicationInfo(info)}>
                  저장
                </button>
                <button
                  onClick={() => {
                    setEditingRow(null)
                    setUpdatedValue({})
                  }}
                >
                  취소
                </button>
              </>
            ) : !isCancelled ? (
              <>
                <button onClick={() => setEditingRow(info.id)}>수정</button>
                <PartialRefundButton
                  orderId={application?.competitionPayment?.orderId}
                  applicationInfo={info}
                />
              </>
            ) : null}
          </td>
        </tr>
      )
    }

    const renderPaymentInfo = application => {
      let normal = 0
      let amount = 0
      let discount = 0

      application.CompetitionApplicationInfos.forEach(info => {
        if (info.status === 'CANCELED') return
        const {
          normal: infoNormal,
          amount: infoAmount,
          discount: infoDiscount,
        } = getTotalAmounts(info)
        normal += infoNormal || 0
        amount += infoAmount || 0
        discount += infoDiscount || 0
      })

      return (
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
          {/* {paymentFilter
            ? refundButton(application)
            : changePaymentStatusButton(application, true)} */}
          {paymentFilter && refundButton(application)}
          {paymentFilter && changePaymentStatusButton(application, false)}
          {!paymentFilter && changePaymentStatusButton(application, true)}
        </div>
      )
    }

    return (
      <tr>
        <td colSpan="8">
          <Collapse isOpened={selectedRowIndex === application.id || openAll}>
            <animated.div>
              <div className="PaymentInfo_listInfo">
                <table>
                  <tr>
                    <th>No.</th>
                    <th>팀 이름</th>
                    <th>선수명</th>
                    <th>전화번호</th>
                    <th>생년월일</th>
                    <th>성별</th>
                    <th>gi / no-gi</th>
                    <th>부문</th>
                    <th>벨트</th>
                    <th>체급</th>
                    <th>결제가격</th>
                    <th>참가비</th>
                    <th>할인가격</th>
                    <th></th>
                  </tr>
                  {application.CompetitionApplicationInfos.map(
                    renderInfoTableRow
                  )}
                </table>
                {renderPaymentInfo(application)}
              </div>
            </animated.div>
          </Collapse>
        </td>
      </tr>
    )
  }

  //환불 함수
  async function refund(orderId, applicationInfoIds) {
    await deleteAdminApplicationPayment(orderId, applicationInfoIds)
    getCompetitionApplicationInfo(paymentFilter)
  }

  function renderCompetitionInfo() {
    function CompetitionInfoItem({ title, value }) {
      return (
        <div className="ProfileInfo_competition_date">
          <h3>{title}</h3>
          <p>{value}</p>
        </div>
      )
    }

    const infoItems = [
      { title: '대회 날짜', value: competitionApplicationInfo.doreOpen },
      { title: '대회 장소', value: competitionApplicationInfo.location },
      {
        title: '얼리버드 마감',
        value: competitionApplicationInfo.earlyBirdDeadline,
      },
      {
        title: '참가신청 마감',
        value: competitionApplicationInfo.registrationDeadline,
      },
      {
        title: '신청자 명단',
        value: competitionApplicationInfo.applicantTableOpenDate,
      },
      {
        title: '대진표 공개',
        value: competitionApplicationInfo.tournamentTableOpenDate,
      },
    ]

    return (
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
            {infoItems.map(item => (
              <CompetitionInfoItem
                key={item.title}
                title={item.title}
                value={item.value}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (decodedToken) {
      // 레벨 1인 유저가 들어오면 다시 수정페이지로 리다이렉트
      if (decodedToken.userLevel == 1) {
        alert('회원가입을 완료해주세요')
        navigate('/UserInfopage')
      }
    }
    getCompetitionApplicationInfo(true)
  }, [decodedToken])

  const paymentFilterHandler = () => {
    setPaymentFilter(!paymentFilter)
    getCompetitionApplicationInfo(!paymentFilter)
    setEditingRow(null)
    setUpdatedValue({})
    setSelectedRowIndex(null)
  }

  return (
    <div className="PaymentInfo_wrapper">
      {renderCompetitionInfo()}
      <div>
        <button
          style={{ margin: '10px', fontSize: '50px' }}
          onClick={() => paymentFilterHandler()}
        >
          {paymentFilter ? '결제완료' : '미결제'}
        </button>
        <button
          style={{ margin: '10px', fontSize: '50px' }}
          onClick={() => setOpenAll(!openAll)}
        >
          {openAll ? '전체닫기' : '전체열기'}
        </button>
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
