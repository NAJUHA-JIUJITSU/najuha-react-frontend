import React from 'react'
import uuid from 'react-uuid'
import { useNavigate } from 'react-router-dom'
import AdminCompetitionlist from '../components/AdminCompetitionlist'

function Admincompetition() {
  let navigate = useNavigate()
  const createCompetition = () => {
    const id = uuid()

    navigate('/Admincompetition/' + id)
  }

  return (
    <div>
      <button
        onClick={createCompetition}
        style={{ width: '100%', height: '16vh', background: 'green' }}>
        대회등록
      </button>
      <AdminCompetitionlist />
    </div>
  )
}

export default Admincompetition
