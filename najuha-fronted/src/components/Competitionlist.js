import axios from 'axios'
import React, {useState, useEffect, useRef} from 'react'
import { useNavigate } from "react-router-dom";
import './competitionlist.css'
import dropdownicon from '../src_assets/드랍다운아이콘회색.svg'
import searchicon from '../src_assets/검색돋보기아이콘.svg'
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
                                <button id='each-competition-button-able' onClick={()=>{navigate(`/competition/applymethod/${curcompetition.id}`)}}>신청</button>
                            </div>
                        </div>
                        {/* <div class='each-competition-bottom'>
                            <h4><img src='Assets/타이머.svg' alt='신청기간아이콘'/>{curcompetition.registrationDate}({curcompetition.registrationDateDay})</h4>
                            <h4><img src='Assets/타이머.svg' alt='신청기간아이콘'/>{curcompetition.registrationDeadline}({curcompetition.registrationDeadlineDay})</h4>
                            <div class='each-competition-bottom-buttons'>
                                <button>세부정보</button>
                                
                            </div>
                        </div>  */}
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