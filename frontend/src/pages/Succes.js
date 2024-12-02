import React from 'react'
import SuccessImage from "../resources/success.png"
import { Link } from 'react-router-dom'

const Succes = () => {
  return (
    <div className=' text-green-950 '>
        <div className='w-full max-w-md mx-auto text-center'>
        <h2 className='text-3xl font-semibold text-center text-green-800'>Plată efectuată cu succes!</h2>
        <img 
            src={SuccessImage} 
            alt="Plată reușită" 
            className="w-full h-auto " 
        />

        <Link to="/order" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-3xl shadow-lg transition duration-300 mr-10 mb-8">
            Vezi comanda
        </Link>
        </div>

        <p className='mx-20 text-center text-2xl mt-10 '>
            Îți mulțumim pentru achiziția ta! Comanda ta de cărți a fost plasată și procesată cu succes. 
            <br />
            În scurt timp, vei primi un email de confirmare cu detaliile comenzii.
        </p>
        <p className='text-xl text-center mt-5 mb-4'>
            Echipa <span className="font-bold text-green-800 ">Bookish Boutique</span>
        </p>
        </div>

  )
}

export default Succes
