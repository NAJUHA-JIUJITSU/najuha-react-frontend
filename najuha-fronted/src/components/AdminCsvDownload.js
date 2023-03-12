import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import axios from 'axios'
import { Cookies } from 'react-cookie'
import { getAdminCompetitionApplicationListCsv } from '../apis/api/admin'

const AdminCsvDownload = () => {
  const [csvData, setCsvData] = useState([])
  const cookies = new Cookies()
  const xAccessToken = cookies.get('x-access-token')
  const competitionId = useParams().id
  console.log(competitionId)

  const getCsvData = async () => {
    const res = await getAdminCompetitionApplicationListCsv(competitionId)
    if (res) setCsvData(res.data.result)
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
          }}
        >
          Download me
        </button>
      </CSVLink>
      <div style={{ fontSize: '20px', marginTop: '200px' }}>{csvData}</div>
    </div>
  )
}

export default AdminCsvDownload
