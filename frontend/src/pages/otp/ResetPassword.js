import React, { useState } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../../common';
import { useLocation, useNavigate } from 'react-router-dom';

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Parolele nu se potrivesc');
            return;
        }

        const response = await fetch(SummaryApi.resetPassword.url, {
            method: SummaryApi.resetPassword.method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, newPassword }),
        });

        const result = await response.json();

        if (result.success) {
            toast.success(result.message);
            navigate('/login');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center pt-16">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Resetare Parola</h2>
                <p className="text-center text-xl text-gray-600 mb-4">
                    Te rog introdu parola nouă și confirmă parola pentru a-ți putea reseta parola.
                </p>
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                        <label className="block text-md font-medium text-gray-700">Parola Nouă</label>
                        <input
                            type="password"
                            placeholder="Introdu parola nouă"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 p-3 block w-full shadow-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-md font-medium text-gray-700">Confirmă Parola</label>
                        <input
                            type="password"
                            placeholder="Confirmă parola"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 p-3 block w-full shadow-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-3 rounded-md font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
                    >
                        Resetează Parola
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
