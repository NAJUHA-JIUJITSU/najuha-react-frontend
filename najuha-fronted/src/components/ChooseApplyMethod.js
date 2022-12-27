import React from 'react'
import './ChooseApplyMethod.css'
import oneicon from '../src_assets/개인 아이콘.svg'
import teamicon from '../src_assets/단체 아이콘.svg'

function ChooseApplyMethod() {
  return (
    <div className='ChooseApplyMethod-wrapper'>
        <div className='ChooseApplyMethod-card'>
            <div className='ChooseApplyMethod-card-top'>
                <img src={oneicon} alt='개인신청아이콘'/>
            </div>
            <div className='ChooseApplyMethod-card-bottom'>
                <p>
                    상세설명
                </p>
                <ul>
                    <li>오직 한 명의 이름만 신청 가능합니다.</li>
                    <li>한명이 여러 대회를 신청할 수 있습니다.</li>
                    <li>다른 부문 동시 신청 시 할인이 되는 경우 할인이 적용됩니다.</li>
                    <li>얼리버드 할인이 적용됩니다.</li>
                </ul>
                <button>개인 신청하기</button>
            </div>
        </div>
        <div className='ChooseApplyMethod-card'>
            <div className='ChooseApplyMethod-card-top'>
                <img src={oneicon} alt='개인신청아이콘'/>
            </div>
            <div className='ChooseApplyMethod-card-bottom'>
                <p>
                    상세설명
                </p>
                <ul>
                    <li>오직 한 명의 이름만 신청 가능합니다.</li>
                    <li>한명이 여러 대회를 신청할 수 있습니다.</li>
                    <li>다른 부문 동시 신청 시 할인이 되는 경우 할인이 적용됩니다.</li>
                    <li>얼리버드 할인이 적용됩니다.</li>
                </ul>
                <button>개인 신청하기</button>
            </div>
        </div>
    </div>
  )
}

export default ChooseApplyMethod