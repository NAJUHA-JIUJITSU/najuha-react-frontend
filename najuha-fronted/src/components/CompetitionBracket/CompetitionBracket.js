import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import dropdownicon from '../../src_assets/드랍다운아이콘.svg'
import { getCompetitionDetail } from '../../apis/api/competition'
import { getCompetitionBrackets } from '../../apis/api/competition'
import './CompetitionBracket.css'
import Papa from 'papaparse'
import { Tree } from 'react-tree-graph'
import 'react-tree-graph/dist/style.css'

const PlayerNode = ({ player }) => {
  return (
    <>
      <text x="0" y="-22" textAnchor="end" fontSize="14px">
        {player.playerName}
      </text>
      <text x="0" y="-8" textAnchor="end" fontSize="12px">
        {player.team}
      </text>
    </>
  )
}

const getTreeData = (players, depth) => {
  if (players.length === 0) {
    return null
  }

  if (players.length === 1 && depth === 0) {
    return {
      children: [
        {
          label: <PlayerNode player={players[0]} />,
        },
      ],
    }
  } else if (players.length === 1) {
    return {
      children: [
        {
          children: [
            {
              children: [
                {
                  label: <PlayerNode player={players[0]} />,
                },
              ],
            },
          ],
        },
      ],
    }
  }

  const mid = Math.floor(players.length / 2)
  const leftPlayers = players.slice(0, mid)
  const rightPlayers = players.slice(mid)
  return {
    children: [
      getTreeData(leftPlayers, ++depth),
      getTreeData(rightPlayers, ++depth),
    ],
  }
}

function CompetitionBracket() {
  const { id } = useParams()
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
  const [brackets, setBrackets] = useState([])
  const [tmpBrackets, setTmpBrackets] = useState([])

  const filterApplicant = copyCompetitionApplication => {
    let filtered = []

    const filter = JSON.parse(JSON.stringify(copyCompetitionApplication))

    if (filter.gender)
      filter.gender = filter.gender === 'male' ? '남자' : '여자'
    if (filter.uniform) filter.uniform = filter.uniform === 'gi' ? '기' : '노기'

    for (let b of brackets) {
      if (
        (b.gender.includes(filter.gender) || !filter.gender) &&
        (b.uniform.includes(filter.uniform) || !filter.uniform) &&
        (b.divisionName.includes(filter.divisionName) ||
          !filter.divisionName) &&
        (b.belt.includes(filter.belt) || !filter.belt) &&
        (b.weight.includes(filter.weight) || !filter.weight)
      ) {
        filtered.push(b)
      }
    }
    setTmpBrackets(filtered)
  }

  useEffect(() => {
    getCompetition(id)
    getBrackets(id)
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

  const getBrackets = async id => {
    const res = await getCompetitionBrackets(id)
    if (res?.status === 200) {
      const brackets = res.data.result.brackets
      setBrackets(brackets)
      setTmpBrackets(brackets)
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

  const elbowPathFunc = (x1, y1, x2, y2) => {
    return `M${x1},${y1} V${y2} H${x2}`
  }

  const treeDepth = treeData => {
    if (!treeData || !treeData.children) {
      return 0
    }

    let maxDepth = 0
    treeData.children.forEach(child => {
      maxDepth = Math.max(maxDepth, treeDepth(child))
    })

    return maxDepth + 1
  }

  const dynamicWidth = group => {
    if (group.length === 1 || group.length === 2) {
      return 200
    }
    let maxWordLen = group.reduce((acc, cur) => {
      let max = Math.max(acc, cur.team.length)
      max = Math.max(max, cur.playerName.length)
      return max
    }, 10)
    const depth = treeDepth(getTreeData(group)) || 1

    const minWidthPerLevel = maxWordLen * 14

    let width = minWidthPerLevel * depth

    return width / 4
  }

  const dynamicHeight = group => {
    if (group.length < 4) {
      return 200
    }
    return group.length * 60
  }

  const getLeftGroup = group => {
    if (group.length === 1) {
      return group
    }
    const mid = Math.floor(group.length / 2)
    return group.slice(0, mid)
  }

  const getRightGroup = group => {
    if (group.length === 1) {
      return group
    }
    const mid = Math.floor(group.length / 2)
    return group.slice(mid)
  }

  return (
    <div className="CompetitionBracket-filter-wrapper">
      <div className="CompetitionBracket-filter-top">
        <h1 className="CompetitionBracket-filter-title">
          {competition?.title}
        </h1>
        <div className="CompetitionBracket-filter-top-table">
          <div className="CompetitionBracket-filter-top-table-child1">
            <ul className="CompetitionBracket-filter-top-table-column">
              <li>성별</li>
              <li>기/노기</li>
            </ul>
            <ul className="CompetitionBracket-filter-top-table-row">
              {competitionApplication.gender != '' ? ( // 본인값있으면 본인값 보여주고
                <li onClick={genderDropdownToggle}>
                  <p style={{ color: 'black' }}>
                    {competitionApplication.gender == 'male' ? '남자' : '여자'}
                  </p>
                  <img
                    className="CompetitionBracket-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {genderDropdown ? (
                    <ul id="CompetitionBracket-filter-top-table-row-dropdown">
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
                    className="CompetitionBracket-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {genderDropdown ? (
                    <ul id="CompetitionBracket-filter-top-table-row-dropdown">
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
                  id="CompetitionBracket-filter-top-table-ginogi"
                >
                  <p style={{ color: 'black' }}>
                    {competitionApplication.uniform == 'gi' ? '기' : '노기'}
                  </p>{' '}
                  <img
                    className="CompetitionBracket-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {uniformDropdown ? (
                    <ul id="CompetitionBracket-filter-top-table-row-dropdown">
                      {renderUniformOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : competitionApplication.gender != '' ? ( // 없으면 앞에 값(성별) 유무에따라 유: 선택할수있는 드랍다운, 무: 디스에이블
                <li
                  onClick={uniformDropdownToggle}
                  id="CompetitionBracket-filter-top-table-ginogi"
                >
                  기/노기{' '}
                  <img
                    className="CompetitionBracket-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {uniformDropdown ? (
                    <ul id="CompetitionBracket-filter-top-table-row-dropdown">
                      {renderUniformOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : (
                <li
                  className="CompetitionBracket-filter-top-table-row-disable"
                  id="CompetitionBracket-filter-top-table-ginogi"
                >
                  기/노기{' '}
                  <img
                    className="CompetitionBracket-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                </li>
              )}
            </ul>
          </div>
          <div className="CompetitionBracket-filter-top-table-child2">
            <ul className="CompetitionBracket-filter-top-table-column">
              <li>부문</li>
              <li>벨트</li>
              <li>체급</li>
            </ul>
            <ul className="CompetitionBracket-filter-top-table-row">
              {competitionApplication.divisionName != '' ? ( // 본인값있으면 본인값 보여주고
                <li
                  onClick={divisionDropdownToggle}
                  id="CompetitionBracket-filter-top-table-division"
                >
                  <p style={{ color: 'black' }}>
                    {competitionApplication.divisionName}
                  </p>
                  <img
                    className="CompetitionBracket-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {divisionDropdown ? (
                    <ul id="CompetitionBracket-filter-top-table-row-dropdown">
                      {renderDivisionNameOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : competitionApplication.uniform != '' ? ( // 없으면 앞에(유니폼) 값 유무에따라 유: 선택할 수 있는 드랍다운, 무: 디스에이블
                <li
                  onClick={divisionDropdownToggle}
                  id="CompetitionBracket-filter-top-table-division"
                >
                  부문
                  <img
                    className="CompetitionBracket-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {divisionDropdown ? (
                    <ul id="CompetitionBracket-filter-top-table-row-dropdown">
                      {renderDivisionNameOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : (
                <li
                  className="CompetitionBracket-filter-top-table-row-disable"
                  id="CompetitionBracket-filter-top-table-division"
                >
                  부문{' '}
                  <img
                    className="CompetitionBracket-filter-top-table-row-dropdown-icon"
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
                    className="CompetitionBracket-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {beltDropdown ? (
                    <ul id="CompetitionBracket-filter-top-table-row-dropdown">
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
                    className="CompetitionBracket-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {beltDropdown ? (
                    <ul id="CompetitionBracket-filter-top-table-row-dropdown">
                      {renderBeltOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : (
                <li className="CompetitionBracket-filter-top-table-row-disable">
                  벨트{' '}
                  <img
                    className="CompetitionBracket-filter-top-table-row-dropdown-icon"
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
                    className="CompetitionBracket-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {weightDropdown ? (
                    <ul id="CompetitionBracket-filter-top-table-row-dropdown">
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
                    className="CompetitionBracket-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                  {weightDropdown ? (
                    <ul id="CompetitionBracket-filter-top-table-row-dropdown">
                      {renderWeightOptionUI()}
                    </ul>
                  ) : (
                    ''
                  )}
                </li>
              ) : (
                <li className="CompetitionBracket-filter-top-table-row-disable">
                  체급
                  <img
                    className="CompetitionBracket-filter-top-table-row-dropdown-icon"
                    src={dropdownicon}
                  />
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <h3 className="CompetitionBracket-filter-bottom-title">대진표</h3>
      <div>
        {tmpBrackets.map((bracket, index) => (
          <div className="bracket-container" key={index}>
            <div className="bracket-title">{bracket.division}</div>
            <div className="bracket-rapper">
              {bracket.players.length > 8 ? (
                <>
                  <div className="bracket-left">
                    <Tree
                      data={getTreeData(getLeftGroup(bracket.players), 0)}
                      direction={'rtl'}
                      nodeShape={'none'}
                      labelProp="label"
                      height={dynamicHeight(getLeftGroup(bracket.players))}
                      width={dynamicWidth(bracket.players)}
                      svgProps={{
                        strokeWidth: 1,
                      }}
                      pathFunc={elbowPathFunc}
                      margins={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    />
                  </div>
                  <div className="bracket-right" key={index}>
                    <Tree
                      data={getTreeData(getRightGroup(bracket.players), 0)}
                      direction={'ltr'}
                      nodeShape={'none'}
                      labelProp="label"
                      height={dynamicHeight(getRightGroup(bracket.players))}
                      width={dynamicWidth(bracket.players)}
                      svgProps={{
                        strokeWidth: 1,
                      }}
                      pathFunc={elbowPathFunc}
                      margins={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    />
                  </div>
                </>
              ) : (
                <div className="bracket-left-only">
                  <Tree
                    data={getTreeData(bracket.players, 0)}
                    direction={'rtl'}
                    nodeShape={'none'}
                    labelProp="label"
                    height={dynamicHeight(bracket.players)}
                    width={dynamicWidth(bracket.players)}
                    svgProps={{
                      strokeWidth: 1,
                    }}
                    pathFunc={elbowPathFunc}
                    margins={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompetitionBracket
