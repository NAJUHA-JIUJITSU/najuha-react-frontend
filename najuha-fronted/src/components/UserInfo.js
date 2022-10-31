import React from 'react'
import {useState, useEffect, useRef} from 'react';
import './userInfo.css'
import axios from 'axios';
import ProfileTap from '../components/ProfileTap'
import { Cookies } from 'react-cookie';
import { useJwt } from "react-jwt";

function  UserInfo() {
    const [mode, setMode] = useState('READ');
    const [userInfo, setUserInfo] = useState([]);
    const [token, setToken] = useState(null);
    let user = userParsing(userInfo);
    let content = null
    const cookies = new Cookies();
    const xAccessToken = cookies.get("x-access-token");
    const { decodedToken, isExpired } = useJwt(xAccessToken);

    async function getUsers() {
        axios.get(`${process.env.REACT_APP_BACK_END_API}/users`,
        {
            headers: {
                'x-access-token': cookies.get("x-access-token")
            }
        })
        .then((res) => {
            setUserInfo(res.data.result.userInfo);
            console.log(res.data.message);
        })
        .catch((err) => {
            console.log(err);
            console.log(err.response.status);
            console.log(err.response.data.message);
        })
        return ;
    }

    async function updateUser(updateUerinfo) {
        console.log(updateUerinfo);
        axios({
            method: "patch",
            headers: {
              "x-access-token":  cookies.get("x-access-token")
            },
            url: `${process.env.REACT_APP_BACK_END_API}/users`,
            data: updateUerinfo
          })
          .then((res) => {
            if(decodedToken.userLevel === 1){
                alert('회원가입이 완료되었습니다')
            }
            cookies.set('x-access-token', res.data.result, { path: '/', overwrite: true})
            console.log(res.data.message);
            console.log(res.data.result);
            })
            .catch((err) => {
                console.log(err);
                console.log(err.response.data.message);
            })
          
        // axios.patch(`${process.env.REACT_APP_BACK_END_API}/users`,
        // {
        //     headers: {
        //         'x-access-token':  process.env.REACT_APP_BACK_END_TOKEN
        //     },
        //     data: updateUerinfo
        // })
        // .then((res) => {
        //     console.log(res.data.message);
        //     console.log(res.data.result);
        // })
        // .catch((err) => {
        //     console.log(err);
        //     console.log(err.response.data.message);
        // })
    }

    function userParsing(userInfo) {
        let fullName = userInfo.fullName;
        let email = userInfo.email;
        let phoneNumber = userInfo.phoneNumber;
        let gender = (userInfo.gender === 'male') ? '남자' : '여자';
        let belt = userInfo.belt;
        let weight = userInfo.weight;

        return {
            'fullName' : fullName,
            'email' : email,
            'phoneNumber' : phoneNumber,
            'gender' : gender,
            'belt' : belt,
            'weight' : weight
        }
    }

    function Read() {

        return (
            <div className='UserInfo_Boxs'>
            <div className='UserInfo_infoBox'>
                <span>이름</span>
                <p>{user.fullName}</p>
            </div>
            <div className='UserInfo_infoBox'>
                <span>성별</span>
                <p>{user.gender}</p>
            </div>
            <div className='UserInfo_infoBox'>
                <span>휴대폰</span>
                <p>{user.phoneNumber}</p>
            </div>
            <div className='UserInfo_infoBox'>
                <span>이메일</span>
                <p>{user.email}</p>
            </div>
            <div className='UserInfo_infoBox'>
                <span>벨트</span>
                <p>{user.belt}</p>
            </div>
            <div className='UserInfo_infoBox'>
                <span>체급</span>
                <p>{user.weight}kg</p>
            </div>
            <button className='UserInfo_updateBtn' onClick={(e) => {
                e.preventDefault()
                setMode('UPDATE')}}>수정하기</button>
        </div>
        )
    }

    function Update(props) {
        const [userInfos, setUserInfos] = useState(props.user);
    
        const handleChange = (e, title) => {
            console.log(userInfos);
            let newuserInfos = {...userInfos};
            newuserInfos[title] = e.target.value;
            setUserInfos(newuserInfos);
        }
    
        const onSumbit = (e)  => {
            e.preventDefault();
            let updateUerinfo = {
                'fullName': e.target.fullName.value,
                'email': e.target.email.value,
                'phoneNumber': e.target.phoneNumber.value,
                'gender': (e.target.male.checked) ? 'male' : 'female',
                'belt': e.target.belt.value,
                'weight': e.target.weight.value
    
            }
            setUserInfo(updateUerinfo);
            updateUser(updateUerinfo);
            console.log(updateUerinfo);
            setMode('READ');
            // getUsers();
        }
    
        return (
            <form onSubmit={(e)=>onSumbit(e)}>
                 <div className='UserInfo_infoBox'>
                <span>이름</span>
                <p><input type='text' name='fullName' placeholder={userInfos.fullName} value= {userInfos.fullName} onChange={(e)=>handleChange(e, 'fullName')}/></p>
                </div>
                <div className='UserInfo_infoBox'>
                    <span>성별</span>
                    <div className='UserInfo_genderCategory'>
                        <input type='radio' name='male' value='남자' id='male' checked={userInfos.gender === '남자'} onChange={(e)=>handleChange(e, 'gender')}/><p>남자</p>
                        <input type='radio' name='female' value='여자' id='female' checked={userInfos.gender === '여자'} onChange={(e)=>handleChange(e, 'gender')}/><p>여자</p>
                    </div>
                </div>
                <div className='UserInfo_infoBox'>
                    <span>휴대폰</span>
                    <p><input type='text' name='phoneNumber' placeholder={userInfos.phoneNumber} value={userInfos.phoneNumber} onChange={(e)=>handleChange(e, 'phoneNumber')}/></p>
                </div>
                <div className='UserInfo_infoBox'>
                    <span>이메일</span>
                    <p><input type='text' name='email' placeholder={userInfos.email} value={userInfos.email} onChange={(e)=>handleChange(e, 'email')}/></p>
                </div>
                <div className='UserInfo_infoBox'>
                    <span>벨트</span>
                    <p><input type='text' name='belt' placeholder={userInfos.belt} value={userInfos.belt} onChange={(e)=>handleChange(e, 'belt')}/></p>
                </div>
                <div className='UserInfo_infoBox'>
                    <span>체급</span>
                    <p><input type='text' name='weight' placeholder={userInfos.weight} value={userInfos.weight} onChange={(e)=>handleChange(e, 'weight')}/></p>
                </div>
                <button className='UserInfo_updateBtn' type='submit'>저장하기</button>
            </form>
        )
    }

    useEffect(() => {
        if(decodedToken){
            if(decodedToken.userLevel === 1){
                setMode('UPDATE')
            }
        }

        getUsers();
    }, [decodedToken])

    if(mode === 'READ') {
        content = <Read/>
    } else if(mode === 'UPDATE') {
        content = <Update user={user}/>
    }    

    return (
        <div className='UserInfo_wrapper'>
            <ProfileTap/>
            <div className='UserInfo_right'>
                <h2>내 프로필 관리</h2>
                {content}    
            </div>
        </div>
    )
}

export default UserInfo