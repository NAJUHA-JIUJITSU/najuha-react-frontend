import React, {useEffect} from 'react'
import './competition.css'
import ReactMarkdown from 'react-markdown';

function Competition() {
    let markdown = `
# 참가자 명단
## 세부 정보
11월 25일 화요일 공개

---

# 대진표
## 엑셀 다운로드
[예거스 챔피언쉽 로컬대회 송도 오픈_대진표xl](www.naver.com)

---

# 주요 사항
## 주최
예거스 챔피언쉽
#### 
## 후원
예거스 챔피언쉽  
####
## 설명  
본프로젝트는 기부합니다 어쩌구~~

---

# Division
## 환불 규정
환불 요청은 11.20(화) 23:59 이전에만 가능
![sample](https://user-images.githubusercontent.com/76994774/211767637-9b72a5a8-0d20-4e7c-9ca3-bb655fd90fcb.png)


---

# 대회 안내
### 대회규정
- 어드 존재 안함
- 동점으로 끝났을 때, 서든데스 연장전 진행
- 앱솔루트: 서든데스 방식 적용
### 계체 안내
- 경기 시작 전 직전 계체
- 허용 오차 : 저울의 오차 범위 +500g 허용 (계체 실패시 즉시 실격)
- 체급 1강도 계체를 통과해야 함
### 도복 규정
- 도복 색상은 흰색, 검정색, 파란색만 착용 가능
- 도복 상의 안에 여성은 래쉬가드 착용, 남성은 착용 불가
- 도복 팔 길이는 손목에서 5cm, 바지 길이는 복사뼈에서 5cm 이내여야 함
### 코치(세컨) 제도
- 선수 1명당 코치 1명 동반 입장 가능
- 코치는 대회사에서 제공하는 코치복을 착용하고 입장
- 영상 촬영 허용
### 보험안내
- 선수 1명당 코치 1명 동반 입장 가능
- 코치는 대회사에서 제공하는 코치복을 착용하고 입장
- 영상 촬영 허용
`;

    // markdown =  markdown.replace(/\n/gi, '\n &nbsp;');

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
            <ReactMarkdown className='competition-bottom-markdown' children={markdown}/>
        </div>
    </div>
  )
}

export default Competition