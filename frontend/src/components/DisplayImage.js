import React from 'react';

function DisplayImage({ imgUrl, onClose }) {
    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-20 flex justify-center items-center bg-slate-800 bg-opacity-80 overflow-hidden'>
            <div className='relative'>
                <button className='absolute top-2 right-2 text-2xl text-white' onClick={onClose}>✕</button>
                <img src={imgUrl} alt="Full Screen" className='max-w-full max-h-full' />
            </div>
        </div>
    );
}

export default DisplayImage;
