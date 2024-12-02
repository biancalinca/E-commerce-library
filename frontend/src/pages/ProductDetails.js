import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import SummaryApi from './../common/index';
import { FaStar } from "react-icons/fa";
import addToCart from './../helpers/addToCart';
import { BsBasket2Fill } from "react-icons/bs";
import HorizontalCardProduct from '../components/HorizontalCardProduct';
import Context from '../context';
import Reviews from '../components/Reviews';
import StarRating from '../components/StarRating';
import moment from 'moment';


//Componenta pentru afisarea detaliilor unei carti
const ProductDetails = () => {
  //starea initiala a datelor produsului luate din modelul produsului
  const [data, setData] = useState({ 
    title: "",
    author: "",
    description: "",
    price: "",
    sellingPrice: "",
    pageNumber: "",
    inStock: true,
    stock: "",
    bookImage: [],
    publicationYear: "",
    category: "Beletristica",
    publisher: "Nemira",
    edition: "Cartonata",
    ISBN: "",
    librarianRecommendations: [],
    promotions: ""
  })

  const params = useParams()
  const productId = params.id; // Extrage productId din params
  console.log("Params ID:", params?.id); // Verificăm dacă params.id este corect
  const [loading, setLoading] = useState(true)
  const productImageListLoading = new Array(4).fill(null)
  const [activeImage, setActiveImage] = useState("")

  const {fetchUserAddToCart, currentUser} = useContext(Context)


  const fetchProductDetails = async() => {
    setLoading(true)
    console.log("Sending productId:", params?.id); // Verificăm ce trimitem în cerere
    const response = await fetch(SummaryApi.productDetails.url,
      {
        method: SummaryApi.productDetails.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: params?.id })
      }
    )
    setLoading(false)
    const dataResponse = await response.json()

    setData(dataResponse?.data)
    setActiveImage(dataResponse?.data?.bookImage[0])
  }

  console.log("CATEGORIA ARATA:", data?.category); // Verificăm valoarea categoriei


  useEffect(() => {
    fetchProductDetails()
  }, [params])

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL)
    
  }

  const handleAddToCart = async (e, id) => {
    await addToCart(e,id)
    fetchUserAddToCart()
}
// Calculate discount percentage if there's a discount
const hasDiscount = data.price > data.sellingPrice;
const discountPercentage = hasDiscount
    ? Math.round(((data.price - data.sellingPrice) / data.price) * 100)
    : 0;

// Check if the product is new (added in the last 24 hours)
const isNew = moment().diff(moment(data.createdAt), 'hours') < 24;

  return (
    <div className='container mx-auto p-4 text-green-950'>

      <div className=' min-h-[200px] flex flex-col lg:flex-row gap-2'>

        {/*Imaginea produsului*/}
        <div className='h-96 flex flex-col lg:flex-row-reverse gap-3'>

          <div className='h-[300px] w-[300px] lg:h-96 lg:w-96  relative'>
            <img src={activeImage} className='h-full w-full object-scale-down mix-blend-multiply' />
          </div>
          
          <div className='h-full'> 
            {
              loading ? (
                <div className='flex gap-3 lg:flex-col overflow-scroll scorllbar-none h-full'>
                  {
                    productImageListLoading.map((el,index) => {
                      return (
                        <div className='h-20 w-20 bg-slate-200 rounded animate-pulse' key={"loadingImag" + index}>
                        </div>    
                      )                      
                    })
                  }
                </div>
              ) : (
                <div className='flex gap-3 lg:flex-col overflow-scroll scorllbar-none h-full'>
                  {
                    data?.bookImage?.map((imgURL, index) => {
                      return (
                        
                        <div className='h-20 w-20 rounded' key={imgURL}>
                          
                          <img src={imgURL} className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer' onMouseEnter={() => handleMouseEnterProduct(imgURL)} onClick={() => handleMouseEnterProduct(imgURL)} />
                        </div>
    
                      )
                    })
                  }
                </div>
              )
            }
          </div>
        </div>

        {/*Detaliile produsului descrierea*/}
        {
          loading ? (
            <div className='flex flex-col items-start '>
            <p className='bg-slate-200 animate-pulse h-6 w-full rounded-full opacity-70  '></p>
  
            <div className='flex flex-col items-start my-1 gap-1'>
              <h2 className='text-3xl  lg:text-4xl font-medium h-6 w-full rounded-full bg-slate-200 animate-pulse'></h2>
              <p className='h-6 w-full rounded-full bg-slate-200 animate-pulse'></p>
              <div className='flex gap-2 h-6 w-full rounded-full bg-slate-200 animate-pulse'>
                <div className='flex justify-center lg:justify-start items-center text-slate-200 gap-1'>
                <FaStar />
                <FaStar />
                <FaStar />  
                <FaStar />  
                <FaStar />  
                </div>
                <div>
                  <p className='text-slate-200'>Nota (nr de review-uri)</p>
                </div>
              </div>
              <p className='h-6 w-full rounded-full bg-slate-200 animate-pulse text-slate-200'>Descriere....</p>
            </div>

          </div>
          ) : (
            <div className='flex flex-col items-start '>
            <div className='flex items-center gap-2'>
                <p className='bg-pink-700 text-red-200 px-4 rounded-full opacity-70'>{data?.category}</p>
                {isNew && (
                  <p className='bg-blue-500 text-white px-4 rounded-full opacity-70'>Nou</p>
                )}
                {hasDiscount && (
                  <p className='bg-red-500 text-white px-4 rounded-full opacity-70'>-{discountPercentage}% Reducere</p>
                )}
            </div>
  
            <div className='flex flex-col items-start my-1 gap-1'>
              <h2 className='text-3xl  lg:text-4xl font-medium'>{data?.title}</h2>
              <p className=''>De (autor): {data?.author}</p>
              <div className='flex gap-2'>
              </div>
              <p>Descriere....</p>
            </div>
          </div>
          )
        }

        {/*Detaliile produsului - detaliate*/}
        {
          loading ? (
            <div className='w-full text-center lg:text-left lg:w-1/3 p-4 flex flex-col justify-between'>
            <div className='h-6 w-full rounded-full bg-slate-200 animate-pulse text-slate-200'>
              {data?.sellingPrice} Lei 
              <s className='h-6 w-full rounded-full bg-slate-200 animate-pulse text-slate-200'>{data?.price} Lei</s>
            </div>
  
            
            <div className='my-4 flex justify-center'>
                <button className=" font-semibold py-2 px-4 rounded-3xl shadow-lg transition duration-300 flex items-center h-6 w-full  bg-slate-200 animate-pulse text-slate-200 gap-4 pl-8" onClick={(e) => addToCart(e, data?._id)}>

                </button>
            </div>
            <div>
              <h3 className='text-2xl mb-3 font-semibold h-6 w-full rounded-full bg-slate-200 animate-pulse text-slate-200'></h3>
              <div className='flex flex-col gap-1'>
                <p className='h-6 w-full rounded-full bg-slate-200 animate-pulse text-slate-200'> <b></b> </p>
                <p className='h-6 w-full rounded-full bg-slate-200 animate-pulse text-slate-200'><b></b> </p>
                <p className='h-6 w-full rounded-full bg-slate-200 animate-pulse text-slate-200'><b></b> </p>
                <p className='h-6 w-full rounded-full bg-slate-200 animate-pulse text-slate-200'><b></b> </p>
                <p className='h-6 w-full rounded-full bg-slate-200 animate-pulse text-slate-200'><b></b> </p>
                <p className='h-6 w-full rounded-full bg-slate-200 animate-pulse text-slate-200'><b></b> </p>
                <p className='h-6 w-full rounded-full bg-slate-200 animate-pulse text-slate-200'><b></b> </p>
              </div>
            </div>
          </div>
            
          ) : (
            <div className='w-full text-center lg:text-left lg:w-1/3 p-4 flex flex-col justify-between ml-10'>
            <div className='text-2xl font-semibold text-green-800'>
              {data?.sellingPrice} Lei 
              <s className='text-gray-400 font-normal text-lg p-1'>{data?.price} Lei</s>
            </div>
            <StarRating productId={params.id} size={24} />
            
            <div className='my-4 flex justify-center'>
                <button className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-3xl shadow-lg transition duration-300 flex items-center gap-4 pl-8" onClick={(e) => handleAddToCart(e, data?._id)}>
                    Adaugă în coș  
                    <BsBasket2Fill />
                </button>
            </div>
            <div className=''>
              <h3 className='text-2xl mb-3 font-semibold'>Detaliile produsului</h3>
              <div className='flex flex-col gap-1'>
                <p className='capitalize'> <b>Categoria:</b> {data?.category}</p>
                <p className=''><b>Autor:</b> {data?.author}</p>
                <p className='capitalize'><b>Editura:</b> {data?.publisher}</p>
                <p className=''><b>An apariție:</b> {data?.publicationYear}</p>
                <p className='capitalize'><b>Ediție:</b> {data?.edition}</p>
                <p className=''><b>Nr. pagini:</b> {data?.pageNumber}</p>
                <p className=''><b>ISBN:</b> {data?.ISBN}</p>
              </div>
            </div>
          </div>
          )
        }

      </div>

      {  
        data.category && (
          <HorizontalCardProduct category={data?.category} heading={"Te-ar putea interesa și..." }/>
        )
      }

      {/* <Link to={"/review/" + data?._id}> Du-te la review-uri</Link> */}
      <Reviews productId={productId} product={data} user={currentUser} />


    </div>
  )
}

export default ProductDetails
