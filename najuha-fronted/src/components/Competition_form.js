import React from 'react';
import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import './competition_form.css'

function Competition_form() {
    const {id} = useParams();
    const [title, setTitle] = useState("")
    const [doreOpen, setDoreOpen] = useState("")
    const [registrationDate, setRegistrationDate] = useState("")
    const [registrationDeadLine, setRegistrationDeadLine] = useState("")
    const [location, setLocation] = useState("")


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
                earlybird:{ 
                    price: "",
                    deadline: ""
                },
                normalPrice:{
                    price: ""
                }
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
                    earlybird:{ 
                        price: "",
                        deadline: ""
                    },
                    normalPrice:{
                        price: ""
                    }
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
        newDiv[i].pricingPolicy.earlybird.price = text;
        setDivisions(newDiv);
        console.log(newDiv[i].pricingPolicy.earlybird.price)
    }

    function changeEarlybirdDeadline(text, i){
        let newDiv = [...divisions]
        newDiv[i].pricingPolicy.earlybird.deadline = text;
        setDivisions(newDiv);
        console.log(newDiv[i].pricingPolicy.earlybird.deadline)
    }

    function changeNormalPrice(text, i){
        let newDiv = [...divisions]
        newDiv[i].pricingPolicy.normalPrice.price = text;
        setDivisions(newDiv);
        console.log(newDiv[i].pricingPolicy.normalPrice.price = text)
    }


    function commitToDB(){
        console.log(divisions)
        // axios.post(`http://localhost:8000/add_questions/${id}`, {
        //     'title': title,
        //     'doreOpen': doreOpen,
        //     'registrationDate': registrationDate,
        //     'registrationDeadLine': registrationDeadLine,
        //     'location': location,
        //     'division': divisions,
        // })
    }

    function divisionsUI(){
        return divisions.map((divs, i) => {
            return(
                <div className='division'>
                    <h1>{i+1} 디비전</h1>
                    <div className='constantFactor'>
                        <h3>constantFactor</h3>
                        <h3>도복 유/무</h3>
                        <div className='uniform'>
                            <h4>기</h4>
                            <input type='radio' value='기' checked={divs.constantFactor.uniform === '기'} onClick={(e) =>{changeUniform(e.target.value, i)}}/>
                            <input type='radio' value='노기' checked={divs.constantFactor.uniform === '노기'} onClick={(e) =>{changeUniform(e.target.value, i)}}/>
                            <h4>노기</h4>
                        </div>
                        <h3>성별</h3>
                        <div className='gender'>
                            <h4>남자</h4>
                            <input type='radio' value='남자' checked={divs.constantFactor.gender === '남자'} onClick={(e) =>{changeGender(e.target.value, i)}}/>
                            <input type='radio' value='여자' checked={divs.constantFactor.gender === '여자'} onClick={(e) =>{changeGender(e.target.value, i)}}/>
                            <h4>여자</h4>
                        </div>
                        <input className='name' type='text' placeholder='나이 ex)초등부, 중등부, 마스터부, 어덜트' value={divs.constantFactor.name} onChange={(e) => {changeName(e.target.value, i)}}></input>
                        <div>
                            <input type='number' placeholder='몇년생부터 ex)2010' value={divs.constantFactor.birth[0]} onChange={(e) => {changeBirthStart(e.target.value, i)}}></input>
                            <input type='number' placeholder='몇년생까지 ex)2015' value={divs.constantFactor.birth[1]} onChange={(e) => {changeBirthEnd(e.target.value, i)}}></input>
                        </div>
                    </div>

                    <div className='variableFactor'>
                        <h3>variableFactor</h3>
                        <input className='weight' type='text' placeholder='체급 ex)-30,-35,-40,-45,-50,-55,+55' value={divs.variableFactor.weight} onChange={(e) => {changeWeight(e.target.value, i)}}></input>
                        <input className='belt' type='text' placeholder='벨트 ex)white,blue,purple,black' value={divs.variableFactor.belt} onChange={(e) => {changeBelt(e.target.value, i)}}></input>
                    </div>

                    <div className='pricingPolicy'>
                        <h3>pricingPolicy</h3>
                        <input className='earlybird_price' type='number' placeholder='얼리버드가격 ex)30000' value={divs.pricingPolicy.earlybird.price} onChange={(e) => {changeEarlybirdPrice(e.target.value, i)}}></input>
                        <input className='earlybird_price' type='text' placeholder='얼리버드기한 ex)2022-08-27 00:00:00' value={divs.pricingPolicy.earlybird.deadline} onChange={(e) => {changeEarlybirdDeadline(e.target.value, i)}}></input>
                    </div>

                    <div className='normalPrice'>
                        <h3>normalPrice</h3>
                        <input className='price' type='number' placeholder='일반가격 ex)40000' value={divs.pricingPolicy.normalPrice.price} onChange={(e) => {changeNormalPrice(e.target.value, i)}}></input>
                    </div>
                    <button onClick={addMoreDivision}>디비전추가하기</button>
                    <button onClick={() => {copyDivision(i)}}>디비전복사하기</button>
                    <button onClick={() => {deleteDivision(i)}}>디비전삭제하기</button>
                </div>

            )
        })
    }


  return (
    <div className='competition_register_form'>
        <div className='section'>
            <div className='competition_register_top'>
                <input type='text' className='competition_register_top_title' placeholder='대회이름' value={title} onChange={(e) => {setTitle(e.target.value)}}></input>
                <input type='text' className='competition_register_top_doreOpen' placeholder='대회날짜 ex)0000-00-00 00:00:00' value={doreOpen} onChange={(e) => {setDoreOpen(e.target.value)}}></input>
                <input type='text' className='competition_register_top_registrationDate' placeholder='등록시작 ex)0000-00-00 00:00:00' value={registrationDate} onChange={(e) => {setRegistrationDate(e.target.value)}}></input>
                <input type='text' className='competition_register_top_registrationDeadLine' placeholder='등록마감 ex)0000-00-00 00:00:00' value={registrationDeadLine} onChange={(e) => {setRegistrationDeadLine(e.target.value)}}></input>
                <input type='text' className='competition_register_top_location' placeholder='장소' value={location} onChange={(e) => {setLocation(e.target.value)}}></input>
            </div>
        </div>

        {divisionsUI()}
        <button id='save' onClick={commitToDB}>대회등록하기</button>
    </div>
  )
}

export default Competition_form