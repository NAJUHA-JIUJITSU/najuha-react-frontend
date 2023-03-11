import React, { useEffect, useState, Component, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './mainScroll.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
import backgroundImg from '../src_assets/jiujitsuGuys.jpg'
import monitor from '../src_assets/모니터.png'
import phone1 from '../src_assets/폰1.png'
import phone2 from '../src_assets/폰2.png'
import samplePoster from '../src_assets/samplePoster.png'
import scrollImg from '../src_assets/스크롤.svg'

import Slider from 'react-slick'
import './slick.css'
import './slick-theme.css'

import ProgressiveImage from 'react-progressive-graceful-image'
import placeholderSrc from '../src_assets/bgImg.jpeg'

import { Cookies } from 'react-cookie'
import axios from 'axios'

function MainScroll() {
  const [ScrollActive, setScrollActive] = useState(false)
  const [ScrollY, setScrollY] = useState(0) // window 의 pageYOffset값을 저장
  const [first, setFirst] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [bgColor, setBgColor] = useState('rgba(0, 0, 0, 0)')
  const [bgColorW, setBgColorW] = useState('rgba(255, 255, 255, 0)')
  const [competitions, setCompetitions] = useState([])

  let navigate = useNavigate()

  const cookies = new Cookies()
  const xAccessToken = cookies.get('x-access-token')

  //대회 정보 가져오기
  async function getCompetitons() {
    axios
      .get(
        `${process.env.REACT_APP_BACK_END_API}/competitionsPartnershipTrue`,
        {
          headers: {
            'x-access-token': cookies.get('x-access-token'),
          },
        }
      )
      .then(res => {
        setCompetitions(res.data.result)
        console.log(res.data.result)
        console.log(res.data.message)
      })
      .catch(err => {
        console.log(err)
        // console.log(err.response.status)
        // console.log(err.response.data.message)
      })
    return
  }
  //요일 값 구하기
  function getDayOfWeek(날짜문자열) {
    //ex) getDayOfWeek('2022-06-13')

    const week = ['일', '월', '화', '수', '목', '금', '토']

    const dayOfWeek = week[new Date(날짜문자열).getDay()]

    return dayOfWeek
  }
  //대회 정보 데이터 파싱
  function competitionsParsing(competition) {
    let id = competition.id
    let title = competition.title
    let doreOpen = competition.doreOpen
      .substr(0, 10)
      .replace('-', '.')
      .replace('-', '.')
    let doreOpenDay = getDayOfWeek(competition.doreOpen)
    let location = competition.location
    let postUrl = competition.CompetitionPoster
      ? competition.CompetitionPoster.imageUrl
      : samplePoster

    return {
      id: id,
      title: title,
      postUrl: postUrl,
      doreOpen: doreOpen + '(' + doreOpenDay + ')',
      location: location,
    }
  }

  //스크롤 값 구하기 && 그에 따른 이벤트 추가
  function handleScroll() {
    console.log('스크롤 ' + ScrollY)
    if (ScrollY <= 1700) {
      setBgColor('rgba(0, 0, 0, 0)')
      setBgColorW('rgba(255, 255, 255, 0)')
    }
    if (ScrollY > 1700) {
      setScrollActive(true)

      const scrollTop = window.pageYOffset
      const scrollFraction = (scrollTop - 1700) / window.innerHeight
      const zoomLevel = 1 + scrollFraction
      setZoom(zoomLevel > 1 ? zoomLevel : 1)

      if (scrollTop < 3100) {
        const newBgColor = `rgba(0, 0, 0, ${(scrollTop - 1700) / 1000})`
        setBgColor(newBgColor)
      } else if (scrollTop >= 3600) {
        setBgColor('rgba(0, 0, 0, 0.4)')
        const newBgColor = `rgba(255, 255, 255, ${(scrollTop - 3600) / 500})`
        setBgColorW(newBgColor)
      }

      setScrollY(window.pageYOffset)
    } else {
      setScrollY(window.pageYOffset)
      setScrollActive(false)
    }
  }

  //스크롤 감시
  useEffect(() => {
    function scrollListener() {
      window.addEventListener('scroll', handleScroll)
    } //  window 에서 스크롤을 감시 시작
    scrollListener() // window 에서 스크롤을 감시
    return () => {
      window.removeEventListener('scroll', handleScroll)
    } //  window 에서 스크롤을 감시를 종료
  })

  //슬라이드 라이브러리 추가
  useEffect(() => {
    AOS.init()
  })

  useEffect(() => {
    getCompetitons()
    window.onbeforeunload = function pushRefresh() {
      window.scrollTo(0, 0)
    }
  }, [])

  //슬라이드 오른쪽 화살표 컴포넌트
  function SampleNextArrow(props) {
    const { className, style, onClick } = props
    return (
      <div
        className={className}
        style={{ ...style, display: 'block' }}
        onClick={onClick}></div>
    )
  }

  //슬라이드 왼쪽 화살표 컴포넌트
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props
    return (
      <div
        className={className}
        style={{ ...style, display: 'block' }}
        onClick={onClick}
      />
    )
  }

  //슬라이드 설정값
  const [settings, setSettings] = useState({
    dots: true,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 400,
    centerMode: true,
    centerPadding: '12%',
    nextArrow: <SampleNextArrow className="arrow" />,
    prevArrow: <SamplePrevArrow className="arrow" />,
  })

  return (
    <div className="MainScroll_wrapper">
      <div className="MainScroll_section1">
        <ProgressiveImage src={backgroundImg} placeholder={placeholderSrc}>
          {(src, loading) => (
            <img
              className={`image${loading ? ' loading' : ' loaded'}`}
              src={src}
              id="MainScroll_bgImg"
              alt="배경 이미지"
              width="100vh"
              height="100vh"
              style={
                ScrollY > 5000
                  ? { display: 'none' }
                  : { transform: `scale(${zoom})` }
              }
            />
          )}
        </ProgressiveImage>

        <div
          className="MainScroll_black"
          style={ScrollY > 5000 ? { display: 'none' } : {}}></div>
        <div className="MainScroll_message">
          <h1
            className={
              ScrollY > 100
                ? ScrollY > 1700
                  ? 'MainScroll_fadeout'
                  : 'MainScroll_fadein'
                : 'MainScroll_none'
            }>
            <span>나</span> 는
          </h1>
          <h1
            className={
              ScrollY > 700
                ? ScrollY > 1700
                  ? 'MainScroll_fadeout'
                  : 'MainScroll_fadein'
                : 'MainScroll_none'
            }>
            <span>주</span> 짓수가
          </h1>
          <h1
            className={
              ScrollY > 1050
                ? ScrollY > 1700
                  ? 'MainScroll_fadeout'
                  : 'MainScroll_fadein'
                : 'MainScroll_none'
            }>
            <span>하</span> 고싶다
          </h1>
        </div>
        <div className="MainScroll_message2">
          <h2
            className={
              ScrollY > 2000
                ? ScrollY > 3600
                  ? 'MainScroll_fadeout'
                  : 'MainScroll_fadein'
                : 'MainScroll_none'
            }>
            이번 달 주짓수 대회 어디서 확인하지?
          </h2>
          <h2
            className={
              ScrollY > 2400
                ? ScrollY > 3600
                  ? 'MainScroll_fadeout'
                  : 'MainScroll_fadein'
                : 'MainScroll_none'
            }>
            신청부터 결제까지 한 번에 할 수 없나?
          </h2>
          <h2
            className={
              ScrollY > 2800
                ? ScrollY > 3600
                  ? 'MainScroll_fadeout'
                  : 'MainScroll_fadein'
                : 'MainScroll_none'
            }>
            나주하에서는 전부 가능합니다.
          </h2>
        </div>
        <div
          className="MainScroll_black2"
          style={{ backgroundColor: bgColor }}></div>
        <div
          className="MainScroll_black2"
          style={{ backgroundColor: bgColorW }}></div>
      </div>

      <div
        className="MainScroll_scrollImg"
        style={ScrollY > 1700 || !first ? { display: 'none' } : {}}>
        <p>SCROLL</p>
        <img src={scrollImg} alt="스크롤 화살표"></img>
      </div>
      <div className="MainScroll_section1-1"></div>

      <div className="MainScroll_section2">
        <div data-aos="fade-up" className="MainScroll_title1">
          <h1>전국에 있는</h1>
          <h1>주짓수 대회를</h1>
          <h1>한 눈에.</h1>
          <div className="MainScroll_blueLine"></div>
        </div>
        <div data-aos="fade-up" className="MainScroll_subtitle1">
          <h2> 대회조회부터 상세정보까지 간편하게 확인해보세요.</h2>
        </div>
        <div>
          <img data-aos="fade-up" src={monitor} alt="모니터"></img>
        </div>
      </div>

      <div className="MainScroll_linear1"></div>

      <div className="MainScroll_section3">
        <div data-aos="fade-up" className="MainScroll_title2">
          <h1>대회신청부터</h1>
          <h1>대회결제까지</h1>
          <h1>한 번에.</h1>
          <div className="MainScroll_blueLine2"></div>
        </div>
        <div className="MainScroll_phone" data-aos="fade-up">
          <div className="MainScroll_phone1">
            <img src={phone1} alt="핸드폰사진1"></img>
            <h2 data-aos="fade-up" className="MainScroll_phoneMsg">
              간편결제를 이용하여 <br></br>쉽고 빠르게 결제해보세요.
            </h2>
            <p data-aos="fade-up">
              *나주하와 협약된 대회만 간편결제를 이용하실 수 있습니다.
            </p>
          </div>
          <div className="MainScroll_phone2">
            <img src={phone2} alt="핸드폰사진2"></img>
            <h2 data-aos="fade-up">
              간편결제를 이용하여 쉽고 빠르게 결제해보세요.
            </h2>
          </div>
        </div>
      </div>

      <div className="MainScroll_linear2"></div>

      <div className="MainScroll_section4">
        <div data-aos="fade-up" className="MainScroll_title3">
          <h1>나주하와</h1>
          <h1>함께하는 대회를</h1>
          <h1>신청해보세요!</h1>
          <div className="MainScroll_blueLine3"></div>
          <h2>간편결제로 결제하고 내 프로필에서 바로 확인까지</h2>
        </div>
        <div data-aos="fade-up" className="MainScroll_slide">
          <Slider {...settings}>
            {competitions.map(el => {
              let competition = competitionsParsing(el)
              return (
                <div
                  key={competition.id}
                  id="card"
                  onClick={() => {
                    window.scrollTo(0, 0)
                    navigate(`/competition/${competition.id}`)
                  }}>
                  <div className="MainScroll_card">
                    <img src={competition.postUrl} />

                    <div className="MainScroll_cardInfo">
                      <p>{competition.doreOpen}</p>
                      <h2>{competition.title}</h2>
                      <h3>{competition.location}</h3>
                      {/* <button className="MainScroll_apply">바로가기</button> */}
                    </div>
                  </div>
                </div>
              )
            })}
          </Slider>
        </div>

        <div
          className="MainScroll_listBtn"
          onClick={() => {
            window.scrollTo(0, 0)
            navigate('/competition')
          }}>
          <p>모든 대회 보러가기</p>
        </div>
      </div>
    </div>
  )
}

export default MainScroll
