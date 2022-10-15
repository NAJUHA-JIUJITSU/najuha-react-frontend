import axios from 'axios'
import React, {useState, useEffect, useRef} from 'react'
import './competitionlist.css'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function Competitionlist() {
    const [competitions, setCompetitions] = useState([])
    const [week, setWeek] = useState(['일', '월', '화', '수', '목', '금', '토'])
    const [isLoading, setIsLoading] = useState(false)
    const [lastElement, setLastElement] = useState('')
    const [offset, setOffset] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [location, setLocation] = useState('');
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
    const [locationSample, setLocationSample]=useState(['강원', '경기', '경남', '경북', '광주', '대구', '대전', '부산', '서울', '울산', '인천', '전남', '전북', '제주', '충남', '충북'])
    
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
        axios.get(`${process.env.REACT_APP_BACK_END_API}/competitions?startDate=${startDate}&offset=${offset}&title=${title}&location=${location}`,
        {
            headers: {
                'x-access-token':  process.env.REACT_APP_BACK_END_TOKEN
            }
        })
        .then((res) => {
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
    }, [lastElement, location, startDate, title])

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

    function listRefresh(){ // 검색 변수가 바뀔때마다 초기화 해주어야함.
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
        <div className='competition-searchzone'>
            <div className='competition-searchzone-wrapper'>
                <div className='competition-searchzone-title'>대회일정</div>
                <div className='competition-searchzone-fake'>
                    <img className='competition-searchzone-input-icon' src='Assets/검색돋보기아이콘.svg' alt="돋보기아이콘" onClick={()=>{
                        setTitle(temTitle);
                        listRefresh()
                    }}/>
                    <input className='competition-searchzone-input' value={temTitle} placeholder='대회 이름 직접 검색하기' onChange={(e)=> setTemTitle(e.target.value)}/>
                </div>
                <div className='competition-searchzone-options'>
                    <div className='competition-searchzone-options-date'>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DesktopDatePicker
                    label="날짜 선택"
                    views={['year', 'month', 'day']}
                    minDate={dayjs('2022-1-1')} // 올해로 한정될수 있게 변수값을 고쳐야함 
                    maxDate={dayjs('2022-12-31')} // 올해로 한정될수 있게 변수값을 고쳐야함 
                    inputFormat="MM-DD-YYYY" 
                    value={startDate}
                    onChange={(newvalue)=>{
                        if(newvalue.format('YYYY-MM-DD') != 'Invalid Date'){
                            setStartDate(newvalue.format('YYYY-MM-DD'))
                            listRefresh();
                        }
                    }}
                    renderInput={(params) => <TextField style={{width: '100%'}} {...params} />}
                    />
                    </LocalizationProvider>
                    </div>
                    <div className='competition-searchzone-options-location'>
                        <FormControl variant="standard" style={{width:'100%'}}>
                            <InputLabel id="demo-simple-select-standard-label">지역</InputLabel>
                            <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={location}
                            onChange={(e) => {
                                setLocation(e.target.value)
                                listRefresh();
                            }}
                            label="지역"
                            >
                            <MenuItem value="">
                                <em>지역</em>
                            </MenuItem>
                            {locationSample.map((sample) => {
                                return(
                                    <MenuItem value={sample}>{sample}</MenuItem>
                                )
                            })}
                            </Select>
                        </FormControl>
                    </div>
                    {/* <div className='competition-searchzone-options-city'>
                        <FormControl variant="standard" style={{width:'100%'}}>
                        <InputLabel id="demo-simple-select-standard-label">도시</InputLabel>
                        <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={city}
                        onChange={(e) => {setCity}}
                        label="Age"
                        >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                    </div> */}
                </div>
            </div>
        </div>
        <div className='competition-list'>
            <ul class='competition-row'>
                {renderCompetitionList()}
                {isLoading && <div style={{fontsize: '200px', margin: '0 2rem'}}>Loading...</div>}
                {!isLoading && <div style={{fontsize: '200px', margin: '0 2rem'}}ref={setLastElement}>HI</div>}
            </ul>
        </div>
    </div>
  )
}

export default Competitionlist