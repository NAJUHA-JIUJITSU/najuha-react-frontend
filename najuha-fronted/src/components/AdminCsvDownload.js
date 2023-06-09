import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import {
  getAdminCompetitionApplicationListCsv,
  postAdminFixCompetitionPayments,
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
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [rowCnt, setRowCnt] = useState(0)
  const competitionId = useParams().id

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

  const handleFixCompetitionPaymentError = async competitionId => {
    try {
      const res = await postAdminFixCompetitionPayments(competitionId)
      alert(
        `결제 오류 보정 성공.\n결제오류 보정 갯수 : ${res.data.result.fixedCnt}`
      )
    } catch (e) {
      alert('결제 오류 보정 실패.')
      console.log(e)
    }
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
        <div style={{ padding: '20px', border: '1px solid black' }}>
          <button
            onClick={handleFixCompetitionPaymentError}
            style={{
              fontSize: '50px',
            }}
          >
            결제 오류 보정
          </button>
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
