import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SummaryApi from '../../common';
import { toast } from 'react-toastify';

function VerifyEmail() {
    const location = useLocation();
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState('Verificarea emailului este în curs...');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(`${SummaryApi.verifyEmail.url}${location.search}`, {
                    method: SummaryApi.verifyEmail.method,
                });

                const data = await response.json();

                if (data.success) {
                    toast.success(data.message);
                    setVerificationStatus('Email verificat cu succes! Mulțumim că te-ai alăturat nouă.');
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000); // 3 seconds delay before redirection
                } else {
                    toast.error(data.message);
                    setVerificationStatus('Verificarea emailului a eșuat. Te rugăm să încerci din nou.');
                }
            } catch (error) {
                toast.error('A apărut o eroare la verificarea emailului.');
                setVerificationStatus('A apărut o eroare. Te rugăm să încerci din nou mai târziu.');
            }
        };

        verifyEmail();
    }, [location.search, navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <h2 className="text-xl font-semibold">{verificationStatus}</h2>
            </div>
        </div>
    );
}

export default VerifyEmail;
