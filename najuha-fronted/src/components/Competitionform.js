import React from 'react';
import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import './competitionform.css'
import { Cookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

function Competition_form() {
    const {id} = useParams();
    const [title, setTitle] = useState("")
    const [host, setHost] = useState("");
    const [doreOpen, setDoreOpen] = useState("")
    const [registrationDate, setRegistrationDate] = useState("")
    const [registrationDeadLine, setRegistrationDeadLine] = useState("")
    const [earlybirdDeadline, setEarlybirdDeadline] = useState("")    
    const [location, setLocation] = useState("")
    const [bankAccount, setBankAccount] = useState("")
    const [infomation, setInfomation] = useState("")
    const [mode, setMode] = useState("post")
    const [competition, setCompetition] = useState(null)
    let navigate = useNavigate();

    const cookies = new Cookies();

    const [divisions, setDivisions] = useState(
        [{
            constantFactor:{ 
                uniform: "",
                gender: "",
                name: "",
                birth: [null,null]
            },
            variableFactor:{
                weight: [],
                belt: []
            },
            pricingPolicy:{
                earlyBird: "",
                normal: "",
                withGi: "",
            }
        }
    ])
    function copyDivision(i){
        let newdiv=[...divisions]
        let newCopydiv = JSON.parse(JSON.stringify(newdiv[i]))
        setDivisions([...divisions, newCopydiv])
    }

    function deleteDivision(i){
        let newdiv=[...divisions]
        if(newdiv.length > 1)
            newdiv.splice(i, 1)
        setDivisions(newdiv)
    } 

    function addMoreDivision(){
        setDivisions([...divisions,
            {
                constantFactor:{ 
                    uniform: "",
                    gender: "",
                    name: "",
                    birth: [null,null]
                },
                variableFactor:{
                    weight: [],
                    belt: []
                },
                pricingPolicy:{
                    earlyBird: "",
                    normal: ""
                }
            }
        ])
    }


    function changeUniform(text, i){
        let newDiv = [...divisions]
        newDiv[i].constantFactor.uniform = text;
        setDivisions(newDiv);
        console.log(divisions[i].constantFactor.uniform)
    }

    function changeGender(text, i){
        let newDiv = [...divisions]
        newDiv[i].constantFactor.gender = text;
        setDivisions(newDiv);
        console.log(divisions[i].constantFactor.gender)
    }

    function changeName(text, i){
        let newDiv = [...divisions]
        newDiv[i].constantFactor.name = text;
        setDivisions(newDiv);
        console.log(divisions[i].constantFactor.name)
    }

    function changeBirthStart(text, i){
        let newDiv = [...divisions]
        newDiv[i].constantFactor.birth[0] = text;
        setDivisions(newDiv);
        console.log(divisions[i].constantFactor.birth[0])
    }

    function changeBirthEnd(text, i){
        let newDiv = [...divisions]
        newDiv[i].constantFactor.birth[1] = text;
        setDivisions(newDiv);
        console.log(divisions[i].constantFactor.birth[1])
    }

    function changeWeight(text, i){
        let newDiv = [...divisions]
        newDiv[i].variableFactor.weight = text.split(',');
        setDivisions(newDiv);
        console.log(divisions[i].variableFactor.weight)
    }

    function changeBelt(text, i){
        let newDiv = [...divisions]
        newDiv[i].variableFactor.belt = text.split(',');
        setDivisions(newDiv);
        console.log(divisions[i].variableFactor.belt)
    }

    function changeEarlybirdPrice(text, i){
        let newDiv = [...divisions]
        newDiv[i].pricingPolicy.earlyBird = text;
        setDivisions(newDiv);
        console.log(newDiv[i].pricingPolicy.earlyBird)
    }

    function changeNormalPrice(text, i){
        let newDiv = [...divisions]
        newDiv[i].pricingPolicy.normal = text;
        setDivisions(newDiv);
        console.log(newDiv[i].pricingPolicy.normal = text)
    }

    function changewithGiPrice(text, i){
        let newDiv = [...divisions]
        newDiv[i].pricingPolicy.withGi = text;
        setDivisions(newDiv);
        console.log(newDiv[i].pricingPolicy.withGi)
    }


    function postToDB(){
        console.log(divisions)

        axios({
            method: "post",
            headers: {
              "x-access-token":  cookies.get("x-access-token")
            },
            url: `${process.env.REACT_APP_BACK_END_API}/admin/competitions`,
            data: {
                'title': title,
                'host': host,
                'doreOpen': doreOpen,
                'registrationDate': registrationDate,
                'registrationDeadline': registrationDeadLine,
                'location': location,
                'bankAccount': bankAccount,
                'earlybirdDeadline': earlybirdDeadline,
                'information': infomation,
                'division': JSON.stringify(divisions),
            }
          })
          .then(res => {
            console.log(res)
            alert('??????????????? ?????????????????????.')
            navigate('/Admincompetition/');
          })
          .catch(err => {
            console.log(err)
            alert('??????????????? ?????????????????????.')
          })
    }

    function patchToDB(){
        console.log(divisions)

        axios({
            method: "patch",
            headers: {
              "x-access-token":  cookies.get("x-access-token")
            },
            url: `${process.env.REACT_APP_BACK_END_API}/admin/competitions/${id}`,
            data: {
                'title': title,
                'host': host,
                'doreOpen': doreOpen,
                'registrationDate': registrationDate,
                'registrationDeadline': registrationDeadLine,
                'location': location,
                'bankAccount': bankAccount,
                'earlybirdDeadline': earlybirdDeadline,
                'information': infomation,
                'division': divisions,
            }
          })
          .then(res => {
            console.log(res)
            alert('??????????????? ?????????????????????.')
          })
          .catch(err => {
            console.log(err)
            alert('??????????????? ?????????????????????.')
          })
    }

    function loadingCompetition(competition) {
        setTitle(competition.title)
        setHost(competition.host)
        setDoreOpen(competition.doreOpen)
        setRegistrationDate(competition.registrationDate)
        setRegistrationDeadLine(competition.registrationDeadline)
        setEarlybirdDeadline(competition.earlybirdDeadline)
        setLocation(competition.location)
        setBankAccount(competition.bankAccount)
        setInfomation(competition.information)
        setDivisions(competition.division)
    }

    // async/await ??? ???????????? ????????? ??????
        
    const getCompetition = async (id) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_API}/competitions/${id}`, {
                headers: {
                    "x-access-token":  cookies.get("x-access-token")
                }
            });
            const newCompetition = response.data.result;
            setCompetition(newCompetition)
        } catch(err) {
            console.log(err);
        }
    }
        
        
        
        // axios.get(`${process.env.REACT_APP_BACK_END_API}/competitions/${id}`, {
        //     headers: {
        //         "x-access-token":  cookies.get("x-access-token")
        //     }
        // })
        // .then((res) => {
        //     let newCompetition = res.data.result
        //     setCompetition(newCompetition)
        //     console.log('??????')
        // })
        // .catch((err) => {
        //     console.log(err)
        //     console.log(err.response.status);
        // })
        // return ;



    function divisionsUI(){
        return divisions.map((divs, i) => {
            return(
                <div className='division'>
                    <h1>{i+1} ?????????</h1>
                    <div className='constantFactor'>
                        <h3>constantFactor</h3>
                        <h3>?????? ???/???</h3>
                        <div className='uniform'>
                            <h4>???</h4>
                            <input type='radio' value='gi' checked={divs.constantFactor.uniform === 'gi'} onClick={(e) =>{changeUniform(e.target.value, i)}}/>
                            <input type='radio' value='no-gi' checked={divs.constantFactor.uniform === 'no-gi'} onClick={(e) =>{changeUniform(e.target.value, i)}}/>
                            <h4>??????</h4>
                        </div>
                        <h3>??????</h3>
                        <div className='gender'>
                            <h4>??????</h4>
                            <input type='radio' value='male' checked={divs.constantFactor.gender === 'male'} onClick={(e) =>{changeGender(e.target.value, i)}}/>
                            <input type='radio' value='female' checked={divs.constantFactor.gender === 'female'} onClick={(e) =>{changeGender(e.target.value, i)}}/>
                            <h4>??????</h4>
                        </div>
                        <input className='name' type='text' placeholder='?????? ex)?????????, ?????????, ????????????, ?????????' value={divs.constantFactor.name} onChange={(e) => {changeName(e.target.value, i)}}></input>
                        <div>
                            <input type='number' placeholder='??????????????? ex)2010' value={divs.constantFactor.birth[0]} onChange={(e) => {changeBirthStart(e.target.value, i)}}></input>
                            <input type='number' placeholder='??????????????? ex)2015' value={divs.constantFactor.birth[1]} onChange={(e) => {changeBirthEnd(e.target.value, i)}}></input>
                        </div>
                    </div>

                    <div className='variableFactor'>
                        <h3>variableFactor</h3>
                        <input className='weight' type='text' placeholder='?????? ex)-30,-35,-40,-45,-50,-55,+55' value={divs.variableFactor.weight} onChange={(e) => {changeWeight(e.target.value, i)}}></input>
                        <input className='belt' type='text' placeholder='?????? ex)white,blue,purple,black' value={divs.variableFactor.belt} onChange={(e) => {changeBelt(e.target.value, i)}}></input>
                    </div>

                    <div className='normalPrice'>
                        <h3>normalPrice</h3>
                        <input className='price' type='number' placeholder='???????????? ex)40000' value={divs.pricingPolicy.normal} onChange={(e) => {changeNormalPrice(e.target.value, i)}}></input>
                    </div>

                    <div className='pricingPolicy'>
                        <h3>earlyBirdPrice</h3>
                        <input className='earlybird_price' type='number' placeholder='?????????????????? ex)-10000' value={divs.pricingPolicy.earlyBird} onChange={(e) => {changeEarlybirdPrice(e.target.value, i)}}></input>
                    </div>

                    <div className='pricingPolicy'>
                        <h3>withGiPrice</h3>
                        <input className='withGi_price' type='number' placeholder='withGi ex)-10000' value={divs.pricingPolicy.withGi} onChange={(e) => {changewithGiPrice(e.target.value, i)}}></input>
                    </div>

                    <button onClick={addMoreDivision}>?????????????????????</button>
                    <button onClick={() => {copyDivision(i)}}>?????????????????????</button>
                    <button onClick={() => {deleteDivision(i)}}>?????????????????????</button>
                </div>

            )
        })
    }

    useEffect(() => {
        if(Number(id)){
            setMode('patch')
            getCompetition(id);
            
        }
    },[])

    useEffect(() => {
        if(competition !== null){
            console.log(competition);
            loadingCompetition(competition)
        }
    },[competition])




  return (
    <div className='competition_register_form'>
        <div className='section'>
            <div className='competition_register_top'>
                <input type='text' className='competition_register_top_title' placeholder='????????????' value={title} onChange={(e) => {setTitle(e.target.value)}}></input>
                <input type='text' className='competition_register_top_host' placeholder='?????????' value={host} onChange={(e) => {setHost(e.target.value)}}></input>
                <input type='text' className='competition_register_top_doreOpen' placeholder='???????????? ex)0000-00-00 00:00:00' value={doreOpen} onChange={(e) => {setDoreOpen(e.target.value)}}></input>
                <input type='text' className='competition_register_top_registrationDate' placeholder='???????????? ex)0000-00-00 00:00:00' value={registrationDate} onChange={(e) => {setRegistrationDate(e.target.value)}}></input>
                <input type='text' className='competition_register_top_registrationDeadLine' placeholder='???????????? ex)0000-00-00 00:00:00' value={registrationDeadLine} onChange={(e) => {setRegistrationDeadLine(e.target.value)}}></input>
                <input type='text' className='competition_register_top_location' placeholder='??????' value={location} onChange={(e) => {setLocation(e.target.value)}}></input>
                <input type='text' className='competition_register_top_bankAccount' placeholder='????????????' value={bankAccount} onChange={(e) => {setBankAccount(e.target.value)}}></input>
                <input type='text' className='competition_register_top_earlyBirdDeadline' placeholder='?????????????????? ex)2022-08-27 00:00:00' value={earlybirdDeadline} onChange={(e) => {setEarlybirdDeadline(e.target.value)}}></input>
                <input type='text' className='competition_register_top_information' placeholder='????????????' value={infomation} onChange={(e) => {setInfomation(e.target.value)}}></input>
            </div>
        </div>

        {divisionsUI()}
        {mode==='post' ? <button id='save' onClick={postToDB}>??????????????????</button> :
        <button id='patch' onClick={patchToDB}>??????????????????</button>
        }
    </div>
  )
}

export default Competition_form