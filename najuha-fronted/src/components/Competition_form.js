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
              {birth: [null,null]}
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
              normalPrice: [
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

    function changeGender(text, i){
        let newDiv = [...divisions]
        newDiv[i].constantFactor[1].gender = text;
        setDivisions(newDiv);
        console.log(divisions[i].constantFactor[1].gender)
    }

    function changeName(text, i){
        let newDiv = [...divisions]
        newDiv[i].constantFactor[2].name = text;
        setDivisions(newDiv);
        console.log(divisions[i].constantFactor[2].name)
    }

    function changeBirthStart(text, i){
        let newDiv = [...divisions]
        newDiv[i].constantFactor[3].birth[0] = text;
        setDivisions(newDiv);
        console.log(divisions[i].constantFactor[3].birth[0])
    }

    function changeBirthEnd(text, i){
        let newDiv = [...divisions]
        newDiv[i].constantFactor[3].birth[1] = text;
        setDivisions(newDiv);
        console.log(divisions[i].constantFactor[3].birth[1])
    }

    function changeWeight(text, i){
        let newDiv = [...divisions]
        newDiv[i].variableFactor[0].weight = text.split(',');
        setDivisions(newDiv);
        console.log(divisions[i].variableFactor[0].weight)
    }

    function changeBelt(text, i){
        let newDiv = [...divisions]
        newDiv[i].variableFactor[1].belt = text.split(',');
        setDivisions(newDiv);
        console.log(divisions[i].variableFactor[1].belt)
    }

    function changeEarlybirdPrice(text, i){
        let newDiv = [...divisions]
        newDiv[i].pricingPolicy[0].earlybird[0].price = text;
        setDivisions(newDiv);
        console.log(newDiv[i].pricingPolicy[0].earlybird[0].price)
    }

    function changeEarlybirdDeadline(text, i){
        let newDiv = [...divisions]
        newDiv[i].pricingPolicy[0].earlybird[1].deadline = text;
        setDivisions(newDiv);
        console.log(newDiv[i].pricingPolicy[0].earlybird[1].deadline)
    }

    function changeNormalPrice(text, i){
        let newDiv = [...divisions]
        newDiv[i].normalPrice[0].price = text;
        setDivisions(newDiv);
        console.log(newDiv[i].normalPrice[0].price = text)
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
                            <input type='radio' value='남자' checked={divs.constantFactor[1].gender === '남자'} onClick={(e) =>{changeGender(e.target.value, i)}}/>
                            <input type='radio' value='여자' checked={divs.constantFactor[1].gender === '여자'} onClick={(e) =>{changeGender(e.target.value, i)}}/>
                            <h4>여자</h4>
                        </div>
                        <input className='name' type='text' placeholder='나이 ex)초등부, 중등부, 마스터부, 어덜트' value={divs.constantFactor[2].name} onChange={(e) => {changeName(e.target.value, i)}}></input>
                        <div>
                            <input type='number' placeholder='몇년생부터 ex)2010' value={divs.constantFactor[3].birth[0]} onChange={(e) => {changeBirthStart(e.target.value, i)}}></input>
                            <input type='number' placeholder='몇년생까지 ex)2015' value={divs.constantFactor[3].birth[1]} onChange={(e) => {changeBirthEnd(e.target.value, i)}}></input>
                        </div>
                    </div>

                    <div className='variableFactor'>
                        <h1>variableFactor</h1>
                        <input className='weight' type='text' placeholder='체급 ex)-30,-35,-40,-45,-50,-55,+55' value={divs.variableFactor[0].weight} onChange={(e) => {changeWeight(e.target.value, i)}}></input>
                        <input className='belt' type='text' placeholder='벨트 ex)white,blue,purple,black' value={divs.variableFactor[1].belt} onChange={(e) => {changeBelt(e.target.value, i)}}></input>
                    </div>

                    <div className='pricingPolicy'>
                        <h1>pricingPolicy</h1>
                        <input className='earlybird_price' type='number' placeholder='얼리버드가격 ex)30000' value={divs.pricingPolicy[0].earlybird[0].price} onChange={(e) => {changeEarlybirdPrice(e.target.value, i)}}></input>
                        <input className='earlybird_price' type='text' placeholder='얼리버드기한 ex)2022-08-27 00:00:00' value={divs.pricingPolicy[0].earlybird[1].deadline} onChange={(e) => {changeEarlybirdDeadline(e.target.value, i)}}></input>
                    </div>

                    <div className='normalPrice'>
                        <h1>normalPrice</h1>
                        <input className='price' type='number' placeholder='일반가격 ex)40000' value={divs.normalPrice[0].price} onChange={(e) => {changeNormalPrice(e.target.value, i)}}></input>
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