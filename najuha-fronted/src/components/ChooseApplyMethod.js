import React from 'react'
import './ChooseApplyMethod.css'
import oneicon from '../src_assets/개인 아이콘.svg'
import teamicon from '../src_assets/단체 아이콘.svg'
import checkicon from '../src_assets/파란색체크아이콘.svg'
import xicon from '../src_assets/빨간엑스아이콘.svg'

import { useParams, useNavigate, useLocation } from 'react-router-dom'

function ChooseApplyMethod() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const competitionTitle = state

  return (
    <div className="ChooseApplyMethod-wrapper">
      <div className="ChooseApplyMethod-title">
        <h2>{competitionTitle}</h2>
      </div>
      <div className="ChooseApplyMethod-cardWrapper">
        <div
          className="ChooseApplyMethod-card"
          id="ChooseApplyMethod-forshadows">
          <div className="ChooseApplyMethod-card-top">
            <h2 className="ChooseApplyMethod-card-top-title">개인신청</h2>
            <img src={oneicon} alt="개인신청아이콘" />
          </div>
          <div className="ChooseApplyMethod-card-middle">
            <ul>
              <li>
                <img src={checkicon} alt="체크아이콘" />
                <p>오직 한 명의 이름만 신청 가능합니다.</p>
              </li>
              <li>
                <img src={checkicon} alt="체크아이콘" />
                <p>한명이 여러 대회를 신청할 수 있습니다.</p>
              </li>

              <li>
                <img src={checkicon} alt="체크아이콘" />
                <p>
                  중복대회 신청 할인(기 + 노기, 체급 + 앱솔 등)은 한번에
                  신청해야 할인됩니다.
                </p>
              </li>
              <li>
                <img src={xicon} alt="체크아이콘" />
                <p>
                  {' '}
                  얼리버드 마감 후 신청정보를 변경하기 위해 환불 후 재거래
                  진행시 얼리버드 할인은 받으실 수 없습니다.
                </p>
              </li>
            </ul>
          </div>
          <div className="ChooseApplyMethod-card-bottom">
            <button
              onClick={() => {
                navigate(`/competition/apply/${id}`)
              }}>
              개인 신청하기
            </button>
            <p className="ChooseApplyMethod-card-bottom-info">
              ex) 선수 개인이 1개 이상의 부문에 신청을 하는 경우
            </p>
          </div>
        </div>
        <div className="ChooseApplyMethod-card">
          <div className="ChooseApplyMethod-card-top">
            <h2 className="ChooseApplyMethod-card-top-title">단체신청</h2>
            <img src={teamicon} alt="단체신청아이콘" />
          </div>
          <div className="ChooseApplyMethod-card-middle">
            <ul>
              <li>
                <img src={checkicon} alt="체크아이콘" />
                <p>두 명 이상의 선수가 신청할 때 유용합니다.</p>
              </li>
              <li>
                <img src={checkicon} alt="체크아이콘" />
                <p>신청 선수들의 팀은 모두 같아야 합니다.</p>
              </li>
              <li>
                <img src={checkicon} alt="체크아이콘" />
                <p>대표자의 번호로 선수 연락처가 통일됩니다.</p>
              </li>

              <li>
                <img src={checkicon} alt="체크아이콘" />
                <p>
                  중복대회 신청 할인(기 + 노기, 체급 + 앱솔 등)은 한번에
                  신청해야 할인됩니다.
                </p>
              </li>
              <li>
                <img src={xicon} alt="체크아이콘" />
                <p>
                  {' '}
                  얼리버드 마감 후 신청정보를 변경하기 위해 환불 후 재거래
                  진행시 얼리버드 할인은 받으실 수 없습니다.
                </p>
              </li>
            </ul>
          </div>
          <div className="ChooseApplyMethod-card-bottom">
            <button
              onClick={() => {
                navigate(`/competition/applyteam/${id}`)
              }}>
              단체 신청하기
            </button>
            <p className="ChooseApplyMethod-card-bottom-info">
              ex) 체육관 관장님이 관원들을 단체로 대리 신청하는 경우
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChooseApplyMethod
