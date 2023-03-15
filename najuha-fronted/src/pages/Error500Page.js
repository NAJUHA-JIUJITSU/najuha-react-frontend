import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Error500 from '../components/Error500'

function Error500Page() {
  return (
    <div>
      <Navbar />
      <Error500 />
      <Footer />
    </div>
  )
}

export default Error500Page
