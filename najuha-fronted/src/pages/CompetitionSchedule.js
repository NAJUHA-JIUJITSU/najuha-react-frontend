import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Competitionlist from '../components/Competitionlist'
import PartnershipBanner from '../components/PartnershipBanner'

function CompetitionSchedule() {
  return (
    <div>
      <Navbar />
      <PartnershipBanner />
      <Competitionlist />
      <Footer />
    </div>
  )
}

export default CompetitionSchedule
