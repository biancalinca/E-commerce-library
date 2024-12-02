import React, { useState } from 'react'
import user_logo from '../resources/user_logo.png'
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import imageTobase64 from '../helpers/imageTobase64';
import SummaryApi from '../common';
import {toast} from 'react-toastify';

function Register() {

    //functii legate de parola-----
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordVisibleConfirm, setPasswordVisibleConfirm] = useState(false);
      
    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };
    const togglePasswordVisibilityConfirm = () => {
        setPasswordVisibleConfirm(!passwordVisibleConfirm);
    };


    const[data, setData] = useState({ //initializeaza state-ul cu un obiect care are 8 proprietati toate fiind string-uri goale (stocate in data)
        name: "",
        lastname: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
        profilePic: ""
      })


      const navigate = useNavigate()

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

      const handleUploadPic= async(e)=>{
        const file = e.target.files[0]

        const  imagePic = await imageTobase64(file)
        setData((prev)=>{
            return{
                ...prev,
                profilePic: imagePic
            }
        })
      }

      const handleSubmit = async(e) => {
        e.preventDefault()

        if(data.password === data.confirmPassword){
            const dataResponse = await fetch(SummaryApi.register.url,{
                method: SummaryApi.register.method,
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const dataApi = await dataResponse.json()

            //aici fac sa afisez validarile in pagina
            if(dataApi.success){
                toast.success(dataApi.message)
                navigate("/login")
            }
            if(dataApi.error){
                toast.error(dataApi.message)
            }

        }else{
            toast.error("Parolele nu se potrivesc")
        }
      }

  return (
    <section id='register' className='p-5'>
        <div className='mx-auto container p-4'>
            <div className='bg-white p-2 py-5 w-full max-w-md mx-auto shadow-md'>
                <p className='text-center p-4 font-medium text-lg '>Introdu datele tale de înregistrare</p>
                <div className='w-20 h-20 mx-auto '>
                    <form>
                        <label>
                            <div className='w-20 h-20 mx-auto overflow-hidden rounded-full'>
                                <div>
                                    <img src={data.profilePic ||user_logo} alt='login icon' className='cursor-pointer'/>
                                </div>
                            </div>
                            
                            <input type='file' className='hidden' onChange={handleUploadPic}/>
                        </label>
                            <div className='text-center text-xs  '>
                                Upload photo
                            </div>
                    </form>
                   
                </div>

                <form className='flex flex-col p-8 mt-4 ' onSubmit={handleSubmit}>
                    <div>
                        <label>Nume: </label>
                        <div >
                            <input 
                            type='text' 
                            placeholder='Nume' 
                            name='name' 
                            value={data.name}
                            onChange={handleOnChange}
                            required
                            className='pl-4 border w-full h-full outline-none p-3 my-3 rounded-3xl'/>
                        </div>
                    </div>
                    <div>
                        <label>Prenume: </label>
                        <div >
                            <input 
                            type='text' 
                            placeholder='Prenume' 
                            name='lastname' 
                            value={data.lastname}
                            onChange={handleOnChange}
                            required
                            className='pl-4 border w-full h-full outline-none p-3 my-3 rounded-3xl'/>
                        </div>
                    </div>

                    <div>
                        <label>Email: </label>
                        <div >
                            <input 
                            type='email' 
                            placeholder='Introdu email' 
                            name='email' 
                            value={data.email}
                            onChange={handleOnChange}
                            required
                            className='pl-4 border w-full h-full outline-none p-3 my-3 rounded-3xl'/>
                        </div>
                    </div>

                    <div>
                        <label>Telefon: </label>
                        <div >
                            <input 
                            type='phone' 
                            placeholder='Numarul de telefon' 
                            name='phone' 
                            value={data.phone}
                            onChange={handleOnChange}
                            className='pl-4 border w-full h-full outline-none p-3 my-3 rounded-3xl'/>
                        </div>
                    </div>

                    <div>
                        <label>Adresă: </label>
                        <div >
                            <input 
                            type='text' 
                            placeholder='Adresa' 
                            name='address' 
                            value={data.address}
                            onChange={handleOnChange}
                            className='pl-4 border w-full h-full outline-none p-3 my-3 rounded-3xl'/>
                        </div>
                    </div>

                    <div>
                        <label>Parola: </label>
                        <div className='relative'>
                            <input 
                            type={passwordVisible ? 'text' : 'password'} placeholder='Introdu parola'
                            name='password' 
                            value={data.password}
                            onChange={handleOnChange} 
                            required
                            className='pl-4 border w-full h-full outline-none p-3 my-3 rounded-3xl'/>
                            
                            <div className="absolute inset-y-0 right-0 flex items-center pr-6 cursor-pointer" onClick={togglePasswordVisibility}>
                                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                            </div>
                        </div>                       
                    </div>

                    <div>
                        <label>Confirma Parola: </label>
                        <div className='relative'>
                            <input 
                            type={passwordVisibleConfirm ? 'text' : 'password'} placeholder='Introdu parola din nou'
                            name='confirmPassword' 
                            value={data.confirmPassword}
                            onChange={handleOnChange} 
                            required
                            className='pl-4 border w-full h-full outline-none p-3 my-3 rounded-3xl'/>
                            
                            <div className="absolute inset-y-0 right-0 flex items-center pr-6 cursor-pointer" onClick={togglePasswordVisibilityConfirm}>
                                {passwordVisibleConfirm ? <FaEye /> : <FaEyeSlash />}
                            </div>
                        </div>                       
                    </div>

                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-3xl shadow-lg transition duration-300 mt-4">
                        Înregistrează-te
                    </button>

                    <Link to={'/login'} class="text-green-500 hover:text-green-700 text-center py-2 ">
                        Ai deja un cont?
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

export default Register
