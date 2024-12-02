import React from 'react'
import logo from '../resources/logo.jpg'

function Logo() {
  return (
    <div className="flex items-center justify-left p-4 ">
      <img src={logo} alt='logo' className="w-32 h-32 object-contain rounded-full shadow-lg"/>
    </div>
  )
}

export default Logo
