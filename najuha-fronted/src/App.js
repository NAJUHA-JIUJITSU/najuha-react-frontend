import * as React from 'react'
import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset' // 리액트에서는 styled-reset을 통해 모든 스타일을 reset 할 수 있어요.
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Mainpage from './pages/Mainpage'
import Admincompetition from './pages/Admincompetition'
import Competitionform from './components/Competitionform'
import CompetitionSchedule from './pages/CompetitionSchedule'
import Profilepage from './pages/Profilepage'
import Redirect from './components/Redirect'
import KakaoLogin from './components/KakaoLogin'

const GlobalStyle = createGlobalStyle`
  ${reset}`

function App() {
  return (
    <React.Fragment>
    <GlobalStyle />  
    <BrowserRouter>
      <Routes>
        <Route path = '/' element={<Mainpage/>} />
        <Route path = '/competition' element={<CompetitionSchedule/>} />
        <Route path = '/Admincompetition/' element={<Admincompetition/>} />
        <Route path = '/Admincompetition/:id' element={<Competitionform/>} />
        <Route path = '/Profilepage' element={<Profilepage/>} />
        <Route path="/redirect" element={<Redirect />} />
        <Route path="/oauth/callback/kakao" element={<KakaoLogin/>} />
      </Routes>
    </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
