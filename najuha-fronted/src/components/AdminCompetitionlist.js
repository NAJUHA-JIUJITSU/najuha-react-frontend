import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './admincompetitionlist.css'

import dayjs from 'dayjs'

import { Cookies } from 'react-cookie'

import dropdownicon from '../src_assets/드랍다운아이콘회색.svg'
import searchicon from '../src_assets/검색돋보기아이콘.svg'
import sampleposter from '../src_assets/samplePoster.png'

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

function AdminCompetitionlist() {
  const cookies = new Cookies()
  const [competitions, setCompetitions] = useState([])
  const [dateDropdown, setDateDropdown] = useState(false)
  const [locationDropdown, setLocationDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastElement, setLastElement] = useState('')
  const [offset, setOffset] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [location, setLocation] = useState('')
  const [title, setTitle] = useState('')
  const [temTitle, setTemTitle] = useState('')
  const [temDate, setTemDate] = useState('')
  const offsetRef = useRef()
  const locationRef = useRef()
  const startDateRef = useRef()
  const titleRef = useRef()
  offsetRef.current = offset
  locationRef.current = location
  startDateRef.current = startDate
  titleRef.current = title
  let navigate = useNavigate()
  let todaytime = dayjs()

  const observer = useRef(
    new IntersectionObserver(
      async entries => {
        const first = entries[0]
        if (first.isIntersecting) {
          console.log('관측됨')
          await getCompetitionList(
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

  async function getCompetitionList(startDate, offset, title, location) {
    setIsLoading(true)
    axios({
      method: 'get',
      headers: {
        'x-access-token': cookies.get('x-access-token'),
      },
      url: `${process.env.REACT_APP_BACK_END_API}/admin/competitions?startDate=${startDate}&offset=${offset}&title=${title}&location=${location}`,
    })
      .then(res => {
        console.log(res.data.result)
        let newCompetitions = res.data.result
        setCompetitions(competitions => [...competitions, ...newCompetitions])
        console.log('성공')
      })
      .catch(err => {
        console.log(err)
        console.log(err.response.status)
      })
    setIsLoading(false)
    return
  }

  async function ActivePatch(id) {
    await axios({
      method: 'patch',
      headers: {
        'x-access-token': cookies.get('x-access-token'),
      },
      url: `${process.env.REACT_APP_BACK_END_API}/admin/competitions/${id}/status/ACTIVE`,
    })
      .then(res => {
        console.log(res)
        alert(`id:${id} 대회가 활성화 되었습니다`)
      })
      .catch(err => {
        console.log(err)
        alert(`id:${id} 대회 활성화에 실패하였습니다.`)
      })
  }

  async function InActivePatch(id) {
    await axios({
      method: 'patch',
      headers: {
        'x-access-token': cookies.get('x-access-token'),
      },
      url: `${process.env.REACT_APP_BACK_END_API}/admin/competitions/${id}/status/INACTIVE`,
    })
      .then(res => {
        console.log(res)
        alert(`id:${id} 대회가 비활성화 되었습니다`)
      })
      .catch(err => {
        console.log(err)
        alert(`id:${id} 대회 비활성화에 실패하였습니다.`)
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

  function listRefresh() {
    // 검색 변수가 바뀔때마다 초기화 해주는 역할.
    setOffset(0)
    setCompetitions([])
  }

  function makingRegisterTag(registrationDate, registrationDeadline) {
    let opendate = dayjs(registrationDate, 'YYYY-MM-DD')
    let finishdate = dayjs(registrationDeadline, 'YYYY-MM-DD')

    let deadlineDiff = todaytime.diff(finishdate, 'd')

    if (deadlineDiff > 0) {
      // 마감날짜(데드라인)이 지났을경우
      return (
        <div className="each-competition-tag-gray">
          <p>신청마감</p>
        </div>
      )
    }

    if (deadlineDiff == 0) {
      // 오늘이 마감날짜(데드라인)일 경우
      return (
        <div className="each-competition-tag-blue">
          <p>신청마감 D-day</p>
        </div>
      )
    }

    let openDiff = todaytime.diff(opendate, 'd')

    if (openDiff < 0) {
      // 현재날짜가 오픈 전일 경우 ex) 신청오픈 D-20
      return (
        <div className="each-competition-tag-gray">
          <p>신청오픈 D{openDiff}</p>
        </div>
      )
    }
    return (
      <div className="each-competition-tag-blue">
        <p>신청마감 D{deadlineDiff}</p>
      </div>
    )
  }

  function makingEarlybirdTag(
    registrationDate,
    registrationDeadline,
    earlyBirdDeadline
  ) {
    let opendate = dayjs(registrationDate, 'YYYY-MM-DD')
    let finishdate = dayjs(registrationDeadline, 'YYYY-MM-DD')
    let earlyBirdDate = dayjs(earlyBirdDeadline, 'YYYY-MM-DD')

    let deadlineDiff = todaytime.diff(finishdate, 'd')
    let openDiff = todaytime.diff(opendate, 'd')
    let earlyBirdDiff = todaytime.diff(earlyBirdDate, 'd')

    if (openDiff >= 0 && deadlineDiff <= 0 && earlyBirdDiff <= 0)
      return (
        <div className="each-competition-tag-red">
          <p>얼리버드</p>
        </div>
      )
  }

  //신청마감 & 신청오픈 전 카드 색 변경
  function competitionCardGray(registrationDate, registrationDeadline) {
    let opendate = dayjs(registrationDate, 'YYYY-MM-DD')
    let finishdate = dayjs(registrationDeadline, 'YYYY-MM-DD')

    let deadlineDiff = todaytime.diff(finishdate, 'd')
    let openDiff = todaytime.diff(opendate, 'd')

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
          ? competition.CompetitionPoster.imageUrl
          : sampleposter,
      earlyBirdDeadline:
        competition.earlyBirdDeadline != null
          ? competition.earlyBirdDeadline
          : null,
    }
  }

  function searchEnterPress(e) {
    if (e.key == 'Enter') {
      setTitle(temTitle)
      listRefresh()
    }
  }

  function renderCompetitionList() {
    return competitions.map((competition, i) => {
      let curcompetition = competitionParsing(competition)
      let cardGray = competitionCardGray(
        competition.registrationDate,
        competition.registrationDeadline
      )
      return (
        <li className="competition-col">
          <div className="each-competition-tag">
            {makingEarlybirdTag(
              competition.registrationDate,
              competition.registrationDeadline,
              curcompetition.earlyBirdDeadline
            )}
            {makingRegisterTag(
              competition.registrationDate,
              competition.registrationDeadline
            )}
          </div>
          <div className="each-competition-body">
            {' '}
            {/* 위쪽 태그공간  */}
            <div class="each-competition-body-poster">
              {' '}
              {/* 카드왼쪽 포스터공간  */}
              <img src={curcompetition.posterImage}></img>
              <div class="each-competition-body-poster-block"></div>
              <h1>
                {curcompetition.doreOpen}
                <span>({curcompetition.doreOpenDay})</span>
              </h1>
            </div>
            <div className="each-competition-body-desc">
              {' '}
              {/* 카드오른쪽 설명공간 */}
              <div
                class="each-competition-body-desc-top"
                onClick={() => {
                  navigate(`/Admincompetition/info/${curcompetition.id}`)
                }}>
                <p>{curcompetition.title}</p>
              </div>
              <div className="each-competition-body-desc-middle">
                <p>{curcompetition.location}</p>
              </div>
              <div className="each-competition-body-desc-bottom">
                {competition.isPartnership === true ? (
                  <button
                    style={cardGray === '' ? {} : { display: 'none' }}
                    onClick={() => {
                      navigate(`/competition/applymethod/${curcompetition.id}`)
                    }}>
                    신청
                  </button>
                ) : (
                  <button
                    style={cardGray === '' ? {} : { display: 'none' }}
                    onClick={() => {
                      window.location.href = competition.nonPartnershipPageLink
                    }}>
                    신청
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="admin-each-competition-bottom">
            <div className="admin-each-competition-bottom-buttons">
              <button
                style={{ background: 'orange', color: 'black' }}
                onClick={() => {
                  navigate(`/admincompetition/${curcompetition.id}`)
                }}>
                대회수정하기
              </button>
              {curcompetition.status === 'ACTIVE' ? (
                <button
                  style={{ background: 'gray', color: 'black' }}
                  onClick={async () => {
                    InActivePatch(curcompetition.id)
                  }}>
                  비활성화하기
                </button>
              ) : (
                <button
                  style={{ background: 'red', color: 'black' }}
                  onClick={() => {
                    ActivePatch(curcompetition.id)
                  }}>
                  활성화하기
                </button>
              )}
              <button
                style={{ background: 'lightblue', color: 'black' }}
                onClick={() => {
                  navigate(`/Admincompetition/imageupload/${curcompetition.id}`)
                }}>
                포스터업로드하기
              </button>
              <button
                style={{ background: 'pink', color: 'black' }}
                onClick={() => {
                  navigate(`/paymentinfo/${curcompetition.id}`)
                }}>
                결제정보
              </button>
              <button
                style={{ background: 'yellow', color: 'black' }}
                onClick={() => {
                  navigate(`/Admincompetition/csv/${curcompetition.id}`)
                }}>
                참가선수명단
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
          onClick={() => setDateDropdown(pre => !pre)}>
          <p>{startDate == '' ? '날짜' : `${temDate}월`}</p>
          <img src={dropdownicon} />
          {dateDropdown ? (
            <ul>
              <li
                value=""
                onClick={() => {
                  setStartDate('')
                  listRefresh()
                }}>
                전체
              </li>
              {months.map(element => {
                return (
                  <li
                    value={element}
                    onClick={() => {
                      setStartDate(`2023-${element}-01`)
                      setTemDate(element)
                      listRefresh()
                    }}>
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
          onClick={() => setLocationDropdown(pre => !pre)}>
          <p>{location == '' ? '지역' : location}</p>
          <img src={dropdownicon} />
          {locationDropdown ? (
            <ul>
              <li
                value=""
                onClick={() => {
                  setLocation('')
                  listRefresh()
                }}>
                전체
              </li>
              {locationSample.map(element => {
                return (
                  <li
                    value={element}
                    onClick={() => {
                      setLocation(element)
                      listRefresh()
                    }}>
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
            placeholder="대회 이름 직접 검색하기"
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
      <div className="competition-list">
        <ul className="competition-row">
          {renderCompetitionList()}
          {isLoading && (
            <div style={{ fontsize: '200px', margin: '0 2rem' }}>
              Loading...
            </div>
          )}
          {!isLoading && (
            <div
              style={{ fontsize: '200px', margin: '0 2rem' }}
              ref={setLastElement}>
              해당 대회가 모두 로딩되었습니다.
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}

export default AdminCompetitionlist
