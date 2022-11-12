import React, { useState } from 'react'
import './competitionApplyForm.css'
import reseticon from '../src_assets/리셋아이콘.svg'
import complete from '../src_assets/완료아이콘.svg'
import notcomplete from '../src_assets/미완료아이콘.svg'

function CompetitionApplyForm() {
    // const [isMyself, setIsMyself] = useState('');
    // const [playerName, setPlayerName] = useState('');
    // const [playerBirth, setPlayerBirth] = useState('');
    // const [phoneNumber, setPhoneNumber] = useState('');   
    // const [uniform, setUniform] = useState('');
    // const [divisionName, setDivisionName] = useState('');
    // const [gender, setGender] = useState('');
    // const [belt, setBelt] = useState('');
    // const [isMyself, setIsMyself] = useState('');
    // const [isMyself, setIsMyself] = useState('');
    // const [isMyself, setIsMyself] = useState('');

  return (
    <div className='CompetitionApplyForm-wrapper'>
        <div className='CompetitionApplyForm-top'>
            <h2 className='CompetitionApplyForm-top-title'>
                예거스 챔피언쉽 로컬대회 송도 오픈
            </h2>
            <div className='CompetitionApplyForm-top-table'>
                <ul className='CompetitionApplyForm-top-table-standard'>
                    <li>기노기</li>
                    <li>부문</li>
                    <li>성별</li>
                    <li>체급</li>
                    <li>벨트</li>
                    <li>참가비</li>
                </ul>
                <ul className='CompetitionApplyForm-top-table-item'>
                    <li>노기</li>
                    <li>일반부</li>
                    <li>여자</li>
                    <li>-50kg</li>
                    <li>화이트</li>
                    <li>50,000원</li>
                </ul>
            </div>
        </div>
        <div className='CompetitionApplyForm-middle'>
            <div className='CompetitionApplyForm-middle-function'>
                <div className='CompetitionApplyForm-middle-function-re'>
                    <img src={reseticon} />
                    <p>다시하기</p>
                </div>
                <div className='CompetitionApplyForm-middle-function-complete'>
                    <img src={notcomplete} />
                    <p>선택완료</p>
                </div>
            </div>
            <ul className='CompetitionApplyForm-middle-option'>
                <li>기</li>
                <li>노기</li>
            </ul>
            {/* <h2>해당 대회를 신청하고자 한다면 <br/> 선택완료를 클릭해주세요</h2> */}
            <h2 className='CompetitionApplyForm-middle-info'>신청할 대회를 선택하세요</h2>
        </div>
        <div className='CompetitionApplyForm-bottom'>
            <div className='CompetitionApplyForm-bottom-sum'>
                <p>총 결제금액</p>
                <h3>90,000원</h3>
            </div>
            <button className='CompetitionApplyForm-bottom-payment'>결제하기</button>
        </div>
    </div>
  )
}

export default CompetitionApplyForm