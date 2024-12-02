import React, { useEffect, useState } from 'react'
import { IoClose, IoCloudUploadOutline } from "react-icons/io5";
import productCategory from '../helpers/productCategory';
import productPublisher from '../helpers/productPublisher';
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import productEdition from './../helpers/productEdition';

function UploadProduct({
    onClose,
    fetchData // il folosesc pentru a afisa cartile atunci cand adaug carti noi 
}) {

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
    promotions: []
    })

    const [fullScreenImage, setFullScreenImage] = useState("")
    const [openFullScreenImage, setOpenFullScreenImage] = useState(false)

    const [librarianRecommendationsOptions, setLibrarianRecommendationsOptions] = useState([]);
    const [newLibrarianRecommendation, setNewLibrarianRecommendation] = useState("");

    const [promotionTags, setPromotionTags] = useState([]);
    const [newPromotionTag, setNewPromotionTag] = useState("");


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

        const response = await fetch(SummaryApi.uploadProduct.url, {
            method : SummaryApi.uploadProduct.method,
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
            fetchData()
        }

        if(responseData.error){
            toast.error(responseData?.message)
        }
    }

    const handleRecommendationsChange = (e) => {
        const value = e.target.value;
        setData(prev => {
            const recommendations = prev.librarianRecommendations.includes(value)
                ? prev.librarianRecommendations.filter(item => item !== value)
                : [...prev.librarianRecommendations, value];
            return { ...prev, librarianRecommendations: recommendations };
        });
    };

    const handleTagsChange = (field, value, checked) => {
        setData(prevData => {
            const updatedField = checked
                ? [...prevData[field], value]  // Adăugăm tagul dacă este bifat
                : prevData[field].filter(tag => tag !== value);  // Îl eliminăm dacă este debifat
    
            return {
                ...prevData,
                [field]: updatedField
            };
        });
    };
    


    const addNewLibrarianRecommendation = async () => {
        if (newLibrarianRecommendation && !librarianRecommendationsOptions.includes(newLibrarianRecommendation)) {
            try {
                const response = await fetch(SummaryApi.addTag.url, {
                    method: SummaryApi.addTag.method,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: newLibrarianRecommendation })
                });
                const result = await response.json();
                if (result.success) {
                    setLibrarianRecommendationsOptions(prev => [...prev, newLibrarianRecommendation]);
                    setData(prev => ({
                        ...prev,
                        librarianRecommendations: [...prev.librarianRecommendations, newLibrarianRecommendation]
                    }));
                    toast.success("Eticheta a fost adăugată cu succes.");
                } else {
                    toast.error(result.message);
                }
            } catch (err) {
                toast.error("A apărut o eroare la adăugarea etichetei.");
            }
            setNewLibrarianRecommendation("");
        }
    };

    const handleAddNewPromotionTag = async () => {
        if (newPromotionTag && !promotionTags.includes(newPromotionTag)) {
            try {
                const response = await fetch(SummaryApi.addPromotionTag.url, {
                    method: SummaryApi.addPromotionTag.method,
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newPromotionTag })
                });
                const result = await response.json();
                if (result.success) {
                    setPromotionTags([...promotionTags, newPromotionTag]);
                    setData(prev => ({
                        ...prev,
                        promotions: [...prev.promotions, newPromotionTag]
                    }));
                    toast.success("Eticheta de promoție a fost adăugată cu succes.");
                } else {
                    toast.error(result.message);
                }
            } catch (err) {
                toast.error("A apărut o eroare la adăugarea etichetei de promoție.");
            }
            setNewPromotionTag("");
        }
    };



    useEffect(() => {

        const fetchPromotionTags = async () => {
            const response = await fetch(SummaryApi.getAllPromotionTags.url);
            const result = await response.json();
            if (result.success) {
                setPromotionTags(result.data.map(tag => tag.name));
            }
        };

        fetchPromotionTags();
        // Încarcă etichetele existente din baza de date la inițializare
        const fetchTags = async () => {
            try {
                const response = await fetch(SummaryApi.getAllTags.url, {
                    credentials: 'include',
                    method: 'GET'
                });
                const result = await response.json();
                if (result.success) {
                    setLibrarianRecommendationsOptions(result.data.map(tag => tag.name));
                } else {
                    toast.error("Nu s-au putut încărca etichetele.");
                }
            } catch (err) {
                toast.error("A apărut o eroare la încărcarea etichetelor.");
            }
        };

        fetchTags();
    }, []);

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-center items-center bg-slate-800 bg-opacity-60 overflow-hidden '>
        <div className='max-auto bg-white shadow-md p-4  w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
            <div className='flex justify-between items-center pb-3'>
                <h1 className='pb-4 text-lg font-bold '>Adauga o carte noua</h1>
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
                        <option value={""}>Selecteaza editia</option>
                        {
                            productEdition.map(edition => (
                                <option key={edition.id} value={edition.value}>{edition.label}</option>
                            ))
                        }
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

                <label htmlFor='librarianRecommendations'>Recomandările Librarului:</label>
                <div className='flex flex-wrap gap-2'>
                    {librarianRecommendationsOptions.map((option, index) => (
                        <label key={index} className='flex items-center'>
                            <input
                                type='checkbox'
                                value={option}
                                checked={data.librarianRecommendations.includes(option)}
                                onChange={(e) => handleTagsChange('librarianRecommendations', e.target.value, e.target.checked)}
                            />
                            <span className='ml-2'>{option}</span>
                        </label>
                    ))}
                </div>
                <div className='flex mt-2'>
                    <input
                        type='text'
                        placeholder='Adaugă o nouă recomandare'
                        value={newLibrarianRecommendation}
                        onChange={(e) => setNewLibrarianRecommendation(e.target.value)}
                        className='bg-slate-100 p-2 w-full border rounded'
                    />
                    <button type='button' onClick={addNewLibrarianRecommendation} className='ml-2 px-4 py-2 bg-green-600 text-white rounded'>
                        Adaugă
                    </button>
                </div>

                <label htmlFor='promotions'>Promoții:</label>
                <div className='flex flex-wrap gap-2'>
                    {promotionTags.map((option, index) => (
                        <label key={index} className='flex items-center'>
                            <input
                                type='checkbox'
                                value={option}
                                checked={data.promotions.includes(option)}
                                onChange={(e) => handleTagsChange('promotions', e.target.value, e.target.checked)}
                            />
                            <span className='ml-2'>{option}</span>
                        </label>
                    ))}
                </div>
                <div className='flex mt-2'>
                    <input
                        type='text'
                        placeholder='Adaugă o nouă etichetă de promoție'
                        value={newPromotionTag}
                        onChange={(e) => setNewPromotionTag(e.target.value)}
                        className='bg-slate-100 p-2 w-full border rounded'
                    />
                    <button type='button' onClick={handleAddNewPromotionTag} className='ml-2 px-4 py-2 bg-green-600 text-white rounded'>
                        Adaugă
                    </button>
                </div>


                
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
                    Adauga cartea
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

export default UploadProduct
