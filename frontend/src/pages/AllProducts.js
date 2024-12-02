import React, { useEffect, useState } from 'react'
import UploadProduct from '../components/UploadProduct'
import SummaryApi from '../common'
import AdminProductCard from '../components/AdminProductCard'

function AllProducts() {

  //stare pentru a controla vizibilitatea ferestrei modale de incarcare a unei carti
  const [openUploadProducts, setOpenUploadProducts] = useState(false)

  //pt afisarea cartilor ------
  const [allProducts, setAllProducts] = useState([])

  const fetchAllProduct = async() => {
    const response = await fetch(SummaryApi.getBooks.url)
    const responseData = await response.json()

    setAllProducts(responseData?.data || [])
  }

  useEffect(() => {
    fetchAllProduct()
  }, [])

  return (
    <div className='h-[calc(100vh-190px)] overflow-y-scroll'>
      <div className='  px-4 flex justify-between items-center '>
        <h1 className='text-3xl font-bold '>Toate cartile</h1>
        <button className='border-2 border-green-600 hover:bg-green-600 hover:text-white font-bold py-2 px-4 rounded-3xl shadow-lg transition duration-300 mt-4' onClick={() => setOpenUploadProducts(true)}>Adauga o carte noua</button>
      </div>

    {/*Toate cartile afisate*/}
      <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scoll'>
        {
          allProducts.map((product, index)=>{
            return (
              <AdminProductCard data={product} key={index+"allProducts"} fetchdata = {fetchAllProduct}/>
            )
          })
        }
      </div>


      {/* upload product component */}
      {
        openUploadProducts && (
          <UploadProduct onClose={() => setOpenUploadProducts(false)} fetchData={fetchAllProduct} /> //acest fetchData este din UploadProduct.js
        )
      }
    </div>
  )
}

export default AllProducts
