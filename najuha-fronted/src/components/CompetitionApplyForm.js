import React, { useEffect, useState } from 'react'
import './competitionApplyForm.css'
import reseticon from '../src_assets/리셋아이콘.svg'
import complete from '../src_assets/완료아이콘.svg'
import notcomplete from '../src_assets/미완료아이콘.svg'
import axios from 'axios';
import { Cookies } from 'react-cookie';
import {useParams} from 'react-router-dom';

function CompetitionApplyForm() {
    const {id} = useParams();
    const [isMyself, setIsMyself] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [playerBirth, setPlayerBirth] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');   
    const [uniform, setUniform] = useState('');
    const [divisionName, setDivisionName] = useState('');
    const [gender, setGender] = useState('');
    const [belt, setBelt] = useState('');
    const [weight, setWeight] = useState('');
    const [team, setTeam] = useState('');
    const [competitionId, setCompetitionId] = useState('');
    const [price, setPrice] = useState('');
    const [competition, setCompetition] = useState(null);
    const cookies = new Cookies();
    const [fillteredcompetition, setFillteredCompetition] = useState(null);
    const [competitionApplicationList, setCompetitionApplicationList] = useState(
        [{
            isMyself: '',
            playerName: "",
            playerBirth: "",
            phoneNumber: "",
            uniform: 'gi',
            divisionName: '일반부',
            gender: 'female',
            belt: null,
            weight: '-50',
            team: "김포 골든라이언",
            competitionId: '',
            price: '',
            check: 0, 
        },
    ])


    const getCompetition = async (id) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACK_END_API}/competitions/${id}`, {
                headers: {
                    "x-access-token":  cookies.get("x-access-token")
                }
            });
            const newCompetition = response.data.result;
            setCompetition(newCompetition)
            setFillteredCompetition(newCompetition.division);
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getCompetition(id);
    }, [])

    useEffect(() => {
        console.log(competition)
    }, [competition])

    useEffect(() => {
        console.log(fillteredcompetition)
    }, [fillteredcompetition])

    const applicationDetailUI = () => {
        return competitionApplicationList.map((application, i) => {
            return(
                <ul className='CompetitionApplyForm-top-table-item'>
                    <li>{application.uniform}</li>
                    <li>{application.divisionName}</li>
                    <li>{application.gender}</li>
                    <li>{application.weight}</li>
                    <li>{application.belt}</li>
                    <li>{application.price}</li>
                </ul>
            )
        })
    }

    // const chooseUniformOption = (application, i) => {

    // }

    const chooseOptionUI = (application, i) => {
        if(application.uniform == null){
            let comuniform = [];
            fillteredcompetition.map((com, j) => {
                comuniform.push(com.constantFactor.uniform);
            })
            comuniform = [...new Set(comuniform)];
            return comuniform.map((el, h) => {
                return(
                    <li onClick={(() => chooseUniformOption(application,i))}>{el == 'gi' ? '기' : '노기'}</li>
                )
            })
        } else if(application.divisionName == null){
            let comdi = [];
            fillteredcompetition.map((com, j) => {
                comdi.push(com.constantFactor.divisionName);
            })
            comdi = [...new Set(comdi)];
            return comdi.map((el, h) => {
                return(
                    <li>{el}</li>
                )
            })
        } else if(application.gender == null){
            let comgender = [];
            fillteredcompetition.map((com, j) => {
                comgender.push(com.constantFactor.gender);
                
            })
            comgender = [...new Set(comgender)];
            return comgender.map((el, h) => {
                return(
                    <li>{el}</li>
                )
            })
        } else if(application.weight == null){
            let comweight = [];
            fillteredcompetition.map((com, j) => {
                com.variableFactor.weight.map((wei, g) => {
                    comweight.push(wei);
                })
            })
            return comweight.map((el, h) => {
                return(
                    <li>{el}</li>
                )
            }) 
        } else if(application.belt == null){
            let combelt = [];
            fillteredcompetition.map((com, j) => {
                com.variableFactor.belt.map((bel, g) => {
                    combelt.push(bel);
                })
            })
            return combelt.map((el, h) => {
                return(
                    <li>{el}</li>
                )
            }) 
        }
    }

    const optionUI = () => {
        return competitionApplicationList.map((application, i) => {
            return(
            <>
                <div className='CompetitionApplyForm-middle-function'>
                    <div className='CompetitionApplyForm-middle-function-re'>
                        <img src={reseticon} style={{cursor: 'pointer'}}/>
                        <p>다시하기</p>
                    </div>
                    <div className='CompetitionApplyForm-middle-function-complete'>
                        <img src={notcomplete} style={{cursor: 'pointer'}}/>
                        <p>선택완료</p>
                    </div>
                </div>
                <ul className='CompetitionApplyForm-middle-option'>
                    {fillteredcompetition != null ? (application.check == 0 ? chooseOptionUI(application, i) : '') : ''}
                </ul>
                {/* <h2>해당 대회를 신청하고자 한다면 <br/> 선택완료를 클릭해주세요</h2> */}
                <h2 className='CompetitionApplyForm-middle-info'>신청할 대회를 선택하세요</h2>
            </>
            )
        })
    }


  return (
    <div className='CompetitionApplyForm-wrapper'>
        <div className='CompetitionApplyForm-top'>
            <h2 className='CompetitionApplyForm-top-title'>
                예거스 챔피언쉽 로컬대회 송도 오픈
            </h2>
            <div className='CompetitionApplyForm-top-table'>
                <ul className='CompetitionApplyForm-top-table-standard'>
                    <li>기노기</li>
                    <li>부문</li>
                    <li>성별</li>
                    <li>체급</li>
                    <li>벨트</li>
                    <li>참가비</li>
                </ul>
                {applicationDetailUI()}
            </div>
        </div>
        <div className='CompetitionApplyForm-middle'>
            {optionUI()}
        </div>
        <div className='CompetitionApplyForm-bottom'>
            <div className='CompetitionApplyForm-bottom-sum'>
                <p>총 결제금액</p>
                <h3>90,000원</h3>
            </div>
            <button className='CompetitionApplyForm-bottom-payment'>결제하기</button>
        </div>
    </div>
  )
}

export default CompetitionApplyForm