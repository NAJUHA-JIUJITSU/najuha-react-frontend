import React from 'react'
import './applymodal.css'

function ApplyModal(props) {

    function closeModal() {
        props.closeModal();
    }

    function register(e) {
        e.preventDefault();
        props.postCompetition()
    }


  return (
    <div className="ApplyModal_Modal" >
      <div className="ApplyModal_modalBody" onClick={(e) => e.stopPropagation()}>
        <h2 id="ApplyModal_modaltitle">선수정보입력</h2>
        <button id="ApplyModal_modalCloseBtn" onClick={closeModal}>
          ✖
        </button>
        <form className='ApplyModal_modalform' onSubmit={register}>
            <div className='ApplyModal_modalinputdiv'>
                <label>성명</label>
                <input placeholder='성명을 입력해주세요' onChange={(e) => props.changePlayerName(e.target.value)}></input>
            </div>
            <div className='ApplyModal_modalinputdiv'>
                <label>번호</label>
                <input placeholder='번호를 -없이 입력해주세요' onChange={(e) => props.changephoneNumber(e.target.value)}></input>
            </div>
            <div id='ApplyModal_modalinputdiv_birth'className='ApplyModal_modalinputdiv'>
                <label>생년월일</label>
                <input placeholder='주민번호 앞6자리' onChange={(e) => props.changePlayerBirth(e.target.value)}></input>
            </div>
            <div className='ApplyModal_modalinputdiv'>
                <label>소속</label>
                <input placeholder='소속을 입력해주세요' onChange={(e) => props.changeTeam(e.target.value)}></input>
            </div>
            <button className='ApplyModal_modalregisterbutton' type='submit'>신청하기</button>
        </form>
      </div>
    </div>
  )
}

export default ApplyModal