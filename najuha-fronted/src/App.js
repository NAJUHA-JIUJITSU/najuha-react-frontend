import * as React from 'react'
import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset' // 리액트에서는 styled-reset을 통해 모든 스타일을 reset 할 수 있어요.
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Mainpage from './pages/Mainpage'
import Admincompetition from './pages/Admincompetition'
import Competitionform from './components/Competitionform'
import CompetitionSchedule from './pages/CompetitionSchedule'
import Profilepage from './pages/Profilepage'
import UserInfopage from './pages/UserInfopage'

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
        <Route path = '/UserInfopage' element={<UserInfopage/>} />
      </Routes>
    </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
