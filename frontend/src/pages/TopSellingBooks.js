import React, { useEffect, useState, useContext } from 'react';
import SummaryApi from './../common/index';
import { Link } from 'react-router-dom';
import { BsBasket2Fill } from "react-icons/bs";
import { GrFavorite } from 'react-icons/gr';
import { FaCrown, FaMedal } from 'react-icons/fa';  // Importăm iconițele pentru locurile 1, 2, 3
import addToCart from './../helpers/addToCart';
import addToWishlist from '../helpers/addToWishlist';
import StarRating from '../components/StarRating';
import Context from '../context';
import scrollTop from '../helpers/scrollTop';
import moment from 'moment';

const TopSellingBooks = () => {
  const [books, setBooks] = useState([]);
  const { fetchUserAddToCart, fetchUserWishlist } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopSellingBooks();
  }, []);

  const fetchTopSellingBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.topSellingBooks.url, {
        method: SummaryApi.topSellingBooks.method,
        credentials: 'include',
      });
      const dataResponse = await response.json();
      console.log("Răspuns API pentru Top 10 Cărți Vândute:", dataResponse);

      if (dataResponse.success && Array.isArray(dataResponse.data)) {
        setBooks(dataResponse.data);
      } else {
        console.error('Eroare la extragerea datelor:', dataResponse.message);
        setBooks([]);
      }
    } catch (err) {
      console.error('Eroare la apelul API:', err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const handleAddToWishlist = async (e, id) => {
    await addToWishlist(e, id);
    fetchUserWishlist();
  };

  return (
    <div className="container mx-auto px-4 my-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-700">Top 10 Cărți Vândute</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
        {loading ? (
          <div className="w-full min-w-[280px] md:min-w-[180px] max-w-[280px] md:max-w-[180px] bg-white rounded-sm shadow-md animate-pulse">
            <div className="bg-slate-200 p-2 h-64 flex justify-center items-center"></div>
            <div className="text-center">
              <h3 className="text-lg font-semibold bg-slate-200 animate-pulse"></h3>
              <p className="text-sm text-gray-600 bg-slate-200 animate-pulse"></p>
            </div>
          </div>
        ) : books && books.length > 0 ? (
          books.map((book, index) => {
            const isNew = moment().diff(moment(book?.createdAt), 'hours') < 24;
            const hasDiscount = book?.price && book?.sellingPrice && book?.price > book?.sellingPrice;
            const discountPercentage = hasDiscount
              ? Math.round(((book?.price - book?.sellingPrice) / book?.price) * 100)
              : 0;

            // Alegem iconița și stilizarea pentru primele trei locuri
            let badge = null;
            if (index === 0) {
              badge = <FaCrown className="text-yellow-500 text-4xl absolute -top-4 left-4" />;
            } else if (index === 1) {
              badge = <FaMedal className="text-gray-400 text-3xl absolute -top-4 left-4" />;
            } else if (index === 2) {
              badge = <FaMedal className="text-orange-400 text-3xl absolute -top-4 left-4" />;
            }

            return (
              <Link key={index} to={"/book/" + book?._id} className="w-full bg-white rounded-md shadow-md p-4 flex flex-col transition-transform duration-200 hover:scale-105 relative" onClick={scrollTop}>
                {/* Afișarea iconiței pentru top 3 cărți */}
                {badge && (
                  <div className="z-0">
                    {badge}
                  </div>
                )}

                <div className='relative bg-white p-2 flex justify-center items-center'>
                  {isNew && (
                    <div className="absolute top-4 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      NOU
                    </div>
                  )}
                  {hasDiscount && (
                    <div className="absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                      -{discountPercentage}%
                    </div>
                  )}
                  <img 
                    src={book.bookImage?.[0] || "fallback_image_url_here"}  
                    alt={book?.name || "Imagine indisponibilă"}  
                    className='object-contain h-64 w-full rounded-md'
                    loading="lazy"
                  />
                </div>
                
                <div className='text-center mt-4'>
                  <h3 className='text-lg font-semibold text-gray-800'>{book?.name || "Titlu indisponibil"}</h3>
                  <p className='text-sm text-gray-600'>{book?.author || "Autor necunoscut"}</p>
                  <p className='text-sm text-gray-500'>Categorie: {book?.category || "Categorie necunoscută"}</p>
                </div>
                <div className='text-center my-5'>
                  <div className='text-xl font-semibold text-green-700'>
                    {book?.sellingPrice ? `${book.sellingPrice} Lei` : "Preț indisponibil"} 
                    {book?.price && <s className='text-gray-400 font-normal text-lg p-1'>{book.price} Lei</s>}
                  </div>
                  <div className='text-md my-2 flex justify-center gap-4'>
                    <StarRating productId={book?._id} size={20} />
                    <div className='text-3xl'>
                      <button className="text-pink-500 w-11 h-11 flex justify-center items-center" aria-label="Add to favorites" onClick={(e) => handleAddToWishlist(e, book?._id)}>
                        <GrFavorite /> 
                      </button>
                    </div>
                  </div> 
                  <div className='my-4 flex justify-center'>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-3xl shadow-lg transition duration-300 flex items-center gap-4 pl-8" onClick={(e) => handleAddToCart(e, book?._id)}>
                      Adaugă în coș  
                      <BsBasket2Fill />
                    </button>
                  </div>
                </div>   
              </Link>
            );
          })
        ) : (
          <p className="text-lg text-center text-gray-500">Nu există cărți disponibile de afișat.</p>
        )}
      </div>
    </div>
  );
};

export default TopSellingBooks;
