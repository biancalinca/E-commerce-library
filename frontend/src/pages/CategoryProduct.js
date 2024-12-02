import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import productCategory from '../helpers/productCategory';
import productPublisher from '../helpers/productPublisher';
import productEdition from '../helpers/productEdition';
import VerticalCard from '../components/VerticalCard';
import SummaryApi from '../common';
import { MdOutlineSort } from "react-icons/md";
import PriceRangeSlider from '../components/PriceRangeSlider';

const CategoryProduct = () => {
    const params = useParams();
    const [data, setData] = useState([]);
    const [tags, setTags] = useState([]); // Adăugat pentru a stoca tagurile încărcate din baza de date
    const [promotionTags, setPromotions] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const urlSearch = new URLSearchParams(location.search);
    const urlCategoryListinArray = urlSearch.getAll("category");

    const urlCategoryListObject = {};
    urlCategoryListinArray.forEach(el => {
        urlCategoryListObject[el] = true;
    });

    const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
    const [filterCategoryList, setFilterCategoryList] = useState([]);
    const [selectPublisher, setSelectPublisher] = useState({});
    const [filterproductPublisher, setFilterProductPublisher] = useState([]);
    const [selectEdition, setSelectEdition] = useState({});
    const [filterProductEdition, setFilterProductEdition] = useState([]);
    const [selectTags, setSelectTags] = useState({});  // Adăugat pentru a gestiona tagurile selectate
    const [filterTags, setFilterTags] = useState([]);  // Adăugat pentru a filtra tagurile
    const [selectPromotions, setSelectPromotions] = useState({});
    const [filterPromotions, setFilterPromotions] = useState([]);


    const [priceRange, setPriceRange] = useState([0, 1000]);

    const [sortBy, setSortBy] = useState('price'); // Default sorting by price
    const [sortOrder, setSortOrder] = useState("asc"); // Ascending by default
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    // const toggleDateDropdown = () => setIsDateDropdownOpen(!isDateDropdownOpen);

    const handlePriceRangeChange = (range) => {
      setPriceRange(range);
  };

    const handleSortChange = (sortBy, order) => {
        setSortBy(sortBy);
        setSortOrder(order);
        setIsDropdownOpen(false);
    };

    const fetchTags = async () => {
        try {
            const response = await fetch(SummaryApi.getAllTags.url, {
                method: SummaryApi.getAllTags.method
            });
            const result = await response.json();
            if (result.success) {
                setTags(result.data.map(tag => tag.name));  // Stocăm doar numele tagurilor
            } else {
                console.error("Failed to fetch tags");
            }
        } catch (err) {
            console.error("Error fetching tags:", err);
        }
    };
    const fetchPromotionTags = async () => {
        try {
            const response = await fetch(SummaryApi.getAllPromotionTags.url, {
                method: SummaryApi.getAllPromotionTags.method
            });
            const result = await response.json();
            if (result.success) {
                setPromotions(result.data.map(promotionTags => promotionTags.name));  // Stocăm doar numele tagurilor
            } else {
                console.error("Failed to fetch tags");
            }
        } catch (err) {
            console.error("Error fetching tags:", err);
        }
    };

    const fetchData = async () => {
        const response = await fetch(SummaryApi.filterProduct.url, {
            method: SummaryApi.filterProduct.method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category: filterCategoryList,
                publisher: filterproductPublisher, // Include publisher in the request
                edition: filterProductEdition,
                tags: filterTags,
                promotions: filterPromotions,
                minPrice: priceRange[0],
                maxPrice: priceRange[1]
            })
        });

        const dataResponse = await response.json();
        let sortedData = dataResponse?.data || [];

        // Apply unified sorting
        sortedData = sortProducts(sortedData, sortBy, sortOrder);

        // Set the final sorted data
        setData(sortedData);
    };

    const handleSelectCategory = (e) => {
        const { name, value, checked } = e.target;

        setSelectCategory((prev) => ({
            ...prev,
            [value]: checked
        }));
    };

    const handleSelectPublisher = (e) => {
      const { name, value, checked } = e.target;
  
      setSelectPublisher((prev) => ({
          ...prev,
          [value]: checked
      }));
  };

  const handleSelectEdition = (e) => {
        const { value, checked } = e.target;

        setSelectEdition((prev) => ({
            ...prev,
            [value]: checked
        }));
    };

    const handleSelectTag = (e) => {  // Funcție adăugată pentru a gestiona selectarea tagurilor
        const { value, checked } = e.target;

        setSelectTags((prev) => ({
            ...prev,
            [value]: checked
        }));
    };

    const handleSelectPromotion = (e) => {
        const { value, checked } = e.target;

        setSelectPromotions((prev) => ({
            ...prev,
            [value]: checked
        }));
    };

  

    const sortProducts = (products, sortBy, sortOrder) => {
        return products.sort((a, b) => {
            if (sortBy === 'price') {
                if (sortOrder === 'asc') {
                    return a.sellingPrice - b.sellingPrice; 
                } else {
                    return b.sellingPrice - a.sellingPrice; 
                }
            } else if (sortBy === 'date') {
                if (sortOrder === 'newest') {
                    return new Date(b.createdAt) - new Date(a.createdAt); 
                } else {
                    return new Date(a.createdAt) - new Date(b.createdAt); 
                }
            }
            return 0; 
        });
    };

    // Funcția care resetează toate filtrele
    const resetFilters = () => {
        setSelectCategory({});
        setSelectPublisher({});
        setSelectEdition({});
        setSelectTags({});
        setSelectPromotions({});
        setFilterCategoryList([]);
        setFilterProductPublisher([]);
        setFilterProductEdition([]);
        setFilterTags([]);  // Resetează filtrul de taguri
        setFilterPromotions([]);
        setPriceRange([0, 1000]); // Resetare interval preț la valoarea implicită
        setSortBy('price'); // Resetare sortare la criteriul implicit
        setSortOrder('asc'); // Resetare sortare la ordinea implicită

        fetchData(); // Reîncarcă datele cu filtrele resetate

        navigate("/book-category"); // Resetează URL-ul pentru a reflecta eliminarea filtrelor
    };

    useEffect(() => {
        fetchTags();  // Încarcă tagurile la inițializarea componentei
        fetchPromotionTags();
        fetchData();
    }, [filterCategoryList, filterproductPublisher, priceRange, filterProductEdition, filterTags, filterPromotions, sortOrder, sortBy]);

    useEffect(() => {
      const arrayOfCategory = Object.keys(selectCategory).map(categoryKeyName => {
          if (selectCategory[categoryKeyName]) {
              return categoryKeyName;
          }
          return null;
      }).filter(el => el);
  
      const arrayOfPublishers = Object.keys(selectPublisher).map(publisherKeyName => {
          if (selectPublisher[publisherKeyName]) {
              return publisherKeyName;
          }
          return null;
      }).filter(el => el);

      const arrayOfEditions = Object.keys(selectEdition).map(editionKeyName => {
        if (selectEdition[editionKeyName]) {
            return editionKeyName;
        }
        return null;
    }).filter(el => el);

    const arrayOfTags = Object.keys(selectTags).map(tagKeyName => {  // Actualizează array-ul de taguri selectate
        if (selectTags[tagKeyName]) {
            return tagKeyName;
        }
        return null;
    }).filter(el => el);

    const arrayOfPromotions = Object.keys(selectPromotions).map(promotionKeyName => {
        if (selectPromotions[promotionKeyName]) {
            return promotionKeyName;
        }
        return null;
    }).filter(el => el);
  
      setFilterCategoryList(arrayOfCategory);
      setFilterProductPublisher(arrayOfPublishers);
      setFilterProductEdition(arrayOfEditions);
      setFilterTags(arrayOfTags);  // Setează tagurile selectate pentru filtrare
      setFilterPromotions(arrayOfPromotions);
  
      // format for url change when change on the checkbox
      const urlFormat = [...arrayOfCategory, ...arrayOfPublishers, ...arrayOfEditions, ...arrayOfTags, ...arrayOfPromotions].map((el, index) => {
          if ((arrayOfCategory.length + arrayOfPublishers.length + arrayOfEditions.length + arrayOfTags.length + arrayOfPromotions.length - 1) === index) {
              return `filter=${el}`;
          }
          return `filter=${el}&&`;
      });
  
      navigate("/book-category?" + urlFormat.join(""));
  
  }, [selectCategory, selectPublisher, selectEdition, selectTags, selectPromotions]);
  

    return (
        <div className='container mx-auto p-2'>
            
            {/* desktop version */}
            <div className='hidden lg:grid grid-cols-[200px,1fr] '>
                {/* left side */}
                <div className='bg-white p-2 min-h-[calc(100vh-120px)] shadow '>


                    {/* filtering */}
                <div className=''>
                    <h3 className='border-b border-slate-400 text-xl pb-1 text-green-950 mt-0'>Filtrare după preț</h3>
                    <PriceRangeSlider onPriceChange={handlePriceRangeChange} />
                </div>

                    {/* filtering */}
                    <div className=''>
                        <h3 className='border-b border-slate-400 text-xl pb-1 text-green-950 mt-4'>Categorie</h3>

                        <form className='flex flex-col gap-2 py-2  max-h-32 overflow-y-scroll'>
                            {productCategory.map((categoryName, index) => {
                                return (
                                    <div className='flex items-center gap-3' key={index}>
                                        <input type='checkbox' name={"category"} checked={selectCategory[categoryName?.value]} value={categoryName?.value} id={categoryName?.value} onChange={handleSelectCategory} />
                                        <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
                                    </div>
                                )
                            })}
                        </form>
                    </div>

                    {/* filtering by publisher */}
                  <div className=''>
                      <h3 className='border-b border-slate-400 text-xl pb-1 text-green-950 mt-4'>Editura</h3>

                      <form className='flex flex-col gap-2 py-2 max-h-24 overflow-y-scroll'>
                          {productPublisher.map((publisherName, index) => {
                              return (
                                  <div className='flex items-center gap-3' key={index}>
                                      <input type='checkbox' name={"publisher"} checked={selectPublisher[publisherName?.value]} value={publisherName?.value} id={publisherName?.value} onChange={handleSelectPublisher} />
                                      <label htmlFor={publisherName?.value}>{publisherName?.label}</label>
                                  </div>
                              )
                          })}
                      </form>
                  </div>

                  {/* filtering by edition */}
                  <div className=''>
                        <h3 className='border-b border-slate-400 text-xl pb-1 text-green-950 mt-4'>Ediție</h3>

                        <form className='flex flex-col gap-2 py-2'>
                            {productEdition.map((editionName, index) => {
                                return (
                                    <div className='flex items-center gap-3' key={index}>
                                        <input type='checkbox' name={"edition"} checked={selectEdition[editionName?.value]} value={editionName?.value} id={editionName?.value} onChange={handleSelectEdition} />
                                        <label htmlFor={editionName?.value}>{editionName?.label}</label>
                                    </div>
                                )
                            })}
                        </form>
                    </div>

                    {/* filtering by tags */}
                    <div className=''>
                        <h3 className='border-b border-slate-400 text-xl pb-1 text-green-950 mt-4'>Recomandările Noastre</h3>

                        <form className='flex flex-col gap-2 py-2'>
                            {tags.map((tagName, index) => {
                                return (
                                    <div className='flex items-center gap-3' key={index}>
                                        <input type='checkbox' name={"tag"} checked={selectTags[tagName]} value={tagName} id={tagName} onChange={handleSelectTag} />
                                        <label htmlFor={tagName}>{tagName}</label>
                                    </div>
                                )
                            })}
                        </form>
                    </div>

                    <div className=''>
                        <h3 className='border-b border-slate-400 text-xl pb-1 text-green-950 mt-4'>Promoții</h3>

                        <form className='flex flex-col gap-2 py-2'>
                            {promotionTags.map((promotionName, index) => {
                                return (
                                    <div className='flex items-center gap-3' key={index}>
                                        <input type='checkbox' name={"promotion"} checked={selectPromotions[promotionName]} value={promotionName} id={promotionName} onChange={handleSelectPromotion} />
                                        <label htmlFor={promotionName}>{promotionName}</label>
                                    </div>
                                )
                            })}
                        </form>
                    </div>
                
                </div>

                {/* right side (products) */}
                <div className=''>
                    <div className='flex justify-between'>
                    <div className='text-left ml-10 '>
                        <button onClick={resetFilters} className='border-2 border-green-600 hover:bg-green-600 hover:text-white font-bold py-2 px-4 rounded-3xl shadow-lg transition duration-300 ' >
                        Reseteaza filtrele
                        </button>
                        <p className='font-medium text-slate-800 text-lg my-2 ml-5'>Search Results : {data.length}</p>
                        <h1 className='capitalize text-3xl pb-1 text-green-700 mt-4 ml-11'>{params?.categoryName}</h1>
                    </div>
                    {/* sorting */}
                    <div className=''>
                        <h3 className='border-b border-slate-400 text-xl pb-1 text-green-950 ml-2'>Ordonează după</h3>

                        <div className="relative inline-block text-left mb-4 mt-2 ">
                            <button
                                className="flex items-center space-x-2 bg-white border border-gray-300 rounded-full py-2 px-4 shadow-md hover:shadow-lg transition-all duration-200"
                                onClick={toggleDropdown}
                            >
                                <MdOutlineSort className="text-green-700" />
                                <span className="text-green-700 font-medium">
                                {sortBy === 'price' ? (
                                  `Preț ${sortOrder === "asc" ? "crescător" : "descrescător"}`
                                ) : (
                                  ` ${sortOrder === "newest" ? "Cele mai noi" : "Cele mai vechi"}`
                                )}
                                  </span>
                                <svg
                                    className={`w-4 h-4 transform transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-full transition-all duration-300 ease-in-out transform origin-top scale-y-100 z-20">
                                    <ul className="py-1 text-gray-700 ">
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer "
                                            onClick={() => handleSortChange("price", "asc")}
                                        >
                                            Preț crescător
                                        </li>
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleSortChange("price", "dsc")}
                                        >
                                            Preț descrescător
                                        </li>
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleSortChange("date", "newest")}
                                        >
                                            Cele mai noi
                                        </li>
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleSortChange("date", "oldest")}
                                        >
                                            Cele mai vechi
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    </div>

                    
                    <div className='min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)]'>
                        {data.length !== 0 && (
                          
                            <VerticalCard data={data} loading={loading} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryProduct;
