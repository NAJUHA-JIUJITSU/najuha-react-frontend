import React from 'react'
import {useState, useEffect} from 'react';
import './userInfo.css'
import axios from 'axios';
import ProfileTap from '../components/ProfileTap'

function UserInfo() {
    const [userInfo, serUserInfo] = useState([]);

    async function getUsers() {
        axios.get(`${process.env.REACT_APP_BACK_END_API}/users`,
        {
            headers: {
                'x-access-token':  process.env.REACT_APP_BACK_END_TOKEN
            }
        })
        .then((res) => {
            serUserInfo(res.data.result.userInfo);
            console.log(res.data.message);
        })
        .catch((err) => {
            console.log(err);
            console.log(err.response.status);
            console.log(err.response.data.message);
        })
        return ;
    }

    function userParsing(userInfo) {
        let fullName = userInfo.fullName;
        let email = userInfo.email;
        let phoneNumber = userInfo.phoneNumber;
        let gender = (userInfo.gender = 'male') ? '남자' : '여자';
        let belt = userInfo.belt;
        let weight = userInfo.weight + 'kg';

        return {
            'fullName' : fullName,
            'email' : email,
            'phoneNumber' : phoneNumber,
            'gender' : gender,
            'belt' : belt,
            'weight' : weight
        }
    }

    function userForm() {
        let user = userParsing(userInfo);

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
                    <p>{user.weight}</p>
                </div>
            </div>
        )
    }

    useEffect(() => {
        getUsers();
    }, [])

    return (
        <div className='UserInfo_wrapper'>
            <ProfileTap/>
            <div className='UserInfo_right'>
                <h2>내 프로필 관리</h2>
                {userForm()}
                <button className='UserInfo_updateBtn'>수정하기</button>
            </div>
        </div>
    )
}

export default UserInfo