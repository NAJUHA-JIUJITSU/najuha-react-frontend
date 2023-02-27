import React, { useEffect, useState, Component, useRef } from 'react'
import './mainScroll.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
import backgroundImg from '../src_assets/jiujitsuGuys.jpg'
import monitor from '../src_assets/모니터.png'
import phone1 from '../src_assets/폰1.png'
import phone2 from '../src_assets/폰2.png'
import samplePoster from '../src_assets/samplePoster.png'
import samplePoster2 from '../src_assets/포스터2.png'
import samplePoster3 from '../src_assets/포스터3.png'
import cardRigthArrow from '../src_assets/카드오른쪽화살표.svg'

import Slider from 'react-slick'
import './slick.css'
import './slick-theme.css'

function MainScroll() {
  const [ScrollActive, setScrollActive] = useState(false)
  const [ScrollY, setScrollY] = useState(0) // window 의 pageYOffset값을 저장
  const [zoom, setZoom] = useState(1)
  const [bgColor, setBgColor] = useState('rgba(0, 0, 0, 0)')
  const [bgColorW, setBgColorW] = useState('rgba(255, 255, 255, 0)')

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

  useEffect(() => {
    function scrollListener() {
      window.addEventListener('scroll', handleScroll)
    } //  window 에서 스크롤을 감시 시작
    scrollListener() // window 에서 스크롤을 감시
    return () => {
      window.removeEventListener('scroll', handleScroll)
    } //  window 에서 스크롤을 감시를 종료
  })

  useEffect(() => {
    AOS.init()
  })

  function SampleNextArrow(props) {
    const { className, style, onClick } = props
    return (
      <div
        className={className}
        style={{ ...style, display: 'block' }}
        onClick={onClick}></div>
    )
  }

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
  const [settings, setSettings] = useState({
    dots: true,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    centerMode: true,
    centerPadding: '28%',
    nextArrow: <SampleNextArrow className="arrow" />,
    prevArrow: <SamplePrevArrow className="arrow" />,
    responsive: [
      {
        breakpoint: 1049,
        settings: {
          centerPadding: '18%',
        },
      },
      {
        breakpoint: 750,
        settings: {
          centerPadding: '12%',
        },
      },
    ],
  })

  const images = [
    {
      src: samplePoster,
      id: 1,
      doreOpen: '2023.02.08(월)',
      title: '나주하 후원 챔피언십',
      location: '사우동 시민회관',
    },
    {
      src: samplePoster2,
      id: 2,
      doreOpen: '2023.02.15(토)',
      title: 'JUCA 주짓수 카니발 대회',
      location: '카니발 체육관',
    },
    {
      src: samplePoster3,
      id: 3,
      doreOpen: '2023.02.23(일)',
      title: '모래밭 주짓수 챔피언십',
      location: '해운대 모래밭',
    },
    {
      src: samplePoster,
      id: 4,
      doreOpen: '2023.03.01(금)',
      title: '나주하 후원 챔피언십',
      location: '사우동 시민회관',
    },
    {
      src: samplePoster2,
      id: 5,
      doreOpen: '2023.03.09(토)',
      title: '나주하 후원 챔피언십',
      location: '사우동 시민회관',
    },
    {
      src: samplePoster3,
      id: 6,
      doreOpen: '2023.03.16(일)',
      title: '나주하 후원 챔피언십',
      location: '사우동 시민회관',
    },
    {
      src: samplePoster,
      id: 7,
      doreOpen: '2023.04.01(월)',
      title: '나주하 후원 챔피언십',
      location: '사우동 시민회관',
    },
  ]

  return (
    <div className="MainScroll_wrapper">
      <div className="MainScroll_section1">
        <img
          style={{ transform: `scale(${zoom})` }}
          className="MainScroll_bgImg"
          src={backgroundImg}
          alt="배경 이미지"></img>
        <div className="MainScroll_black"></div>
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
            이번 달 주짓수 대회 한 눈에 보고싶은데..
          </h2>
          <h2
            className={
              ScrollY > 2400
                ? ScrollY > 3600
                  ? 'MainScroll_fadeout'
                  : 'MainScroll_fadein'
                : 'MainScroll_none'
            }>
            신청부터 결제까지 한 번에 할 수 없나..
          </h2>
          <h2
            className={
              ScrollY > 2800
                ? ScrollY > 3100
                  ? 'MainScroll_fadeout'
                  : 'MainScroll_fadein'
                : 'MainScroll_none'
            }>
            (수근수근)
          </h2>
          <h2
            className={
              ScrollY > 3100
                ? ScrollY > 3600
                  ? 'MainScroll_fadeout'
                  : 'MainScroll_fadein'
                : 'MainScroll_none'
            }>
            뭐? 나주하에서는 다 가능하다고?
          </h2>
        </div>
        <div
          className="MainScroll_black2"
          style={{ backgroundColor: bgColor }}></div>
        <div
          className="MainScroll_black2"
          style={{ backgroundColor: bgColorW }}></div>
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
            {images.map(el => (
              <div key={el.id} id="card">
                <div className="MainScroll_card">
                  <img src={el.src} />

                  <div className="MainScroll_cardInfo">
                    <p>{el.doreOpen}</p>
                    <h2>{el.title}</h2>
                    <h3>{el.location}</h3>
                    <button className="MainScroll_apply">바로 신청</button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <div className="MainScroll_listBtn">
          <p>모든 대회 보러가기</p>
        </div>
      </div>
    </div>
  )
}

export default MainScroll
