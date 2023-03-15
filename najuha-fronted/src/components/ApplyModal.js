import React from 'react'
import './applymodal.css'
import blackX from '../src_assets/blackX.svg'

function ApplyModal(props) {
  function closeModal() {
    props.closeModal()
  }

  function register(e) {
    e.preventDefault()
    props.postCompetition()
  }

  return (
    <div className="ApplyModal_Modal">
      <div className="ApplyModal_modalBody" onClick={e => e.stopPropagation()}>
        <div className="ApplyModal_title">
          <h2 id="ApplyModal_modaltitle">선수정보입력</h2>
          <button id="ApplyModal_modalCloseBtn" onClick={closeModal}>
            <img
              src={blackX}
              alt="삭제 아이콘"
              style={{
                width: '24px',
                marginRight: '-10px',
                marginTop: '-30px',
              }}
            ></img>
          </button>
        </div>

        <form className="ApplyModal_modalform" onSubmit={register}>
          <div className="ApplyModal_modalinputdiv" require>
            <label>성명</label>
            <input
              placeholder="성명(한글)을 입력해주세요"
              value={props.viewcompetitionApplicationList[0].playerName}
              onChange={e => {
                let pattern = /[0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g
                e.target.value = e.target.value.replace(pattern, '')
                if (e.target.value.length > 10)
                  e.target.value = e.target.value.slice(0, 10)
                props.changePlayerName(e.target.value)
              }}
              pattern="[가-힣]{1,10}"
              title="한글 10자 이하만 가능합니다."
              required
            ></input>
          </div>
          <div className="ApplyModal_modalinputdiv">
            <label>번호</label>
            <input
              value={props.viewcompetitionApplicationList[0].phoneNumber}
              placeholder="번호를 -없이 입력해주세요"
              onChange={e => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '')
                if (e.target.value.length > 11)
                  e.target.value = e.target.value.slice(0, 11)
                props.changephoneNumber(e.target.value)
              }}
              pattern="[0-9]{11}"
              required
              title="숫자 11자를 입력해주세요"
            ></input>
          </div>
          <div
            id="ApplyModal_modalinputdiv_birth"
            className="ApplyModal_modalinputdiv"
          >
            <label>생년월일</label>
            <input
              value={props.viewcompetitionApplicationList[0].playerBirth}
              placeholder="주민번호 앞6자리"
              onChange={e => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '')
                if (e.target.value.length > 6)
                  e.target.value = e.target.value.slice(0, 6)
                props.changePlayerBirth(e.target.value)
              }}
              pattern="[0-9]{6}"
              title="숫자 6자를 입력해주세요"
              required
            ></input>
          </div>
          <div className="ApplyModal_modalinputdiv">
            <label>소속</label>
            <input
              value={props.viewcompetitionApplicationList[0].team}
              placeholder="소속을 입력해주세요"
              onChange={e => {
                let pattern = /[0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g
                e.target.value = e.target.value.replace(pattern, '')
                if (e.target.value.length > 50)
                  e.target.value = e.target.value.slice(0, 50)
                props.changeTeam(e.target.value)
              }}
              pattern="[가-힣]{1,50}"
              title="한글 50자 이하만 가능합니다."
              required
            ></input>
          </div>
          <button className="ApplyModal_modalregisterbutton" type="submit">
            신청하기
          </button>
        </form>
      </div>
    </div>
  )
}

export default ApplyModal
