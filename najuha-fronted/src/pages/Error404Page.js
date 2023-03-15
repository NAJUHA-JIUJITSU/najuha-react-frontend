import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Error404 from '../components/Error404'

function Error404Page() {
  return (
    <div>
      <Navbar />
      <Error404 />
      <Footer />
    </div>
  )
}

export default Error404Page
