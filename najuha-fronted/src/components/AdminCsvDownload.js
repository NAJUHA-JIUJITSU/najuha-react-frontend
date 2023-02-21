import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import axios from 'axios'
import { Cookies } from 'react-cookie'

const backBaseUrl = process.env.REACT_APP_BACK_END_API

const AdminCsvDownload = () => {
  const [csvData, setCsvData] = useState([])
  const cookies = new Cookies()
  const xAccessToken = cookies.get('x-access-token')
  const competitionId = useParams().id
  console.log(competitionId)

  const getCsvData = async () => {
    try {
      const res = await axios({
        method: 'get',
        headers: {
          'x-access-token': xAccessToken,
        },
        url:
          backBaseUrl +
          '/admin/competitions/' +
          competitionId +
          '/competitionApplications/csv',
      })
      setCsvData(res.data.result)
    } catch {
      console.log('에러')
    }
  }

  useEffect(() => {
    getCsvData()
  }, [])

  return (
    <div>
      <CSVLink data={csvData} filename="applicationList.csv">
        <button
          style={{
            fontSize: '50px',
            marginLeft: '50%',
            transform: 'translate(-50%,200%)',
          }}>
          Download me
        </button>
      </CSVLink>
      <div style={{ fontSize: '20px', marginTop: '200px' }}>{csvData}</div>
    </div>
  )
}

export default AdminCsvDownload
