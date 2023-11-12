import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './admincompetitionlist.css'

import dayjs from 'dayjs'
import {
  getAdminCompetitionList,
  patchAdminCompetitionStatus,
  deleteAdminCompetition,
} from '../apis/api/admin'
import { postLike } from '../apis/api/like'

import { Cookies } from 'react-cookie'
import jwt_decode from 'jwt-decode'

import dropdownicon from '../src_assets/드랍다운아이콘회색.svg'
import searchicon from '../src_assets/검색돋보기아이콘.svg'
import sampleposter from '../src_assets/samplePoster.png'
import likeFull from '../src_assets/heartFull.png'
import like from '../src_assets/heart.png'

const months = [
  '20231',
  '20232',
  '20233',
  '20234',
  '20235',
  '20236',
  '20237',
  '20238',
  '20239',
  '202310',
  '202311',
  '202312',
  '20241',
  '20242',
  '20243',
  '20244',
]
const locationSample = [
  '강원',
  '경기',
  '경남',
  '경북',
  '광주',
  '대구',
  '대전',
  '부산',
  '서울',
  '울산',
  '인천',
  '전남',
  '전북',
  '제주',
  '충남',
  '충북',
]
const week = ['일', '월', '화', '수', '목', '금', '토']

function AdminCompetitionlist() {
  const cookies = new Cookies()
  const [competitions, setCompetitions] = useState([])
  const [dateDropdown, setDateDropdown] = useState(false)
  const [locationDropdown, setLocationDropdown] = useState(false)
  const [lastElement, setLastElement] = useState('')
  const [offset, setOffset] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [location, setLocation] = useState('')
  const [title, setTitle] = useState('')
  const [temTitle, setTemTitle] = useState('')
  const [temDate, setTemDate] = useState('')
  const [activeMonth, setActiveMonth] = useState(0)
  const [activeLocation, setActiveLocation] = useState(0)
  const [userId, setUserId] = useState('')
  const [filters, setFilters] = useState([]) // 사용자가 선택한 필터 조건들

  const offsetRef = useRef()
  const locationRef = useRef()
  const startDateRef = useRef()
  const titleRef = useRef()
  const dateDropdownRef = useRef(null)
  const locationDropdownRef = useRef(null)
  offsetRef.current = offset
  locationRef.current = location
  startDateRef.current = startDate
  titleRef.current = title
  let navigate = useNavigate()
  let todaytime = dayjs()
  const xAccessToken = cookies.get('x-access-token')
  const restApiKey = process.env.REACT_APP_REST_API_KEY
  const redirectUri = process.env.REACT_APP_REDIRECT_URI
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${restApiKey}&redirect_uri=${redirectUri}&response_type=code`

  const s3EndPoint = process.env.REACT_APP_S3_END_POINT

  const observer = useRef(
    new IntersectionObserver(
      async entries => {
        const first = entries[0]
        if (first.isIntersecting) {
          console.log('관측됨')
          await viewGetCompetitionList(
            startDateRef.current,
            offsetRef.current,
            titleRef.current,
            locationRef.current
          )
          await setOffset(preOffset => {
            return preOffset + 1
          })
        }
      },
      { threshold: 1 }
    )
  )

  async function deleteCompetition(id) {
    if (window.confirm('정말로 삭제하시겠습니까?') == false) return
    await deleteAdminCompetition(id)
    window.location.reload()
  }

  async function viewGetCompetitionList(startDate, offset, title, location) {
    let res = await getAdminCompetitionList(startDate, offset, title, location)
    console.log(res)
    let newCompetitions = res.data.result
    setCompetitions(preCompetitions => [...preCompetitions, ...newCompetitions])
    return
  }

  // 좋아요 클릭
  async function clickedLike(competitionId) {
    //로그인 안한 상태
    if (!userId) {
      alert('로그인이 필요합니다')
      window.location.href = kakaoAuthURL
      return
    }

    let res = await postLike(competitionId)

    if (res?.status === 200) {
      let likeCount = res.data.result.competitionLikeCount
      changeCompetitionLiked(likeCount, competitionId)
    }

    return
  }

  // 좋아요 수 변경
  function changeCompetitionLiked(likeCount, competitionId) {
    setCompetitions(prevCompetitions => {
      return prevCompetitions.map(competition => {
        if (competition.id === competitionId) {
          return {
            ...competition,
            competitionLikeCount: likeCount,
            CompetitionLikes: competition.CompetitionLikes.find(
              like => like.userId === userId
            )
              ? competition.CompetitionLikes.filter(
                  like => like.userId !== userId
                )
              : [...competition.CompetitionLikes, { userId }],
          }
        } else {
          return competition
        }
      })
    })
  }

  useEffect(() => {
    const currentElement = lastElement
    const currentObserver = observer.current
    if (currentElement) {
      currentObserver.observe(currentElement)
    }
    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement)
      }
    }
  }, [lastElement, location, startDate, title, offset === 0])

  //외부 클릭시 드랍다운 닫히기
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        dateDropdown &&
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target)
      ) {
        setDateDropdown(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [dateDropdown])

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        locationDropdown &&
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target)
      ) {
        setLocationDropdown(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [locationDropdown])

  // 유저 아이디, 레벨 확인하기
  useEffect(() => {
    let decodedToken
    if (xAccessToken) {
      // 토큰 확인하기
      decodedToken = jwt_decode(xAccessToken)
    }
    // 로그인한 상태
    if (decodedToken) {
      setUserId(decodedToken.userId)
    }
  }, [])

  useEffect(() => {
    console.log(competitions.length)
  }, [competitions])

  useEffect(() => {
    console.log(`offset값은: ${offset}`)
  }, [offset])

  useEffect(() => {
    console.log(`startDate값은: ${startDate}`)
  }, [startDate])

  useEffect(() => {
    console.log(`location값은: ${location}`)
  }, [location])

  useEffect(() => {
    console.log(`title값은: ${title}`)
  }, [title])

  //대회 필터해주는 함수
  const getFilteredAndSortedCompetitions = competitions => {
    // 필터 적용
    let filteredCompetitions = competitions

    // 선택된 필터 조건들을 모두 적용
    filters.forEach(filter => {
      //신청가능 필터
      if (filter === 'active') {
        filteredCompetitions = filteredCompetitions.filter(competition => {
          // 마감기한 조건에 따라 필터링
          if (competition.year === '2030') {
            return
          }

          let opendate = dayjs(competition.registrationDate, 'YYYY-MM-DD')
          let finishdate = dayjs(competition.registrationDeadline, 'YYYY-MM-DD')
          let deadlineDiffM = todaytime.diff(finishdate, 'm')
          let opendateDiffM = todaytime.diff(opendate, 'm')

          if (opendateDiffM >= 0 && deadlineDiffM <= 0) {
            return true
          }
        })
      }
      //얼리버드 필터
      else if (filter === 'early') {
        filteredCompetitions = filteredCompetitions.filter(competition => {
          // 얼리버드 여부
          let opendate = dayjs(competition.registrationDate, 'YYYY-MM-DD')
          let finishdate = dayjs(competition.registrationDeadline, 'YYYY-MM-DD')
          let earlyBirdDate = dayjs(competition.earlyBirdDeadline, 'YYYY-MM-DD')

          let deadlineDiff = todaytime.diff(finishdate, 'm')
          let openDiff = todaytime.diff(opendate, 'm')
          let earlyBirdDiff = todaytime.diff(earlyBirdDate, 'm')

          if (openDiff >= 0 && deadlineDiff <= 0 && earlyBirdDiff < 0) {
            return true
          }
        })
      }
      //간편결제 필터
      else if (filter === 'easypay') {
        filteredCompetitions = filteredCompetitions.filter(competition => {
          // 파트너십 여부
          return competition.isPartnership
        })
      }
      //내 좋아요 필터
      else if (filter === 'likes') {
        // 사용자가 로그인하지 않은 경우, 좋아요 체크하지 않음
        if (!userId) {
          alert('로그인이 필요합니다')
          window.location.href = kakaoAuthURL
          return false
        }

        filteredCompetitions = filteredCompetitions.filter(competition => {
          // 대회의 CompetitionLikes 배열에서 현재 사용자의 ID와 일치하는 객체를 찾아서 좋아요 여부를 반환
          return competition.CompetitionLikes.some(
            like => like.userId === userId
          )
        })
      }
    })

    return filteredCompetitions
  }

  // 필터 목록 변경
  const handleFilter = condition => {
    if (filters.includes(condition)) {
      // 이미 선택된 필터인 경우, 해당 필터를 해제
      setFilters(filters.filter(filter => filter !== condition))
    } else {
      // 선택되지 않은 필터인 경우, 해당 필터를 추가
      setFilters([...filters, condition])
    }
  }

  function listRefresh() {
    // 검색 변수가 바뀔때마다 초기화 해주는 역할.
    setOffset(0)
    setCompetitions([])
  }

  function makingRegisterTag(
    registrationDate,
    registrationDeadline,
    year,
    isPartnership
  ) {
    if (year === '2030') {
      return
    }

    let opendate = dayjs(registrationDate, 'YYYY-MM-DD')
    let finishdate = dayjs(registrationDeadline, 'YYYY-MM-DD')
    let deadlinePlus3Days = finishdate.add(3, 'day') // 신청마감일부터 +3일

    let openDiff = todaytime.diff(opendate, 'd')
    let deadlineDiff = todaytime.diff(finishdate, 'd')
    let deadlineDiffM = todaytime.diff(finishdate, 'm')
    let opendateDiffM = todaytime.diff(opendate, 'm')
    let plus3DaysDeadlineDiffM = todaytime.diff(deadlinePlus3Days, 'm')

    if (opendateDiffM < 0) {
      if (openDiff < 0) {
        return (
          <div className="each-competition-tag-gray">
            <p>신청오픈 D{openDiff}</p>
          </div>
        )
      }
      if (openDiff === 0) {
        return (
          <div className="each-competition-tag-gray">
            <p>신청오픈 D-1</p>
          </div>
        )
      }
    }

    if (deadlineDiffM > 0 && plus3DaysDeadlineDiffM > 0 && isPartnership) {
      // 마감날짜(데드라인)이 지났을경우 && 마감날짜+3(체급조정기간)일이 지났을 경우 && 파트너쉽
      return (
        <div className="each-competition-tag-gray">
          <p>신청마감</p>
        </div>
      )
    }

    if (deadlineDiffM > 0 && !isPartnership) {
      return (
        <div className="each-competition-tag-gray">
          <p>신청마감</p>
        </div>
      )
    }

    if (!(deadlineDiffM > 0) && deadlineDiff === 0) {
      // 오늘이 마감날짜(데드라인)일 경우
      return (
        <div className="each-competition-tag-blue">
          <p>신청마감 D-day</p>
        </div>
      )
    }

    if (deadlineDiffM < 0) {
      return (
        <div className="each-competition-tag-blue">
          <p>신청마감 D{deadlineDiff}</p>
        </div>
      )
    }
  }
  function makingSoloAdjustmentTag(registrationDeadline) {
    let finishdate = dayjs(registrationDeadline, 'YYYY-MM-DD')
    let deadlinePlus3Days = finishdate.add(3, 'day') // 신청마감일부터 +3일
    let deadlineDiffM = todaytime.diff(finishdate, 'm')
    let plus3DaysDeadlineDiffM = todaytime.diff(deadlinePlus3Days, 'm')

    if (deadlineDiffM > 0 && plus3DaysDeadlineDiffM < 0) {
      return (
        <div className="each-competition-tag-green">
          <p>단독출전조정</p>
        </div>
      )
    }
  }

  function makingEarlybirdTag(
    registrationDate,
    registrationDeadline,
    earlyBirdDeadline
  ) {
    let opendate = dayjs(registrationDate, 'YYYY-MM-DD')
    let finishdate = dayjs(registrationDeadline, 'YYYY-MM-DD')
    let earlyBirdDate = dayjs(earlyBirdDeadline, 'YYYY-MM-DD')

    let deadlineDiff = todaytime.diff(finishdate, 'm')
    let openDiff = todaytime.diff(opendate, 'm')
    let earlyBirdDiff = todaytime.diff(earlyBirdDate, 'm')
    if (openDiff >= 0 && deadlineDiff <= 0 && earlyBirdDiff < 0)
      return (
        <div className="each-competition-tag-red">
          <p>얼리버드</p>
        </div>
      )
  }

  function makingPartnerTag() {
    return (
      <div className="each-competition-tag-purple">
        <p>간편결제</p>
      </div>
    )
  }

  //신청마감 & 신청오픈 전 카드 색 변경
  function competitionCardGray(registrationDate, registrationDeadline) {
    let opendate = dayjs(registrationDate, 'YYYY-MM-DD')
    let finishdate = dayjs(registrationDeadline, 'YYYY-MM-DD')
    let deadlinePlus3Days = finishdate.add(3, 'day') // 신청마감일부터 +3일

    let deadlineDiff = todaytime.diff(deadlinePlus3Days, 'm')
    let openDiff = todaytime.diff(opendate, 'm')

    if (deadlineDiff > 0) {
      // 마감날짜(데드라인)이 지났을경우 (전체 그레이)
      return 'competitionCardGray-all'
    }

    if (openDiff < 0) {
      // 현재날짜가 오픈 전일 경우 (버튼만 비활성화)
      return 'competitionCardGray-button'
    }

    return ''
  }

  function competitionParsing(competition) {
    let doreOpenDay = week[new Date(competition.doreOpen).getDay()]
    let registrationDateDay =
      week[new Date(competition.registrationDate).getDay()]
    let registrationDeadLineDay =
      week[new Date(competition.registrationDeadline).getDay()]
    let doreOpen = competition.doreOpen.substr(5, 5).replace('-', '.')
    let registrationDate = competition.registrationDate
      .substr(5, 5)
      .replace('-', '.')
    let registrationDeadline = competition.registrationDeadline
      .substr(5, 5)
      .replace('-', '.')
    let year = competition.registrationDeadline.substr(0, 4)
    let displayNone = year === '2030' ? true : false

    return {
      id: competition.id,
      title: competition.title,
      location: competition.location,
      doreOpen: doreOpen,
      doreOpenDay: doreOpenDay,
      registrationDate: registrationDate,
      registrationDateDay: registrationDateDay,
      registrationDeadline: registrationDeadline,
      registrationDeadlineDay: registrationDeadLineDay,
      status: competition.status,
      posterImage:
        competition.CompetitionPoster != null
          ? `${s3EndPoint}/${competition.CompetitionPoster.imageKey}`
          : sampleposter,
      earlyBirdDeadline:
        competition.earlyBirdDeadline != null
          ? competition.earlyBirdDeadline
          : null,
      likeCount: competition.competitionLikeCount,
      likeUsers: competition.CompetitionLikes,
      year: year,
      displayNone: displayNone,
    }
  }

  function searchEnterPress(e) {
    if (e.key == 'Enter') {
      setTitle(temTitle)
      listRefresh()
    }
  }

  function renderCompetitionList() {
    let filteredCompetitions = getFilteredAndSortedCompetitions(competitions)

    return filteredCompetitions.map((competition, i) => {
      let curcompetition = competitionParsing(competition)
      let cardGray = competitionCardGray(
        competition.registrationDate,
        competition.registrationDeadline
      )
      return (
        <li className="competition-col" key={i}>
          <div className="each-competition-tag">
            {/* 위쪽 태그공간  */}
            {makingEarlybirdTag(
              competition.registrationDate,
              competition.registrationDeadline,
              curcompetition.earlyBirdDeadline
            )}
            {makingRegisterTag(
              competition.registrationDate,
              competition.registrationDeadline,
              curcompetition.year,
              competition.isPartnership
            )}
            {competition.isPartnership ? makingPartnerTag() : ''}
            {competition.isPartnership
              ? makingSoloAdjustmentTag(competition.registrationDeadline)
              : ''}
          </div>
          <div className="each-competition-body">
            <div
              className="each-competition-body-poster"
              onClick={() => {
                window.scrollTo(0, 0)
                navigate(`/competition/${curcompetition.id}`)
              }}
            >
              {' '}
              {/* 카드왼쪽 포스터공간  */}
              <img src={curcompetition.posterImage} alt="대회 포스터"></img>
              <div className="each-competition-body-poster-block"></div>
              <h1>
                {curcompetition.doreOpen}
                <span>({curcompetition.doreOpenDay})</span>
              </h1>
            </div>
            <div className="each-competition-body-desc">
              {' '}
              {/* 카드오른쪽 설명공간 */}
              <div
                className="each-competition-body-desc-top"
                onClick={() => {
                  window.scrollTo(0, 0)
                  navigate(`/admincompetition/info/${curcompetition.id}`)
                }}
              >
                <p>{curcompetition.title}</p>
              </div>
              <div className="each-competition-body-desc-middle">
                <p>{curcompetition.location}</p>
              </div>
              <div className="each-competition-body-desc-bottom">
                <div className="each-competition-body-applyDate">
                  <h3
                    style={
                      curcompetition.displayNone ? { display: 'none' } : {}
                    }
                  >
                    신청기간
                  </h3>
                  <p
                    style={
                      curcompetition.displayNone ? { display: 'none' } : {}
                    }
                  >
                    ~{curcompetition.year}.{curcompetition.registrationDeadline}
                  </p>
                </div>
                <div
                  className="each-competition-body-like"
                  onClick={() => clickedLike(curcompetition.id)}
                >
                  {curcompetition.likeUsers.find(
                    users => users.userId === userId
                  ) ? (
                    <img src={likeFull}></img>
                  ) : (
                    <img src={like}></img>
                  )}
                  <p>{curcompetition.likeCount}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="admin-each-competition-bottom">
            <div className="admin-each-competition-bottom-buttons">
              <button
                style={{ background: 'orange', color: 'black' }}
                onClick={() => {
                  navigate(`/admincompetition/${curcompetition.id}`)
                }}
              >
                대회수정하기
              </button>
              {curcompetition.status === 'ACTIVE' ? (
                <button
                  style={{ background: 'gray', color: 'black' }}
                  onClick={async () => {
                    await patchAdminCompetitionStatus(
                      curcompetition.id,
                      'INACTIVE'
                    )
                    window.location.reload()
                  }}
                >
                  비활성화하기
                </button>
              ) : (
                <button
                  style={{ background: 'red', color: 'black' }}
                  onClick={async () => {
                    await patchAdminCompetitionStatus(
                      curcompetition.id,
                      'ACTIVE'
                    )
                    window.location.reload()
                  }}
                >
                  활성화하기
                </button>
              )}
              <button
                style={{ background: 'lightblue', color: 'black' }}
                onClick={() => {
                  navigate(`/Admincompetition/imageupload/${curcompetition.id}`)
                }}
              >
                포스터업로드하기
              </button>
              <button
                style={{ background: 'pink', color: 'black' }}
                onClick={() => {
                  navigate(`/paymentinfo/${curcompetition.id}`)
                }}
              >
                결제정보
              </button>
              <button
                style={{ background: 'yellow', color: 'black' }}
                onClick={() => {
                  navigate(`/Admincompetition/csv/${curcompetition.id}`)
                }}
              >
                참가선수명단
              </button>
              <button
                style={{ background: 'purple', color: 'yellowGreen' }}
                onClick={() => {
                  deleteCompetition(curcompetition.id)
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </li>
      )
    })
  }

  return (
    <div className="competition-schedule-wrapper">
      <div className="competition-searchzone">
        <div
          className="competition-searchzone-option"
          onClick={() => setDateDropdown(pre => !pre)}
          ref={dateDropdownRef}
        >
          <p id={startDate === '' ? '' : 'competition-searchzone-black'}>
            {startDate === '' ? '날짜' : `${temDate}월`}
          </p>
          <img src={dropdownicon} alt="아래 화살표" />
          {dateDropdown ? (
            <ul>
              <li
                value=""
                onClick={() => {
                  setStartDate('')
                  listRefresh()
                  setActiveMonth('')
                }}
              >
                전체
              </li>
              {months.map(element => {
                let year = element.slice(0, 4)
                element = element.slice(4, 6)
                let renderElement =
                  year === '2024' ? `24년  ${element}월` : `23년  ${element}월`
                return (
                  <li
                    id={
                      element === activeMonth
                        ? 'competition-searchzone-active'
                        : ''
                    }
                    value={element}
                    onClick={() => {
                      if (year === '2024') setStartDate(`2024-${element}-01`)
                      else setStartDate(`2023-${element}-01`)
                      setTemDate(element)
                      listRefresh()
                      setActiveMonth(element)
                    }}
                  >
                    {renderElement}
                  </li>
                )
              })}
            </ul>
          ) : (
            ''
          )}
        </div>
        <div
          className="competition-searchzone-option"
          onClick={() => setLocationDropdown(pre => !pre)}
          ref={locationDropdownRef}
        >
          <p id={location === '' ? '' : 'competition-searchzone-black'}>
            {location === '' ? '지역' : location}
          </p>
          <img src={dropdownicon} alt="아래 화살표" />
          {locationDropdown ? (
            <ul>
              <li
                value=""
                onClick={() => {
                  setLocation('')
                  listRefresh()
                  setActiveLocation('')
                }}
              >
                전체
              </li>
              {locationSample.map(element => {
                return (
                  <li
                    id={
                      element === activeLocation
                        ? 'competition-searchzone-active'
                        : ''
                    }
                    value={element}
                    onClick={() => {
                      setLocation(element)
                      listRefresh()
                      setActiveLocation(element)
                    }}
                  >
                    {element}
                  </li>
                )
              })}
            </ul>
          ) : (
            ''
          )}
        </div>
        <div className="competition-searchzone-searchbar">
          <input
            placeholder="대회명 직접 검색하기"
            value={temTitle}
            onKeyDown={e => searchEnterPress(e)}
            onChange={e => {
              setTemTitle(e.target.value)
            }}
          />
          <img
            src={searchicon}
            alt="돋보기아이콘"
            onClick={() => {
              setTitle(temTitle)
              listRefresh()
            }}
          />
        </div>
      </div>
      <div className="competition-filter">
        <label>
          <input
            type="checkbox"
            value="active"
            checked={filters.includes('active')}
            onChange={() => handleFilter('active')}
          />
          <span className="filter-active">신청가능</span>
        </label>
        <label>
          <input
            type="checkbox"
            value="early"
            checked={filters.includes('early')}
            onChange={() => handleFilter('early')}
          />
          <span className="filter-early">얼리버드</span>
        </label>
        <label>
          <input
            type="checkbox"
            value="easypay"
            checked={filters.includes('easypay')}
            onChange={() => handleFilter('easypay')}
          />
          <span className="filter-easypay">간편결제</span>
        </label>
        <label>
          <input
            type="checkbox"
            value="likes"
            checked={filters.includes('likes')}
            onChange={() => handleFilter('likes')}
          />
          <span className="filter-likes">
            좋아요 <img src={likeFull}></img>
          </span>
        </label>
      </div>
      <div className="competition-list">
        <ul className="competition-row">
          {renderCompetitionList()}
          <div
            style={{ fontsize: '200px', margin: '0 2rem' }}
            ref={setLastElement}
          >
            대회가 모두 로딩되었습니다.
          </div>
        </ul>
      </div>
    </div>
  )
}

export default AdminCompetitionlist
