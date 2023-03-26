import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './partnershipBanner.css'
import { getPartnershipCompetitionList } from '../apis/api/competition'
import sampleposter from '../src_assets/samplePoster.png'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'

function PartnershipBanner() {
  const [week, setWeek] = useState(['일', '월', '화', '수', '목', '금', '토'])
  const [competitions, setCompetitions] = useState([])
  const navigate = useNavigate()

  async function getCompetitons() {
    const res = await getPartnershipCompetitionList()
    if (res?.status === 200) {
      setCompetitions(res.data.result)
      return
    }
  }

  useEffect(() => {
    getCompetitons()
  }, [])

  function competitionParsing(competition) {
    let doreOpen = competition.doreOpen
      .substr(2, 8)
      .replace('-', '.')
      .replace('-', '.')
    let doreOpenDay = week[new Date(competition.doreOpen).getDay()]

    // i want parsing location string at second white space
    let location = competition.location.substr(
      0,
      competition.location.indexOf(' ', competition.location.indexOf(' ') + 1)
    )
    return {
      doreOpen: doreOpen,
      doreOpenDay: doreOpenDay,
      location: location,
    }
  }

  function competitionRender() {
    return competitions.map(competition => {
      let parsedCompetition = competitionParsing(competition)
      return (
        <SwiperSlide>
          <div className="PartnershipBanner_wrapper">
            <div
              className="PartnershipBanner_posterimage"
              style={{
                backgroundImage: `url(${
                  competition.CompetitionPoster
                    ? competition.CompetitionPoster.imageUrl
                    : sampleposter
                }
                )`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
            <div className="PartnershipBanner_postershadow" />
            <div
              className="PartnershipBanner_postercontent"
              onClick={() => navigate(`/competition/${competition.id}`)}
            >
              <div className="PartnershipBanner_postercontent_top">
                <p>간편하게 신청해보세요!</p>
              </div>
              <div className="PartnershipBanner_postercontent_middle">
                <p>{competition.title}</p>
                {/* <p>[4/1] 화성 OPMT 주짓수 토너먼트</p> */}
              </div>
              <div className="PartnershipBanner_postercontent_bottom">
                <div className="PartnershipBanner_postercontent_bottom_button">
                  <p>신청하기</p>
                </div>
                <div className="PartnershipBanner_postercontent_bottom_info">
                  <div className="PartnershipBanner_postercontent_bottom_location">
                    <h1>장소</h1>
                    <p>{parsedCompetition.location}</p>
                  </div>
                  <div className="PartnershipBanner_postercontent_bottom_date">
                    <h1>대회날짜</h1>
                    <p>
                      {parsedCompetition.doreOpen}(
                      {parsedCompetition.doreOpenDay})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      )
    })
  }

  return (
    <Swiper
      navigation={true}
      modules={[Navigation, Autoplay]}
      className="mySwiper"
      autoplay={{
        delay: 4500,
        disableOnInteraction: false,
      }}
      loop={true}
    >
      {competitions.length > 0 ? competitionRender() : <></>}
    </Swiper>
  )
}

export default PartnershipBanner
