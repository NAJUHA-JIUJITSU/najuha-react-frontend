import React from 'react'
import './competition.css'

function Competition() {
  return (
    <div className='competition-wrapper'>
        <div className='competition-top'>
            <div className='competition-top-title'>
                <h2>예거스 챔피언쉽 로컬대회 송도 오픈</h2>
                
            </div>
            <div className='competition-top-content'>
                <div className='competition-top-content-img'></div>
                {/* <img className='competition-top-content-img' src={} alt='대회이미지' /> */}
                <div className='competition-top-content-info'>
                    <div className='competition-top-content-info-each'>
                        <h3>대회 날짜</h3>
                        <p>22.11.04 (월)</p>
                    </div>
                    <div className='competition-top-content-info-each'>
                        <h3>대회 장소</h3>
                        <p>서울,KBS 88 제2체육관 두 줄 넘어감</p>
                    </div>
                    <div className='competition-top-content-info-each'>
                        <h3>얼리버드 마감</h3>
                        <p>22.11.14 (월)</p>
                    </div>
                    <div className='competition-top-content-info-each'>
                        <h3>참가신청 마감</h3>
                        <p>22.11.22 (토)</p>
                    </div>
                    <div className='competition-top-content-info-each'>
                        <h3>신청자 명단</h3>
                        <p>22.11.25 (화)</p>
                    </div>
                    <div id='competition-top-content-info-each-last' className='competition-top-content-info-each'>
                        <h3>대진표 공개</h3>
                        <p>22.11.25 (화)</p>
                    </div>
                </div>
            </div>
            <button id='competition-top-button'>대회 신청</button>
        </div>
        <div className='competition-bottom'>
            
        </div>
    </div>
  )
}

export default Competition