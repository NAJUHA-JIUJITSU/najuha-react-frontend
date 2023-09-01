import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import {
  getAdminCompetitionApplicationListCsv,
  postAdminFixCompetitionPayments,
  getAdminCompetitionSoloApplicationList,
  getAdminCompetition,
  postAdminKakoMessage,
} from '../apis/api/admin'
import { CsvToHtmlTable } from 'react-csv-to-table'
import './AdminCsvDownload.css'

const convertHeaderToKorean = csvData => {
  const csvDataArray = csvData.split('\n')
  const headers = csvDataArray[0].split(',')
  const newHeaders = headers.map(header => {
    switch (header) {
      case 'division':
        return '디비전'
      case 'playerName':
        return '이름'
      case 'playerBirth':
        return '생년월일'
      case 'phoneNumber':
        return '전화번호'
      case 'uniform':
        return '유니폼'
      case 'gender':
        return '성별'
      case 'divisionName':
        return '디비전명'
      case 'belt':
        return '벨트'
      case 'weight':
        return '체급'
      case 'team':
        return '소속팀'
      case 'isPayment':
        return '결제여부'
      case 'amount':
        return '결제금액'
      case 'normal':
        return '일반금액'
      case 'earlyBird':
        return '얼리버드할인'
      case 'withGi':
        return '노기할인'
      case 'withOther':
        return '앱솔할인'
      case 'orderId':
        return '주문번호'
      case 'paymentId':
        return '결제ID'
      default:
        return header
    }
  })

  csvDataArray[0] = newHeaders.join(',')
  return csvDataArray.join('\n')
}

const AdminCsvDownload = () => {
  const [csvData, setCsvData] = useState([])
  const [csvDataKo, setCsvDataKo] = useState([])
  const [soloParticipation, setSoloParticipation] = useState([])
  const [isSoloParticipation, setIsSoloParticipation] = useState(false)
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [rowCnt, setRowCnt] = useState(0)
  const [fixedApplications, setFixedApplications] = useState([])
  const competitionId = useParams().id
  const [message, setMessage] = useState('')

  const convertEngToKo = info => {
    // 메세지 보낼때 한글로 바꿔주는 함수
    info.gender = info.gender === 'male' ? '남자' : '여자'
    info.uniform = info.uniform === 'gi' ? '기' : '노기'

    return info
  }

  const makeTextforSoloParticipation = info => {
    // 단독출전자들에게 보내는 메세지 제작 함수
    info = convertEngToKo(info)
    let text = `안녕하세요. 나주하입니다.\n
    ${info.playerName}님이 신청해주신 ${info.gender}/${info.divisionName}/${info.belt}/${info.weight}는 참가자가 1명(본인)으로 단독출전 상태입니다.\n
    1. 환불을 하기\n
    2. 환불 후 다른부문을 신청하기\n
    3. 단독우승하기\n
    가 가능합니다. 1,2번을 원하실 경우 나주하 홈페이지에 신청대회목록에서 본인이 신청한 대회를 찾아서 환불을 진행해주시면됩니다.\n
    단독우승을 원하실경우에는 시합날 대회장에 오시면 됩니다. 단, 단독우승도 계체를 통과해야합니다.\n`

    return text
  }

  function formatDateToKorean(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // 월은 0부터 시작하기 때문에 +1을 해줍니다.
    const day = date.getDate()
    const dayOfWeek = date.getDay() // 일요일: 0, 월요일: 1, ..., 토요일: 6

    const dayOfWeekKo = ['일', '월', '화', '수', '목', '금', '토']

    const ret = `${year}년 ${month}월 ${day}일(${dayOfWeekKo[dayOfWeek]})`
    return ret
  }

  const sendkakaoMessageforSoloParticipation = async soloParticipation => {
    try {
      const res = await getAdminCompetition(competitionId)
      const competition = res.data.result
      const registrationDeadlineDate = new Date(
        competition.registrationDeadline
      )
      const soloMediateStartDate = new Date(registrationDeadlineDate)
      soloMediateStartDate.setDate(registrationDeadlineDate.getDate() + 1)
      const soloMediateEndDate = new Date(registrationDeadlineDate)
      soloMediateEndDate.setDate(registrationDeadlineDate.getDate() + 3)
      const soloMediateStartDateKo = formatDateToKorean(soloMediateStartDate)
      const soloMediateEndDateKo = formatDateToKorean(soloMediateEndDate)

      const request = soloParticipation.map(info => {
        let body = {
          phoneNumber: info.phoneNumber,
          title: competition.title,
          soloMediateEndDate: soloMediateEndDateKo,
          soloMediateStartDate: soloMediateStartDateKo,
          uniform: info.uniform === 'gi' ? '기' : '노기',
          playerName: info.playerName,
          gender: info.gender === 'male' ? '남자' : '여자',
          divisionName: info.divisionName,
          belt: info.belt,
          weight: info.weight,
        }

        return postAdminKakoMessage(body)
      })
      const result = await Promise.all(request)
      const data = result.map(res => res.data.result)
      console.log(data)

      alert(`${competition.title} 대회 단독 출전자 메시지 전송 완료.`)
    } catch (e) {
      console.log(e)
    }
  }

  const getSoloApplicationList = async () => {
    try {
      const res = await getAdminCompetitionSoloApplicationList(competitionId)
      if (res && res.data && res.data.result) {
        setSoloParticipation(res.data.result)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    console.log(soloParticipation)
  }, [soloParticipation])

  //
  //           "playerName": "허민투",
  //           "playerBirth": "830413",
  //           "phoneNumber": "01041153316",
  //           "uniform": "no-gi",
  //           "gender": "male",
  //           "divisionName": "노기통합",
  //           "belt": "고급",
  //           "weight": "앱솔",
  //           "team": "나주하",
  //           "earlyBirdDeadline": "2022-08-01 03:31:00",
  //           "pricingPolicy": {
  //               "normal": 50000,
  //               "withGi": 0,
  //               "earlyBird": 20,
  //               "withOther": -25000
  //           },
  //           "priceTag": {
  //               "amount": 25000,
  //               "normal": 50000,
  //               "withGi": 0,
  //               "earlyBird": 0,
  //               "withOther": -25000
  //           },
  //           "status": "ACTIVE",
  //           "createdAt": "2023-08-14 15:13:27",
  //           "updatedAt": "2023-08-14 15:21:33",
  //           "competitionApplicationId": 53
  //       }

  // const changeFilltertoSoloParticipation = data => { 나중에쓸 수도 있어서 일단 킵
  //   // 단독출전 구별하는 함수를 작동시키는 함수
  //   setCsvDataKo(fillterSoloParticipation(data))
  // }

  // const fillterSoloParticipation = data => {
  //   // 단독출전 구별하는 함수

  //   data = data.trim().split('\n')
  //   let emptyRecords = []
  //   let emptyViewerRecords =
  //     '디비전,이름,생년월일,전화번호,유니폼,성별,디비전명,벨트,체급,소속팀,결제여부,결제금액,일반금액,얼리버드할인,노기할인,앱솔할인,주문번호,결제ID,createdAt' +
  //     '\n'
  //   let isInEmptyBlock = false

  //   data.forEach(record => {
  //     const attributes = record.split(',')
  //     const isAllEmpty = attributes.every(attr => attr.trim() === '')

  //     if (isAllEmpty) {
  //       isInEmptyBlock = !isInEmptyBlock
  //     } else if (isInEmptyBlock) {
  //       emptyRecords.push(attributes.join(','))
  //       emptyViewerRecords += attributes.join(',') + '\n'
  //     }
  //   })
  //   emptyRecords = emptyRecords.map(record => record.split(','))
  //   emptyRecords = emptyRecords.map(record => {
  //     return {
  //       요약: record[0],
  //       이름: record[1],
  //       생년월일: record[2],
  //       전화번호: record[3],
  //       유니폼: record[4] === 'gi' ? '기' : '노기',
  //       성별: record[5] === 'male' ? '남자' : '여자',
  //       디비전명: record[6],
  //       벨트: record[7],
  //       체급: record[8],
  //     }
  //   })
  //   console.log(emptyRecords)

  //   setSoloParticipation(emptyRecords)
  //   setRowCnt(emptyRecords.length)

  //   return emptyViewerRecords
  // }

  const getCsvData = async () => {
    const res = await getAdminCompetitionApplicationListCsv(
      competitionId,
      paymentFilter
    )
    if (res && res.data && res.data.result) {
      setRowCnt(res.data.result.rowCnt)
      if (res.data.result.csv) {
        setCsvData(res.data.result.csv)
        setCsvDataKo(convertHeaderToKorean(res.data.result.csv))
      } else {
        setCsvData('')
        setCsvDataKo('')
      }
    }
  }

  useEffect(() => {
    getCsvData()
  }, [paymentFilter])

  const handleFilterButtonClick = filter => {
    setPaymentFilter(filter)
  }

  const handleFixCompetitionPaymentError = async () => {
    try {
      const res = await postAdminFixCompetitionPayments(competitionId)
      setFixedApplications(res.data.result.fixedApplications)
      alert(
        `결제 오류 보정 성공.\n결제오류 보정 갯수 : ${res.data.result.fixedCnt}`
      )
    } catch (e) {
      alert('결제 오류 보정 실패.')
      console.log(e)
    }
  }

  const downloadFixedApplications = () => {
    const blob = new Blob([JSON.stringify(fixedApplications, null, 2)], {
      type: 'application/json',
    })
    let downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = `competition_${competitionId}_fixedApplications.json`
    downloadLink.click()
  }

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ padding: '20px', border: '1px solid black' }}>
          <h1 style={{ fontSize: '25px' }}>
            필터 :{' '}
            {paymentFilter === 'all'
              ? '결제완료 + 미결제'
              : paymentFilter === 'paid'
              ? '결제완료'
              : '미결제'}
          </h1>
          <button onClick={() => handleFilterButtonClick('all')}>
            결제완료 + 미결제
          </button>
          <button onClick={() => handleFilterButtonClick('paid')}>
            결제완료
          </button>
          <button onClick={() => handleFilterButtonClick('unpaid')}>
            미결제
          </button>
          <div
            style={{
              fontSize: '30px',
            }}
          >
            count : {rowCnt}
          </div>
        </div>
        <div style={{ padding: '20px', border: '1px solid black' }}>
          <h1 style={{ fontSize: '25px' }}>CSV 다운로드</h1>
          <CSVLink data={csvData} filename="applicationList.csv">
            <button
              style={{
                fontSize: '30px',
              }}
            >
              나주하용
            </button>
          </CSVLink>
          <CSVLink data={csvDataKo} filename="applicationList.csv">
            <button
              style={{
                fontSize: '30px',
              }}
            >
              대회사용
            </button>
          </CSVLink>
        </div>
        <div
          style={{
            padding: '20px',
            border: '1px solid black',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <button
            onClick={handleFixCompetitionPaymentError}
            style={{
              fontSize: '30px',
            }}
          >
            결제 오류 보정
          </button>
          {fixedApplications.length > 0 && (
            <button
              onClick={downloadFixedApplications}
              style={{
                fontSize: '30px',
              }}
            >
              보정결과 다운로드
            </button>
          )}
        </div>
        <div
          style={{
            padding: '20px',
            border: '1px solid black',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <button
            onClick={() => {
              getSoloApplicationList()
            }}
            style={{
              fontSize: '30px',
            }}
          >
            단독출전
          </button>
          <div>{isSoloParticipation.length}명</div>
          <button
            onClick={() =>
              //단독출전일때만 버튼누를수 있게
              sendkakaoMessageforSoloParticipation(soloParticipation)
            }
            style={{
              fontSize: '30px',
            }}
          >
            단독출전 안내문자보내기
          </button>
        </div>
        <div
          style={{
            padding: '20px',
            border: '1px solid black',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <textarea
            style={{
              height: '100px',
            }}
            value={message}
            onChange={e => setMessage(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div>
        {csvDataKo.length > 0 && (
          <CsvToHtmlTable
            data={csvDataKo}
            csvDelimiter=","
            tableClassName="AdminCsvDownload"
          />
        )}
      </div>
    </div>
  )
}

export default AdminCsvDownload
