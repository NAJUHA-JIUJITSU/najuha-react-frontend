import React, {useEffect, useState} from 'react'
import './scrollPageOne.css'
import gymFront from '../src_assets/체육관_앞.png'
import gymBackground from '../src_assets/체육관_뒤.png'
import players from '../src_assets/선수들.png'
import competitionBackgruond from '../src_assets/대회장.png'
import competitionFull from '../src_assets/대회장전체.png'
import phone from '../src_assets/폰목업.png'

function  ScrollPageOne() {
    const [ScrollActive, setScrollActive] = useState(false);
    const [ScrollY, setScrollY] = useState(0); // window 의 pageYOffset값을 저장 

    function handleScroll() { 
        console.log('스크롤 ' +ScrollY)
        if(ScrollY > 200) {
            setScrollY(window.pageYOffset);
            setScrollActive(true);
        } else {
            setScrollY(window.pageYOffset);
            setScrollActive(false);
        }
    }
    useEffect(() => {
        function scrollListener() {  window.addEventListener("scroll", handleScroll); } //  window 에서 스크롤을 감시 시작
        scrollListener(); // window 에서 스크롤을 감시
        return () => { window.removeEventListener("scroll", handleScroll); }; //  window 에서 스크롤을 감시를 종료
    });

    return (
        
        <>
            <div className='ScrollPageOne_wrapper'>
                <img id={ScrollActive ? "ScrollPageOne_back" : "ScrollPageOne_gym-front"} src={gymFront}></img>
                <img id='ScrollPageOne_gym-background' src={gymBackground}></img>
                <img id='ScrollPageOne_players' src={players}></img>
                <h1 className={ScrollActive ? 'ScrollPageOne_ment1 ScrollPageOne_fadein': 'ScrollPageOne_ment1 ScrollPageOne_fadeout'}>체육관에서</h1>
                <h1 className={ScrollActive ? 'ScrollPageOne_ment2 ScrollPageOne_fadeout': 'ScrollPageOne_ment2 ScrollPageOne_fadein'}>대회장까지</h1>
            </div>
            <div className='ScrollPageOne_wrapper'>
                <img id='ScrollPageOne_competition-background' src={competitionBackgruond}></img>
            </div>
        </>
    )
}

export default ScrollPageOne