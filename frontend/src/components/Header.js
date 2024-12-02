import React, { useState, useEffect, useRef, useContext }from 'react'
import Logo from './Logo'
import { GrFavorite, GrSearch } from "react-icons/gr";
import { FaRegUser, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserDetail } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';
import Navbar from './Navbar';


function Header() {

  const user = useSelector((state) => state?.user?.user)

  //ca sa sterg datele atunci cand ma deloghez:
  const dispatch = useDispatch()

  //----admin panel-----
  const [menuDisplay, setMenuDisplay] = useState(false)
  const menuRef = useRef(null);

  //pt basket addd to cart
  const context = useContext(Context)

  //pentru bara de cautare
  const navigate = useNavigate()
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const dropdownRef = useRef(null); // Ref pentru dropdown
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1); // Indexul sugestiei active
  const location = useLocation(); // Pentru a urmări schimbările de locație


  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuDisplay(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  //logout
  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout.url, {
      method : SummaryApi.logout.method,
      credentials : 'include',
    })
  
  const data = await fetchData.json()

  if(data.success){
    toast.success(data.message)
    dispatch(setUserDetail(null))
    navigate("/")
  }

  if(data.error){
    toast.error(data.error)
  }
}


const fetchSuggestions = async (value) => {
  if (value.length < 2) {
    setSuggestions([]);
    return;
  }

  const response = await fetch(`${SummaryApi.searchProduct.url}?q=${value}`);
  const dataResponse = await response.json();
  setSuggestions(dataResponse.data);
  setActiveSuggestionIndex(-1); // Resetează sugestia activă
};

const handleInputChange = (e) => {
  const value = e.target.value;
  setQuery(value);

  // Debounce the API call
  if (value) {
    fetchSuggestions(value);
  } else {
    setSuggestions([]);
  }
};

const handleSuggestionClick = (suggestion) => {
  navigate(`/book/${suggestion._id}`);
  setQuery('');
  setSuggestions([]);
};

const handleSearch = (e) => {
  if (e.key === 'Enter') {
    if (activeSuggestionIndex >= 0 && suggestions.length > 0) {
      handleSuggestionClick(suggestions[activeSuggestionIndex]);
    } else {
      navigate(`/search?q=${query}`);
      setSuggestions([]);
    }
  } else if (e.key === 'ArrowDown') {
    // Navighează în jos în lista de sugestii
    setActiveSuggestionIndex((prevIndex) =>
      prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
    );
  } else if (e.key === 'ArrowUp') {
    // Navighează în sus în lista de sugestii
    setActiveSuggestionIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
    );
  } else if (e.type === 'click') {
    navigate(`/search?q=${query}`);
    setSuggestions([]);
  }
};

// Close dropdown when clicking outside of it
useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [dropdownRef]);

// Resetează bara de căutare atunci când se schimbă locația
useEffect(() => {
  setQuery(''); // Resetare query la schimbarea locației
  setSuggestions([]); // Resetare sugestii
}, [location.pathname]);

  return (
<header className='h-25 shadow-md bg-white fixed w-full z-10'>
  <div className='h-full container mx-auto flex items-center justify-between  '>

    <div className=''>
      <Link to={'/'}>
        <Logo/>
      </Link>
    </div>
    
    <div className='flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow'>

      <input 
      type='text' 
      placeholder='Search' 
      className='w-full h-9 outline-none pl-4 bg-gray-200 rounded-l-full px-4'
      value={query}
      onChange={handleInputChange}
      onKeyDown={handleSearch}  // Trigger search on Enter key
      />

      <div 
      className='text-lg min-w-[50px] h-9 bg-gray-200 flex items-center justify-center rounded-r-full text-black'
      onClick={handleSearch} // Trigger search on click 
      >
      <GrSearch />
      </div>

      {/* Dropdown for suggestions */}
      {suggestions.length > 0 && (
            <ul ref={dropdownRef} className='absolute top-28 text-center left-72 right-80 bg-white border border-gray-300 rounded-md shadow-lg mt-1 mx-48 z-20'>
              {suggestions.map((suggestion, index) => (
                <li
                key={index}
                className={`p-3 cursor-pointer hover:bg-gray-100 transition-all duration-200 ${index === activeSuggestionIndex ? 'bg-gray-200' : ''}`}
                onClick={() => handleSuggestionClick(suggestion)}
                >
                  {index < 3 ? (
                    // For top search suggestions (categories, authors)
                    <div className='text-sm text-gray-700 '>
                      {suggestion.title} in <span className='font-semibold text-gray-800 capitalize'>{suggestion.category}</span>
                    </div>
                  ) : (
                    // For product suggestions
                    <div className='flex items-center'>
                      <div className='w-12 h-12 bg-gray-100  flex-shrink-0 overflow-hidden'>
                        <img src={suggestion.bookImage[0] || "default-image-url.jpg"} alt={suggestion.title} className='w-full h-full object-cover' />
                      </div>
                      <div className='ml-3 text-left'>
                        <p className='text-sm font-semibold text-gray-800'>{suggestion.title}</p>
                        <p className='text-xs text-gray-500'>by {suggestion.author}</p>
                      </div>
                      <div className='ml-auto text-right'>
                        <p className='text-sm font-semibold text-green-700'>{suggestion.sellingPrice} Lei</p>
                        <p className='text-xs text-gray-500 line-through'>{suggestion.price} Lei</p>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

    </div>

    <div className='flex items-center gap-7'>

      {
        user?._id && (
          <div className='relative flex justify-center' onClick={() => setMenuDisplay(prev => !prev)} ref={menuRef}>
          <div className='text-3xl cursor-pointer'>
            
          
            {
              user?.profilePic ? (
                <img src={user?.profilePic} alt={user?.name} className='w-10 h-10 rounded-full'/>
              ) :(
                <FaRegUser />
              )
            }
          </div>
          {
            menuDisplay && (
              <div className='absolute bg-green-500  bottom-0 top-11 h-fit p-2 text-white font-bold shadow-lg rounded z-50'>
                <nav className='flex flex-col gap-2 '>
                  {
                    user?.role === ROLE.ADMIN && (
                      <Link to={"admin-panel/all-products"} className='whitespace-nowrap hover:bg-green-600 bottom-0 top-11 h-fit p-2 '>Admin panel</Link>
                    )
                    }
                  <Link to={"user-details"} className='whitespace-nowrap hover:bg-green-600 bottom-0 top-11 h-fit p-2 '>Contul meu</Link>
                  <Link to={"whish-list"} className='whitespace-nowrap hover:bg-green-600 bottom-0 top-11 h-fit p-2  '>Whish List</Link>
                  <Link to="/order" className='whitespace-nowrap hover:bg-green-600 bottom-0 top-11 h-fit p-2 '>Comenzile mele</Link>
                </nav>
              </div>
            )
          }
  
        </div>
        )
      }

      <Link to={"/whish-list"} className='text-3xl cursor-pointer relative'>
      <span><GrFavorite/></span>
        {
          user?._id && (                     
            <div className='bg-pink-500 text-white w-5 h-5 p-1 rounded-full flex items-center justify-center absolute -top-2 -right-4 '>
              
              <p className='text-xs'>{context?.wishlistProductCount}</p>
            </div>
          )
        }
      </Link>
      <Link to={"/cart"} className='text-3xl cursor-pointer relative'>
      <span> <FaShoppingCart />  </span>

        {
           user?._id && (
            <div className='bg-green-500 text-white w-5 h-5 p-1 rounded-full flex items-center justify-center absolute -top-2 -right-4 '>
              <p className='text-xs'>{context?.cartProductCount}</p>
            </div>
           )
        }
      </Link>

      <div>
        {
          user?._id ? (
            <button onClick={handleLogout} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-3xl shadow-lg transition duration-300">Logout</button>
          )
          :
          (
            <Link to={"/login"} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-3xl shadow-lg transition duration-300">Login</Link>

          )
        }
      </div>

    </div>
  </div>
  <Navbar /> {/* Integrăm componenta Navbar */}
</header>
  )
}

export default Header
