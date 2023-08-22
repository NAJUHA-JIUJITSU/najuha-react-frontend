import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './competitionlist.css'
import dropdownicon from '../src_assets/드랍다운아이콘회색.svg'
import searchicon from '../src_assets/검색돋보기아이콘.svg'
import sampleposter from '../src_assets/samplePoster.png'
import likeFull from '../src_assets/heartFull.png'
import like from '../src_assets/heart.png'
import viewCnt from '../src_assets/viewCnt.png'
import dayjs from 'dayjs'
import {
  getCompetitionList,
  postCompetitionListViewCnt,
} from '../apis/api/competition'
import { postLike } from '../apis/api/like'
import { Cookies } from 'react-cookie'
import jwt_decode from 'jwt-decode'

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
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

function Competitionlist() {
  const [competitions, setCompetitions] = useState([])
  const [lastElement, setLastElement] = useState('')
  const [offset, setOffset] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [temDate, setTemDate] = useState('')
  const [location, setLocation] = useState('')
  const [dateDropdown, setDateDropdown] = useState(false)
  const [locationDropdown, setLocationDropdown] = useState(false)
  const [title, setTitle] = useState('')
  const [temTitle, setTemTitle] = useState('')
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
  const cookies = new Cookies()

  const [decodedToken, setDecodedToken] = useState('')
  const nowTime = new Date()
  let tokenTime = new Date(0)

  const xAccessToken = cookies.get('x-access-token')
  const restApiKey = process.env.REACT_APP_REST_API_KEY
  const redirectUri = process.env.REACT_APP_REDIRECT_URI
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${restApiKey}&redirect_uri=${redirectUri}&response_type=code`

  const observer = useRef(
    new IntersectionObserver(
      async entries => {
        const first = entries[0]
        if (first.isIntersecting) {
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

  async function viewGetCompetitionList(startDate, offset, title, location) {
    let res = await getCompetitionList(startDate, offset, title, location)
    if (res?.status === 200) {
      let newCompetitions = res.data.result
      setCompetitions(competitions => [...competitions, ...newCompetitions])
    }
    return
  }

  async function postViewCompetitionListPage() {
    let res = await postCompetitionListViewCnt()

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
    //로그인 한 상태 + 토큰만료시간 지남
    else {
      tokenTime = new Date(decodedToken.exp * 1000) // 토큰만료시간
      tokenTime.setMinutes(tokenTime.getMinutes() - 15) // 토큰만료시간에 15분 빼기
      if (nowTime >= tokenTime) {
        cookies.remove('x-access-token', { path: '/' })
        alert('재로그인이 필요합니다.')
        window.location.href = kakaoAuthURL
      }
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

  // 유저 아이디, 레벨 확인하기, 페이지 조회수 증가
  useEffect(() => {
    let decodedToken
    if (xAccessToken) {
      // 토큰 확인하기
      decodedToken = jwt_decode(xAccessToken)
    }
    // 로그인한 상태
    if (decodedToken) {
      setUserId(decodedToken.userId)
      setDecodedToken(decodedToken)
    }

    // 조회수 증가
    postViewCompetitionListPage()
  }, [])

  function listRefresh() {
    // 검색 변수가 바뀔때마다 초기화 해주는 역할.
    setOffset(0)
    setCompetitions([])
  }

  function makingRegisterTag(registrationDate, registrationDeadline, year) {
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

    if (deadlineDiffM > 0 && plus3DaysDeadlineDiffM > 0) {
      // 마감날짜(데드라인)이 지났을경우 && 마감날짜+3(체급조정기간)일이 지났을 경우
      return (
        <div className="each-competition-tag-gray">
          <p>신청마감</p>
        </div>
      )
    }

    if (deadlineDiff === 0) {
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

  function makingPartnerTag(isPartnership) {
    if (isPartnership) {
      return (
        <div className="each-competition-tag-purple">
          <p>간편결제</p>
        </div>
      )
    }
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
    let viewCnt = competition.CompetitionViewCnts[0]?.viewCnt

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
      posterImage:
        competition.CompetitionPoster != null
          ? competition.CompetitionPoster.imageUrl
          : sampleposter,
      earlyBirdDeadline:
        competition.earlyBirdDeadline != null
          ? competition.earlyBirdDeadline
          : null,
      likeCount: competition.competitionLikeCount,
      likeUsers: competition.CompetitionLikes,
      year: year,
      displayNone: displayNone,
      viewCnt: viewCnt,
    }
  }

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
        } else {
          tokenTime = new Date(decodedToken.exp * 1000) // 토큰만료시간
          tokenTime.setMinutes(tokenTime.getMinutes() - 15) // 토큰만료시간에 15분 빼기
          if (nowTime >= tokenTime) {
            cookies.remove('x-access-token', { path: '/' })
            alert('재로그인이 필요합니다.')
            window.location.href = kakaoAuthURL
            return false
          }
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

  function renderCompetitionList() {
    let filteredCompetitions = getFilteredAndSortedCompetitions(competitions)

    return filteredCompetitions.map((competition, i) => {
      let curcompetition = competitionParsing(competition)

      let cardGray = competitionCardGray(
        competition.registrationDate,
        competition.registrationDeadline
      )

      return (
        <li className="competition-col" key={competition.id}>
          <div className="each-competition-tag">
            {' '}
            {/* 위쪽 태그공간  */}
            {makingEarlybirdTag(
              competition.registrationDate,
              competition.registrationDeadline,
              curcompetition.earlyBirdDeadline
            )}
            {makingRegisterTag(
              competition.registrationDate,
              competition.registrationDeadline,
              curcompetition.year
            )}
            {makingPartnerTag(competition.isPartnership)}
            {makingSoloAdjustmentTag(competition.registrationDeadline)}
          </div>
          <div className="each-competition-body" id={cardGray}>
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
                  // postCompetitionViewCnt(curcompetition.id)
                  navigate(`/competition/${curcompetition.id}`)
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
                    ~{curcompetition.year.substr(2)}.
                    {curcompetition.registrationDeadline}
                  </p>
                </div>
                <div className="each-competition-body-bottom-right">
                  <div className="each-competition-body-view">
                    <img src={viewCnt}></img>
                    <p>{curcompetition.viewCnt ? curcompetition.viewCnt : 0}</p>
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
          </div>
        </li>
      )
    })
  }

  function searchEnterPress(e) {
    if (e.key === 'Enter') {
      setTitle(temTitle)
      listRefresh()
    }
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

  return (
    <div className="competition-schedule-wrapper">
      <div className="competition-searchzone">
        <div
          className="competition-searchzone-option"
          onClick={() => setDateDropdown(pre => !pre)}
          ref={dateDropdownRef}
        >
          <p id={startDate === '' ? '' : 'competition-searchzone-black'}>
            {startDate === '' ? '날짜' : `${temDate}월~`}
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
                return (
                  <li
                    id={
                      element === activeMonth
                        ? 'competition-searchzone-active'
                        : ''
                    }
                    value={element}
                    onClick={() => {
                      setStartDate(`2023-${element}-01`)
                      setTemDate(element)
                      listRefresh()
                      setActiveMonth(element)
                    }}
                  >
                    {element}월
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

export default Competitionlist
