import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { MdEdit} from "react-icons/md";
import {toast} from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetail } from '../store/userSlice';
import ViewedBooksHistory from '../components/ViewedBooksHistory';

const UserDetails = () => {
    const [data, setData] = useState(null);
    const user = useSelector((state) => state?.user?.user)
    const navigate = useNavigate()
      //ca sa sterg datele atunci cand ma deloghez:
  const dispatch = useDispatch()
    const [isEditing, setIsEditing] = useState(false);
    const [formValues, setFormValues] = useState({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        address: ''
    });

    const fetchUserDetails = async () => {
        try {
            const response = await fetch(SummaryApi.current_user.url, {
                method: SummaryApi.current_user.method,
                credentials: 'include',
            });
            const dataResponse = await response.json();
            if (dataResponse.success) {
                setData(dataResponse.data);
                setFormValues({
                    name: dataResponse.data.name,
                    lastname: dataResponse.data.lastname,
                    email: dataResponse.data.email,
                    phone: dataResponse.data.phone,
                    address: dataResponse.data.address,
                });
            } else {
                throw new Error(dataResponse.message);
            }
        } catch (err) {
            console.error("Error fetching user data", err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSave = async () => {
        try {
            const response = await fetch(SummaryApi.editUser.url, {
                method: SummaryApi.editUser.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formValues),
            });
            const dataResponse = await response.json();
            if (dataResponse.success) {
                toast.success(dataResponse.message);
                setData(dataResponse.data);
                setIsEditing(false);
            } else {
                toast.error(dataResponse.message);
                throw new Error(dataResponse.message);
            }
        } catch (err) {
            console.error("Error updating user data", err);
        }
    };

     //logout
  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout.url, {
      method : SummaryApi.logout.method,
      credentials : 'include',
    })
  
  const data = await fetchData.json()

  if(data.success){
    toast.success(data.message)
    dispatch(setUserDetail(null))
    navigate("/")
  }

  if(data.error){
    toast.error(data.error)
  }
}

    useEffect(() => {
        fetchUserDetails();
    }, []);

    return (
        <div className="max-w-5xl mx-auto mt-10 mb-5">
            <div className="flex flex-col space-y-6">
                {/* Top Section - User Details */}
                <div className="flex">
                    {/* Left Menu */}
                    <div className="w-1/4 bg-green-50 p-4 rounded-2xl shadow-lg">
                        <ul className="space-y-4">
                            <li className="font-semibold text-lg text-green-900">Informațiile mele</li>
                            <li className='hover:text-green-900 hover:underline'>
                                <Link to="/order">Comenzile mele</Link>
                            </li>
                            <li className='hover:text-green-900 hover:underline'>                               
                                <Link to="/whish-list">Wishlist</Link>
                            </li>
                            {/* <li className='hover:text-green-900 hover:underline'>Review-urile mele</li>
                            <li className='hover:text-green-900 hover:underline'>Puncte de fidelitate</li> */}
                            <li className="hover:text-green-900 hover:underline">
                                {user?._id ? (
                                    <button onClick={handleLogout} className="hover:text-green-900 hover:underline">
                                        Log out
                                    </button>
                                ) : (
                                    <Link to="/login" className="hover:text-green-900 ">Log in</Link>
                                )}
                            </li>
                        </ul>
                    </div>

                    {/* Right Content - User Details */}
                    <div className="w-3/4 p-8 bg-white rounded-lg shadow-md ml-4">
                        <h2 className="text-2xl font-bold mb-6">Datele mele</h2>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="flex-1 space-y-2">
                                    <p><strong>Prenume:</strong> {data?.name}</p>
                                    <p><strong>Nume:</strong> {data?.lastname}</p>
                                    <p><strong>Email:</strong> {data?.email}</p>
                                    <p><strong>Număr de telefon:</strong> {data?.phone}</p>
                                    <p><strong>Adresă:</strong> {data?.address}</p>
                                </div>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-yellow-600 hover:underline flex gap-2"
                                >
                                    <MdEdit className="text-xl" />
                                    <span>Editează</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal for Editing User Details */}
                {isEditing && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-96">
                            <h2 className="text-xl font-bold mb-4">Editează detaliile</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-semibold">Prenume:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formValues.name}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold">Nume:</label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        value={formValues.lastname}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold">Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formValues.email}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold">Număr de telefon:</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formValues.phone}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold">Adresă:</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formValues.address}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        onClick={handleSave}
                                        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                                    >
                                        Salvează
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="text-red-600 py-2 px-4 rounded border border-red-600 hover:bg-red-50"
                                    >
                                        Anulează
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Section - Viewed Books History */}
            <div className="mt-10">
                <ViewedBooksHistory />
            </div>
        </div>
                
    );
};

export default UserDetails;
