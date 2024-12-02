import React, { useContext } from 'react';
import { BsBasket2Fill } from "react-icons/bs";
import { Link} from 'react-router-dom';
import addToCart from './../helpers/addToCart';
import addToWishlist from '../helpers/addToWishlist';
import Context from '../context';
import scrollTop from '../helpers/scrollTop';
import moment from 'moment';
import { GrFavorite } from 'react-icons/gr';
import StarRating from './StarRating';

const VerticalCard = ({ loading, data = [] }) => {

    const loadingList = new Array(13).fill(null);
    const { fetchUserAddToCart, fetchUserWishlist } = useContext(Context);

    const handleAddToCart = async (e, id) => {
        await addToCart(e, id);
        fetchUserAddToCart();
    };

    const handleAddToWishlist =  async (e,id)=>{
        await addToWishlist(e,id)
        fetchUserWishlist()
    }

    return (
        <div className='container mx-auto px-4 my-4 relative '>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                {loading ? (
                    loadingList.map((_, index) => (
                        <div key={index} className='w-full bg-white rounded-sm shadow-md'>
                            <div className='bg-slate-200 h-64 flex justify-center items-center animate-pulse'></div>
                            <div className='text-center'>
                                <h3 className='text-lg font-semibold bg-slate-200 animate-pulse'></h3>
                                <p className='text-sm text-gray-600 bg-slate-200 animate-pulse'></p>
                            </div>
                            <div className='text-center my-5'>
                                <div className='text-xl font-semibold text-green-700 bg-slate-200 p-1 animate-pulse'></div>
                                <div className='text-sm my-2 w-full bg-slate-200 animate-pulse'></div>
                                <div className='my-4 flex justify-center'>
                                    <button className="bg-slate-200 animate-pulse rounded-full w-full"></button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    data.map((product, index) => {
                        const isNew = moment().diff(moment(product.createdAt), 'hours') < 24;
                        const hasDiscount = product.price > product.sellingPrice;
                        const discountPercentage = hasDiscount
                            ? Math.round(((product.price - product.sellingPrice) / product.price) * 100)
                            : 0;

                        return (
                            <Link key={index} to={`/book/${product?._id}`} className='w-full bg-white rounded-sm shadow-md' onClick={scrollTop}>
                                <div className='relative bg-white p-2 h-64 flex justify-center items-center'>
                                    {isNew && (
                                        <div className="absolute top-2 left-2 bg-blue-400 text-white px-2 py-1 rounded-full text-xs font-bold">
                                            NOU
                                        </div>
                                    )}
                                    {hasDiscount && (
                                        <div className="absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                                            -{discountPercentage}%
                                        </div>
                                    )}
                                    <img src={product.bookImage[0]} alt={product.title} className='object-contain h-full' />
                                </div>
                                <div className='text-center'>
                                    <h3 className='text-lg font-semibold'>{product?.title}</h3>
                                    <p className='text-sm text-gray-600'>{product?.author}</p>
                                </div>
                                <div className='text-center my-5'>
                                    <div className='text-xl font-semibold text-green-700'>
                                        {product?.sellingPrice} Lei 
                                        <s className='text-gray-400 font-normal text-lg p-1'>{product?.price} Lei</s>
                                    </div>
                                    <div className='text-md my-2 flex justify-center gap-4'>
                                    <StarRating productId={product._id} size={20} />
                                    <div className='text-3xl'>
                                        <button className=" text-pink-500" aria-label="Add to favorites" onClick={(e) => handleAddToWishlist(e, product?._id)}>
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
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default VerticalCard;
