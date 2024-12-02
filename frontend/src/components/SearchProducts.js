import React, { useContext } from 'react'
import scrollTop from '../helpers/scrollTop'
import { BsBasket2Fill } from 'react-icons/bs'
import addToCart from './../helpers/addToCart';
import Context from '../context';
import { Link } from 'react-router-dom';
// import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';


const SearchProducts = ({
    loading,
    data = []
}) => {

    const loadingList = new Array(13).fill(null)
    const {fetchUserAddToCart} = useContext(Context)

    const handleAddToCart = async (e, id) => {
        await addToCart(e,id)
        fetchUserAddToCart()
    }


  return (
    <div className='flex items-center gap-4 md:gap-6 overflow-scroll scorllbar-none transition-all' >


{  
 loading ? (
    loadingList.map((product, index) => {
        return (
            <div className='w-full min-w-[280px] md:min-w-[180px] max-w-[280px] md:max-w-[180px] bg-white rounded-sm shadow-md'>
                <div className='bg-slate-200 p-2 min-w-[180px] md:min-w-[145px] h-64 flex justify-center items-center animate-pulse'>
                </div>

                <div className=' text-center'>
                    <h3 className='text-lg font-semibold bg-slate-200 animate-pulse'></h3>
                    <p className='text-sm text-gray-600 '></p>
                    {/* Adaugă alte detalii relevante aici */}
                </div>

                <div className='text-center my-5'>
                    <div className='text-xl font-semibold text-green-700 bg-slate-200 p-1 animate-pulse'>
                        <s className='text-gray-400 font-normal text-lg p-1'> </s>
                    </div>

                    <div className='text-sm my-2 w-full bg-slate-200 animate-pulse'>
                        
                    </div> 

                    <div className='my-4 flex justify-center'>
                        <button className="bg-slate-200 animate-pulse rounded-full  w-full">
                           
                        </button>
                    </div>

                </div>    

                
            </div>
        )
    })
    ) : (
        data.map((product, index) => {
            return (
                <Link to={"/book/" + product?._id} className='w-full min-w-[280px] md:min-w-[180px] max-w-[280px] md:max-w-[180px] bg-white rounded-sm shadow-md' onClick = {scrollTop}>
                    <div className='bg-white p-2 min-w-[180px] md:min-w-[145px] h-64 flex justify-center items-center'>
                        <img src={product?.bookImage[0]} className='object-contain h-full '/>
                    </div>

                    <div className=' text-center'>
                        <h3 className='text-lg font-semibold'>{product?.title}</h3>
                        <p className='text-sm text-gray-600'>{product?.author}</p>
                        {/* Adaugă alte detalii relevante aici */}
                    </div>

                    <div className='text-center my-5'>
                        <div className='text-xl font-semibold text-green-700'>
                            {product?.sellingPrice} Lei 
                            <s className='text-gray-400 font-normal text-lg p-1'>{product?.price} Lei</s>
                        </div>

                        {/* <div className='text-sm my-2'>
                            Review stelute
                        </div>  */}

                        <div className='my-4 flex justify-center'>
                            <button className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-3xl shadow-lg transition duration-300 flex items-center gap-4 pl-8" onClick={(e) => handleAddToCart(e, product?._id)}>
                                Adaugă în coș  
                                <BsBasket2Fill />
                            </button>
                        </div>

                    </div>   
                    
                </Link>
            )
        })
    )
}
</div>
  )
}

export default SearchProducts
