import React from 'react'
import './competitionApplyTeamForm.css';
import {useState} from 'react'
import dropdownicon from '../src_assets/드랍다운아이콘.svg'

function CompetitionApplyTeamForm() {
    const [genderDropdown, setGenderDropdown] = useState(false)
    const [uniformDropdown, setUniformDropdown] = useState(false)
    const [divisionDropdown, setDivisionDropdown] = useState(false)
    const [beltDropdown, setBeltDropdown] = useState(false)
    const [weightDropdown, setWeightDropdown] = useState(false)

    function genderDropdownToggle(){
      setGenderDropdown((pre) => (!pre));
    }

    function uniformDropdownToggle(){
      setUniformDropdown((pre) => (!pre));
    }

    function divisionDropdownToggle(){
      setDivisionDropdown((pre) => (!pre));
    }

    function beltDropdownToggle(){
      setBeltDropdown((pre) => (!pre));
    }

    function weightDropdownToggle(){
      setWeightDropdown((pre) => (!pre));
    }

  return (
    <div className='CompetitionApplyTeamForm-wrapper'>
        <div className='CompetitionApplyTeamForm-top'>
            <h1 className='CompetitionApplyTeamForm-title'>예거스 챔피언쉽 로컬대회 송도오픈</h1>
            <div className='CompetitionApplyTeamForm-teaminfo'>
                <label>팀이름</label>
                <input placeholder='팀 이름을 입력해주세요'></input>
                <label>대표자 번호</label>
                <input placeholder="'-' 없이 번호만 입력해주세요"></input>
            </div>
            <ul className='CompetitionApplyTeamForm-top-table-column'>
                    <li>이름</li>
                    <li>성별</li>
                    <li>기/노기</li>
                    <li>부문</li>
                    <li>벨트</li>
                    <li>체급</li>
            </ul>
            <ul className='CompetitionApplyTeamForm-top-table-row'>
                    <li><input></input> </li>
                    <li onClick={genderDropdownToggle}>
                      성별 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/>
                      {genderDropdown ?
                      <ul id= 'CompetitionApplyTeamForm-top-table-row-dropdown'>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                      </ul>
                      :
                      ''
                      }
                    </li>
                    <li onClick={uniformDropdownToggle}>
                      기/노기 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/>
                      {uniformDropdown ?
                      <ul id= 'CompetitionApplyTeamForm-top-table-row-dropdown'>
                        <li>1</li>
                        <li>1</li>
                        <li>1</li>
                      </ul>
                      :
                      ''
                      }
                    </li>
                    <li onClick={divisionDropdownToggle}>부문 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/>
                      {divisionDropdown ?
                        <ul id= 'CompetitionApplyTeamForm-top-table-row-dropdown'>
                          <li>1</li>
                          <li>1</li>
                          <li>1</li>
                        </ul>
                        :
                        ''
                      }
                    </li>
                    <li onClick={beltDropdownToggle}>벨트 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/>
                      {beltDropdown ?
                        <ul id= 'CompetitionApplyTeamForm-top-table-row-dropdown'>
                          <li>1</li>
                          <li>1</li>
                          <li>1</li>
                        </ul>
                        :
                        ''
                      }
                    </li>
                    <li onClick={weightDropdownToggle}>체급 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/>
                      {weightDropdown ?
                        <ul id= 'CompetitionApplyTeamForm-top-table-row-dropdown'>
                          <li>1</li>
                          <li>1</li>
                          <li>1</li>
                        </ul>
                        :
                        ''
                        }
                    </li>
            </ul>
            <button className='CompetitionApplyTeamForm-button-add'>추가하기</button>
        </div>
        <div className='CompetitionApplyTeamForm-bottom'>
          <h3 className='CompetitionApplyTeamForm-bottom-title'>신청자 명단</h3>
          <div className='CompetitionApplyTeamForm-bottom-table'>
            <ul className='CompetitionApplyTeamForm-bottom-table-column'>
                      <li>No.</li>
                      <li>이름</li>
                      <li>성별</li>
                      <li>기/노기</li>
                      <li>부문</li>
                      <li>벨트</li>
                      <li>체급</li>
                      <li>참가비</li>
            </ul>
            <ul className='CompetitionApplyTeamForm-bottom-table-row'>
                      <li>1</li>
                      <li>유연아</li>
                      <li>여자</li>
                      <li>노기</li>
                      <li>마스터부</li>
                      <li>브라운</li>
                      <li>-45kg</li>
                      <li>50,000원</li>
            </ul>
            <ul className='CompetitionApplyTeamForm-bottom-table-row'>
                      <li>1</li>
                      <li>유연아</li>
                      <li>여자</li>
                      <li>노기</li>
                      <li>마스터부</li>
                      <li>브라운</li>
                      <li>-45kg</li>
                      <li>50,000원</li>
            </ul>
            <ul className='CompetitionApplyTeamForm-bottom-table-row'>
                      <li>1</li>
                      <li>유연아</li>
                      <li>여자</li>
                      <li>노기</li>
                      <li>마스터부</li>
                      <li>브라운</li>
                      <li>-45kg</li>
                      <li>50,000원</li>
            </ul>
            <ul className='CompetitionApplyTeamForm-bottom-table-row'>
                      <li>1</li>
                      <li>유연아</li>
                      <li>여자</li>
                      <li>노기</li>
                      <li>마스터부</li>
                      <li>브라운</li>
                      <li>-45kg</li>
                      <li>50,000원</li>
            </ul>
            <div className='CompetitionApplyTeamForm-bottom-table-result'>
              <h3>총 결제금액</h3>
              <h3>90,000원</h3>
            </div>
          </div>
          <div className='CompetitionApplyTeamForm-bottom-table-buttons'>
            <button id='CompetitionApplyTeamForm-bottom-table-buttons-save'>저장하기</button>
            <button id='CompetitionApplyTeamForm-bottom-table-buttons-register'>신청하기</button>
          </div>
        </div>
    </div>
  )
}

export default CompetitionApplyTeamForm