import React, { useEffect } from 'react'
import { FaRegUser } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';


const AdminPanel= () => {

    const user = useSelector((state) => state?.user?.user)
    const navigate = useNavigate()

    useEffect(() => {
      if(user?.role !== ROLE.ADMIN){
        navigate("/")
      }
    }, [user])

  return (
    <div className='min-h-[calc(100vh-120px)] flex'>
        <aside className=' min-h-full w-full max-w-60 customShadow'>
          <div className='h-32  flex justify-center items-center flex-col'>
            <div className='text-4xl cursor-pointer relative flex justify-center'>
            {
                user?.profilePic ? (
                <img src={user?.profilePic} alt={user?.name} className='w-20 h-20 rounded-full'/>
                ) :(
                <FaRegUser />
                )
            }
            </div>
            <p className='text-lg font-semibold'>{user?.name}</p> 
            <p className='text-sm'>{user?.role}</p>
          </div>

            {/* navigation */}
          <div className='text-green-900 text-lg font-semibold'>
            <nav className='grid p-4'>
                <Link to={"all-users"} className='px-2 py-1 hover:bg-green-100'>Toti utilizatorii</Link>
                <Link to={"all-products"} className='px-2 py-1 hover:bg-green-100'>Toate cartile</Link>
                <Link to={"all-order"} className='px-2 py-1 hover:bg-green-100'>Toate comenzile</Link>
                <Link to={"statistics"} className='px-2 py-1 hover:bg-green-100'>Statistică comenzi</Link>
            </nav>
          </div>
        </aside>

        <main className='p-2 w-full h-full'>
        <Outlet/>
        </main>
    </div>
  )
}

export default AdminPanel
