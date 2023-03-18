import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import { getAdminCompetitionApplicationListCsv } from '../apis/api/admin'
import { CsvToHtmlTable } from 'react-csv-to-table'
import './AdminCsvDownload.css'

const AdminCsvDownload = () => {
  const [csvData, setCsvData] = useState([])
  const competitionId = useParams().id

  const getCsvData = async () => {
    const res = await getAdminCompetitionApplicationListCsv(competitionId)
    if (res && res.data && res.data.result) {
      setCsvData(res.data.result)
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
          }}
        >
          Download me
        </button>
      </CSVLink>
      {csvData.length > 0 && (
        <CsvToHtmlTable
          data={csvData}
          csvDelimiter=","
          tableClassName="AdminCsvDownload"
        />
      )}
    </div>
  )
}

export default AdminCsvDownload
