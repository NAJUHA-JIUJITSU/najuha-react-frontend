import { useEffect, useState } from 'react'
import uuid from 'react-uuid'
import { useNavigate } from 'react-router-dom'
import {
  getAdminCompetitionListViewCnt,
  getAdminUserCnt,
} from '../../apis/api/admin'

function AdminDashBoard() {
  const [userCnt, setUserCnt] = useState(0)
  const [competitionListViewCnt, setCompetitionListViewCnt] = useState(0)
  const navigate = useNavigate()

  const createCompetition = () => {
    const id = uuid()
    navigate('/Admincompetition/' + id)
  }

  const getUserCnt = async () => {
    const res = await getAdminUserCnt()
    setUserCnt(res.data.result.userCnt)
  }

  const getCompetitionListViewCnt = async () => {
    const res = await getAdminCompetitionListViewCnt()
    setCompetitionListViewCnt(res.data.result.viewCnt)
  }

  useEffect(() => {
    getUserCnt()
    getCompetitionListViewCnt()
  }, [])

  return (
    <div>
      <div style={{ fontSize: '3rem' }}>
        <ul>
          <li>회원수 : {userCnt}</li>
          <li>방문자수 : {competitionListViewCnt}</li>
        </ul>
        <button
          onClick={() => {
            navigate('/AdminUserList')
          }}
        >
          유저 리스트 페이지로 이동
        </button>
      </div>
      <button
        onClick={createCompetition}
        style={{
          width: '100%',
          height: '16vh',
          background: 'green',
          fontSize: '2rem',
        }}
      >
        대회등록
      </button>
    </div>
  )
}

export default AdminDashBoard
