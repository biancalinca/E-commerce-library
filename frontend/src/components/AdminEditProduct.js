import React, { useState } from 'react'
import { IoClose, IoCloudUploadOutline } from "react-icons/io5";
import productCategory from '../helpers/productCategory';
import productPublisher from '../helpers/productPublisher';
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

function AdminEditProduct({
    onClose, productData, fetchdata
}) {
    const [data, setData] = useState({
        ...productData,
        title: productData?.title,
        author: productData?.author,
        description: productData?.description,
        price: productData?.price,
        sellingPrice: productData?.sellingPrice,
        pageNumber: productData?.pageNumber,
        inStock: productData?.inStock,
        stock: productData?.stock,
        bookImage: productData?.bookImage || [],
        publicationYear: productData?.publicationYear,
        category: productData?.category,
        publisher: productData?.publisher,
        edition: productData?.edition,
        ISBN: productData?.ISBN,
        librarianRecommendations: [],
        promotions: ""
        })
    
        const [fullScreenImage, setFullScreenImage] = useState("")
        const [openFullScreenImage, setOpenFullScreenImage] = useState(false)
    
    

        const handleOnChange = (e) => {
            setData({
                ...data,
                [e.target.name]: e.target.value
            });
        };
    
        const handleUploadProduct = async(e) => {
            const file = e.target.files[0]
    
            //cloudinary 
            const uploadImageCloudinary = await uploadImage(file)
    
            setData((prev)=>{
                return {
                    ...prev,
                    bookImage: [...prev.bookImage, uploadImageCloudinary.url] 
                }
            })  
        }
    
        const handleDeleteProductImage = async(index)=>{
            const newBookImage = [...data.bookImage]
            newBookImage.splice(index,1)
    
            setData((prev)=>{
            return{
                ...prev,
                bookImage : [...newBookImage]
                 }
            })
        }
    
        {/*upload book */}
        const handleSubmit = async(e) => {
            e.preventDefault()
            console.log(data)
    
            const response = await fetch(SummaryApi.updateProduct.url, {
                method : SummaryApi.updateProduct.method,
                credentials : 'include',
                headers : {
                    'content-type' : 'application/json'
                },
                body : JSON.stringify(data)
            })
    
            const responseData = await response.json()
            
            if(responseData.success){
                toast.success(responseData?.message)
                onClose()
                fetchdata()
            }
    
            if(responseData.error){
                toast.error(responseData?.message)
            }
        }
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-center items-center bg-slate-800 bg-opacity-60 overflow-hidden '>
        <div className='max-auto bg-white shadow-md p-4  w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
            <div className='flex justify-between items-center pb-3'>
                <h1 className='pb-4 text-lg font-bold '>Editeaza cartea</h1>
                <button className=' block ml-auto text-2xl hover:text-green-900' onClick={onClose}>
                    <IoClose />
                </button>
            </div>

            <form className='grid p-4 gap-3 h-full pb-5 overflow-y-auto' onSubmit={handleSubmit}>
                <label htmlFor='title'>Titlu:</label>
                <input 
                type='text' 
                id='title'
                name='title' 
                placeholder='Intru titlul cartii' value={data.title} 
                onChange={handleOnChange}
                className='bg-slate-100 p-2 w-full border rounded'
                required
                />

                <label htmlFor='author'>Autorul:</label>
                <input 
                type='text' 
                id='author'
                name='author' 
                placeholder='Intru autorul cartii' value={data.author} 
                onChange={handleOnChange}
                className='bg-slate-100 p-2 w-full border rounded'
                required
                />

                <label htmlFor='description'>Descriere:</label>
                <input 
                type='text'
                id='description' 
                name='description' 
                placeholder='Intru descrierea cartii' value={data.description} 
                onChange={handleOnChange}
                className='bg-slate-100 p-2 w-full h-20 border rounded'
                required
                />

                <label htmlFor='price'>Pret:</label>
                <input 
                type='number'
                id='price' 
                name='price' 
                placeholder='Intru pretul cartii' value={data.price} 
                onChange={handleOnChange}
                className='bg-slate-100 p-2 w-full border rounded'
                required
                />

                <label htmlFor='sellingPrice'>Pretul cu care se vinde:</label>
                <input 
                type='number'
                id='sellingPrice' 
                name='sellingPrice' 
                placeholder='Intru pretul cartii' value={data.sellingPrice} 
                onChange={handleOnChange}
                className='bg-slate-100 p-2 w-full border rounded'
                required
                />
                
                <label htmlFor='pageNumber'>Numarul de pagini:</label>
                <input 
                type='number'
                id='pageNumber' 
                name='pageNumber' 
                placeholder='Intru numarul de pagini' value={data.pageNumber} 
                onChange={handleOnChange}
                className='bg-slate-100 p-2 w-full border rounded'
                required
                />

                <label htmlFor='ISBN'>ISBN:</label>
                <input
                type='text'
                id='ISBN'
                name='ISBN'
                placeholder='Intru ISBN-ul cartii'
                value={data.ISBN}
                onChange={handleOnChange}
                className='bg-slate-100 p-2 w-full border rounded'
                required
                />

                
                <label htmlFor='category'>Categoria:</label>
                <select
                value={data.category} 
                onChange={handleOnChange}
                name='category'
                required
                className='bg-slate-100 p-2 w-full border rounded'>
                    <option value={""}>Selecteaza categoria</option>
                    {
                        productCategory.map(category => (
                            <option key={category.id} value={category.value}>{category.label}</option>
                        ))
                    }
                    
                </select>

                <label htmlFor='publisher'>Editura:</label>
                <select
                value={data.publisher} 
                onChange={handleOnChange}
                name='publisher'
                required
                className='bg-slate-100 p-2 w-full border rounded'>
                    <option value={""}>Selecteaza editura</option>
                    {
                        productPublisher.map(publisher => (
                            <option key={publisher.id} value={publisher.value}>{publisher.label}</option>
                        ))
                    }
                    
                </select>

                <label htmlFor='edition'>Editie:</label>
                    <select
                        id='edition'
                        name='edition'
                        value={data.edition}
                        onChange={handleOnChange}
                        className='bg-slate-100 p-2 w-full border rounded'
                        required
                    >
                        <option value="hardcover">Cartonata</option>
                        <option value="cover">Necartonata</option>
                    </select>

                <label htmlFor='publicationYear'>Anul publicarii:</label>
                <input
                    type='number'
                    id='publicationYear'
                    name='publicationYear'
                    placeholder='Intru anul publicarii'
                    value={data.publicationYear}
                    onChange={handleOnChange}
                    className='bg-slate-100 p-2 w-full border rounded'
                    required
                />

                <label htmlFor='inStock'>In stoc:</label>
                    <select
                        id='inStock'
                        name='inStock'
                        value={data.inStock}
                        onChange={handleOnChange}
                        className='bg-slate-100 p-2 w-full border rounded'
                        required
                    >
                        <option value={true}>Da</option>
                        <option value={false}>Nu</option>
                    </select>

                    <label htmlFor='stock'>Stoc:</label>
                    <input
                        type='number'
                        id='stock'
                        name='stock'
                        placeholder='Intru stocul disponibil'
                        value={data.stock}
                        onChange={handleOnChange}
                        className='bg-slate-100 p-2 w-full border rounded'
                        required
                    />
                
                <label htmlFor='bookImage'>Imaginea:</label>
                <label htmlFor='uploadImageInput'>
                <div className='bg-slate-100 p-2 w-full h-32 border rounded flex justify-center items-center cursor-pointer'>                           
                    <div className=' text-slate-500 '>
                        <span className='text-4xl flex justify-center items-center flex-col mb-2'> <IoCloudUploadOutline /></span>
                        <p className='text-sm'>Incarca o imagine pentru coperta cartii</p>
                        <input type='file' id='uploadImageInput'  className='hidden' onChange={handleUploadProduct} />
                    </div>                            
                </div>
                </label>
                <div>
                        {data?.bookImage[0] ? (
                            <div className='flex items-center gap-2'>
                                {data.bookImage.map((image, index) => (
                                    <div className='relative group' key={index}>
                                        <img
                                            src={image}
                                            alt={image}
                                            width={80}
                                            height={80}
                                            className='bg-slate-100 border rounded cursor-pointer'
                                            onClick={() => {
                                                setOpenFullScreenImage(true);
                                                setFullScreenImage(image);
                                            }}
                                        />
                                        <div
                                            className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer z-50'
                                            onClick={() => handleDeleteProductImage(index)}
                                        >
                                            <MdDelete />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-red-700 text-xs'>*Te rog adauga imagini pentru coperta cartii</p>
                        )}
                    </div>

                <button className='border-2 border-green-600 hover:bg-green-600 hover:text-white font-bold py-2 px-4 rounded-3xl shadow-lg transition duration-300 mt-4 mb-9'>
                    Salveaza modificarile
                </button>

            </form>


        </div>

        {/* display image full screen */}
        {
            openFullScreenImage && (
                <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage}/>
            )
        } 
    </div>
  )
}

export default AdminEditProduct
