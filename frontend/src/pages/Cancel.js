import React from 'react'
import CancelImage from "../resources/cancel.png"
import { Link } from 'react-router-dom'

const Cancel = () => {
    return (
        <div className=' text-green-950 '>
            <div className='w-full max-w-md mx-auto text-center'>
            <h2 className='text-3xl font-semibold text-center text-red-800'>Plată eșuată!</h2>
            <img 
                src={CancelImage} 
                alt="Plată esuata" 
                className="w-full h-auto " 
            />
    
            <Link to="/cart" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-3xl shadow-lg transition duration-300  mb-8">
                Înapoi la comandă
            </Link>
            </div>
    
            <p className='mx-20 text-center text-2xl mt-10'>
                Ceva nu a mers bine în procesarea plății! Te rugăm să încerci din nou.
            </p>
            <p className='text-xl text-center mt-5 mb-4'>
                Echipa <span className="font-bold text-green-800 ">Bookish Boutique</span>
            </p>
            </div>
    
      )
}

export default Cancel
