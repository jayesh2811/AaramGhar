import React from 'react'
import { Link } from 'react-router-dom'

function LandingScreen() {
  return (
    <div className='row landing'>
      <div className='col-md-12 text-center'>
        <h1 style={{color: 'white', fontSize: '130px'}}>AaramGhar</h1>
        <h2 style={{color: 'white'}}>There is only one boss. The Guest</h2>

        <Link to='/home'>
        <button className='btn landBtn'>Get Started</button>
        </Link>

      </div>
    </div>
  )
}

export default LandingScreen
