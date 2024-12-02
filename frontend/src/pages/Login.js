import React, { useState } from 'react'
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import SummaryApi from '../common';
import Context from '../context';
import {useContext} from 'react';

function Login() {
        //functii legate de parola-----
        const [passwordVisible, setPasswordVisible] = useState(false);
      
        const togglePasswordVisibility = () => {
          setPasswordVisible(!passwordVisible);
        };

        //initializarea state-ului
        //definește state-ul data și funcția setData pentru a-l actualiza.
        const[data, setData] = useState({ //initializeaza state-ul cu un obiect care are 2 proprietati: email si password, ambele fiind string-uri goale
          email: "",
          password: ""
        })

        const navigate = useNavigate()
        const {fetchUserDetail, fetchUserAddToCart} = useContext(Context)

        //este o functie care se executa cand utiliz tasteaza in campurile input
        const handleOnChange = (e) => {
            //extrage name si value din elementul care a declansat evenimentul e.target, adica input-ul 
          const {name, value} = e.target 
          setData((prev)=>{ //actualizeaza state-ul data. prev este state-ul anterior
            //returneaza un nou obiect care combina 
            return {
                ...prev,  //vechiul state
                [name]: value //cu noua valoare actualizata cu proprietatea name
            }
          })
        }

        const handleSubmit = async (e) => {
          e.preventDefault()

    try{   
        const dataResponse = await fetch(SummaryApi.login.url, {
            method : SummaryApi.login.method,
            credentials : 'include',
            headers : {
            'content-type' : 'application/json'
            },
             body : JSON.stringify(data)
        })

        const dataApi = await dataResponse.json()

        if(dataApi.success){
            toast.success(dataApi.message)
            navigate("/")
            fetchUserDetail()
            fetchUserAddToCart()
        }

        if(dataApi.error){
            toast.error(dataApi.message)    
        }
    }catch(error){
        toast.error(error.message)
    }
}

        console.log("data login: ", data)


  return (
    <section id='login' className='p-5'>
        <div className='mx-auto container p-4'>
            <div className='bg-white p-2 py-5 w-full max-w-md mx-auto shadow-md'>

                <p className='text-center p-4 font-medium text-lg'>Introdu datele tale de autentificare</p>

                <form className='flex flex-col -mt-4 p-8' onSubmit={handleSubmit}>
                    <div>
                        <label>Email: </label>
                        <div >
                            <input 
                            type='email' 
                            placeholder='Enter email' 
                            name='email' 
                            value={data.email}
                            onChange={handleOnChange}
                            className='pl-4 border w-full h-full outline-none p-3 my-3 rounded-3xl'/>
                        </div>
                    </div>

                    <div>
                        <label>Password: </label>
                        <div className='relative'>
                            <input 
                            type={passwordVisible ? 'text' : 'password'} placeholder='Enter password'
                            name='password' 
                            value={data.password}
                            onChange={handleOnChange} 
                            className='pl-4 border w-full h-full outline-none p-3 my-3 rounded-3xl'/>
                            
                            <div className="absolute inset-y-0 right-0 flex items-center pr-6 cursor-pointer" onClick={togglePasswordVisibility}>
                                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                            </div>
                        </div>                       
                    </div>

                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-3xl shadow-lg transition duration-300 mt-4">
                        Login
                    </button>

                    <Link to={'/send-otp'} class="text-green-500 hover:text-green-700 text-center py-2 ">
                        Mi-am uitat parola
                    </Link>

                    <Link to={'/register'} class="text-green-500 hover:text-green-700 text-center py-2 ">
                        Nu ai cont? Creeaza unul aici.
                    </Link>
                    
                    <button className=" flex items-center justify-center border border-green-500 hover:bg-green-500 text-green-500 hover:text-white font-bold py-2 px-4 rounded-3xl shadow-lg transition duration-200">
                    <FaGoogle  className='mr-2'/>
                        Continua cu Google
                    </button>
                </form>
                
            </div>
        </div>
    </section>
  )
}

export default Login
