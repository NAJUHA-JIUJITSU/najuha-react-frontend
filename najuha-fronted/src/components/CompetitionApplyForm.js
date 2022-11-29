import React, { useEffect, useState } from 'react'
import './competitionApplyForm.css'
import reseticon from '../src_assets/리셋아이콘.svg'
import complete from '../src_assets/완료아이콘.svg'
import notcomplete from '../src_assets/미완료아이콘.svg'
import plus from '../src_assets/대회추가아이콘.svg';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import {useParams} from 'react-router-dom';
import ApplyModal from './ApplyModal'

function CompetitionApplyForm() {
    const {id} = useParams();
    const [totalprice, setTotalPrice] = useState(0);
    const [competition, setCompetition] = useState(null);
    const [applymodal, setapplymodal] = useState(false);
    const cookies = new Cookies();
    const [fillteredcompetition, setFillteredCompetition] = useState(null);
    const [selectedcompetition, setSelectedCompetition] = useState([]);
    const [competitionApplicationList, setCompetitionApplicationList] = useState(
        [{
            isMyself: true,
            playerName: "",
            playerBirth: "",
            phoneNumber: "",
            uniform: null,
            divisionName: null,
            gender: null,
            belt: null,
            weight: null,
            team: "김포 골든라이언",
            competitionId: id,
            price: null,
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

    const getTotalPrice = async (id) => {
        axios({
            method: "get",
            headers: {
              "x-access-token":  cookies.get("x-access-token")
            },
            url: `${process.env.REACT_APP_BACK_END_API}/competitions/${id}/prices`,
            data: {
                isGroup: false,
                divisions: [...competitionApplicationList]
            }
          })
          .then(res => {
            console.log(res);

          })
          .catch(err => {
            console.log(err)
          })
    }

    // const postCompetition = async () => {
    //     try {
    //         const response = await axios.post(`${process.env.REACT_APP_BACK_END_API}/competitionApplications`, {
    //             headers: {
    //                 "x-access-token":  cookies.get("x-access-token")
    //             },
    //             body: {competitionApplicationList}
    //         });
    //         console.log(response)
    //     } catch(err) {
    //         console.log(err);
    //     }
    // }


    function postCompetition(){

        axios({
            method: "post",
            headers: {
              "x-access-token":  cookies.get("x-access-token")
            },
            url: `${process.env.REACT_APP_BACK_END_API}/competitionApplications`,
            data: {
                competitionApplicationList
            }
          })
          .then(res => {
            console.log(res)

          })
          .catch(err => {
            console.log(err)
          })
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

    useEffect(() => {
        console.log(competitionApplicationList)
    }, [competitionApplicationList])

    const curApplicationReset = (i) => {
        console.log(i);
        let cal = [...competitionApplicationList];
        cal[i] = {
            isMyself: '',
            playerName: "",
            playerBirth: "",
            phoneNumber: "",
            uniform: null,
            divisionName: null,
            gender: null,
            belt: null,
            weight: null,
            team: "김포 골든라이언",
            competitionId: id,
            price: null,
            check: 0, 
        }
        setCompetitionApplicationList(cal);
        setFillteredCompetition(competition.division);
    }

    // const calculatePrice = () => {        
    // }

    const curApplicationcomplete = (i) => {
        let cal = [...competitionApplicationList];
        cal[i].price = fillteredcompetition[0].pricingPolicy.normal;
        setCompetitionApplicationList(cal);
        getTotalPrice(id);
        setSelectedCompetition(fillteredcompetition[0]);
        // calculatePrice();
    }

    const addApplication = (i) => {
        let cal = [...competitionApplicationList];
        cal[i].check = 1;
        cal.push({
            isMyself: true,
            playerName: "",
            playerBirth: "",
            phoneNumber: "",
            uniform: null,
            divisionName: null,
            gender: null,
            belt: null,
            weight: null,
            team: "김포 골든라이언",
            competitionId: '',
            price: null,
            check: 0, 
        })
        setCompetitionApplicationList(cal);
        setFillteredCompetition(competition.division);
    }

    const checkInvaildApply = () => {
        let cal = [...competitionApplicationList];
        cal.forEach((x, i) => {
            if(x.price == null){
                cal.splice(i, 1);
            }
        })
        if(cal.length >= 1){
            setCompetitionApplicationList(cal);
            return true; 
        } else {
            alert('신청을 끝까지 완료해주셔야 합니다.')
            return false; 
        }
        
    }

    const applicationDetailUI = () => {
        return competitionApplicationList.map((application, i) => {
            return(
                <>
                <ul className='CompetitionApplyForm-top-table-item'>
                    <li>{application.uniform}</li>
                    <li>{application.divisionName}</li>
                    <li>{application.gender}</li>
                    <li>{application.belt}</li>
                    <li>{application.weight}</li>
                    <li>{application.price}</li>
                </ul>
                </>
            )
        })
    }

    const constfillteringcompetition = (value, part) => {
        console.log(value, part);
        let newfillteredcompetition = fillteredcompetition.filter((div) => div.constantFactor[part] == value);
        setFillteredCompetition(newfillteredcompetition);
    }

    const varfillteringcompetition = (value, part) => {
        console.log(value, part);
        let newfillteredcompetition = fillteredcompetition.filter((div) => div.variableFactor[part].includes(value));
        setFillteredCompetition(newfillteredcompetition);
    }


    const chooseUniformOption = (value, i) => {
        console.log(value);
        let cal = [...competitionApplicationList];
        cal[i].uniform = value;
        setCompetitionApplicationList(cal);
        constfillteringcompetition(value, 'uniform')
    }

    const chooseDivisionOption = (value, i) => {
        console.log(value);
        let cal = [...competitionApplicationList];
        cal[i].divisionName = value;
        setCompetitionApplicationList(cal);
        constfillteringcompetition(value, 'divisionName')
    }

    const chooseGenderOption = (value, i) => {
        console.log(value);
        let cal = [...competitionApplicationList];
        cal[i].gender = value;
        setCompetitionApplicationList(cal);
        constfillteringcompetition(value, 'gender')
    }

    const chooseWeightOption = (value, i) => {
        console.log(value);
        let cal = [...competitionApplicationList];
        cal[i].weight = value;
        setCompetitionApplicationList(cal);
        varfillteringcompetition(value, 'weight')
    }

    const chooseBeltOption = (value, i) => {
        console.log(value);
        let cal = [...competitionApplicationList];
        cal[i].belt = value;
        setCompetitionApplicationList(cal);
        varfillteringcompetition(value, 'belt')

    }

    const changePlayerName = (value) => {
        let cal = [...competitionApplicationList]
        cal.map(x => {
            x.playerName = value
        })
        setCompetitionApplicationList(cal);
    }

    const changePlayerBirth = (value) => {
        let cal = [...competitionApplicationList]
        cal.map(x => {
            x.playerBirth = value
        })
        setCompetitionApplicationList(cal);
    }

    const changephoneNumber = (value) => {
        let cal = [...competitionApplicationList]
        cal.map(x => {
            x.phoneNumber = value
        })
        setCompetitionApplicationList(cal);
    }

    const changeTeam = (value) => {
        let cal = [...competitionApplicationList]
        cal.map(x => {
            x.team = value
        })
        setCompetitionApplicationList(cal);
    }

    const chooseOptionUI = (application, i) => {
        if(application.uniform == null){
            let comuniform = [];
            fillteredcompetition.map((com, j) => {
                comuniform.push(com.constantFactor.uniform);
            })
            comuniform = [...new Set(comuniform)];
            return comuniform.map((el, h) => {
                return(
                    <li onClick={(() => chooseUniformOption(el, i))} >{el == 'gi' ? '기' : '노기'}</li>
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
                    <li onClick={(() => chooseDivisionOption(el, i))}>{el}</li>
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
                    <li onClick={(() => chooseGenderOption(el, i))}>{el}</li>
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
                    <li onClick={(() => chooseBeltOption(el, i))}>{el}</li>
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
                    <li onClick={(() => chooseWeightOption(el, i))}>{el}</li>
                )
            }) 
        } 
    }

    const optionUI = () => {
        return competitionApplicationList.map((application, i) => {
            return(
            <>
                {!application.check ? <>
                    <div className='CompetitionApplyForm-middle-function'>
                    <div className='CompetitionApplyForm-middle-function-re'>
                        <img src={reseticon} style={{cursor: 'pointer'}} onClick={() => curApplicationReset(i)}/>
                        <p>다시하기</p>
                    </div>
                    <div className='CompetitionApplyForm-middle-function-complete'>
                        {application.price  ? <><img src={plus} style={{cursor: 'pointer'}} onClick={() => addApplication(i)}/>
                        <p>대회추가</p></> : <><img src={notcomplete} style={{cursor: 'pointer'}} onClick={() => curApplicationcomplete(i)}/>
                        <p>선택완료</p></>}
                    </div>
                </div>
                <ul className='CompetitionApplyForm-middle-option'>
                    {fillteredcompetition != null ? (application.check == 0 ? chooseOptionUI(application, i) : '') : ''}
                </ul>
                {application.price  ? <h2 className='CompetitionApplyForm-middle-info-checkmessage'>대회를 더 신청하고자 한다면<br/> + 버튼을 클릭해주세요</h2> : application.weight == null ? <h2 className='CompetitionApplyForm-middle-info'>신청할 대회를 선택하세요</h2> : <h2 className='CompetitionApplyForm-middle-info-checkmessage'>해당 대회를 신청하고자 한다면 <br/> 선택완료를 클릭해주세요</h2>}
                </> : ''}
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
                    <li>벨트</li>
                    <li>체급</li>
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
                <h3>{totalprice}원</h3>
            </div>
            <button className='CompetitionApplyForm-bottom-payment' onClick={() => {
                if(checkInvaildApply())
                    setapplymodal(!applymodal);
            }}>결제하기</button>
            {
                applymodal && (
                    <ApplyModal closeModal={() => setapplymodal(!applymodal)} changePlayerName={changePlayerName} changePlayerBirth={changePlayerBirth} changephoneNumber={changephoneNumber} changeTeam={changeTeam} postCompetition={postCompetition}/>
                )
            }
        </div>
    </div>
  )
}

export default CompetitionApplyForm