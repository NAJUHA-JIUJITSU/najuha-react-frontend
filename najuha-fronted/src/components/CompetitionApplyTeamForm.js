import React from 'react'
import './competitionApplyTeamForm.css'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import dropdownicon from '../src_assets/드랍다운아이콘.svg'
import deleteicon from '../src_assets/명단삭제로고.svg'

import Paymentmodal from './Paymentmodal'
import Paymentbridgemodal from './Paymentbridgemodal'

import {
  getCompetitionDetail,
  getCompetitionPricePredict,
} from '../apis/api/competition'
import { postCompetitionApplicationGroup } from '../apis/api/competitionApplications'

function CompetitionApplyTeamForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [genderDropdown, setGenderDropdown] = useState(false)
  const [uniformDropdown, setUniformDropdown] = useState(false)
  const [divisionDropdown, setDivisionDropdown] = useState(false)
  const [beltDropdown, setBeltDropdown] = useState(false)
  const [weightDropdown, setWeightDropdown] = useState(false)
  const [paymentmodal, setPaymentmodal] = useState(false)
  const [paymentbridgemodal, setPaymentbridgemodal] = useState(false)

  const [normalPrice, setNormalPrice] = useState(0)
  const [discountedPrice, setDiscountedPrice] = useState(0)

  const [competition, setCompetition] = useState(null)
  const [fillteredcompetition, setFillteredCompetition] = useState(null)

  const [viewCompetitionApplicationList, setViewCompetitionApplicationList] =
    useState([])
  const [competitionApplication, setCompetitionApplication] = useState({
    team: '',
    phoneNumber: '',
    playerName: '',
    playerBirth: '',
    gender: '',
    uniform: '',
    divisionName: '',
    belt: '',
    weight: '',
    price: '',
    competitionId: id,
  })
  const [competitionApplicationId, setCompetitionApplicationId] = useState(null)

  useEffect(() => {
    getCompetition(id)
  }, [])

  useEffect(() => {
    if (competitionApplication.weight !== '') findApplicationPrice()
  }, [competitionApplication.weight])

  useEffect(() => {
    console.log(competition)
  }, [competition])

  useEffect(() => {
    console.log(competitionApplication)
  }, [competitionApplication])

  useEffect(() => {
    console.log(viewCompetitionApplicationList)
    if (viewCompetitionApplicationList.length > 0) getTotalPrice() // 가격 받아오기
  }, [viewCompetitionApplicationList])

  function parsingBeforePost(viewCompetitionApplicationList) {
    let copyCompetitionApplicationList = JSON.parse(
      JSON.stringify(viewCompetitionApplicationList)
    )
    copyCompetitionApplicationList.map(application => {
      delete application.price
    })
    return copyCompetitionApplicationList
  }

  async function postCompetitionApply() {
    let competitionApplicationList = parsingBeforePost(
      viewCompetitionApplicationList
    )
    let res = await postCompetitionApplicationGroup({
      competitionApplicationList,
    })
    if (res?.status === 200) {
      setCompetitionApplicationId(res.data.result.competitionApplicationId)
      return true
    }
    return false
  }

  const getCompetition = async id => {
    const res = await getCompetitionDetail(id)
    if (res?.status === 200) {
      const newCompetition = res.data.result
      setCompetition(newCompetition)
      setFillteredCompetition(newCompetition.division)
    }
  }

  function genderDropdownToggle() {
    setGenderDropdown(pre => !pre)
  }

  function uniformDropdownToggle() {
    setUniformDropdown(pre => !pre)
  }

  function divisionDropdownToggle() {
    setDivisionDropdown(pre => !pre)
  }

  function beltDropdownToggle() {
    setBeltDropdown(pre => !pre)
  }

  function weightDropdownToggle() {
    setWeightDropdown(pre => !pre)
  }

  function changeCompetitionApplication(value, key) {
    let copycompetitionApplication = JSON.parse(
      JSON.stringify(competitionApplication)
    )
    copycompetitionApplication[key] = value
    setCompetitionApplication(copycompetitionApplication)
    return copycompetitionApplication
  }

  const constfillteringcompetition = (object, value, part) => {
    let newfillteredcompetition = object.filter(
      div => div.constantFactor[part] == value
    )
    return newfillteredcompetition
  }

  const varfillteringcompetition = (object, value, part) => {
    let newfillteredcompetition = object.filter(div =>
      div.variableFactor[part].includes(value)
    )
    return newfillteredcompetition
  }

  function renderGenderOptionUI() {
    let comgender = []
    fillteredcompetition.map((com, j) => {
      comgender.push(com.constantFactor.gender)
    })
    comgender = [...new Set(comgender)]
    return comgender.map((el, h) => {
      return (
        <li
          key={el}
          value={el}
          onClick={() => {
            let copycompetitionApplication = changeCompetitionApplication(
              el,
              'gender'
            )
            stateRefresh('gender', copycompetitionApplication)
          }}
        >
          {el == 'female' ? '여자' : '남자'}
        </li>
      )
    })
  }

  function renderUniformOptionUI() {
    let newfillteredcompetition = JSON.parse(
      JSON.stringify(fillteredcompetition)
    )
    newfillteredcompetition = constfillteringcompetition(
      newfillteredcompetition,
      competitionApplication.gender,
      'gender'
    )
    let comuniform = []
    newfillteredcompetition.map((com, j) => {
      comuniform.push(com.constantFactor.uniform)
    })
    comuniform = [...new Set(comuniform)]
    return comuniform.map((el, h) => {
      return (
        <li
          key={el}
          value={el}
          onClick={() => {
            let copycompetitionApplication = changeCompetitionApplication(
              el,
              'uniform'
            )
            stateRefresh('uniform', copycompetitionApplication)
          }}
        >
          {el == 'gi' ? '기' : '노기'}
        </li>
      )
    })
  }

  function renderDivisionNameOptionUI() {
    let newfillteredcompetition = JSON.parse(
      JSON.stringify(fillteredcompetition)
    )
    newfillteredcompetition = constfillteringcompetition(
      newfillteredcompetition,
      competitionApplication.gender,
      'gender'
    )
    newfillteredcompetition = constfillteringcompetition(
      newfillteredcompetition,
      competitionApplication.uniform,
      'uniform'
    )
    let comdi = []
    newfillteredcompetition.map((com, j) => {
      comdi.push(com.constantFactor.divisionName)
    })
    comdi = [...new Set(comdi)]
    return comdi.map((el, h) => {
      return (
        <li
          key={el}
          value={el}
          onClick={() => {
            let copycompetitionApplication = changeCompetitionApplication(
              el,
              'divisionName'
            )
            stateRefresh('divisionName', copycompetitionApplication)
          }}
        >
          {el}
        </li>
      )
    })
  }

  function renderBeltOptionUI() {
    let newfillteredcompetition = JSON.parse(
      JSON.stringify(fillteredcompetition)
    )
    newfillteredcompetition = constfillteringcompetition(
      newfillteredcompetition,
      competitionApplication.gender,
      'gender'
    )
    newfillteredcompetition = constfillteringcompetition(
      newfillteredcompetition,
      competitionApplication.uniform,
      'uniform'
    )
    newfillteredcompetition = constfillteringcompetition(
      newfillteredcompetition,
      competitionApplication.divisionName,
      'divisionName'
    )
    let combelt = []
    newfillteredcompetition.map((com, j) => {
      com.variableFactor.belt.map((bel, g) => {
        combelt.push(bel)
      })
    })
    combelt = [...new Set(combelt)]
    return combelt.map((el, h) => {
      return (
        <li
          key={el}
          onClick={() => {
            let copycompetitionApplication = changeCompetitionApplication(
              el,
              'belt'
            )
            stateRefresh('belt', copycompetitionApplication)
          }}
        >
          {el}
        </li>
      )
    })
  }

  function renderWeightOptionUI() {
    let newfillteredcompetition = JSON.parse(
      JSON.stringify(fillteredcompetition)
    )
    newfillteredcompetition = constfillteringcompetition(
      newfillteredcompetition,
      competitionApplication.gender,
      'gender'
    )
    newfillteredcompetition = constfillteringcompetition(
      newfillteredcompetition,
      competitionApplication.uniform,
      'uniform'
    )
    newfillteredcompetition = constfillteringcompetition(
      newfillteredcompetition,
      competitionApplication.divisionName,
      'divisionName'
    )
    newfillteredcompetition = varfillteringcompetition(
      newfillteredcompetition,
      competitionApplication.belt,
      'belt'
    )
    let comweight = []
    newfillteredcompetition.map((com, j) => {
      com.variableFactor.weight.map((wei, g) => {
        comweight.push(wei)
      })
    })
    comweight = [...new Set(comweight)]
    return comweight.map((el, h) => {
      return (
        <li
          key={el}
          onClick={() => {
            changeCompetitionApplication(el, 'weight')
          }}
        >
          {el}
        </li>
      )
    })
  }

  function findApplicationPrice() {
    let newfillteredcompetition = JSON.parse(
      JSON.stringify(fillteredcompetition)
    )
    newfillteredcompetition = constfillteringcompetition(
      newfillteredcompetition,
      competitionApplication.gender,
      'gender'
    )
    newfillteredcompetition = constfillteringcompetition(
      newfillteredcompetition,
      competitionApplication.uniform,
      'uniform'
    )
    newfillteredcompetition = constfillteringcompetition(
      newfillteredcompetition,
      competitionApplication.divisionName,
      'divisionName'
    )
    newfillteredcompetition = varfillteringcompetition(
      newfillteredcompetition,
      competitionApplication.belt,
      'belt'
    )
    newfillteredcompetition = varfillteringcompetition(
      newfillteredcompetition,
      competitionApplication.weight,
      'weight'
    )
    changeCompetitionApplication(
      newfillteredcompetition[0].pricingPolicy.normal,
      'price'
    )
  }

  function stateRefresh(key, copycompetitionApplication) {
    if (key == 'gender') {
      copycompetitionApplication.uniform = ''
      copycompetitionApplication.divisionName = ''
      copycompetitionApplication.belt = ''
      copycompetitionApplication.weight = ''
      console.log(copycompetitionApplication)
      setCompetitionApplication(copycompetitionApplication)
    } else if (key == 'uniform') {
      copycompetitionApplication.divisionName = ''
      copycompetitionApplication.belt = ''
      copycompetitionApplication.weight = ''
      setCompetitionApplication(copycompetitionApplication)
    } else if (key == 'divisionName') {
      copycompetitionApplication.belt = ''
      copycompetitionApplication.weight = ''
      setCompetitionApplication(copycompetitionApplication)
    } else if (key == 'belt') {
      copycompetitionApplication.weight = ''
      setCompetitionApplication(copycompetitionApplication)
    }
  }

  function validationcheck(application) {
    let tmp = Object.values(application)
    let ret = true
    for (let i = 0; i < tmp.length; i++) {
      if (tmp[i] === '') {
        let keyName = Object.keys(application)[i]
        if (keyName === 'team') {
          alert('팀이름을 입력해주세요')
        } else if (keyName === 'phoneNumber') {
          alert('대표자번호를 입력해주세요')
        } else if (keyName === 'playerName') {
          alert('선수이름을 입력해주세요')
        } else if (keyName === 'playerBirth') {
          alert('생년월일을 입력해주세요')
        } else if (keyName === 'gender') {
          alert('성별을 선택해주세요')
        } else if (keyName === 'uniform') {
          alert('기/노기를 선택해주세요')
        } else if (keyName === 'divisionName') {
          alert('부문을 선택해주세요')
        } else if (keyName === 'belt') {
          alert('벨트를 선택해주세요')
        } else if (keyName === 'weight') {
          alert('체급을 선택해주세요')
        }
        ret = false
        break
      }
    }
    return ret
  }

  function addCompetitionApplication() {
    let check = validationcheck(competitionApplication)
    console.log(check)
    if (check) {
      let newCompetitionApplicationList = [...viewCompetitionApplicationList]
      if (newCompetitionApplicationList.length > 0) {
        // 팀이름과 핸드폰 번호를 마지막 신청자에 것으로 통일해주는 역할
        newCompetitionApplicationList.map((copycompetitionApplication, i) => {
          copycompetitionApplication.team = competitionApplication.team
          copycompetitionApplication.phoneNumber =
            competitionApplication.phoneNumber
        })
      }
      newCompetitionApplicationList.push(competitionApplication)
      setViewCompetitionApplicationList(newCompetitionApplicationList)
    }
  }

  function deleteCompetitionApplication(i) {
    let copy = [...viewCompetitionApplicationList]
    copy.splice(i, 1)
    setViewCompetitionApplicationList(copy)
  }

  function renderCompetitionApplicationList() {
    return viewCompetitionApplicationList.map((application, i) => {
      return (
        <ul key={i} className="CompetitionApplyTeamForm-bottom-table-row">
          <li>{i + 1}</li>
          <li>{application.playerName}</li>
          <li>{application.playerBirth}</li>
          <li>{application.gender == 'female' ? '여자' : '남자'}</li>
          <li>{application.uniform == 'gi' ? '기' : '노기'}</li>
          <li>{application.divisionName}</li>
          <li>{application.belt}</li>
          <li>{application.weight}</li>
          <li>{application.price}원</li>
          <img
            id="CompetitionApplyTeamForm-bottom-table-row-deleteicon"
            src={deleteicon}
            alt="삭제아이콘"
            onClick={() => deleteCompetitionApplication(i)}
          />
        </ul>
      )
    })
  }

  const getTotalPrice = async () => {
    let res = await getCompetitionPricePredict(id, {
      isGroup: true,
      divisions: viewCompetitionApplicationList,
    })
    if (res?.status === 200) {
      setDiscountedPrice(res.data.result.discountedPrice)
      setNormalPrice(res.data.result.normalPrice)
    }
  }

  return (
    <div className="CompetitionApplyTeamForm-wrapper">
      <div className="CompetitionApplyTeamForm-top">
        <h1 className="CompetitionApplyTeamForm-title">{competition?.title}</h1>
        <div className="CompetitionApplyTeamForm-teaminfo">
          <div className="CompetitionApplyTeamForm-teaminfo-element">
            <label>팀이름</label>
            <input
              placeholder="팀 이름을 입력해주세요"
              value={competitionApplication.team}
              onChange={e => {
                let pattern = /[0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g
                e.target.value = e.target.value.replace(pattern, '')
                if (e.target.value.length > 50)
                  e.target.value = e.target.value.slice(0, 50)
                changeCompetitionApplication(e.target.value, 'team')
              }}
            ></input>
          </div>
          <div className="CompetitionApplyTeamForm-teaminfo-element">
            <label>대표자 번호</label>
            <input
              placeholder="'-' 없이 번호만 입력해주세요"
              value={competitionApplication.phoneNumber}
              onChange={e => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '')
                if (e.target.value.length > 11)
                  e.target.value = e.target.value.slice(0, 11)
                changeCompetitionApplication(e.target.value, 'phoneNumber')
              }}
            ></input>
          </div>
        </div>
        <div className="CompetitionApplyTeamForm-top-table">
          <div className="CompetitionApplyTeamForm-top-table-child1">
            <ul className="CompetitionApplyTeamForm-top-table-column">
              <li>이름</li>
              <li>생년월일</li>
              <li>성별</li>
              <li>기/노기</li>
            </ul>
            <ul className="CompetitionApplyTeamForm-top-table-row">
              <li>
                <input
                  placeholder="이름"
                  value={competitionApplication.playerName}
                  onChange={e => {
                    let pattern =
                      /[0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g
                    e.target.value = e.target.value.replace(pattern, '')
                    if (e.target.value.length > 10)
                      e.target.value = e.target.value.slice(0, 10)
                    changeCompetitionApplication(e.target.value, 'playerName')
                  }}
                ></input>{' '}
              </li>
              {competitionApplication.playerName != '' ? (
                <li>
                  <input
                    placeholder="예) 980404"
                    value={competitionApplication.playerBirth}
                    onChange={e => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '')
                      if (e.target.value.length > 6)
                        e.target.value = e.target.value.slice(0, 6)
                      changeCompetitionApplication(
                        e.target.value,
                        'playerBirth'
                      )
                    }}
                  ></input>
                </li>
              ) : competitionApplication.playerBirth != '' ? (
                <li>
                  <input
                    placeholder="ex) 900404"
                    value={competitionApplication.playerBirth}
                    onChange={e => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '')
                      if (e.target.value.length > 6)
                        e.target.value = e.target.value.slice(0, 6)
                      changeCompetitionApplication(
                        e.target.value,
                        'playerBirth'
                      )
                    }}
                  ></input>
                </li>
              ) : (
                <li className="CompetitionApplyTeamForm-top-table-row-disable">
                  ex) 900404
                </li>
              )}

              {competitionApplication.gender != '' ? ( // 본인값있으면 본인값 보여주고
                <li onClick={genderDropdownToggle}>
                  <p style={{ color: 'black' }}>
                    {competitionApplication.gender == 'male' ? '남자' : '여자'}
                  </p>
                  <img
                    className="CompetitionApplyTeamForm-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {genderDropdown ? (
                    <ul id="CompetitionApplyTeamForm-top-table-row-dropdown">
                      {renderGenderOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : competitionApplication.playerBirth != '' ? ( // 없으면, 앞에 값(생년월일) 유무에 따라 유: 선택할수있는 드랍다운, 무: 디스에이블
                <li onClick={genderDropdownToggle}>
                  성별{' '}
                  <img
                    className="CompetitionApplyTeamForm-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {genderDropdown ? (
                    <ul id="CompetitionApplyTeamForm-top-table-row-dropdown">
                      {renderGenderOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : (
                <li className="CompetitionApplyTeamForm-top-table-row-disable">
                  성별{' '}
                  <img
                    className="CompetitionApplyTeamForm-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                </li>
              )}

              {competitionApplication.uniform != '' ? ( // 본인값있으면 본인값 보여주고
                <li
                  onClick={uniformDropdownToggle}
                  id="CompetitionApplyTeamForm-top-table-ginogi"
                >
                  <p style={{ color: 'black' }}>
                    {competitionApplication.uniform == 'gi' ? '기' : '노기'}
                  </p>{' '}
                  <img
                    className="CompetitionApplyTeamForm-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {uniformDropdown ? (
                    <ul id="CompetitionApplyTeamForm-top-table-row-dropdown">
                      {renderUniformOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : competitionApplication.gender != '' ? ( // 없으면 앞에 값(성별) 유무에따라 유: 선택할수있는 드랍다운, 무: 디스에이블
                <li
                  onClick={uniformDropdownToggle}
                  id="CompetitionApplyTeamForm-top-table-ginogi"
                >
                  기/노기{' '}
                  <img
                    className="CompetitionApplyTeamForm-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {uniformDropdown ? (
                    <ul id="CompetitionApplyTeamForm-top-table-row-dropdown">
                      {renderUniformOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : (
                <li
                  className="CompetitionApplyTeamForm-top-table-row-disable"
                  id="CompetitionApplyTeamForm-top-table-ginogi"
                >
                  기/노기{' '}
                  <img
                    className="CompetitionApplyTeamForm-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                </li>
              )}
            </ul>
          </div>
          <div className="CompetitionApplyTeamForm-top-table-child2">
            <ul className="CompetitionApplyTeamForm-top-table-column">
              <li>부문</li>
              <li>벨트</li>
              <li>체급</li>
            </ul>
            <ul className="CompetitionApplyTeamForm-top-table-row">
              {competitionApplication.divisionName != '' ? ( // 본인값있으면 본인값 보여주고
                <li
                  onClick={divisionDropdownToggle}
                  id="CompetitionApplyTeamForm-top-table-division"
                >
                  <p style={{ color: 'black' }}>
                    {competitionApplication.divisionName}
                  </p>
                  <img
                    className="CompetitionApplyTeamForm-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {divisionDropdown ? (
                    <ul id="CompetitionApplyTeamForm-top-table-row-dropdown">
                      {renderDivisionNameOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : competitionApplication.uniform != '' ? ( // 없으면 앞에(유니폼) 값 유무에따라 유: 선택할 수 있는 드랍다운, 무: 디스에이블
                <li
                  onClick={divisionDropdownToggle}
                  id="CompetitionApplyTeamForm-top-table-division"
                >
                  부문
                  <img
                    className="CompetitionApplyTeamForm-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {divisionDropdown ? (
                    <ul id="CompetitionApplyTeamForm-top-table-row-dropdown">
                      {renderDivisionNameOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : (
                <li
                  className="CompetitionApplyTeamForm-top-table-row-disable"
                  id="CompetitionApplyTeamForm-top-table-division"
                >
                  부문{' '}
                  <img
                    className="CompetitionApplyTeamForm-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                </li>
              )}

              {competitionApplication.belt != '' ? ( // 본인값있으면 본인값 보여주고
                <li onClick={beltDropdownToggle}>
                  <p style={{ color: 'black' }}>
                    {competitionApplication.belt}
                  </p>
                  <img
                    className="CompetitionApplyTeamForm-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {beltDropdown ? (
                    <ul id="CompetitionApplyTeamForm-top-table-row-dropdown">
                      {renderBeltOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : competitionApplication.divisionName != '' ? ( // 없으면 앞에(디비전이름) 값 유무에따라 유: 선택할 수 있는 드랍다운, 무: 디스에이블
                <li onClick={beltDropdownToggle}>
                  벨트{' '}
                  <img
                    className="CompetitionApplyTeamForm-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {beltDropdown ? (
                    <ul id="CompetitionApplyTeamForm-top-table-row-dropdown">
                      {renderBeltOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : (
                <li className="CompetitionApplyTeamForm-top-table-row-disable">
                  벨트{' '}
                  <img
                    className="CompetitionApplyTeamForm-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                </li>
              )}

              {competitionApplication.weight != '' ? ( // 본인값이 있을때,
                <li onClick={weightDropdownToggle}>
                  <p style={{ color: 'black' }}>
                    {competitionApplication.weight}
                  </p>
                  <img
                    className="CompetitionApplyTeamForm-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {weightDropdown ? (
                    <ul id="CompetitionApplyTeamForm-top-table-row-dropdown">
                      {renderWeightOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : competitionApplication.belt != '' ? ( // 없으면 앞에(벨트) 값 유무에따라 유: 선택할 수 있는 드랍다운, 무: 디스에이블
                <li onClick={weightDropdownToggle}>
                  체급
                  <img
                    className="CompetitionApplyTeamForm-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {weightDropdown ? (
                    <ul id="CompetitionApplyTeamForm-top-table-row-dropdown">
                      {renderWeightOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : (
                <li className="CompetitionApplyTeamForm-top-table-row-disable">
                  체급
                  <img
                    className="CompetitionApplyTeamForm-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                </li>
              )}
            </ul>
          </div>
        </div>
        <button
          className="CompetitionApplyTeamForm-button-add"
          onClick={addCompetitionApplication}
        >
          추가하기
        </button>
      </div>
      <div className="CompetitionApplyTeamForm-bottom">
        <h3 className="CompetitionApplyTeamForm-bottom-title">신청자 명단</h3>
        <div className="CompetitionApplyTeamForm-bottom-table">
          <ul className="CompetitionApplyTeamForm-bottom-table-column">
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
        </div>
        <div className="CompetitionApplyTeamForm-bottom-table-results">
          <div className="CompetitionApplyTeamForm-bottom-table-result CompetitionApplyTeamForm-bottom-table-result-red">
            <h3 id="CompetitionApplyTeamForm-bottom-table-result-key">
              총 할인금액
            </h3>
            <h3>{normalPrice - discountedPrice}원</h3>
          </div>
          <div className="CompetitionApplyTeamForm-bottom-table-result">
            <h3 id="CompetitionApplyTeamForm-bottom-table-result-key">
              총 결제금액
            </h3>
            <h3>{discountedPrice}원</h3>
          </div>
        </div>
        <div className="CompetitionApplyTeamForm-bottom-table-buttons">
          <button
            id="CompetitionApplyTeamForm-bottom-table-buttons-save"
            onClick={async () => {
              let res = await postCompetitionApply()
              if (res === true) {
                alert('저장되었습니다.')
                navigate('/Profilepage', { state: 'UserApplicationList' })
              }
            }}
          >
            저장하기
          </button>
          <button
            id="CompetitionApplyTeamForm-bottom-table-buttons-register"
            onClick={async () => {
              let res = await postCompetitionApply()
              if (res === true) setPaymentbridgemodal(pre => !pre)
            }}
          >
            신청하기
          </button>
        </div>
      </div>
      {paymentbridgemodal && (
        <Paymentbridgemodal
          closeModal={() => setPaymentbridgemodal(pre => !pre)}
          openNextModal={() => setPaymentmodal(pre => !pre)}
        />
      )}
      {paymentmodal && (
        <Paymentmodal
          closeModal={() => setPaymentmodal(pre => !pre)}
          discountedprice={discountedPrice}
          normalprice={normalPrice}
          competitionApplicationId={competitionApplicationId}
        />
      )}
    </div>
  )
}

export default CompetitionApplyTeamForm
