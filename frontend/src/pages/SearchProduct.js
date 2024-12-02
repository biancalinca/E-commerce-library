import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SummaryApi from '../common'
import SearchProducts from '../components/SearchProducts'

const SearchProduct = () => {
    const query = useLocation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    // Extrage termenul de căutare din query string
    const searchTerm = new URLSearchParams(query.search).get('q');

    const fetchProduct = async()=>{
        setLoading(true)
        const response = await fetch(SummaryApi.searchProduct.url+query.search)
        const dataResponse = await response.json()
        setLoading(false)

        setData(dataResponse.data)
    }

    useEffect(() => {
        fetchProduct()
    }, [query])

  return (
    <div className='container mx-auto p-4 text-green-950'>
        {
            loading && (
                <p className='text-center text-lg '>Se Încarcă...</p>
            )
        }

        <p className='text-2xl font-semibold mb-6'>Rezultatele căutării pentru <b>{searchTerm}</b>: {data.length} </p>
        {
            data.length === 0 && !loading && (
                <p className='text-4xl font-semibold mb-4 text-center'>Nu s-au gasit rezultate pentru : <b>{searchTerm}</b></p>
            )
        }

        {
            data.length !== 0 && !loading && (

                <SearchProducts loading={loading} data={data}/>
            )
            
        }
      
    </div>
  )
}

export default SearchProduct
