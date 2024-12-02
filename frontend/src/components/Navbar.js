import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import SummaryApi from '../common/index'; // Asigură-te că calea este corectă

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate(); // Înlocuiește useHistory cu useNavigate

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const fetchCategories = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.getCategoryProduct.url);
    const dataResponse = await response.json();
    setLoading(false);
    setCategories(dataResponse.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleCategoryClick = (category) => {
    navigate(`/book-category?category=${category}`); // Înlocuiește history.push cu navigate
    setDropdownOpen(false); // Închide dropdown-ul după selectarea categoriei
  };

  useEffect(() => {
    // Când se schimbă locația, poți adăuga logică suplimentară dacă este necesar
  }, [location]);

  return (
    <nav className="bg-pink-400 p-2 shadow-lg text-white opacity-95">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-8">
          <button
            onClick={toggleDropdown}
            className="bg-pink-500 py-2 px-4 rounded-md hover:bg-pink-600 transition-all"
          >
            Categorii de cărți
          </button>

          <div className="hidden md:flex space-x-8 py-2">
            {/* <Link to="/top-dragoste" className="hover:text-gray-300 font-semibold transition-all">
              Top cărți de dragoste
            </Link> */}
            <Link to="/top-selling-books" className="hover:text-gray-300 font-semibold transition-all">
              Top cele mai citite 10 cărți
            </Link>
            {/* <Link to="/noutati" className="hover:text-gray-300 font-semibold transition-all">
              Noutăți
            </Link> */}
            <Link to="/contact" className="hover:text-gray-300 font-semibold transition-all">
              Contact
            </Link>
          </div>
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={toggleDropdown} className="text-2xl">
            <FaBars />
          </button>
        </div>
      </div>

      {dropdownOpen && (
        <div ref={dropdownRef} className="absolute bg-white text-black mt-2 w-72 shadow-lg rounded-md z-10">
          {loading ? (
            <p className="p-4 text-center">Se încarcă...</p>
          ) : (
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.category)}
                className="block px-4 py-2 w-full text-left hover:bg-gray-100 transition-all capitalize"
              >
                {category.category}
              </button>
            ))
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
