import React from 'react';
import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import './competition_form.css'

function Competition_form() {
    const {id} = useParams();
    const [title, setTitle] = useState("untitled")
    const [doreOpen, setDoreOpen] = useState("0000-00-00 00:00:00")
    const [registrationDate, setRegistrationDate] = useState("0000-00-00 00:00:00")
    const [registrationDeadLine, setRegistrationDeadLine] = useState("0000-00-00 00:00:00")
    const [location, setLocation] = useState("not yet")


    const [divisions, setDivisions] = useState(
        [{
            constantFactor: [
              {uniform: ""},
              {gender: ""},
              {name: ""},
              {birth: [0,0]}
            ],
            variableFactor: [
              {weight: []},
              {belt: []}
            ],
            pricingPolicy: [
              {earlybird:[ 
                {price: ""},
                {deadline: ""}
            ]}],
              nomalPrice: [
                {price: ""}
            ]
        }
    ])
    function changeUniform(text, i){
        let newDiv = [...divisions]
        newDiv[i].constantFactor[0].uniform = text;
        setDivisions(newDiv);
        console.log(divisions[i].constantFactor[0].uniform)
    }


    function commitToDB(){
        axios.post(`http://localhost:8000/add_questions/${id}`, {
            'title': title,
            'doreOpen': doreOpen,
            'registrationDate': registrationDate,
            'registrationDeadLine': registrationDeadLine,
            'location': location,
            'division': divisions,
        })
    }

    function divisionsUI(){
        return divisions.map((divs, i) => {
            return(
                <div className='division'>
                    <div className='constantFactor'>
                        <h1>constantFactor</h1>
                        <h3>도복 유/무</h3>
                        <div className='uniform'>
                            <h4>기</h4>
                            <input type='radio' value='기' checked={divs.constantFactor[0].uniform === '기'} onClick={(e) =>{changeUniform(e.target.value, i)}}/>
                            <input type='radio' value='노기' checked={divs.constantFactor[0].uniform === '노기'} onClick={(e) =>{changeUniform(e.target.value, i)}}/>
                            <h4>노기</h4>
                        </div>
                        <h3>성별</h3>
                        <div className='gender'>
                            <h4>남자</h4>
                            <input type='radio' value='남자' checked={divs.constantFactor.gender === 'male'} />
                            <input type='radio' value='여자' checked={divs.constantFactor.gender === 'female'} />
                            <h4>여자</h4>
                        </div>
                        <input className='name' type='text' placeholder='나이 ex)초등부, 중등부, 마스터부, 어덜트'></input>
                        <div>
                            <input type='number' placeholder='몇년생부터 ex)2010'></input>
                            <input type='number' placeholder='몇년생까지 ex)2015'></input>
                        </div>
                    </div>

                    <div className='variableFactor'>
                        <h1>variableFactor</h1>
                        <input className='weight' type='text' placeholder='체급 ex)-30,-35,-40,-45,-50,-55,+55'></input>
                        <input className='belt' type='text' placeholder='벨트 ex)white,blue,purple,black'></input>
                    </div>

                    <div className='pricingPolicy'>
                        <h1>pricingPolicy</h1>
                        <input className='earlybird_price' type='number' placeholder='가격 ex)30000'></input>
                        <input className='earlybird_price' type='text' placeholder='얼리버드기한 ex)2022-08-27 00:00:00'></input>
                    </div>

                    <div className='normalPrice'>
                        <h1>normalPrice</h1>
                        <input className='price' type='number' placeholder='가격 ex)40000'></input>
                    </div>
                </div>

            )
        })
    }


  return (
    <div className='competition_register_form'>
        <div className='section'>
            <div className='competition_register_top'>
                <input type='text' className='competition_register_top_title' placeholder='대회이름' onChange={(e) => {setTitle(e.target.value)}}></input>
                <input type='text' className='competition_register_top_doreOpen' placeholder='대회날짜 ex)0000-00-00 00:00:00' onChange={(e) => {setDoreOpen(e.target.value)}}></input>
                <input type='text' className='competition_register_top_registrationDate' placeholder='등록시작 ex)0000-00-00 00:00:00' onChange={(e) => {setRegistrationDate(e.target.value)}}></input>
                <input type='text' className='competition_register_top_registrationDeadLine' placeholder='등록마감 ex)0000-00-00 00:00:00' onChange={(e) => {setRegistrationDeadLine(e.target.value)}}></input>
                <input type='text' className='competition_register_top_location' placeholder='장소' onChange={(e) => {setLocation(e.target.value)}}></input>
            </div>
        </div>

        {divisionsUI()}
    </div>
  )
}

export default Competition_form