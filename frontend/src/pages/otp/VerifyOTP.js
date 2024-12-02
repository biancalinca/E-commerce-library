import React, { useState } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../../common';
import { useNavigate } from 'react-router-dom';

function VerifyOTP() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const response = await fetch(SummaryApi.verifyOtp.url, {
            method: SummaryApi.verifyOtp.method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        });

        const result = await response.json();

        if (result.success) {
            toast.success(result.message);
            navigate('/reset-password', { state: { email } });
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center pt-16">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Verificare OTP</h2>
                <p className="text-center text-xl text-gray-600 mb-4">
                    Te rog introdu email-ul și codul primit pentru a-ți putea reseta parola.
                </p>
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div>
                        <label className="block text-md font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="Introdu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 p-3 block w-full shadow-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-md font-medium text-gray-700">Cod </label>
                        <input
                            type="text"
                            placeholder="Introdu cod"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="mt-1 p-3 block w-full shadow-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-3 rounded-md font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
                    >
                        Verifică codul
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VerifyOTP;
