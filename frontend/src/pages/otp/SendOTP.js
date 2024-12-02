import React, { useState } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../../common';
import { useNavigate } from 'react-router-dom';

function SendOTP() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        const response = await fetch(SummaryApi.sendOtp.url, {
            method: SummaryApi.sendOtp.method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (result.success) {
            toast.success(result.message);
            navigate('/verify-otp', { state: { email } });
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className=" pt-16 flex items-center justify-center  ">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Recuperare Parola</h2>
                <p className="text-center text-xl text-gray-600 mb-4">
                    Te rog introdu email-ul aici pentru a primi pe email un cod OTP necesar pentru a-ti putea recupera parola.
                </p>
                <form onSubmit={handleSendOTP} className="space-y-4">
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
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-3 rounded-md font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
                    >
                        Trimite cod
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SendOTP;
