import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/index'

const CategoryList = () => {

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)

    const categoryLoading = new Array(13).fill(null)

    const fetchCAtegoryProduct = async () => {
        setLoading(true)
        const response = await fetch(SummaryApi.getCategoryProduct.url)
        const dataResponse = await response.json()
        setLoading(false)
        setCategories(dataResponse.data)
    }
    useEffect(() => {
        fetchCAtegoryProduct()
    }, [])
    
    return (
        <div className='container mx-auto p-4 '>
           <div className='flex items-center gap-4 justify-between overflow-scroll scorllbar-none'>
           {
            loading ? (
                categoryLoading.map((el, index) => {
                    return(
                    <div className='w-36 h-36 md:w-40 md:h-40 overflow-hidden bg-white-200 animate-pulse' key={"categoryLoading" + index}>
                    </div>    
                    )
                })
            ) : 
            (
                categories.map((product, index) => {
                    return (
                        <Link to={"/book-category?category="+ product?.category} className='cursor-pointer' key={"product.category" + index}>
                            {/* <div className='w-36 h-36 md:w-40 md:h-40 overflow-hidden p-2 bg-white-200 flex items-center justify-center'>
                                {/* <img 
                                src={product?.bookImage[0]} 
                                alt={product?.category}
                                className='h-full object-scale-down mix-blend-multiply hover:scale-110 transition-all'
                                loading="lazy"
                                // Use srcset for responsive images
                                srcSet={`${product?.bookImage[0]}?w=400 400w, ${product?.bookImage[0]}?w=800 800w`}
                                sizes="(max-width: 600px) 400px, 800px"
                                /> 
                            </div> */}
                            <div class="text-center p-2">
                                <p class="inline-block p-3 rounded-full bg-green-100 text-sm md:text-base capitalize transition-transform duration-300 ease-in-out hover:scale-125">
                                    { product?.category }
                                </p>
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

export default CategoryList