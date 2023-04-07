import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CSVLink } from 'react-csv'
import { getAdminCompetitionApplicationListCsv } from '../apis/api/admin'
import { CsvToHtmlTable } from 'react-csv-to-table'
import './AdminCsvDownload.css'

const AdminCsvDownload = () => {
  const [csvData, setCsvData] = useState([])
  const [paymentFilter, setPaymentFilter] = useState('all')
  const competitionId = useParams().id

  const getCsvData = async () => {
    const res = await getAdminCompetitionApplicationListCsv(
      competitionId,
      paymentFilter
    )
    if (res && res.data && res.data.result) {
      setCsvData(res.data.result)
    }
  }

  useEffect(() => {
    getCsvData()
  }, [paymentFilter])

  const handleFilterButtonClick = filter => {
    setPaymentFilter(filter)
  }

  return (
    <div>
      <div>
        <button onClick={() => handleFilterButtonClick('all')}>
          결제완료 + 미결제
        </button>
        <button onClick={() => handleFilterButtonClick('paid')}>
          결제완료
        </button>
        <button onClick={() => handleFilterButtonClick('unpaid')}>
          미결제
        </button>
        <CSVLink data={csvData} filename="applicationList.csv">
          <button
            style={{
              fontSize: '50px',
              marginLeft: '20px',
            }}
          >
            Download me
          </button>
        </CSVLink>
      </div>
      <div>
        {csvData.length > 0 && (
          <CsvToHtmlTable
            data={csvData}
            csvDelimiter=","
            tableClassName="AdminCsvDownload"
          />
        )}
      </div>
    </div>
  )
}

export default AdminCsvDownload
