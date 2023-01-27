import axios from 'axios'
import React, {useState, useEffect, useRef} from 'react'
import { useNavigate } from "react-router-dom";
import './competitionlist.css'
import dropdownicon from '../src_assets/드랍다운아이콘회색.svg'
import searchicon from '../src_assets/검색돋보기아이콘.svg'
import sampleposter from '../src_assets/samplePoster.png'
import dayjs from 'dayjs';

const months = [1,2,3,4,5,6,7,8,9,10,11,12]
const locationSample=['강원', '경기', '경남', '경북', '광주', '대구', '대전', '부산', '서울', '울산', '인천', '전남', '전북', '제주', '충남', '충북']

function Competitionlist() {
    const [competitions, setCompetitions] = useState([])
    const [week, setWeek] = useState(['일', '월', '화', '수', '목', '금', '토'])
    const [isLoading, setIsLoading] = useState(false)
    const [lastElement, setLastElement] = useState('')
    const [offset, setOffset] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [temDate, setTemDate] = useState('');
    const [location, setLocation] = useState('');
    const [dateDropdown, setDateDropdown] = useState(false);
    const [locationDropdown, setLocationDropdown] = useState(false);
    const [title, setTitle] = useState('')
    const [temTitle, setTemTitle] = useState('')
    const offsetRef = useRef();
    const locationRef = useRef();
    const startDateRef = useRef();
    const titleRef = useRef();
    offsetRef.current = offset;
    locationRef.current = location;
    startDateRef.current = startDate;
    titleRef.current = title;
    let navigate = useNavigate();
    let todaytime = dayjs()
    
    const date1 = dayjs("2021-10-11 10:30:25.495", "YYYY-MM-DD HH:mm:ss.SSS");
    const date2 = dayjs("2020-04-08 13:25:30.000", "YYYY-MM-DD HH:mm:ss.SSS");
    console.log(date2.diff(date1, "d"))

    const observer = useRef(new IntersectionObserver(async (entries)=>{
        const first = entries[0]
        if(first.isIntersecting){
            console.log('관측됨')
            await getCompetitionList(startDateRef.current, offsetRef.current, titleRef.current, locationRef.current);
            await setOffset((preOffset) =>{return preOffset+1})
        }
    }, {threshold:1}))


    async function getCompetitionList(startDate, offset, title, location){
        setIsLoading(true)
        axios.get(`${process.env.REACT_APP_BACK_END_API}/competitions?startDate=${startDate}&offset=${offset}&title=${title}&location=${location}`)
        .then((res) => {
            console.log(res.data.result);
            let newCompetitions = res.data.result
            setCompetitions((competitions) => [...competitions, ...newCompetitions])
            console.log('성공')
        })
        .catch((err) => {
            console.log(err)
            console.log(err.response.status);
        })
        setIsLoading(false)
        return ;
    }

    

    useEffect(() => {
        const currentElement = lastElement;
        const currentObserver = observer.current;
        if (currentElement) {
            currentObserver.observe(currentElement);
            
        }
        return () => {
            if (currentElement){
                currentObserver.unobserve(currentElement)
            }
        }
    }, [lastElement, location, startDate, title, offset===0])

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

    function listRefresh(){ // 검색 변수가 바뀔때마다 초기화 해주는 역할.
        setOffset(0)
        setCompetitions([]);
    }

    function makingRegisterTag(registrationDate, registrationDeadline){
        let opendate = dayjs(registrationDate, 'YYYY-MM-DD')
        let finishdate = dayjs(registrationDeadline, 'YYYY-MM-DD')
        console.log(`opendate: ${opendate}`)
        console.log(`finishidate: ${finishdate}`)

        let deadlineDiff = todaytime.diff(finishdate, 'd')
        

        if(deadlineDiff > 0){ // 마감날짜(데드라인)이 지났을경우 
            return (
                <div className='each-competition-tag-gray'><p>신청마감</p></div>
            )
        }

        if(deadlineDiff == 0){ // 오늘이 마감날짜(데드라인)일 경우
            return(
                <div className='each-competition-tag-blue'><p>신청마감 D-day</p></div>
            )
        }

        let openDiff = todaytime.diff(opendate, 'd')

        if(openDiff < 0){ // 현재날짜가 오픈 전일 경우 ex) 신청오픈 D-20
            return(
                <div className='each-competition-tag-gray'><p>신청오픈 D{openDiff}</p></div>
            )
        }
        return(
            <div className='each-competition-tag-blue'><p>신청마감 D{deadlineDiff}</p></div>
        )
        
    }

    function makingEarlybirdTag(date){

    }


    function competitionParsing(competition){
        let doreOpenDay = week[new Date(competition.doreOpen).getDay()]
        let registrationDateDay = week[new Date(competition.registrationDate).getDay()]
        let registrationDeadLineDay = week[new Date(competition.registrationDeadline).getDay()]
        let doreOpen = competition.doreOpen.substr(5,5).replace('-','.')
        let registrationDate = competition.registrationDate.substr(5,5).replace('-','.')
        let registrationDeadline = competition.registrationDeadline.substr(5,5).replace('-','.')
        return {
            'id': competition.id,
            'title': competition.title,
            'location': competition.location,
            'doreOpen': doreOpen,
            'doreOpenDay': doreOpenDay,
            'registrationDate': registrationDate,
            'registrationDateDay': registrationDateDay,
            'registrationDeadline': registrationDeadline,
            'registrationDeadlineDay': registrationDeadLineDay,
            'posterImage': competition.CompetitionPoster != null ? competition.CompetitionPoster.imageUrl : sampleposter,
            'earlyBirdDeadline': competition.earlyBirdDeadline != null ? competition.earlyBirdDeadline : null,
        }
    }

    function renderCompetitionList () {
        return competitions.map((competition, i) => {
            let curcompetition = competitionParsing(competition)
            return(
                <li className='competition-col'>
                    <div className='each-competition-tag'>
                        {makingRegisterTag(competition.registrationDate, competition.registrationDeadline)}
                    </div>
                    <div className='each-competition-body'> {/* 위쪽 태그공간  */}
                        <div class='each-competition-body-poster'> {/* 카드왼쪽 포스터공간  */}
                            <img src={curcompetition.posterImage}></img>
                            <div class='each-competition-body-poster-block'></div>
                            <h1>{curcompetition.doreOpen}<span>({curcompetition.doreOpenDay})</span></h1>
                        </div>
                        <div class='each-competition-body-desc'> {/* 카드오른쪽 설명공간 */}
                            <div class='each-competition-body-desc-top'>
                                <p>{curcompetition.title}</p>
                            </div>
                            <div class='each-competition-body-desc-middle'>
                                <p>{curcompetition.location}</p>
                            </div>
                            <div class='each-competition-body-desc-bottom'>
                                <button onClick={()=>{navigate(`/competition/applymethod/${curcompetition.id}`)}}>바로 신청</button>
                            </div>
                        </div>                        
                    </div>
                </li>
            )
        })
    }

    function searchEnterPress (e) {
        if(e.key == 'Enter'){
            setTitle(temTitle)
            listRefresh();
        }
    }





  return (
    <div className='competition-schedule-wrapper'>
        <div className='competition-searchzone'>
            <div className='competition-searchzone-option' onClick={() => setDateDropdown(pre => !pre)}>
                <p>{startDate == '' ? '대회날짜' : `${temDate}월`}</p>
                <img src={dropdownicon}/> 
                {dateDropdown ? <ul>
                    <li value='' onClick={() => {
                        setStartDate('')
                        listRefresh()
                    }}>전체</li>
                    {months.map(element => {
                        return(
                            <li value={element} onClick={() => {
                                setStartDate(`2023-${element}-01`)
                                setTemDate(element)
                                listRefresh()
                            }}>{element}월</li>
                        )
                    })}
                </ul> 
                : ''}
            </div>
            <div className='competition-searchzone-option' onClick={() => setLocationDropdown(pre => !pre)}>
                <p>{location == '' ? '지역' : location}</p>
                <img src={dropdownicon}/>
                {locationDropdown ? 
                <ul>
                    <li value='' onClick={() => {
                        setLocation('')
                        listRefresh()
                    }}>전체</li>
                    {locationSample.map(element => {
                        return(
                            <li value={element} onClick={() => {
                                setLocation(element)
                                listRefresh()
                            }}>{element}</li>
                        )
                    })}
                </ul>
                : ''}
            </div>
            <div className='competition-searchzone-searchbar'>
                <input  placeholder='대회 이름 직접 검색하기' value={temTitle} onKeyDown={(e) => searchEnterPress(e)} onChange={(e)=>{
                    setTemTitle(e.target.value)
                }}/>
                <img src={searchicon} alt='돋보기아이콘' onClick={() =>{
                    setTitle(temTitle)
                    listRefresh();
                }}/>
            </div>

        </div>
        <div className='competition-list'>
            <ul class='competition-row'>
                {renderCompetitionList()}
                {isLoading && <div style={{fontsize: '200px', margin: '0 2rem'}}>Loading...</div>}
                {!isLoading && <div style={{fontsize: '200px', margin: '0 2rem'}}ref={setLastElement}>해당 대회가 모두 로딩되었습니다.</div>}
            </ul>
        </div>
    </div>
  )
}

export default Competitionlist