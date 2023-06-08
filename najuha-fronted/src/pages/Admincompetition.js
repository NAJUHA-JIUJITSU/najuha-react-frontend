import React from 'react'
import uuid from 'react-uuid'
import { useNavigate } from 'react-router-dom'
import AdminCompetitionlist from '../components/AdminCompetitionlist'
import AdminDashBoard from '../components/AdminDashBoard/AdminDashBoard'

function Admincompetition() {
  return (
    <div>
      <AdminDashBoard />
      <AdminCompetitionlist />
    </div>
  )
}

export default Admincompetition
