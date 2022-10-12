import axios from 'axios'
import React, {useState, useEffect, useRef} from 'react'
import './competitionlist.css'

function Competitionlist() {
    const [competitions, setCompetitions] = useState([])
    const [week, setWeek] = useState(['일', '월', '화', '수', '목', '금', '토'])
    const [isLoading, setIsLoading] = useState(false)
    const [lastElement, setLastElement] = useState('')
    const [offset, setOffset] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [location, setLocation] = useState('');
    const [title, setTitle] = useState('')
    const offsetRef = useRef();
    const locationRef = useRef();
    const startDateRef = useRef();
    const titleRef = useRef();
    offsetRef.current = offset;
    locationRef.current = location;
    startDateRef.current = startDate;
    titleRef.current = title;
    
    const observer = useRef(new IntersectionObserver(async (entries)=>{
        const first = entries[0]
        if(first.isIntersecting){
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
    }, [lastElement])

    useEffect(() => {
        console.log(competitions.length)
    }, [competitions])

    useEffect(() => {
        console.log(`offset값은: ${offset}`)
    }, [offset])

    useEffect(() => {
        console.log(`location값은: ${location}`)
    }, [location])



    // useEffect(() => {
    //     async function getCompetitionList(){
    //         axios.get(`${process.env.REACT_APP_BACK_END_API}/competitions`,
    //         {
    //             headers: {
    //                 'x-access-token':  process.env.REACT_APP_BACK_END_TOKEN
    //             }
    //         })
    //         .then((res) => {
    //             setCompetitions(res.data.result)
    //             console.log('성공')
    //         })
    //         .catch((err) => {
    //             console.log(err)
    //             console.log(err.response.status);
    //         })
    //         return ;
    //     }
    //     getCompetitionList()
    // }, [])

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
        <button value='서울' onClick={(e)=>setLocation(e.target.value)}>서울</button>
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