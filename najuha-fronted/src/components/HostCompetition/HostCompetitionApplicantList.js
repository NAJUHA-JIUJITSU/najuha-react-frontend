import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import dropdownicon from '../../src_assets/드랍다운아이콘.svg'
import { getCompetitionDetail } from '../../apis/api/competition'
import { getHostCompetitionApplicationList } from '../../apis/api/host'
import { CsvToHtmlTable } from 'react-csv-to-table'
import './HostCompetitionApplicantList.css'

const jsonToCsv = jsonData => {
  try {
    if (jsonData.length === 0) {
      return ''
    }
    // 1-1. json 데이터 취득
    const json_array = jsonData

    let csv_string = ''

    // 3. 제목 추출: json_array의 첫번째 요소(객체)에서 제목(머릿글)으로 사용할 키값을 추출
    const titles = Object.keys(json_array[0])

    // 4. CSV문자열에 제목 삽입: 각 제목은 컴마로 구분, 마지막 제목은 줄바꿈 추가
    titles.forEach((title, index) => {
      csv_string += index !== titles.length - 1 ? `${title},` : `${title}\r\n`
    })

    // 5. 내용 추출: json_array의 모든 요소를 순회하며 '내용' 추출
    json_array.forEach((content, index) => {
      let row = '' // 각 인덱스에 해당하는 '내용'을 담을 행

      for (let title in content) {
        // for in 문은 객체의 키값만 추출하여 순회함.
        // 행에 '내용' 할당: 각 내용 앞에 컴마를 삽입하여 구분, 첫번째 내용은 앞에 컴마X
        row += row === '' ? `${content[title]}` : `,${content[title]}`
      }

      // CSV 문자열에 '내용' 행 삽입: 뒤에 줄바꿈(\r\n) 추가, 마지막 행은 줄바꿈X
      csv_string += index !== json_array.length - 1 ? `${row}\r\n` : `${row}`
    })

    // 6. CSV 문자열 반환: 최종 결과물(string)
    return csv_string
  } catch (err) {
    throw new Error('jsonToCsv() failed')
  }
}

function CompetitionApplicantList() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [genderDropdown, setGenderDropdown] = useState(false)
  const [uniformDropdown, setUniformDropdown] = useState(false)
  const [divisionDropdown, setDivisionDropdown] = useState(false)
  const [beltDropdown, setBeltDropdown] = useState(false)
  const [weightDropdown, setWeightDropdown] = useState(false)
  const [competition, setCompetition] = useState(null)
  const [fillteredcompetition, setFillteredCompetition] = useState(null)
  const [competitionApplication, setCompetitionApplication] = useState({
    gender: '',
    uniform: '',
    divisionName: '',
    belt: '',
    weight: '',
  })
  const [numofApplicant, setNumofApplicant] = useState(0)
  const [applicantRawData, setApplicantRawData] = useState([])
  const [csvData, setCsvData] = useState([])

  // 객체로 온 참가자명단에는 성명이랑 생년월일이 중복이 값이 있어 이거를 없애는 함수를 만들고싶어요 근데 성명은 같은데 생년월일이 다른 참가자도 있어요 이것도 카운트해야해
  const countApplicant = data => {
    let tmp = {}
    let num = 0

    for (let i = 0; i < data.length; i++) {
      if (tmp[data[i].playerName] === undefined) {
        tmp[data[i].playerName] = [data[i].playerBirth]
        num++
      } else {
        if (!tmp[data[i].playerName].includes(data[i].playerBirth)) {
          tmp[data[i].playerName].push(data[i].playerBirth)
          num++
        }
      }
    }
    return num
  }

  const convertCsvHeader = csvData => {
    return csvData.replace(
      /playerName|uniform|gender|divisionName|belt|weight|team/g,
      function (matched) {
        switch (matched) {
          case 'playerName':
            return '선수명'
          case 'playerBirth':
            return '생년월일'
          case 'uniform':
            return '기/노기'
          case 'gender':
            return '성별'
          case 'divisionName':
            return '부문'
          case 'belt':
            return '벨트'
          case 'weight':
            return '체급'
          case 'team':
            return '소속팀'
        }
      }
    )
  }

  const getCsvData = async () => {
    const res = await getHostCompetitionApplicationList(id)
    if (res && res.data && res.data.result) {
      setNumofApplicant(countApplicant(res.data.result))
      setApplicantRawData(res.data.result)
      setCsvData(convertCsvHeader(jsonToCsv(res.data.result)))
    }
  }

  const filterApplicant = copyCompetitionApplication => {
    const rawData = applicantRawData
    let filteredData = []
    const rawDataKeys = Object.keys(rawData[0])

    for (let i = 0; i < rawData.length; i++) {
      let isFiltered = false
      for (let j = 0; j < rawDataKeys.length; j++) {
        if (
          rawData[i][rawDataKeys[j]] !==
            copyCompetitionApplication[rawDataKeys[j]] &&
          copyCompetitionApplication[rawDataKeys[j]] !== '' &&
          copyCompetitionApplication[rawDataKeys[j]]
        ) {
          isFiltered = true
          break
        }
      }
      if (!isFiltered) {
        filteredData.push(rawData[i])
      }
    }
    setCsvData(convertCsvHeader(jsonToCsv(filteredData)))
  }

  useEffect(() => {
    getCsvData()
  }, [])

  useEffect(() => {
    getCompetition(id)
  }, [])

  useEffect(() => {}, [competition])

  useEffect(() => {}, [competitionApplication])

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
    let copyCompetitionApplication = JSON.parse(
      JSON.stringify(competitionApplication)
    )
    copyCompetitionApplication[key] = value
    setCompetitionApplication(copyCompetitionApplication)
    return copyCompetitionApplication
  }

  const constfillteringcompetition = (object, value, part) => {
    let newfillteredcompetition = object.filter(
      div => div.constantFactor[part] == value
    )
    return newfillteredcompetition
  }

  const varFillteringCompetition = (object, value, part) => {
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
            let copyCompetitionApplication = changeCompetitionApplication(
              el,
              'gender'
            )
            stateRefresh('gender', copyCompetitionApplication)
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
            let copyCompetitionApplication = changeCompetitionApplication(
              el,
              'uniform'
            )
            stateRefresh('uniform', copyCompetitionApplication)
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
            let copyCompetitionApplication = changeCompetitionApplication(
              el,
              'divisionName'
            )
            stateRefresh('divisionName', copyCompetitionApplication)
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
            let copyCompetitionApplication = changeCompetitionApplication(
              el,
              'belt'
            )
            stateRefresh('belt', copyCompetitionApplication)
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
    newfillteredcompetition = varFillteringCompetition(
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
            let copyCompetitionApplication = changeCompetitionApplication(
              el,
              'weight'
            )
            stateRefresh('weight', copyCompetitionApplication)
          }}
        >
          {el}
        </li>
      )
    })
  }

  function stateRefresh(key, copyCompetitionApplication) {
    if (key == 'gender') {
      copyCompetitionApplication.uniform = ''
      copyCompetitionApplication.divisionName = ''
      copyCompetitionApplication.belt = ''
      copyCompetitionApplication.weight = ''
      setCompetitionApplication(copyCompetitionApplication)
    } else if (key == 'uniform') {
      copyCompetitionApplication.divisionName = ''
      copyCompetitionApplication.belt = ''
      copyCompetitionApplication.weight = ''
      setCompetitionApplication(copyCompetitionApplication)
    } else if (key == 'divisionName') {
      copyCompetitionApplication.belt = ''
      copyCompetitionApplication.weight = ''
      setCompetitionApplication(copyCompetitionApplication)
    } else if (key == 'belt') {
      copyCompetitionApplication.weight = ''
      setCompetitionApplication(copyCompetitionApplication)
    }
    filterApplicant(copyCompetitionApplication)
  }

  return (
    <div className="HostCompetitionApplicationList-filter-wrapper">
      <div className="HostCompetitionApplicationList-filter-top">
        <div className="HostCompetitionApplicationList-filter-top-table">
          <div className="HostCompetitionApplicationList-filter-top-table-child1">
            <ul className="HostCompetitionApplicationList-filter-top-table-column">
              <li>성별</li>
              <li>기/노기</li>
            </ul>
            <ul className="HostCompetitionApplicationList-filter-top-table-row">
              {competitionApplication.gender != '' ? ( // 본인값있으면 본인값 보여주고
                <li onClick={genderDropdownToggle}>
                  <p style={{ color: 'black' }}>
                    {competitionApplication.gender == 'male' ? '남자' : '여자'}
                  </p>
                  <img
                    className="HostCompetitionApplicationList-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {genderDropdown ? (
                    <ul id="HostCompetitionApplicationList-filter-top-table-row-dropdown">
                      {renderGenderOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : (
                // 없으면, 앞에 값(생년월일) 유무에 따라 유: 선택할수있는 드랍다운, 무: 디스에이블
                <li onClick={genderDropdownToggle}>
                  성별{' '}
                  <img
                    className="HostCompetitionApplicationList-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {genderDropdown ? (
                    <ul id="HostCompetitionApplicationList-filter-top-table-row-dropdown">
                      {renderGenderOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              )}

              {competitionApplication.uniform != '' ? ( // 본인값있으면 본인값 보여주고
                <li
                  onClick={uniformDropdownToggle}
                  id="HostCompetitionApplicationList-filter-top-table-ginogi"
                >
                  <p style={{ color: 'black' }}>
                    {competitionApplication.uniform == 'gi' ? '기' : '노기'}
                  </p>{' '}
                  <img
                    className="HostCompetitionApplicationList-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {uniformDropdown ? (
                    <ul id="HostCompetitionApplicationList-filter-top-table-row-dropdown">
                      {renderUniformOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : competitionApplication.gender != '' ? ( // 없으면 앞에 값(성별) 유무에따라 유: 선택할수있는 드랍다운, 무: 디스에이블
                <li
                  onClick={uniformDropdownToggle}
                  id="HostCompetitionApplicationList-filter-top-table-ginogi"
                >
                  기/노기{' '}
                  <img
                    className="HostCompetitionApplicationList-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {uniformDropdown ? (
                    <ul id="HostCompetitionApplicationList-filter-top-table-row-dropdown">
                      {renderUniformOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : (
                <li
                  className="HostCompetitionApplicationList-filter-top-table-row-disable"
                  id="HostCompetitionApplicationList-filter-top-table-ginogi"
                >
                  기/노기{' '}
                  <img
                    className="HostCompetitionApplicationList-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                </li>
              )}
            </ul>
          </div>
          <div className="HostCompetitionApplicationList-filter-top-table-child2">
            <ul className="HostCompetitionApplicationList-filter-top-table-column">
              <li>부문</li>
              <li>벨트</li>
              <li>체급</li>
            </ul>
            <ul className="HostCompetitionApplicationList-filter-top-table-row">
              {competitionApplication.divisionName != '' ? ( // 본인값있으면 본인값 보여주고
                <li
                  onClick={divisionDropdownToggle}
                  id="HostCompetitionApplicationList-filter-top-table-division"
                >
                  <p style={{ color: 'black' }}>
                    {competitionApplication.divisionName}
                  </p>
                  <img
                    className="HostCompetitionApplicationList-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {divisionDropdown ? (
                    <ul id="HostCompetitionApplicationList-filter-top-table-row-dropdown">
                      {renderDivisionNameOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : competitionApplication.uniform != '' ? ( // 없으면 앞에(유니폼) 값 유무에따라 유: 선택할 수 있는 드랍다운, 무: 디스에이블
                <li
                  onClick={divisionDropdownToggle}
                  id="HostCompetitionApplicationList-filter-top-table-division"
                >
                  부문
                  <img
                    className="HostCompetitionApplicationList-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {divisionDropdown ? (
                    <ul id="HostCompetitionApplicationList-filter-top-table-row-dropdown">
                      {renderDivisionNameOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : (
                <li
                  className="HostCompetitionApplicationList-filter-top-table-row-disable"
                  id="HostCompetitionApplicationList-filter-top-table-division"
                >
                  부문{' '}
                  <img
                    className="HostCompetitionApplicationList-filter-top-table-row-dropdown-icon"
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
                    className="HostCompetitionApplicationList-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {beltDropdown ? (
                    <ul id="HostCompetitionApplicationList-filter-top-table-row-dropdown">
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
                    className="HostCompetitionApplicationList-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {beltDropdown ? (
                    <ul id="HostCompetitionApplicationList-filter-top-table-row-dropdown">
                      {renderBeltOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : (
                <li className="HostCompetitionApplicationList-filter-top-table-row-disable">
                  벨트{' '}
                  <img
                    className="HostCompetitionApplicationList-filter-top-table-row-dropdown-icon"
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
                    className="HostCompetitionApplicationList-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {weightDropdown ? (
                    <ul id="HostCompetitionApplicationList-filter-top-table-row-dropdown">
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
                    className="HostCompetitionApplicationList-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {weightDropdown ? (
                    <ul id="HostCompetitionApplicationList-filter-top-table-row-dropdown">
                      {renderWeightOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : (
                <li className="HostCompetitionApplicationList-filter-top-table-row-disable">
                  체급
                  <img
                    className="HostCompetitionApplicationList-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="HostCompetitionApplicationList-filter-bottom-title">
        <h3>신청자 명단</h3>
        <h3>
          <span>부문갯수</span> {`${applicantRawData.length}`}개
          <br />
          <span>참가자수</span> {`${numofApplicant}`}명
        </h3>
      </div>
      <div className="HostCompetitionApplicantList-wrapper">
        <div className="HostCompetitionApplicantList-csv-wrapper">
          {csvData.length > 0 && (
            <CsvToHtmlTable
              data={csvData}
              csvDelimiter=","
              tableClassName="HostCompetitionApplicantList-csv"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CompetitionApplicantList
