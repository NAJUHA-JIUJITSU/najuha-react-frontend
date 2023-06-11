import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HostCompetition from '../components/HostCompetition/HostCompetition'
import { HostCompetitionApplicantList } from '../components/HostCompetition'

function HostCompetitionPage() {
  return (
    <>
      <Navbar />
      <HostCompetition />
      <HostCompetitionApplicantList />
      <Footer />
    </>
  )
}

export default HostCompetitionPage
