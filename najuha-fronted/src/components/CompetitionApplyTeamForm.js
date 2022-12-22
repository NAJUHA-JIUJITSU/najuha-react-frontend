import React from 'react'
import './competitionApplyTeamForm.css';
import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom';
import dropdownicon from '../src_assets/드랍다운아이콘.svg'
import deleteicon from '../src_assets/명단삭제로고.svg'

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
      competitionId: id,
    })

    const cookies = new Cookies();

    useEffect(() => {
      getCompetition(id);
  }, [])

    useEffect(() => {
      console.log(competitionApplication);
    }, [competitionApplication])

    useEffect(() => {
      console.log(competitionApplicationList);
    }, [competitionApplicationList])

    // useEffect(() => {
    //   console.log(competition);
    //   console.log(fillteredcompetition)
    // }, [competitionApplication, fillteredcompetition])


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
      return copycompetitionApplication;
    }

    const constfillteringcompetition = (object, value, part) => {
      let newfillteredcompetition = object.filter((div) => div.constantFactor[part] == value);
      return newfillteredcompetition
    }

    const varfillteringcompetition = (object, value, part) => {
        let newfillteredcompetition = object.filter((div) => div.variableFactor[part].includes(value));
        return newfillteredcompetition
    }

    function renderGenderOptionUI(){
      let comgender = [];
            fillteredcompetition.map((com, j) => {
                comgender.push(com.constantFactor.gender);
            })
            comgender = [...new Set(comgender)];
            return comgender.map((el, h) => {
                return(
                    <li key={el} value={el} onClick={() => {
                      let copycompetitionApplication = changeCompetitionApplication(el, 'gender')
                      stateRefresh('gender', copycompetitionApplication)
                    }}>
                    {el == 'female' ? '여자' : '남자' }</li>
                )
                })
    }

    function renderUniformOptionUI(){
      let newfillteredcompetition = JSON.parse(JSON.stringify(fillteredcompetition))
      newfillteredcompetition = constfillteringcompetition(newfillteredcompetition, competitionApplication.gender, 'gender')
      let comuniform = [];
            newfillteredcompetition.map((com, j) => {
                comuniform.push(com.constantFactor.uniform);
            })
            comuniform = [...new Set(comuniform)];
            return comuniform.map((el, h) => {
                return(
                    <li key={el} value={el} onClick={() => {
                      let copycompetitionApplication = changeCompetitionApplication(el, 'uniform')
                      stateRefresh('uniform', copycompetitionApplication)
                      }}>
                      {el == 'gi' ? '기' : '노기' }</li>
                )
                })
    }

    function renderDivisionNameOptionUI(){
      let newfillteredcompetition = JSON.parse(JSON.stringify(fillteredcompetition))
      newfillteredcompetition = constfillteringcompetition(newfillteredcompetition, competitionApplication.gender, 'gender')
      newfillteredcompetition = constfillteringcompetition(newfillteredcompetition, competitionApplication.uniform, 'uniform')
      let comdi = [];
            newfillteredcompetition.map((com, j) => {
                comdi.push(com.constantFactor.divisionName);
            })
            comdi = [...new Set(comdi)];
            return comdi.map((el, h) => {
                return(
                    <li key={el} value={el} onClick={() => {
                      let copycompetitionApplication = changeCompetitionApplication(el, 'divisionName')
                      stateRefresh('divisionName', copycompetitionApplication)
                      }}>{el}</li>
                )
                })
    }

    function renderBeltOptionUI(){
      let newfillteredcompetition = JSON.parse(JSON.stringify(fillteredcompetition))
      newfillteredcompetition = constfillteringcompetition(newfillteredcompetition, competitionApplication.gender, 'gender')
      newfillteredcompetition = constfillteringcompetition(newfillteredcompetition, competitionApplication.uniform, 'uniform')
      newfillteredcompetition = constfillteringcompetition(newfillteredcompetition, competitionApplication.divisionName, 'divisionName')
      let combelt = [];
            newfillteredcompetition.map((com, j) => {
                com.variableFactor.belt.map((bel, g) => {
                    combelt.push(bel);
                })
            })
            combelt = [...new Set(combelt)]
            return combelt.map((el, h) => {
                return(
                    <li key={el} onClick={() => {
                      let copycompetitionApplication = changeCompetitionApplication(el, 'belt')
                      stateRefresh('belt', copycompetitionApplication)
                      }}>{el}</li>
                )
            })
    }

    function renderWeightOptionUI(){
      let newfillteredcompetition = JSON.parse(JSON.stringify(fillteredcompetition))
      newfillteredcompetition = constfillteringcompetition(newfillteredcompetition, competitionApplication.gender, 'gender')
      newfillteredcompetition = constfillteringcompetition(newfillteredcompetition, competitionApplication.uniform, 'uniform')
      newfillteredcompetition = constfillteringcompetition(newfillteredcompetition, competitionApplication.divisionName, 'divisionName')
      newfillteredcompetition = varfillteringcompetition(newfillteredcompetition, competitionApplication.belt, 'belt')
      let comweight = [];
            newfillteredcompetition.map((com, j) => {
                com.variableFactor.weight.map((wei, g) => {
                    comweight.push(wei);
                })
            })
            comweight = [...new Set(comweight)]
            return comweight.map((el, h) => {
                return(
                    <li key={el} onClick={() => {changeCompetitionApplication(el, 'weight')}}>{el}</li>
                )
            })
    }

    function stateRefresh(key, copycompetitionApplication){
      if(key == 'gender'){
        copycompetitionApplication.uniform = '';
        copycompetitionApplication.divisionName = '';
        copycompetitionApplication.belt = '';
        copycompetitionApplication.weight = '';
        console.log(copycompetitionApplication)
        setCompetitionApplication(copycompetitionApplication)
      } else if(key == 'uniform'){
        copycompetitionApplication.divisionName = '';
        copycompetitionApplication.belt = '';
        copycompetitionApplication.weight = '';
        setCompetitionApplication(copycompetitionApplication)
      } else if(key == 'divisionName'){
        copycompetitionApplication.belt = '';
        copycompetitionApplication.weight = '';
        setCompetitionApplication(copycompetitionApplication)
      } else if(key == 'belt'){
        copycompetitionApplication.weight = '';
        setCompetitionApplication(copycompetitionApplication)
      }
    }

    function validationcheck(application){
      let tmp = Object.values(application)
      let ret = true
      tmp.forEach(x => {
        if(x == '') ret = false;
      })
      return ret;
    }

    function addCompetitionApplication(){
      let check = validationcheck(competitionApplication)
      if(check){
        let newCompetitionApplicationList = [...competitionApplicationList]
        newCompetitionApplicationList.push(competitionApplication);
        setCompetitionApplicationList(newCompetitionApplicationList);
      } else{
        alert('신청서를 빈 항목 없이 끝까지 작성해주세요');
      }
      
    }

    function renderCompetitionApplicationList(){
      return competitionApplicationList.map((application, i) => {
        return(
          <ul className='CompetitionApplyTeamForm-bottom-table-row'>
                      <li>{i+1}</li>
                      <li>{application.playerName}</li>
                      <li>{application.playerBirth}</li>
                      <li>{application.gender == 'female' ? '여자' : '남자'}</li>
                      <li>{application.uniform == 'gi' ? '기' : '노기'}</li>
                      <li>{application.divisionName}</li>
                      <li>{application.belt}</li>
                      <li>{application.weight}</li>
                      <li>50,000원</li>
                      <img id='CompetitionApplyTeamForm-bottom-table-row-deleteicon' src={deleteicon} alt='삭제아이콘'/>
          </ul>
        )
      })
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
                        : 
                        competitionApplication.playerBirth != '' ? <li><input placeholder='ex) 900404' value={competitionApplication.playerBirth} onChange={(e)=>{changeCompetitionApplication(e.target.value, 'playerBirth')}}></input></li> : <li className='CompetitionApplyTeamForm-top-table-row-disable'>ex) 900404</li>}
                        
                        {competitionApplication.gender != '' ?  // 본인값있으면 본인값 보여주고 
                        <li onClick={genderDropdownToggle}>
                          <p style={{color:'black'}}>{competitionApplication.gender == 'male' ? '남자' : '여자'}</p><img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/>
                          {genderDropdown ?
                          <ul id= 'CompetitionApplyTeamForm-top-table-row-dropdown'>
                            {renderGenderOptionUI()}
                          </ul>
                          :
                          ''
                          }
                        </li>
                        : 
                          (competitionApplication.playerBirth != '' ? // 없으면, 앞에 값(생년월일) 유무에 따라 유: 선택할수있는 드랍다운, 무: 디스에이블 
                          <li onClick={genderDropdownToggle}>
                            성별 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/>
                            {genderDropdown ?
                            <ul id= 'CompetitionApplyTeamForm-top-table-row-dropdown'>
                              {renderGenderOptionUI()}
                            </ul>
                            :
                            ''
                            }
                          </li>
                          :
                          <li className='CompetitionApplyTeamForm-top-table-row-disable'>성별 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/></li>)}


                        {competitionApplication.uniform != '' ? // 본인값있으면 본인값 보여주고 
                        <li onClick={uniformDropdownToggle} id='CompetitionApplyTeamForm-top-table-ginogi'>
                        <p style={{color:'black'}}>{competitionApplication.uniform == 'gi' ? '기' : '노기'}</p> <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/>
                          {uniformDropdown ?
                          <ul id= 'CompetitionApplyTeamForm-top-table-row-dropdown'>
                            {renderUniformOptionUI()}
                          </ul>
                          :
                          ''
                          }
                        </li>
                        : 
                          competitionApplication.gender != '' ? // 없으면 앞에 값(성별) 유무에따라 유: 선택할수있는 드랍다운, 무: 디스에이블  
                          <li onClick={uniformDropdownToggle} id='CompetitionApplyTeamForm-top-table-ginogi'>
                          기/노기 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/>
                            {uniformDropdown ?
                            <ul id= 'CompetitionApplyTeamForm-top-table-row-dropdown'>
                              {renderUniformOptionUI()}
                            </ul>
                            :
                            ''
                            }
                          </li>
                          :
                          <li className='CompetitionApplyTeamForm-top-table-row-disable' id='CompetitionApplyTeamForm-top-table-ginogi' >기/노기 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/></li>}
                </ul>
              </div>
              <div className='CompetitionApplyTeamForm-top-table-child2'>  
                <ul className='CompetitionApplyTeamForm-top-table-column'>
                        <li>부문</li>
                        <li>벨트</li>
                        <li>체급</li>
                </ul>
                <ul className='CompetitionApplyTeamForm-top-table-row'>
                        {competitionApplication.divisionName != '' ? // 본인값있으면 본인값 보여주고            
                        <li onClick={divisionDropdownToggle} id='CompetitionApplyTeamForm-top-table-division'>
                        <p style={{color:'black'}}>{competitionApplication.divisionName}</p><img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/>
                          {divisionDropdown ?
                            <ul id= 'CompetitionApplyTeamForm-top-table-row-dropdown'>
                              {renderDivisionNameOptionUI()}
                            </ul>
                            :
                            ''
                          }
                        </li>
                        :
                          competitionApplication.uniform != '' ? // 없으면 앞에(유니폼) 값 유무에따라 유: 선택할 수 있는 드랍다운, 무: 디스에이블            
                          <li onClick={divisionDropdownToggle} id='CompetitionApplyTeamForm-top-table-division'>
                          부문<img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/>
                            {divisionDropdown ?
                              <ul id= 'CompetitionApplyTeamForm-top-table-row-dropdown'>
                              {renderDivisionNameOptionUI()}
                              </ul>
                              :
                              ''
                            }
                          </li>
                          :
                          <li className='CompetitionApplyTeamForm-top-table-row-disable' id='CompetitionApplyTeamForm-top-table-division' >부문 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/></li>}

                        {competitionApplication.belt != '' ? // 본인값있으면 본인값 보여주고 
                        <li onClick={beltDropdownToggle}>
                        <p style={{color:'black'}}>{competitionApplication.belt}</p><img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/>
                          {beltDropdown ?
                            <ul id= 'CompetitionApplyTeamForm-top-table-row-dropdown'>
                              {renderBeltOptionUI()}
                            </ul>
                            :
                            ''
                          }
                        </li>
                        : 
                          competitionApplication.divisionName != '' ? // 없으면 앞에(디비전이름) 값 유무에따라 유: 선택할 수 있는 드랍다운, 무: 디스에이블 
                          <li onClick={beltDropdownToggle}>
                          벨트 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/>
                            {beltDropdown ?
                              <ul id= 'CompetitionApplyTeamForm-top-table-row-dropdown'>
                                {renderBeltOptionUI()}
                              </ul>
                              :
                              ''
                            }
                          </li>
                          :
                          <li className='CompetitionApplyTeamForm-top-table-row-disable' >벨트 <img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/></li>}

                        {competitionApplication.weight != '' ? // 본인값이 있을때,
                        <li onClick={weightDropdownToggle}>
                        <p style={{color:'black'}}>{competitionApplication.weight}</p><img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/>
                          {weightDropdown ?
                            <ul id= 'CompetitionApplyTeamForm-top-table-row-dropdown'>
                              {renderWeightOptionUI()}
                            </ul>
                            :
                            ''
                            }
                        </li>
                        : 
                          competitionApplication.belt != '' ? // 없으면 앞에(벨트) 값 유무에따라 유: 선택할 수 있는 드랍다운, 무: 디스에이블 
                          <li onClick={weightDropdownToggle}>
                          체급<img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/>
                            {weightDropdown ?
                              <ul id= 'CompetitionApplyTeamForm-top-table-row-dropdown'>
                                {renderWeightOptionUI()}
                              </ul>
                              :
                              ''
                              }
                          </li>
                          :
                          <li className='CompetitionApplyTeamForm-top-table-row-disable'>체급<img className= 'CompetitionApplyTeamForm-top-table-row-dropdown-icon' src={dropdownicon}/></li>}
                </ul>
              </div>
            </div>     
            <button className='CompetitionApplyTeamForm-button-add' onClick={addCompetitionApplication}>추가하기</button>
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
            {renderCompetitionApplicationList()}
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