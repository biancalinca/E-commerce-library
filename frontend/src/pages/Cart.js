import React, { useContext, useEffect, useState } from 'react'
import emptyCart from "../resources/emptyCart.png"
import SummaryApi from '../common';
import Context from '../context';
import { MdDelete } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import {loadStripe} from '@stripe/stripe-js';

function Cart() {
    const [data, setData] = useState([]) 
    const [loading, setLoading] = useState(false)
    const [loadingProductId, setLoadingProductId] = useState(null) // Starea de loading pentru produsul specific
    const context = useContext(Context)
    const {fetchUserAddToCart} = useContext(Context)


    const fetchData = async () => {
        const response = await fetch(SummaryApi.addToCartView.url, {
            method: SummaryApi.addToCartView.method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        setLoading(false)
        const responseData = await response.json()

        // if (responseData.success) {
        //     console.log("Produse din coș:", responseData.data); 
        //     setData(responseData.data.products); // Asigură-te că setezi `data` corect
        // } else {
        //     console.error("Failed to fetch cart products:", responseData.message);
        // }

        if (responseData.success) {
            console.log("Produse din coș:", responseData.data); 
            if (responseData.data && responseData.data.products) {
                setData(responseData.data.products);
            } else {
                console.error("Products data is missing or undefined.");
                setData([]); // Setează un array gol pentru a evita problemele de tip undefined
            }
        } else {
            console.error("Failed to fetch cart products:", responseData.message);
            setData([]); // În caz de eroare, setează un array gol
        }
    }

    useEffect(() => {
        fetchData()
    }, [context.cartProductCount])

    // Verifică structura `data` în consolă după setare:
useEffect(() => {
    console.log("Data actualizată:", data);
}, [data]);

    const increaseQty = async(id,qty) =>{
        const response = await fetch(SummaryApi.updateAddToCartProduct.url,{
            method : SummaryApi.updateAddToCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                {   
                    _id : id,
                    quantity : qty + 1
                }
            )
        })

        const responseData = await response.json()

        if(responseData.success){
            fetchData(); // Reîncarcă datele coșului după actualizare
            fetchUserAddToCart(); // Actualizează numărul de produse din coș
        }
    }


    const decraseQty = async(id,qty) =>{
       if(qty >= 2){
            const response = await fetch(SummaryApi.updateAddToCartProduct.url,{
                method : SummaryApi.updateAddToCartProduct.method,
                credentials : 'include',
                headers : {
                    "content-type" : 'application/json'
                },
                body : JSON.stringify(
                    {   
                        _id : id,
                        quantity : qty - 1
                    }
                )
            })

            const responseData = await response.json()


            if(responseData.success){
                fetchData(); // Reîncarcă datele coșului după actualizare
                fetchUserAddToCart(); // Actualizează numărul de produse din coș
            }
        }
    }

    const deleteCartProduct = async (id) => {
        const respone = await fetch(SummaryApi.deleteAddToCartProduct.url, {
            method: SummaryApi.deleteAddToCartProduct.method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: id
            })
        })
        const dataResponse = await respone.json()

        if (dataResponse.success) {
            fetchData(); // Reîncarcă datele coșului după ștergere
            fetchUserAddToCart(); // Actualizează numărul de produse din coș
        } else {
            console.error("Eroare la ștergerea produsului:", dataResponse.message);
        }
    }


    const totalQty = data.reduce((previousValue, currentValue)=> previousValue + currentValue.quantity, 0)

    const totalPrice = data.reduce((preve, curr) => preve + (curr.quantity * curr?.productId?.sellingPrice), 0)

    const totalSavings = data.reduce((preve, curr) => 
        preve + (curr.quantity * (curr?.productId?.price - curr?.productId?.sellingPrice)), 0
    )

    const deliveryCost = totalPrice < 150 ? 12 : 0

    const finalPrice = totalPrice + deliveryCost

    const amountToFreeShipping = 150 - totalPrice

    const handlePayment = async() => {
        const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
        const resonse = await fetch(SummaryApi.payment.url, {
            method: SummaryApi.payment.method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cartItems: data
            })
        })
        const responseData = await resonse.json()

        if(responseData?.data?.id){
            stripePromise.redirectToCheckout({ sessionId: responseData.data.id })
        }

        console.log("responseData", responseData)
    }

    return (
        <div className='container mx-auto text-green-950'>
            <div className='text-center text-lg my-3'>
                {
                    (!data || data.length === 0) && !loading && (
                        <div className='text-center my-6'>

                            <div className='w-full h-full'>
                                <img src={emptyCart} alt="Coșul este gol" className='mx-auto w-[600px] h-[220px] object-contain scale-150' />
                            </div>

                            <p className='text-4xl font-semibold mb-4'>
                                Nu exista produse în coșul tău de cumpărături momentan
                            </p>

                            <p className='text-2xl'>
                                Întoarce-te printre rafturile digitale și adaugă ceea ce vrei să cumperi în coșul tău.
                            </p>
                        </div>
                    )
                }
            </div>

            {
                data && data.length > 0 && (
                    <div className='flex flex-col lg:flex-row gap-10 w-full justify-between '>

                    {/*Vizualizare produs in cosul de cumparaturi*/}
                    <div className='w-full max-w-3xl'>
                        {
                            loading ? (
                                new Array(context.cartProductCount).fill(null).map((_, index) => (
                                    <div key={index} className='w-full bg-slate-200 h-32 my-5 border border-slate-300 animate-pulse rounded'>
                                    </div>
                                ))
                            ) : (
                                data.map((product) => {
                                    const isLoadingProduct = loadingProductId === product._id;
                                    return (
                                        <div key={product?.productId?._id + "Add to Cart Loading"} className={`w-full bg-white shadow h-32 my-5 rounded flex items-center ${isLoadingProduct && 'opacity-50'}`}>
                                            <div className="w-32 h-full flex-shrink-0">
                                                <img src={product?.productId?.bookImage[0]} className="w-full h-full object-scale-down mix-blend-multiply" />
                                            </div>
                                            <div className="flex-1 px-4">
                                                <h2 className="text-xl font-semibold">{product?.productId?.title}</h2>
                                                <p className="text-lg">{product?.productId?.author}</p>
                                            </div>
    
                                            <div className='w-20 '>
                                                <button className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 p-2 rounded transition duration-200 ease-in-out shadow-sm text-center" onClick={() => deleteCartProduct(product?._id)}>                                            
                                                    <MdDelete size={18} />
                                                </button>
                                            </div>
    
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    className="border border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 font-medium py-1 px-3 rounded transition duration-200"
                                                    onClick={() => decraseQty(product?._id, product?.quantity)}
                                                >
                                                    -
                                                </button>
                                                <span className="text-lg font-medium text-gray-700">{product?.quantity}</span>
                                                <button 
                                                    className="border border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400 font-medium py-1 px-3 rounded transition duration-200"
                                                    onClick={() => increaseQty(product?._id, product?.quantity)}                              
                                                >
                                                    +
                                                </button>
                                            </div>
    
                                            <div className="w-32 text-right pr-4 flex flex-col items-end justify-center space-y-1">
                                                <div className="text-gray-500 line-through text-sm">{(product?.productId?.price * product?.quantity).toFixed(2)} Lei</div>
                                                <div className="text-lg font-bold text-green-800">{(product?.productId?.sellingPrice * product?.quantity).toFixed(2)} Lei</div>
                                                <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
                                                    {`-${Math.round(((product?.productId?.price - product?.productId?.sellingPrice) / product?.productId?.price) * 100)}%`}
                                                </div>
                                            </div>
                                        </div>
    
                                    )
                                })
                            )
                        }
                    </div>
    
                    
    
                    {/*Totalul cosului de cumparaturi*/}
    
                    <div className='mt-5 lg:mt-0 w-full max-w-sm '>
                        {
                            loading ? (
                                <div className='h-36 bg-slate-200 border-slate-300 animate-pulse'>
                                </div>
                            ) : (
                                <div className='h-64 bg-white shadow rounded'>
    
                                    <h2 className='text-xl font-semibold p-4 '>Total comandă</h2>
                                    <div className='flex justify-between items-center p-2'>
                                        <p>Produse ({totalQty})</p>
                                        <p>{totalPrice.toFixed(2)} Lei</p>
                                    </div>
    
                                    <div className='flex justify-between items-center p-2'>
                                        <p>Ai economisit</p>
                                        <p> {totalSavings.toFixed(2)} Lei</p>
                                    </div>
                                    <div className='flex justify-between items-center p-2'>
                                        <p>Livrare</p>
                                        <p>{deliveryCost === 0 ? 'GRATUIT' : `${deliveryCost.toFixed(2)} Lei`} </p>
                                    </div>
                                    <div className='flex justify-between items-center p-2 my-3 font-semibold'>
                                        <p>Total</p>
                                        <p>{finalPrice.toFixed(2)} Lei</p>
                                    </div>
    
    
                                        {/* Banner pentru transport gratuit */}
                                    {
                                        totalPrice < 150 && (
                                            <div className='fixed bottom-0 left-0 w-full bg-yellow-200 text-yellow-800 text-center py-4 rounded-t opacity-90'>
                                                Mai adaugă produse de <span className='font-semibold'>{amountToFreeShipping.toFixed(2)} Lei</span> pentru a beneficia de transport gratuit!
                                            </div>
                                        )
                                    }
                                    <div className='p-5 flex justify-center '>
                                        <button className="group bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-3xl shadow-lg transition duration-300 flex items-center gap-4 pl-8" onClick = {handlePayment}>
                                            Plasează comanda
                                            <span className='text-xl transform transition-transform duration-300 ease-in-out group-hover:translate-x-1'>
                                                <IoIosArrowForward />
                                            </span>
                                        </button>
                                    </div>
    
                                </div>
                            )
                        }
                    </div>
    
                </div>
                )
            }

                    

        </div>
    )
}

export default Cart
