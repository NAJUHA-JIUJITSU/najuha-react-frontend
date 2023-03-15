import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CompetitionApplicantList from '../components/CompetitionApplicantList/CompetitionApplicantList.js'

function CompetitionApplicantListPage() {
  return (
    <>
      <Navbar />
      <CompetitionApplicantList />
      <Footer />
    </>
  )
}

export default CompetitionApplicantListPage
