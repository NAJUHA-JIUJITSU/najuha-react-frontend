import axios from 'axios'
import React, {useState, useEffect, useRef} from 'react'
import { useNavigate } from "react-router-dom";
import './admincompetitionlist.css'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { height } from '@mui/system';
import { Cookies } from 'react-cookie';

function AdminCompetitionlist() {
    const cookies = new Cookies();
    const [competitions, setCompetitions] = useState([])
    const [activeModal, setActiveModal] = useState(false);
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
    let navigate = useNavigate();
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
        axios({
            method: "get",
            headers: {
              "x-access-token":  cookies.get("x-access-token")
            },
            url: `${process.env.REACT_APP_BACK_END_API}/admin/competitions?startDate=${startDate}&offset=${offset}&title=${title}&location=${location}`,
          })
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

    async function ActivePatch(id){
        await axios({
            method: "patch",
            headers: {
              "x-access-token":  cookies.get("x-access-token")
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

    async function InActivePatch(id){
        await axios({
            method: "patch",
            headers: {
              "x-access-token":  cookies.get("x-access-token")
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
            'status': competition.status,
        }
    }

    function renderCompetitionList () {
        return competitions.map((competition, i) => {
            let curcompetition = competitionParsing(competition)
            return(
                <li class='admin-competition-col' key={i}>
                    <div class='admin-each-competition'>
                        <div class='admin-each-competition-top'>
                            <div class='admin-each-competition-top-date'>
                                <h1>{curcompetition.doreOpen}<span>({curcompetition.doreOpenDay})</span></h1>
                            </div>
                            <div class='admin-each-competition-top-location'>
                                <div class='admin-each-competition-top-location-tag'> {/*display:flex써서 세로 가운데 정렬하려고 클래스하나 더 넣은거임 */}
                                    <h2>{curcompetition.title}</h2><br/>
                                    <h3>{curcompetition.location}</h3>
                                    <h3>대회 id:{curcompetition.id}</h3>
                                </div>
                            </div>
                        </div>
                        <div class='admin-each-competition-bottom'>
                            <div class='admin-each-competition-bottom-buttons'>
                                <button style={{background:'orange', color:'black'}} onClick={()=>{navigate(`/admincompetition/${curcompetition.id}`)}}>대회수정하기</button>
                                {curcompetition.status === 'ACTIVE' ? <button style={{background:'gray', color:'black'}} onClick={async()=>{
                                    InActivePatch(curcompetition.id)                                    
                                    }}>비활성화하기</button> 
                                : <button style={{background:'red', color:'black'}} onClick={()=>{
                                    ActivePatch(curcompetition.id)
                                    }}>활성화하기</button> }
                                <button style={{background:'lightblue', color:'black'}} onClick={()=>{navigate(`/Admincompetition/imageupload/${curcompetition.id}`)}}>포스터업로드하기</button>
                            </div>
                        </div> 
                    </div>
                </li>
            )
        })
    }





  return (
    <div className='admin-competition-schedule-wrapper'>
        <div className='admin-competition-searchzone'>
            <div className='admin-competition-searchzone-wrapper'>
                <div className='admin-competition-searchzone-title'>대회일정</div>
                <div className='admin-competition-searchzone-fake'>
                    <img className='admin-competition-searchzone-input-icon' src='Assets/검색돋보기아이콘.svg' alt="돋보기아이콘" onClick={()=>{
                        setTitle(temTitle);
                        listRefresh()
                    }}/>
                    <input className='admin-competition-searchzone-input' value={temTitle} placeholder='대회 이름 직접 검색하기' onChange={(e)=> setTemTitle(e.target.value)}/>
                </div>
                <div className='admin-competition-searchzone-options'>
                    <div className='admin-competition-searchzone-options-date'>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <DesktopDatePicker
                    label="시작 날짜"
                    views={['year', 'month', 'day']}
                    minDate={dayjs('2022-1-1')} // 올해로 한정될수 있게 변수값을 고쳐야함 
                    maxDate={dayjs('2022-12-31')} // 올해로 한정될수 있게 변수값을 고쳐야함 
                    inputFormat="MM.DD~" 
                    componentsProps={{
                    actionBar: {
                        actions: ['clear'],
                    },
                    }}
                    value={startDate || null}
                    onChange={(newvalue)=>{
                        if(newvalue === null){
                            setStartDate('')
                            listRefresh();
                            return;
                        }
                        if(newvalue.format('YYYY-MM-DD') != 'Invalid Date'){
                            setStartDate(newvalue.format('YYYY-MM-DD'))
                            listRefresh();
                        }
                    }}
                    renderInput={(params) => <TextField sx={{width: '100%', "& fieldset": {borderRadius: '0', borderTop: 'none', borderLeft: 'none', borderRight: 'none', height: '44px', borderBottom:'1px solid #999999 ' }}}  {...params} />}
                    />
                    </LocalizationProvider>
                    </div>
                    <div className='admin-competition-searchzone-options-location'>
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
                </div>
            </div>
        </div>
        <div className='admin-competition-list'>
            <ul class='admin-competition-row'>
                {renderCompetitionList()}
                {isLoading && <div style={{fontsize: '200px', margin: '0 2rem'}}>Loading...</div>}
                {!isLoading && <div style={{fontsize: '200px', margin: '0 2rem'}}ref={setLastElement}>해당 대회가 모두 로딩되었습니다.</div>}
            </ul>
        </div>
    </div>
  )
}

export default AdminCompetitionlist