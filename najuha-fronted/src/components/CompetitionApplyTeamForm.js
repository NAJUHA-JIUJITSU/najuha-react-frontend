import React from 'react'
import './competitionApplyTeamForm.css';
import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom';
import dropdownicon from '../src_assets/드랍다운아이콘.svg'

import axios from 'axios';
import { Cookies } from 'react-cookie';

function CompetitionApplyTeamForm() {
    const {id} = useParams();
    const [genderDropdown, setGenderDropdown] = useState(false)
    const [uniformDropdown, setUniformDropdown] = useState(false)
    const [divisionDropdown, setDivisionDropdown] = useState(false)
    const [beltDropdown, setBeltDropdown] = useState(false)
    const [weightDropdown, setWeightDropdown] = useState(false)

    const [competition, setCompetition] = useState(null);
    const [fillteredcompetition, setFillteredCompetition] = useState(null);

    const [competitionApplicationList, setCompetitionApplicationList] = useState([]);
    const [competitionApplication, setCompetitionApplication] = useState({
      playerName: '',
      playerBirth: '',
      phoneNumber: '',
      uniform: '',
      divisionName: '',
      gender: '',
      belt: '',
      weight: '',
      team: '',
      competitionId: '',
    })

    const cookies = new Cookies();

    useEffect(() => {
      getCompetition(id);
  }, [])

    useEffect(() => {
      console.log(competitionApplication);
    }, [competitionApplication])

    useEffect(() => {
      console.log(competition);
      console.log(fillteredcompetition)
    }, [competitionApplication, fillteredcompetition])


    const getCompetition = async (id) => {
      try {
          const response = await axios.get(`${process.env.REACT_APP_BACK_END_API}/competitions/${id}`, {
              headers: {
                  "x-access-token":  cookies.get("x-access-token")
              }
          });
          const newCompetition = response.data.result;
          setCompetition(newCompetition)
          setFillteredCompetition(newCompetition.division);
      } catch(err) {
          console.log(err);
      }
  }

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
    
    function changeCompetitionApplication(value, key){
      let copycompetitionApplication = JSON.parse(JSON.stringify(competitionApplication))
      copycompetitionApplication[key] = value
      setCompetitionApplication(copycompetitionApplication)
    }

    const constfillteringcompetition = (value, part) => {
      console.log(value, part);
      let newfillteredcompetition = fillteredcompetition.filter((div) => div.constantFactor[part] == value);
      setFillteredCompetition(newfillteredcompetition);
    }

    const varfillteringcompetition = (value, part) => {
        console.log(value, part);
        let newfillteredcompetition = fillteredcompetition.filter((div) => div.variableFactor[part].includes(value));
        setFillteredCompetition(newfillteredcompetition);
    }

    function renderGenderOption(){

    }

  return (
    <div className='CompetitionApplyTeamForm-wrapper'>
        <div className='CompetitionApplyTeamForm-top'>
            <h1 className='CompetitionApplyTeamForm-title'>예거스 챔피언쉽 로컬대회 송도오픈</h1>
            <div className='CompetitionApplyTeamForm-teaminfo'>
                <div className='CompetitionApplyTeamForm-teaminfo-element'>
                  <label>팀이름</label>
                  <input placeholder='팀 이름을 입력해주세요' value={competitionApplication.team} onChange={(e)=>{changeCompetitionApplication(e.target.value, 'team')}}></input>
                </div>
                <div className='CompetitionApplyTeamForm-teaminfo-element'>
                  <label>대표자 번호</label>
                  <input placeholder="'-' 없이 번호만 입력해주세요" value={competitionApplication.phoneNumber} onChange={(e)=>{changeCompetitionApplication(e.target.value, 'phoneNumber')}}></input>
                </div>
            </div>
            <div className='CompetitionApplyTeamForm-top-table'>
              <div className='CompetitionApplyTeamForm-top-table-child1'>
                <ul className='CompetitionApplyTeamForm-top-table-column'>
                        <li>이름</li>
                        <li>생년월일</li>
                        <li>성별</li>
                        <li>기/노기</li>
                </ul>
                <ul className='CompetitionApplyTeamForm-top-table-row'>
                        <li><input placeholder='이름' value={competitionApplication.playerName} onChange={(e)=>{changeCompetitionApplication(e.target.value, 'playerName')}}></input> </li>
                        {competitionApplication.playerName != '' ? <li><input placeholder='ex) 900404' value={competitionApplication.playerBirth} onChange={(e)=>{changeCompetitionApplication(e.target.value, 'playerBirth')}}></input></li> 
                        : <li className='CompetitionApplyTeamForm-top-table-row-disable'>ex) 900404</li>}
                        
                        {competitionApplication.playerBirth != '' ? 
                        <li onClick={genderDropdownToggle}>
                          성별 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/>
                          {genderDropdown ?
                          <ul id= 'CompetitionApplyTeamForm-top-table-row-dropdown' onClick={(e) => {console.log(e.target.value)}}>
                            <li value={1}>1</li>
                            <li value={2}>2</li>
                            <li value={3}>3</li>
                          </ul>
                          :
                          ''
                          }
                        </li>
                        : <li className='CompetitionApplyTeamForm-top-table-row-disable'>성별 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/></li>}

                        {competitionApplication.gender != '' ? 
                        <li onClick={uniformDropdownToggle} id='CompetitionApplyTeamForm-top-table-ginogi'>
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
                        : <li className='CompetitionApplyTeamForm-top-table-row-disable' id='CompetitionApplyTeamForm-top-table-ginogi' >기/노기 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/></li>}
                </ul>
              </div>
              <div className='CompetitionApplyTeamForm-top-table-child2'>  
                <ul className='CompetitionApplyTeamForm-top-table-column'>
                        <li>부문</li>
                        <li>벨트</li>
                        <li>체급</li>
                </ul>
                <ul className='CompetitionApplyTeamForm-top-table-row'>
                        {competitionApplication.gender != '' ?            
                        <li onClick={divisionDropdownToggle} id='CompetitionApplyTeamForm-top-table-division'>부문 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/>
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
                        : <li className='CompetitionApplyTeamForm-top-table-row-disable' id='CompetitionApplyTeamForm-top-table-division' >부문 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/></li>}
                        {competitionApplication.divisionName != '' ?
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
                        : <li className='CompetitionApplyTeamForm-top-table-row-disable' >벨트 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/></li>}
                        {competitionApplication.belt != '' ?
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
                        : <li className='CompetitionApplyTeamForm-top-table-row-disable'>체급 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/></li>}
                </ul>
              </div>
            </div>
            
            
            <button className='CompetitionApplyTeamForm-button-add'>추가하기</button>
        </div>
        <div className='CompetitionApplyTeamForm-bottom'>
          <h3 className='CompetitionApplyTeamForm-bottom-title'>신청자 명단</h3>
          <div className='CompetitionApplyTeamForm-bottom-table'>
            <ul className='CompetitionApplyTeamForm-bottom-table-column'>
                      <li>No.</li>
                      <li>이름</li>
                      <li>생년월일</li>
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
                      <li>981127</li>
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
                      <li>981127</li>
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
                      <li>981127</li>
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
                      <li>981127</li>
                      <li>여자</li>
                      <li>노기</li>
                      <li>마스터부</li>
                      <li>브라운</li>
                      <li>-45kg</li>
                      <li>50,000원</li>
            </ul>
            <div className='CompetitionApplyTeamForm-bottom-table-result'>
              <h3 id='CompetitionApplyTeamForm-bottom-table-result-key'>총 결제금액</h3>
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