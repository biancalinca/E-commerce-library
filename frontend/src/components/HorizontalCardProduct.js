import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryAll from '../helpers/fetchCategoryAll'
import { BsBasket2Fill } from "react-icons/bs";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import addToCart from './../helpers/addToCart';
import addToWishlist from '../helpers/addToWishlist';
import Context from '../context';
import scrollTop from '../helpers/scrollTop';
import moment from 'moment';
import { GrFavorite } from 'react-icons/gr';
import StarRating from './StarRating';

const HorizontalCardProduct = ({category, heading}) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    
    const loadingList = new Array(13).fill(null)

    const [ scroll, setScroll] = useState(0)

    const scrollElement = useRef()

    const {fetchUserAddToCart, fetchUserWishlist} = useContext(Context)



    const handleAddToCart = async (e, id) => {
        await addToCart(e,id)
        fetchUserAddToCart()
    }

    const handleAddToWishlist =  async (e,id)=>{
        await addToWishlist(e,id)
        fetchUserWishlist()
    }

    const fetchData = async () => {
        setLoading(true)
        const categoryProduct = await fetchCategoryAll(category)
        setLoading(false)

        setData(categoryProduct?.data)
    }

    useEffect(() => {
        fetchData()
    },[category])

    const scrollRight = () => {
        scrollElement.current.scrollLeft += 200
    } 

    const scrollLeft = () => {
        scrollElement.current.scrollLeft -= 200
    }


  return (
    <div className='container mx-auto px-4 my-4 relative'>

        <h2 className='text-2xl font-bold py-4 '>{heading}</h2>

       <div className='flex items-center gap-4 md:gap-6 overflow-scroll scorllbar-none transition-all' ref={scrollElement}>
        

            <button 
                className='bg-white shadow-md rounded-full p-2 opacity-50 hover:opacity-70 absolute -left-3 text-lg hidden md:block' onClick={scrollLeft}>
                <FaArrowLeft />
            </button>
            <button 
                className='bg-white shadow-md rounded-full p-2 opacity-50 hover:opacity-70 absolute -right-3 text-lg hidden md:block' onClick={scrollRight}>
                <FaArrowRight />
            </button>

        {   loading ? (
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
                    // Verifică dacă produsul a fost adăugat în ultimele 2 ore
                    const isNew = moment().diff(moment(product.createdAt), 'hours') < 24;
                    const hasDiscount = product.price > product.sellingPrice;
                    const discountPercentage = hasDiscount
                        ? Math.round(((product.price - product.sellingPrice) / product.price) * 100)
                        : 0;

                    return (
                        <Link key={index} to={"/book/" + product?._id} className='w-full min-w-[280px] md:min-w-[180px] max-w-[280px] md:max-w-[180px] bg-white rounded-sm shadow-md' onClick = {scrollTop}>
                            
                            <div className='relative bg-white p-2 min-w-[180px] md:min-w-[145px] h-64 flex justify-center items-center'>
                                {isNew && (
                                    <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                        NOU
                                    </div>
                                )}
                                {hasDiscount && (
                                        <div className="absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                                            -{discountPercentage}%
                                        </div>
                                    )}
                                <img 
                                src={product.bookImage[0]} 
                                alt={product.title} 
                                className='object-contain h-full '
                                style={{ width: '140px', height: '220px' }}
                                loading="lazy"
                                />
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

                                <div className='text-md my-2 flex justify-center gap-4'>
                                <StarRating productId={product._id} size={20} />
                                    <div className='text-3xl'>
                                        <button className=" text-pink-500 w-11 h-11 flex justify-center items-center" aria-label="Add to favorites" onClick={(e) => handleAddToWishlist(e, product?._id)}>
                                        <GrFavorite/> 
                                        </button>
                                    </div>
                                </div> 

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


    </div>
  )
}

export default HorizontalCardProduct
