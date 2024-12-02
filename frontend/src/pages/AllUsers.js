import React, { useEffect, useState } from 'react'
import SummaryApi from './../common/index';
import { toast } from 'react-toastify';
import moment from 'moment';
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import ChangeUserRole from '../components/ChangeUserRole';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';


function AllUsers() {

  const [allUser, setAllUser] = useState([])
  const [openUpdateRole, setOpenUpdateRole] =useState(false)
  const [deleteUserId, setDeleteUserId] = useState(null);  //delete 
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({  //update
    email : "",
    name: "",
    lastname : "",
    role : "",
    _id : ""
  })

  const fetchAllUsers = async () => {
    try {
      const fetchData = await fetch(SummaryApi.allUser.url, {
        method: SummaryApi.allUser.method,
        credentials: 'include',
      });

      // Convertesc datele in json
      const dataResponse = await fetchData.json();

      if (dataResponse.success) {
        setAllUser(dataResponse.data);
      } else if (dataResponse.error) {
        toast.error(dataResponse.message);
      }
    } catch (error) {
      toast.error("A apărut o eroare la preluarea utilizatorilor.");
      console.error("Eroare:", error);
    }

  }
  useEffect(() => {
    fetchAllUsers()
  }, [])


  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(SummaryApi.deleteUser.url, {
        method: SummaryApi.deleteUser.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: deleteUserId }) // Transmite `deleteUserId` din state
      });

      const dataResponse = await response.json();

      if (dataResponse.success) {
        toast.success(dataResponse.message);
        fetchAllUsers(); // Actualizează lista de utilizatori
      } else {
        toast.error(dataResponse.message);
      }
    } catch (error) {
      toast.error("A apărut o eroare la ștergerea utilizatorului.");
      console.error("Eroare:", error);
    } finally {
      setShowConfirmDelete(false); // Închide modalul după ștergere
    }
  }

  const handleOpenDeleteModal = (userId) => {
    setDeleteUserId(userId);
    setShowConfirmDelete(true);
  };

  return (
    <div>
      <table className='w-full user-table '>
        <thead>
          <tr className='bg-black text-white'>
            <th>Nr.</th>
            <th>Nume</th>
            <th>Prenume</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Data creare</th>
            <th>Actiune</th>
          </tr>
          
        </thead>
        <tbody>
          {
            allUser.map((usr, index) => {
              return (
                <tr >
                  <td>{index + 1}</td>
                  <td>{usr?.name}</td>
                  <td>{usr?.lastname}</td>
                  <td>{usr?.email}</td>
                  <td>{usr?.role}</td>
                  <td>{moment(usr?.createdAt).format('LL')}</td>
                  <td className=''>
                    Editeaza
                    <button className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white' title='Edit' 
                    onClick={() => 
                      {
                        setUpdateUserDetails(usr)
                        setOpenUpdateRole(true)
                      }}>

                      <MdModeEditOutline /> 
                    </button> <br/>
                    Sterge
                    <button 
                    className='bg-red-100 p-2 rounded-full cursor-pointer hover:bg-red-500 hover:text-white' 
                    title='Delete'
                    onClick={() => handleOpenDeleteModal(usr._id)}
                    >
                    <RiDeleteBin6Line />
                    </button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      {
        openUpdateRole && (
          <ChangeUserRole onClose={() => setOpenUpdateRole(false)}
            name= {updateUserDetails.name}
            lastname={updateUserDetails.lastname} 
            email={updateUserDetails.email} 
            role={updateUserDetails.role}
            userId={updateUserDetails._id}
            callFunc = {fetchAllUsers}
            />
        )
      }

      {
        showConfirmDelete && (
          <ConfirmDeleteModal 
            onConfirm={handleDeleteUser} // Nu este nevoie să treci parametri
            onCancel={() => setShowConfirmDelete(false)}
          />
        )
      }
    </div>
  )
}

export default AllUsers
