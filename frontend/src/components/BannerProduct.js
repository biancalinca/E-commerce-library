import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import imag1 from '../resources/banner/imag1.png';
import imag2 from '../resources/banner/imag2.png';

const BannerProduct = () => {

    const [currentImage, setCurrentImage] = useState(0);

    const desktopImages = [imag1, imag2];
    const mobileImages = [];

   const nextImage = () => {
        setCurrentImage(prev => (prev + 1) % desktopImages.length);
    };

    const prevImage = () => {
        setCurrentImage(prev => (prev - 1 + desktopImages.length) % desktopImages.length);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextImage();
        }, 8000);
        return () => clearInterval(interval); // Cleanup the interval on unmount
    }, [currentImage]); 
    return (
        <div className='container mx-auto px-4 rounded'>
            <div className='h-60 md:h-72 w-full bg-slate-200 relative'>
                <div className='absolute z-10 w-full h-full md:flex items-center hidden'>
                    <div className='flex justify-between w-full text-2xl p-1'>
                        <button 
                            className='bg-white shadow-md rounded-full p-2 opacity-50 hover:opacity-70'
                            onClick={prevImage}>
                            <FaArrowLeft />
                        </button>
                        <button 
                            onClick={nextImage} 
                            className='bg-white shadow-md rounded-full p-2 opacity-50 hover:opacity-70'>
                            <FaArrowRight />
                        </button>
                    </div>
                </div>

                {/* Mobil  */}

                <div className='flex h-full w-full overflow-hidden md:hidden' >
                    {
                        mobileImages.map((imageUrl, index) => (
                            <div className='w-full h-full min-w-full min-h-full' key={index} style={{transform: `translateX(-${currentImage * 100}%)`, transition: 'transform 0.3s ease-in-out'}}>
                                <img src={imageUrl} className='w-full h-full object-cover' alt={`Slide ${index + 1}`} />
                            </div>
                        ))
                    }
                </div>

                {/* Desktop si tableta  */}

                <div className='hidden md:flex h-full w-full overflow-hidden' >
                    {
                        desktopImages.map((imageUrl, index) => (
                            <div className='w-full h-full min-w-full min-h-full' key={index} style={{transform: `translateX(-${currentImage * 100}%)`, transition: 'transform 0.3s ease-in-out'}}>
                                <img src={imageUrl} className='w-full h-full' alt={`Slide ${index + 1}`} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default BannerProduct;
