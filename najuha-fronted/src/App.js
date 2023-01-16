import * as React from 'react'
import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset' // 리액트에서는 styled-reset을 통해 모든 스타일을 reset 할 수 있어요.
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Mainpage from './pages/Mainpage'
import Admincompetition from './pages/Admincompetition'
import Competitionform from './components/Competitionform'
import CompetitionSchedule from './pages/CompetitionSchedule'
import Profilepage from './pages/Profilepage'
import ProfileInfopage from './pages/ProfileInfopage'
import UserInfopage from './pages/UserInfopage'
import ProfilepageToggle from './pages/ProfilepageToggle'
import Redirect from './components/Redirect'
import KakaoLogin from './components/KakaoLogin'
import CompetitionApplyTeamPage from './pages/CompetitionApplyTeamPage'
import Auth from './hoc/auth'
import CompetitionApplyPage from './pages/CompetitionApplyPage'
import TossSuccess from './components/Tosssuccess'
import CompetitionApplyMethodPage from './pages/CompetitionApplyMethodPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import PaymentFailPage from './pages/PaymentFailPage'
import CompetitionPage from './pages/CompetitionPage'

const GlobalStyle = createGlobalStyle`
  ${reset}`

function App() {
  const AuthMainpage = Auth(Mainpage, null)
  const AuthCompetitionSchedule = Auth(CompetitionSchedule, null)
  const AuthCompetitionPage = Auth(CompetitionPage, null);
  const AuthCompetitionApplyPage = Auth(CompetitionApplyPage, true);
  const AuthCompetitionApplyTeamPage = Auth(CompetitionApplyTeamPage, true);
  const AuthAdmincompetition = Auth(Admincompetition, true, true)
  const AuthCompetitionform = Auth(Competitionform, true, true)
  const AuthProfilepage = Auth(Profilepage, true)
  const AuthProfileInfopage = Auth(ProfileInfopage, true)
  const AuthUserInfopage = Auth(UserInfopage, true)
  const AuthProfilepageToggle = Auth(ProfilepageToggle, true)
  const AuthRedirect = Auth(Redirect, null)
  const Authkakao = Auth(KakaoLogin, null)
  const AuthoCompetitionApplyMethodPage = Auth(CompetitionApplyMethodPage, true);
  const AuthPaymentSuccessPage = Auth(PaymentSuccessPage, true)
  const AuthPaymentFailPage = Auth(PaymentFailPage, true)


  return (
    <React.Fragment>
    <GlobalStyle />  
    <BrowserRouter>
      <Routes>
        <Route path = '/' element={<AuthMainpage/>} />
        <Route path = '/competition' element={<AuthCompetitionSchedule/>} />
        <Route path = '/competition/:id' element={<AuthCompetitionPage/>} />
        <Route path = '/competition/applymethod/:id' element={<AuthoCompetitionApplyMethodPage/>} />
        <Route path = '/competition/apply/:id' element={<AuthCompetitionApplyPage/>} />
        <Route path = '/competition/applyteam/:id' element={<AuthCompetitionApplyTeamPage/>} />
        <Route path = '/Admincompetition/' element={<AuthAdmincompetition/>} />
        <Route path = '/Admincompetition/:id' element={<AuthCompetitionform/>} />
        <Route path = '/Profilepage' element={<AuthProfilepage/>} />
        <Route path = '/Profilepage/info/:id' element={<AuthProfileInfopage/>} />
        <Route path = '/UserInfopage' element={<AuthUserInfopage/>} />
        <Route path = '/ProfilepageToggle' element={<AuthProfilepageToggle/>} />
        <Route path="/redirect" element={<AuthRedirect/>} />
        <Route path="/oauth/callback/kakao" element={<Authkakao/>} />
        <Route path="/toss/success" element={<TossSuccess/>} />
        <Route path="/payment/success" element={<AuthPaymentSuccessPage/>} />
        <Route path="/payment/fail" element={<AuthPaymentFailPage/>} />
      </Routes>
    </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
