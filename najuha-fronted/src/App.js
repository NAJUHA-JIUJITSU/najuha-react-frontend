import * as React from 'react'
import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset' // 리액트에서는 styled-reset을 통해 모든 스타일을 reset 할 수 있어요.
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Mainpage from './pages/Mainpage'
import Admincompetition from './pages/Admincompetition'
import Competitionform from './components/Competitionform'
import CompetitionSchedule from './pages/CompetitionSchedule'
import Profilepage from './pages/Profilepage'
import ProfileInfopage from './pages/ProfileInfopage'
import KakaoLogin from './components/KakaoLogin'
import CompetitionApplyTeamPage from './pages/CompetitionApplyTeamPage'
import CompetitionApplyPatchTeamPage from './pages/CompetitionApplyPatchTeamPage'
import CompetitionApplyPage from './pages/CompetitionApplyPage'
import CompetitionApplyPatchPage from './pages/CompetitionApplyPatchPage'
import Auth from './hoc/auth'
import TossSuccess from './components/Tosssuccess'
import CompetitionApplyMethodPage from './pages/CompetitionApplyMethodPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import PaymentFailPage from './pages/PaymentFailPage'
import CompetitionPage from './pages/CompetitionPage'
import PaymentInfoPage from './pages/PaymentInfoPage'
import AdminCompetitionImagePage from './pages/AdminCompetitionImagePage'
import AdminCsvDownload from './components/AdminCsvDownload'
import AdminCompetitionInfoPage from './pages/AdminCompetitionInfoPage'
import MainScrollPage from './pages/MainScrollPage'
import CompetitionApplicantListPage from './pages/CompetitionApplicantListPage'
import Error404Page from './pages/Error404Page'
import Error500Page from './pages/Error500Page'

const GlobalStyle = createGlobalStyle`
  ${reset}`

function App() {
  const AuthMainpage = Auth(Mainpage, null, null)
  const AuthCompetitionSchedule = Auth(CompetitionSchedule, null, null)
  const AuthCompetitionPage = Auth(CompetitionPage, null, null)
  const AuthCompetitionApplyPage = Auth(CompetitionApplyPage, true, true)
  const AuthCompetitionApplyPatchPage = Auth(
    CompetitionApplyPatchPage,
    true,
    true
  )
  const AuthCompetitionApplyTeamPage = Auth(
    CompetitionApplyTeamPage,
    true,
    true
  )
  const AuthCompetitionApplyPatchTeamPage = Auth(
    CompetitionApplyPatchTeamPage,
    true,
    true
  )
  const AuthAdmincompetition = Auth(Admincompetition, true, true, true)
  const AuthCompetitionInfoPage = Auth(
    AdminCompetitionInfoPage,
    true,
    true,
    true
  )
  const AuthAdminCsvDownload = Auth(AdminCsvDownload, true, true, true)
  const AuthCompetitionform = Auth(Competitionform, true, true, true)
  const AuthProfilepage = Auth(Profilepage, true, null)
  const AuthProfileInfopage = Auth(ProfileInfopage, true, true)
  const Authkakao = Auth(KakaoLogin, null, null)
  const AuthoCompetitionApplyMethodPage = Auth(
    CompetitionApplyMethodPage,
    true,
    true
  )
  const AuthPaymentSuccessPage = Auth(PaymentSuccessPage, true, true)
  const AuthPaymentFailPage = Auth(PaymentFailPage, true, true)
  const AuthPaymentInfoPage = Auth(PaymentInfoPage, true, true)
  const AuthAdminCompetitionImagePage = Auth(
    AdminCompetitionImagePage,
    true,
    true,
    true
  )
  const AuthMainScrollPage = Auth(MainScrollPage, null, null)
  const AuthError404Page = Auth(Error404Page, null, null)
  const AuthError500Page = Auth(Error500Page, null, null)

  return (
    <React.Fragment>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthMainpage />} />
          <Route path="/competition" element={<AuthCompetitionSchedule />} />
          <Route path="/competition/:id" element={<AuthCompetitionPage />} />
          <Route
            path="/competition/applymethod/:id"
            element={<AuthoCompetitionApplyMethodPage />}
          />
          <Route
            path="/competition/apply/:id"
            element={<AuthCompetitionApplyPage />}
          />
          <Route
            path="/competition/apply/patch/:id"
            element={<AuthCompetitionApplyPatchPage />}
          />
          <Route
            path="/competition/applyteam/:id"
            element={<AuthCompetitionApplyTeamPage />}
          />
          <Route
            path="/competition/applyteam/patch/:id"
            element={<AuthCompetitionApplyPatchTeamPage />}
          />
          <Route path="/Admincompetition/" element={<AuthAdmincompetition />} />
          <Route
            path="/Admincompetition/:id"
            element={<AuthCompetitionform />}
          />
          <Route
            path="/Admincompetition/info/:id"
            element={<AuthCompetitionInfoPage />}
          />
          <Route
            path="/Admincompetition/csv/:id"
            element={<AuthAdminCsvDownload />}
          />
          <Route
            path="/Admincompetition/imageupload/:id"
            element={<AuthAdminCompetitionImagePage />}
          />
          <Route path="/Profilepage" element={<AuthProfilepage />} />
          <Route
            path="/Profilepage/info/:id"
            element={<AuthProfileInfopage />}
          />
          <Route path="/oauth/callback/kakao" element={<Authkakao />} />
          <Route path="/toss/success" element={<TossSuccess />} />
          <Route path="/payment/success" element={<AuthPaymentSuccessPage />} />
          <Route path="/payment/fail" element={<AuthPaymentFailPage />} />
          <Route path="/PaymentInfo/:id" element={<AuthPaymentInfoPage />} />
          <Route path="/Mainscroll" element={<AuthMainScrollPage />} />
          <Route
            path="/competition/:id/applicant"
            element={<CompetitionApplicantListPage />}
          />

          <Route path="/*" element={<AuthError404Page />} />

          <Route path="/serverError" element={<AuthError500Page />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  )
}

export default App
