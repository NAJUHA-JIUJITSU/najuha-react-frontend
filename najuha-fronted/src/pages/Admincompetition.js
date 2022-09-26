import React from 'react'
import uuid from 'react-uuid'
import { useNavigate } from 'react-router-dom'

function Admincompetition() {
    let navigate = useNavigate();
    const createCompetition = () => {
        const id = uuid()

        navigate('/Admincompetition/' + id)
    }

    return (
    <div>
        <button onClick={createCompetition}>
            대회등록
        </button>
    </div>
    )
}

export default Admincompetition