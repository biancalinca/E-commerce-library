import React from 'react'
import ROLE from '../common/role'
import { IoClose } from "react-icons/io5";
import { useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

function ChangeUserRole({
    userId, name, lastname, email, role, onClose, callFunc
}) {

    const [userName, setUserName] = useState(name);
    const [userLastName, setLastName] = useState(lastname);
    const [userRole, setUserRole] = useState(role)
    const handleOnChangeSelect = (e) => {
        setUserRole(e.target.value)

        console.log(e.target.value)
    }

    //update user
    // const updateUserRole = async() =>{
    //     const fetchResponse = await fetch(SummaryApi.updateUser.url, {
    //         method: SummaryApi.updateUser.method,
    //         credentials: 'include',
    //         headers: {
    //             "content-type" : "application/json"
    //         },
    //         body: JSON.stringify({
    //             userId : userId,
    //             role : userRole
    //         })
    //     })
    //     const responseData = await fetchResponse.json()
    //     if(responseData.success){
    //         toast.success(responseData.message)
    //         onClose()
    //         callFunc()
    //     }

    //     console.log("responseData------",responseData)
    // }

     //update user
     const updateUserRole = async () => {
        const fetchResponse = await fetch(SummaryApi.updateUser.url, {
            method: SummaryApi.updateUser.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                name: userName,
                lastname: userLastName,
                role: userRole
            })
        });
        const responseData = await fetchResponse.json();
        if (responseData.success) {
            toast.success(responseData.message);
            onClose();
            callFunc();
        } else {
            toast.error(responseData.message);
        }
    };

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-center items-center bg-slate-800 bg-opacity-60 '>
        <div className=' max-auto bg-white shadow-md p-4 w-full max-w-sm'>

            <button className='block ml-auto' onClick={onClose}>
                <IoClose />
            </button>

            <h1 className='pb-4 text-lg font-medium'>Schimba rolul utilizatorului</h1>
            {/* <p>Nume: {name} </p>
            <p>Email: {email}</p> */}

            <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>Nume:</label>
                    <input
                        type='text'
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className='w-full border px-4 py-2 rounded'
                    />
                </div>
            <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>Prenume:</label>
                    <input
                        type='text'
                        value={userLastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className='w-full border px-4 py-2 rounded'
                    />
                </div>

                <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>Email: {email}</label>
   
                </div>

            <div className='flex items-center justify-between my-4'>
                <p>Rol</p>
                <select className='border px-4 py-1' value={userRole} onChange={handleOnChangeSelect}>
                    {
                        Object.values(ROLE).map(el => {
                            return(
                                <option value={el} key={el}>{el}</option>
                            )
                        })
                    }
                </select>
            </div>
            <button className='w-fit mx-auto block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-3xl shadow-lg transition duration-300' onClick={updateUserRole}>Editeaza</button>
            
        </div>
    </div>
  )
}

export default ChangeUserRole

