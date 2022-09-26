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
              {birth: []}
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
              nomal: [
                {price: ""}
            ]
        }
    ])
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
    </div>
  )
}

export default Competition_form