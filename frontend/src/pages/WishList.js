import React, { useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import Context from '../context';
import { BsBasket2Fill } from "react-icons/bs";
import { GrFavorite } from 'react-icons/gr';
// import { MdFavorite } from 'react-icons/md';
import { MdDelete } from "react-icons/md";
import moment from 'moment';
import { Link } from 'react-router-dom';
import addToCart from './../helpers/addToCart';
import addToWishlist from '../helpers/addToWishlist';

function Wishlist() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const context = useContext(Context);

    // const [wishlistItems, setWishlistItems] = useState({});

    const fetchData = async () => {
        setLoading(true);

        const response = await fetch(SummaryApi.viewWishlist.url, {
            method: SummaryApi.viewWishlist.method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const responseData = await response.json();
        setLoading(false);

        if (responseData.success) {
            console.log("Produse din wishlist:", responseData.data);
            if (responseData.data && responseData.data.products) {
                setData(responseData.data.products);
            } else {
                console.error("Products data is missing or undefined.");
                setData([]); // Setează un array gol pentru a evita problemele de tip undefined
            }
        } else {
            console.error("Failed to fetch wishlist products:", responseData.message);
            setData([]); // În caz de eroare, setează un array gol
        }
    };

    const handleAddToCart = async (e, id) => {
        await addToCart(e, id);
        context.fetchUserAddToCart();
    };

    const handleAddToWishlist = async (e, id) => {
        await addToWishlist(e, id);
        context.fetchUserWishlist();
    };



const deleteWishlistProduct = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();  // Previne propagarea evenimentului la elementul `Link`
    try {
        const response = await fetch(SummaryApi.deleteWishlistProduct.url, {
            method: SummaryApi.deleteWishlistProduct.method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: id })
        });

        const dataResponse = await response.json();

        if (dataResponse.success) {
            // Reîncarcă datele wishlist-ului după ștergere
            fetchData(); 
            // Poți actualiza și numărul de produse din wishlist dacă este necesar
            context.fetchUserWishlist(); 
        } else {
            console.error("Eroare la ștergerea produsului din wishlist:", dataResponse.message);
        }
    } catch (err) {
        console.error("A apărut o eroare la ștergerea produsului:", err);
    }
};



    useEffect(() => {
        fetchData();
    }, [context.wishlistProductCount]);

    return (
        <div className='container mx-auto text-green-950'>
            <h1 className="text-3xl font-bold mb-6">Lista ta de dorinte</h1>
            <div className='text-center text-lg my-3'>
                {
                    (!data || data.length === 0) && !loading && (
                        <div className='text-center my-6'>


                            <p className='text-4xl font-semibold mb-4'>
                                Nu există produse în wishlist-ul tău momentan
                            </p>

                            <p className='text-2xl'>
                                Întoarce-te printre rafturile digitale și adaugă ceea ce îți dorești în wishlist.
                            </p>
                        </div>
                    )
                }
            </div>

            {
                data && data.length > 0 && (
                    <div className='container mx-auto px-4 my-4 relative'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                            {loading ? (
                                new Array(context.wishlistProductCount).fill(null).map((_, index) => (
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
                                        <Link key={index} to={`/book/${product?.productId?._id}`} className='w-full bg-white rounded-sm shadow-md'>
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
                                                <img src={product?.productId?.bookImage[0]} alt={product?.productId?.title} className='object-contain h-full' />
                                            </div>
                                            <div className='text-center'>
                                                <h3 className='text-lg font-semibold'>{product?.productId?.title}</h3>
                                                <p className='text-sm text-gray-600'>{product?.productId?.author}</p>
                                            </div>
                                            <div className='text-center my-5'>
                                                <div className='text-xl font-semibold text-green-700'>
                                                    {product?.productId?.sellingPrice} Lei 
                                                    <s className='text-gray-400 font-normal text-lg p-1'>{product?.productId?.price} Lei</s>
                                                </div>
                                                <div className='text-md my-2 flex justify-center gap-4'>
                                                    <div>Stelute</div>
                                                    <div className='text-3xl'>
                                                        <button className="text-pink-500" onClick={(e) => handleAddToWishlist(e, product?.productId?._id)}>
                                                            <GrFavorite/> 
                                                        </button>
                                                    </div>
                                                </div> 
                                                <div className='my-4 flex justify-center'>
                                                    <button className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-3xl shadow-lg transition duration-300 flex items-center gap-4 pl-8" onClick={(e) => handleAddToCart(e, product?.productId?._id)}>
                                                        Adaugă în coș  
                                                        <BsBasket2Fill />
                                                    </button>
                                                </div>
                                                <div className='w-20'>
                                                    <button className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 p-2 rounded transition duration-200 ease-in-out shadow-sm text-center" onClick={(e) => deleteWishlistProduct(e, product?._id)}>                                            
                                                        <MdDelete size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default Wishlist;
