import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BsBasket2Fill } from "react-icons/bs";
import SummaryApi from './../common/index';
import Context from '../context';
import scrollTop from '../helpers/scrollTop';
import addToCart from './../helpers/addToCart';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const ViewedBooksHistory = () => {
  const [viewedBooks, setViewedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchUserAddToCart } = useContext(Context);
  const scrollElement = useRef(null);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('viewedBooks')) || [];

    const fetchBooksDetails = async () => {
      setLoading(true);
      const bookDetails = await Promise.all(
        history.map(async (id) => {
          const response = await fetch(SummaryApi.productDetails.url, {
            method: SummaryApi.productDetails.method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: id }),
          });
          const dataResponse = await response.json();
          return dataResponse?.data;
        })
      );
      setViewedBooks(bookDetails);
      setLoading(false);
    };

    fetchBooksDetails();
  }, []);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const scrollRight = () => {
    scrollElement.current.scrollLeft += 200;
  };

  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 200;
  };

  return (
    <div className='container mx-auto px-4 my-4 relative'>
      <h2 className="text-2xl font-bold mb-4">Ultimele cărți vizualizate</h2>

      <div className='flex items-center gap-4 md:gap-6 overflow-scroll scorllbar-none transition-all' ref={scrollElement}>
        {/* Scroll Left Button */}
        <button
          className='bg-white shadow-md rounded-full p-2 opacity-50 hover:opacity-70 absolute left-0 text-lg hidden md:block z-10'
          onClick={scrollLeft}
        >
          <FaArrowLeft />
        </button>

        {/* Scroll Right Button */}
        <button
          className='bg-white shadow-md rounded-full p-2 opacity-50 hover:opacity-70 absolute right-0 text-lg hidden md:block z-10'
          onClick={scrollRight}
        >
          <FaArrowRight />
        </button>

        {loading
          ? new Array(6).fill(null).map((_, index) => (
              <div
                key={index}
                className='w-full min-w-[280px] md:min-w-[180px] max-w-[280px] md:max-w-[180px] bg-white rounded-sm shadow-md'
              >
                <div className='bg-slate-200 p-2 min-w-[180px] md:min-w-[145px] h-64 flex justify-center items-center animate-pulse'></div>
                <div className='text-center'>
                  <h3 className='text-lg font-semibold bg-slate-200 animate-pulse'></h3>
                  <p className='text-sm text-gray-600'></p>
                </div>
                <div className='text-center my-5'>
                  <div className='text-xl font-semibold text-green-700 bg-slate-200 p-1 animate-pulse'>
                    <s className='text-gray-400 font-normal text-lg p-1'></s>
                  </div>
                  <div className='text-sm my-2 w-full bg-slate-200 animate-pulse'></div>
                  <div className='my-4 flex justify-center'>
                    <button className='bg-slate-200 animate-pulse rounded-full w-full'></button>
                  </div>
                </div>
              </div>
            ))
          : viewedBooks.map((book, index) => {
              const hasDiscount = book?.price > book?.sellingPrice;
              const discountPercentage = hasDiscount
                ? Math.round(((book?.price - book?.sellingPrice) / book?.price) * 100)
                : 0;

              return (
                <Link
                  key={index}
                  to={`/book/${book?._id}`}
                  className='w-full min-w-[280px] md:min-w-[180px] max-w-[280px] md:max-w-[180px] bg-white rounded-sm shadow-md'
                  onClick={scrollTop}
                >
                  <div className='relative bg-white p-2 min-w-[180px] md:min-w-[145px] h-64 flex justify-center items-center'>
                    {hasDiscount && (
                      <div className='absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold'>
                        -{discountPercentage}%
                      </div>
                    )}
                    <img src={book?.bookImage[0]} className='object-contain h-full' alt={book?.title} />
                  </div>
                  <div className='text-center'>
                    <h3 className='text-lg font-semibold'>{book?.title}</h3>
                    <p className='text-sm text-gray-600'>{book?.author}</p>
                  </div>
                  <div className='text-center my-5'>
                    <div className='text-xl font-semibold text-green-700'>
                      {book?.sellingPrice} Lei
                      <s className='text-gray-400 font-normal text-lg p-1'>{book?.price} Lei</s>
                    </div>
                    <div className='text-sm my-2'>Review stelute</div>
                    <div className='my-4 flex justify-center'>
                      <button
                        className='bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-3xl shadow-lg transition duration-300 flex items-center gap-4 pl-8'
                        onClick={(e) => handleAddToCart(e, book?._id)}
                      >
                        Adaugă în coș
                        <BsBasket2Fill />
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
};

export default ViewedBooksHistory;
