import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './competitionform.css'
import { Cookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'

function Competition_form() {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [host, setHost] = useState('')
  const [doreOpen, setDoreOpen] = useState('')
  const [registrationDate, setRegistrationDate] = useState('')
  const [registrationDeadLine, setRegistrationDeadLine] = useState('')
  const [earlybirdDeadline, setEarlybirdDeadline] = useState('')
  const [location, setLocation] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [infomation, setInfomation] = useState('')
  const [applicantTableOpenDate, setApplicantTableOpenDate] = useState('')
  const [tournamentTableOpenDate, setTournamentTableOpenDate] = useState('')
  const [isPartnership, setIsPartnership] = useState('')
  const [nonPartnershipPageLink, setNonPartnershipPageLink] = useState('')
  const [mode, setMode] = useState('post')
  const [competition, setCompetition] = useState(null)
  let navigate = useNavigate()

  const cookies = new Cookies()

  const [divisions, setDivisions] = useState([
    {
      constantFactor: {
        uniform: '',
        gender: '',
        divisionName: '',
        birth: [null, null],
      },
      variableFactor: {
        weight: [],
        belt: [],
      },
      pricingPolicy: {
        earlyBird: '',
        normal: '',
        withGi: '',
        withOther: '',
      },
    },
  ])
  function copyDivision(i) {
    let newdiv = [...divisions]
    let newCopydiv = JSON.parse(JSON.stringify(newdiv[i]))
    setDivisions([...divisions, newCopydiv])
  }

  function deleteDivision(i) {
    let newdiv = [...divisions]
    if (newdiv.length > 1) newdiv.splice(i, 1)
    setDivisions(newdiv)
  }

  function addMoreDivision() {
    setDivisions([
      ...divisions,
      {
        constantFactor: {
          uniform: '',
          gender: '',
          divisionName: '',
          birth: [null, null],
        },
        variableFactor: {
          weight: [],
          belt: [],
        },
        pricingPolicy: {
          earlyBird: '',
          normal: '',
        },
      },
    ])
  }

  function changeUniform(text, i) {
    let newDiv = [...divisions]
    newDiv[i].constantFactor.uniform = text
    setDivisions(newDiv)
    console.log(divisions[i].constantFactor.uniform)
  }

  function changeGender(text, i) {
    let newDiv = [...divisions]
    newDiv[i].constantFactor.gender = text
    setDivisions(newDiv)
    console.log(divisions[i].constantFactor.gender)
  }

  function changeName(text, i) {
    let newDiv = [...divisions]
    newDiv[i].constantFactor.divisionName = text
    setDivisions(newDiv)
    console.log(divisions[i].constantFactor.divisionName)
  }

  function changeBirthStart(text, i) {
    let newDiv = [...divisions]
    newDiv[i].constantFactor.birth[0] = Number(text)
    setDivisions(newDiv)
    console.log(divisions[i].constantFactor.birth[0])
  }

  function changeBirthEnd(text, i) {
    let newDiv = [...divisions]
    newDiv[i].constantFactor.birth[1] = Number(text)
    setDivisions(newDiv)
    console.log(divisions[i].constantFactor.birth[1])
  }

  function changeWeight(text, i) {
    let newDiv = [...divisions]
    text = text.replace(/ /g, '')
    newDiv[i].variableFactor.weight = text.split(',')
    setDivisions(newDiv)
    console.log(divisions[i].variableFactor.weight)
  }

  function changeBelt(text, i) {
    let newDiv = [...divisions]
    text = text.replace(/ /g, '')
    newDiv[i].variableFactor.belt = text.split(',')
    setDivisions(newDiv)
    console.log(divisions[i].variableFactor.belt)
  }

  function changeEarlybirdPrice(text, i) {
    let newDiv = [...divisions]
    newDiv[i].pricingPolicy.earlyBird = Number(text)
    setDivisions(newDiv)
    console.log(newDiv[i].pricingPolicy.earlyBird)
  }

  function changeNormalPrice(text, i) {
    let newDiv = [...divisions]
    newDiv[i].pricingPolicy.normal = Number(text)
    console.log(newDiv[i].pricingPolicy.normal)
    setDivisions(newDiv)
  }

  function changewithGiPrice(text, i) {
    let newDiv = [...divisions]
    newDiv[i].pricingPolicy.withGi = Number(text)
    setDivisions(newDiv)
    console.log(newDiv[i].pricingPolicy.withGi)
  }

  function changewithOtherPrice(text, i) {
    let newDiv = [...divisions]
    newDiv[i].pricingPolicy.withOther = Number(text)
    setDivisions(newDiv)
    console.log(newDiv[i].pricingPolicy.withOther)
  }

  function postToDB() {
    console.log(divisions)

    axios({
      method: 'post',
      headers: {
        'x-access-token': cookies.get('x-access-token'),
      },
      url: `${process.env.REACT_APP_BACK_END_API}/admin/competitions`,
      data: {
        title: title,
        host: host,
        doreOpen: doreOpen,
        registrationDate: registrationDate,
        registrationDeadline: registrationDeadLine,
        location: location,
        bankAccount: bankAccount,
        earlyBirdDeadline: earlybirdDeadline,
        information: infomation,
        applicantTableOpenDate: applicantTableOpenDate,
        tournamentTableOpenDate: tournamentTableOpenDate,
        division: divisions,
        isPartnership: isPartnership === 'true' ? true : false,
        nonPartnershipPageLink: nonPartnershipPageLink,
      },
    })
      .then(res => {
        console.log(res)
        alert('대회등록이 완료되었습니다.')
        navigate('/Admincompetition/')
      })
      .catch(err => {
        console.log(err)
        alert('대회등록이 실패하였습니다.')
      })
  }

  function copyToDB() {
    console.log(divisions)

    axios({
      method: 'post',
      headers: {
        'x-access-token': cookies.get('x-access-token'),
      },
      url: `${process.env.REACT_APP_BACK_END_API}/admin/competitions`,
      data: {
        title: `copied ${title}`,
        host: host,
        doreOpen: doreOpen,
        registrationDate: registrationDate,
        registrationDeadline: registrationDeadLine,
        location: location,
        bankAccount: bankAccount,
        earlyBirdDeadline: earlybirdDeadline,
        information: infomation,
        applicantTableOpenDate: applicantTableOpenDate,
        tournamentTableOpenDate: tournamentTableOpenDate,
        division: divisions,
        isPartnership: isPartnership === 'true' ? true : false,
        nonPartnershipPageLink: nonPartnershipPageLink,
      },
    })
      .then(res => {
        console.log(res)
        alert('대회복사가 완료되었습니다.')
        navigate('/Admincompetition/')
      })
      .catch(err => {
        console.log(err)
        alert('대회복사에 실패하였습니다.')
      })
  }

  function patchToDB() {
    console.log(divisions)

    axios({
      method: 'patch',
      headers: {
        'x-access-token': cookies.get('x-access-token'),
      },
      url: `${process.env.REACT_APP_BACK_END_API}/admin/competitions/${id}`,
      data: {
        title: title,
        host: host,
        doreOpen: doreOpen,
        registrationDate: registrationDate,
        registrationDeadline: registrationDeadLine,
        location: location,
        bankAccount: bankAccount,
        earlyBirdDeadline: earlybirdDeadline,
        information: infomation,
        applicantTableOpenDate: applicantTableOpenDate,
        tournamentTableOpenDate: tournamentTableOpenDate,
        division: divisions,
        isPartnership: isPartnership === 'true' ? true : false,
        nonPartnershipPageLink: nonPartnershipPageLink,
      },
    })
      .then(res => {
        console.log(res)
        alert('대회수정이 완료되었습니다.')
      })
      .catch(err => {
        console.log(err)
        alert('대회수정이 실패하였습니다.')
      })
  }

  function loadingCompetition(competition) {
    setTitle(competition.title)
    setHost(competition.host)
    setDoreOpen(competition.doreOpen)
    setRegistrationDate(competition.registrationDate)
    setRegistrationDeadLine(competition.registrationDeadline)
    setEarlybirdDeadline(competition.earlyBirdDeadline)
    setLocation(competition.location)
    setBankAccount(competition.bankAccount)
    setInfomation(competition.information)
    setApplicantTableOpenDate(competition.applicantTableOpenDate)
    setTournamentTableOpenDate(competition.tournamentTableOpenDate)
    setDivisions(competition.division)
    setIsPartnership(competition.isPartnership.toString())
    setNonPartnershipPageLink(competition.nonPartnershipPageLink)
  }

  // async/await 를 활용하는 수정된 방식

  const getCompetition = async id => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_END_API}/admin/competitions/${id}`,
        {
          headers: {
            'x-access-token': cookies.get('x-access-token'),
          },
        }
      )
      const newCompetition = response.data.result
      setCompetition(newCompetition)
    } catch (err) {
      console.log(err)
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
  //     console.log('성공')
  // })
  // .catch((err) => {
  //     console.log(err)
  //     console.log(err.response.status);
  // })
  // return ;

  function divisionsUI() {
    return divisions.map((divs, i) => {
      return (
        <div className="division" key={i}>
          <h1>{i + 1} 디비전</h1>
          <div className="constantFactor">
            <h3>constantFactor</h3>
            <h3>도복 유/무</h3>
            <div className="uniform">
              <h4>기</h4>
              <input
                type="radio"
                value="gi"
                checked={divs.constantFactor.uniform === 'gi'}
                onChange={e => {
                  changeUniform(e.target.value, i)
                }}
              />
              <input
                type="radio"
                value="no-gi"
                checked={divs.constantFactor.uniform === 'no-gi'}
                onChange={e => {
                  changeUniform(e.target.value, i)
                }}
              />
              <h4>노기</h4>
            </div>
            <h3>성별</h3>
            <div className="gender">
              <h4>남자</h4>
              <input
                type="radio"
                value="male"
                checked={divs.constantFactor.gender === 'male'}
                onChange={e => {
                  changeGender(e.target.value, i)
                }}
              />
              <input
                type="radio"
                value="female"
                checked={divs.constantFactor.gender === 'female'}
                onChange={e => {
                  changeGender(e.target.value, i)
                }}
              />
              <h4>여자</h4>
            </div>
            <input
              className="divisionName"
              type="text"
              placeholder="나이 ex)초등부, 중등부, 마스터부, 어덜트"
              value={divs.constantFactor.divisionName || ''}
              onChange={e => {
                changeName(e.target.value, i)
              }}
            ></input>
            <div>
              <input
                type="text"
                placeholder="몇년생부터 ex)2010"
                value={divs.constantFactor.birth[0] || 0}
                onChange={e => {
                  changeBirthStart(e.target.value, i)
                }}
              ></input>
              <input
                type="text"
                placeholder="몇년생까지 ex)2015"
                value={divs.constantFactor.birth[1] || 9999}
                onChange={e => {
                  changeBirthEnd(e.target.value, i)
                }}
              ></input>
            </div>
          </div>

          <div className="variableFactor">
            <h3>variableFactor</h3>
            <input
              className="weight"
              type="text"
              placeholder="체급 ex)-30,-35,-40,-45,-50,-55,+55"
              value={divs.variableFactor.weight || []}
              onChange={e => {
                changeWeight(e.target.value, i)
              }}
            ></input>
            <input
              className="belt"
              type="text"
              placeholder="벨트 ex)white,blue,purple,black"
              value={divs.variableFactor.belt}
              onChange={e => {
                changeBelt(e.target.value, i)
              }}
            ></input>
          </div>

          <div className="normalPrice">
            <h3>normalPrice</h3>
            <input
              className="price"
              type="text"
              placeholder="일반가격 ex)40000"
              value={divs.pricingPolicy.normal || 0}
              onChange={e => {
                changeNormalPrice(e.target.value, i)
              }}
            ></input>
          </div>

          <div className="pricingPolicy">
            <h3>earlyBirdPrice</h3>
            <input
              className="earlybird_price"
              type="text"
              placeholder="얼리버드할인률 ex)10%하고싶으면 10"
              value={divs.pricingPolicy.earlyBird || 0}
              onChange={e => {
                changeEarlybirdPrice(e.target.value, i)
              }}
            ></input>
          </div>

          <div className="pricingPolicy">
            <h3>withGiPrice</h3>
            <input
              className="withGi_price"
              type="text"
              placeholder="withGi ex)-10000"
              value={divs.pricingPolicy.withGi || 0}
              onChange={e => {
                changewithGiPrice(e.target.value, i)
              }}
            ></input>
          </div>

          <div className="pricingPolicy">
            <h3>withOther</h3>
            <input
              className="withOther_price"
              type="text"
              placeholder="withOther ex)-10000"
              value={divs.pricingPolicy.withOther || 0}
              onChange={e => {
                changewithOtherPrice(e.target.value, i)
              }}
            ></input>
          </div>

          <button onClick={addMoreDivision}>디비전추가하기</button>
          <button
            onClick={() => {
              copyDivision(i)
            }}
          >
            디비전복사하기
          </button>
          <button
            onClick={() => {
              deleteDivision(i)
            }}
          >
            디비전삭제하기
          </button>
        </div>
      )
    })
  }

  useEffect(() => {
    if (Number(id)) {
      setMode('patch')
      getCompetition(id)
    }
  }, [])

  useEffect(() => {
    if (competition !== null) {
      console.log(competition)
      loadingCompetition(competition)
    }
  }, [competition])

  useEffect(() => {
    console.log(isPartnership)
  }, [isPartnership])

  return (
    <div className="competition_register_form">
      <div className="section">
        <div className="competition_register_top">
          <div className="competition_register_top_each">
            <h1>대회이름:</h1>
            <input
              type="text"
              className="competition_register_top_title"
              placeholder="대회이름"
              value={title}
              onChange={e => {
                setTitle(e.target.value)
              }}
            ></input>
          </div>
          <div className="competition_register_top_each">
            <h1>대회사:</h1>
            <input
              type="text"
              className="competition_register_top_host"
              placeholder="대회사"
              value={host}
              onChange={e => {
                setHost(e.target.value)
              }}
            ></input>
          </div>
          <div className="competition_register_top_each">
            <h1>대회날짜:</h1>
            <input
              type="text"
              className="competition_register_top_doreOpen"
              placeholder="대회날짜 ex)0000-00-00 00:00:00"
              value={doreOpen}
              onChange={e => {
                setDoreOpen(e.target.value)
              }}
            ></input>
          </div>
          <div className="competition_register_top_each">
            <h1>신청오픈날짜:</h1>
            <input
              type="text"
              className="competition_register_top_registrationDate"
              placeholder="신청시작 ex)0000-00-00 00:00:00"
              value={registrationDate}
              onChange={e => {
                setRegistrationDate(e.target.value)
              }}
            ></input>
          </div>
          <div className="competition_register_top_each">
            <h1>신청마감날짜:</h1>
            <input
              type="text"
              className="competition_register_top_registrationDeadLine"
              placeholder="신청마감 ex)0000-00-00 00:00:00"
              value={registrationDeadLine}
              onChange={e => {
                setRegistrationDeadLine(e.target.value)
              }}
            ></input>
          </div>
          <div className="competition_register_top_each">
            <h1>대회장소:</h1>
            <input
              type="text"
              className="competition_register_top_location"
              placeholder="장소"
              value={location}
              onChange={e => {
                setLocation(e.target.value)
              }}
            ></input>
          </div>
          <div className="competition_register_top_each">
            <h1>계좌번호:</h1>
            <input
              type="text"
              className="competition_register_top_bankAccount"
              placeholder="계좌번호"
              value={bankAccount}
              onChange={e => {
                setBankAccount(e.target.value)
              }}
            ></input>
          </div>
          <div className="competition_register_top_each">
            <h1>얼리버드기한날짜:</h1>
            <input
              type="text"
              className="competition_register_top_earlyBirdDeadline"
              placeholder="얼리버드기한 ex)2022-08-27 00:00:00"
              value={earlybirdDeadline}
              onChange={e => {
                setEarlybirdDeadline(e.target.value)
              }}
            ></input>
          </div>
          <div className="competition_register_top_each">
            <h1>대회정보(마크업템플릿맞춰서):</h1>
            <textarea
              type="text"
              className="competition_register_top_information"
              placeholder="대회정보"
              value={infomation}
              onChange={e => {
                setInfomation(e.target.value)
              }}
            ></textarea>
          </div>
          <div className="competition_register_top_each">
            <h1>선수명단오픈날짜:</h1>
            <input
              type="text"
              className="competition_register_top_applicantTableOpenDate"
              placeholder="선수명단오픈 ex)2022-08-27 00:00:00"
              value={applicantTableOpenDate}
              onChange={e => {
                setApplicantTableOpenDate(e.target.value)
              }}
            ></input>
          </div>
          <div className="competition_register_top_each">
            <h1>대진표오픈날짜:</h1>
            <input
              type="text"
              className="competition_register_top_tournamentTableLink"
              placeholder="대진표오픈 ex)2022-08-27 00:00:00"
              value={tournamentTableOpenDate}
              onChange={e => {
                setTournamentTableOpenDate(e.target.value)
              }}
            ></input>
          </div>
          <div className="competition_register_top_each">
            <h1>파트너쉽 유무</h1>
            <h4 id="competition_register_top_isPartnership-true">true</h4>
            <input
              id="competition_register_top_isPartnership"
              type="radio"
              value={'true'}
              checked={isPartnership === 'true'}
              onChange={e => {
                // console.log(e.target.value)
                setIsPartnership(e.target.value)
              }}
            />
            <input
              id="competition_register_top_isPartnership"
              type="radio"
              value={'false'}
              checked={isPartnership === 'false'}
              onChange={e => {
                // console.log(e.target.value)
                setIsPartnership(e.target.value)
              }}
            />
            <h4 id="competition_register_top_isPartnership-false">false</h4>
          </div>
          <div className="competition_register_top_each">
            <h1>대회사링크(파트너X)</h1>
            <input
              type="text"
              className="competition_register_top_nonPartnershipPageLink"
              placeholder="대회사 홈페이지 링크 ex)https://www.najuha.com"
              value={nonPartnershipPageLink}
              onChange={e => {
                setNonPartnershipPageLink(e.target.value)
              }}
            ></input>
          </div>
        </div>
      </div>

      {divisionsUI()}
      {mode === 'post' ? (
        <button id="save" onClick={postToDB}>
          대회등록하기
        </button>
      ) : (
        <div className="competition_register_patchcopy">
          <button id="copy" onClick={copyToDB}>
            대회복사하기
          </button>
          <button id="patch" onClick={patchToDB}>
            대회수정하기
          </button>
        </div>
      )}
    </div>
  )
}

export default Competition_form
