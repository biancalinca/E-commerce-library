import React, { useEffect, useState } from 'react'
import SummaryApi from './../common/index';
import moment from 'moment';
import { MdOutlineSort } from "react-icons/md";

const OrderPage = () => {

  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // Implicit sortare descrescătoare (cele mai recente)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSortChange = (order) => {
    setSortOrder(order);
    setIsDropdownOpen(false);
  };

  const fetchOrderDetails = async () => {
    const response = await fetch(SummaryApi.getOrder.url,{
      method: SummaryApi.getOrder.method,
      credentials: 'include'
    });
    const dataResponse = await response.json();

    // Sortează datele în funcție de `sortOrder` înainte de a le seta în `data`
    const sortedData = sortOrders(dataResponse.data, sortOrder);
    setData(sortedData);

    console.log("DETALII COMANDA:", dataResponse);
  };

  const sortOrders = (orders, order) => {
    return orders.sort((a, b) => {
      if (order === "desc") {
        return new Date(b.createdAt) - new Date(a.createdAt); // Sortare descrescătoare (cele mai recente)
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt); // Sortare crescătoare (cele mai vechi)
      }
    });
  };
  

  useEffect(() => {
    fetchOrderDetails();
  }, [sortOrder]);


  return (
    <div className="container mx-auto my-8 text-green-950">
    <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
    <p className="text-3xl font-bold">Comenzile Mele</p>
      <div className="relative inline-block text-left">
        <button 
          className="flex items-center space-x-2 bg-white border border-gray-300 rounded-full py-2 px-4 shadow-md hover:shadow-lg transition-all duration-200"
          onClick={toggleDropdown}
        >
          <MdOutlineSort  className="text-green-700" />
          <span className="text-green-700 font-medium">Comenzile {sortOrder === "desc" ? "recente" : "vechi"}</span>
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
          <div className="absolute mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-full transition-all duration-300 ease-in-out transform origin-top scale-y-100">
            <ul className="py-1 text-gray-700">
              <li 
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSortChange("desc")}
              >
                Cele mai recente
              </li>
              <li 
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSortChange("asc")}
              >
                Cele mai vechi
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
      {
        !data[0] && (
          <p className="text-center text-xl">Nu sunt comenzi valabile</p>
        )
      }
      <div>
        {
          data.map((item, index) => {
            const totalProducts = item.productDetails.reduce((total, product) => total + product.quantity, 0);
            return (
              <div key={item.userId + index} className="bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="border-b pb-4 mb-4">
                  <p className="text-2xl font-semibold text-green-700">{moment(item.createdAt).format("ll")}</p>
                  <p className="text-lg text-gray-600">Comandă ID: {item._id}</p>
                </div>
                <div className="mt-6 flex justify-between items-center">
                <div>
                  {
                    item?.productDetails.map((product, index) => {
                      return (
                        <div key={product.productId + index} className="flex items-center mb-6">
                          <div className="w-24 h-24 flex-shrink-0">
                            <img src={product.image} alt={product.name} className="object-cover w-full h-full rounded-md" />
                          </div>
                          <div className="ml-4 flex-1">
                            <p className="text-xl font-semibold">{product.name}</p>
                            <p className="text-gray-600">Cantitate: {product.quantity}</p>
                            <p className="text-green-700 font-bold">{product.price.toFixed(2)} Lei</p>
                          </div>
                        </div>
                      )
                    })
                  }
                  </div>
                  <div className=" ">
                    <p className="text-xl font-bold text-green-800 mt-2">Total: {item.totalAmount.toFixed(2)} Lei</p>
                    <p className="text-lg font-semibold">Produse comandate: {totalProducts}</p>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default OrderPage
