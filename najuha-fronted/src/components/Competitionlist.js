import React, {useState, useEffect} from 'react'
import './competitionlist.css'

function Competitionlist() {
    const [competitions, setCompetitions] = useState([
        {
            "id": 1,
            "title": "heroes of jiu-jitsu #1",
            "host": "킹오브주짓수",
            "doreOpen": "2022-10-21 08:31:00",
            "registrationDate": "2022-09-20 08:31:00",
            "registrationDeadline": "2022-11-20 08:31:00",
            "earlyBirdDeadline": "2022-09-20 08:31:00",
            "location": "도로명 주소"
        },
        {
            "id": 2,
            "title": "heroes of jiu-jitsu #2",
            "host": "킹오브주짓수",
            "doreOpen": "2022-11-21 08:31:00",
            "registrationDate": "2022-09-20 08:31:00",
            "registrationDeadline": "2022-11-20 08:31:00",
            "earlyBirdDeadline": "2022-09-20 08:31:00",
            "location": "도로명 주소"
        },
        {
            "id": 3,
            "title": "heroes of jiu-jitsu #3",
            "host": "킹오브주짓수",
            "doreOpen": "2022-11-21 08:31:00",
            "registrationDate": "2022-09-20 08:31:00",
            "registrationDeadline": "2022-11-20 08:31:00",
            "earlyBirdDeadline": null,
            "location": "도로명 주소"
        },
    ])


    const [week, setWeek] = useState(['일', '월', '화', '수', '목', '금', '토', '아'])

    function competitionParsing(competition){
        let doreOpenDay = week[new Date(competition.doreOpen).getDay()]
        let registrationDateDay = week[new Date(competition.registrationDate).getDay()]
        let registrationDeadLineDay = week[new Date(competition.registrationDeadline).getDay()]
        let doreOpen = competition.doreOpen.substr(5,5).replace('-','.')
        let registrationDate = competition.registrationDate.substr(5,5).replace('-','.')
        let registrationDeadline = competition.registrationDeadline.substr(5,5).replace('-','.')
        return {
            'title': competition.title,
            'location': competition.location,
            'doreOpen': doreOpen,
            'doreOpenDay': doreOpenDay,
            'registrationDate': registrationDate,
            'registrationDateDay': registrationDateDay,
            'registrationDeadline': registrationDeadline,
            'registrationDeadlineDay': registrationDeadLineDay,
        }
    }

    function renderCompetitionList () {
        return competitions.map((competition, i) => {
            let curcompetition = competitionParsing(competition)
            return(
                <li class='competition-col'>
                    <div class='each-competition'>
                        <div class='each-competition-top'>
                            <div class='each-competition-top-date'>
                                <h1>{curcompetition.doreOpen}<span>({curcompetition.doreOpenDay})</span></h1>
                            </div>
                            <div class='each-competition-top-location'>
                                <div class='each-competition-top-location-tag'> {/*display:flex써서 세로 가운데 정렬하려고 클래스하나 더 넣은거임 */}
                                    <h2>{curcompetition.title}</h2><br/>
                                    <h3>{curcompetition.location}</h3>
                                </div>
                            </div>
                        </div>
                        <div class='each-competition-bottom'>
                            <h4><img src='Assets/타이머.svg' alt='신청기간아이콘'/>{curcompetition.registrationDate}({curcompetition.registrationDateDay})</h4>
                            <h4><img src='Assets/타이머.svg' alt='신청기간아이콘'/>{curcompetition.registrationDeadline}({curcompetition.registrationDeadlineDay})</h4>
                            <div class='each-competition-bottom-buttons'>
                                <button>세부정보</button>
                                <button>신청</button>
                            </div>
                        </div> 
                    </div>
                </li>
            )
        })
    }





  return (
    <div className='competition-schedule-wrapper'>
        <div className='searchzone'>
        searchzone
        </div>
        <div className='competition-list'>
            <ul class='competition-row'>
                {renderCompetitionList()}
            </ul>
        </div>
    </div>
  )
}

export default Competitionlist