import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState, lazy, Suspense } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetail } from './store/userSlice';



function App() {

  const dispatch = useDispatch()
  const [cartProductCount, setCartProductCount] = useState(0)
  const [wishlistProductCount, setWishlistProductCount] = useState(0);

  const fetchUserDetail = async () => {
    const dataResponse = await fetch(SummaryApi.current_user.url, {
      method : SummaryApi.current_user.method,
      credentials : 'include',    
    })
    const dataApi = await dataResponse.json()

    //asta se apeleaza din backend cand primesc detaliile de la user
    if(dataApi.success){
      //date care vin din backend
        dispatch(setUserDetail(dataApi.data))
    }

    console.log("data-user:", dataResponse)
  }

  const fetchUserAddToCart = async () => {
    const dataResponse = await fetch(SummaryApi.countAddToCart.url, {
      method : SummaryApi.countAddToCart.method,
      credentials : 'include',    
    })
    const dataApi = await dataResponse.json()
    setCartProductCount(dataApi?.data?.count)
  }

  const fetchUserWishlist = async () => {
    const dataResponse = await fetch(SummaryApi.countAddToWishlist.url, {
      method: SummaryApi.countAddToWishlist.method,
      credentials: 'include',
    });
    const dataApi = await dataResponse.json();
    setWishlistProductCount(dataApi?.data?.count); // Setăm numărul de produse din wishlist
  };

  useEffect(() => {
    /* detaliile user-ului */
    fetchUserDetail()
    /* detaliile user-ului cu privire la cosul de cumparaturi */
    fetchUserAddToCart()
    /* detaliile user-ului cu privire la wishlist */
    fetchUserWishlist()
  }, [])

  return (

    <> {/* asa se creeaza un fragment */}
    <Context.Provider value={{
      fetchUserDetail, //user detail fetch
      cartProductCount, //current usser add to cart count
      wishlistProductCount,
      fetchUserAddToCart,
      fetchUserWishlist
    }}>
    <ToastContainer 
    position="bottom-right"/>

    <Header/> {/* Header vreau sa fie pe toate paginile */}
    
    <main className='min-h-[calc(100vh-120px)] pt-60'>
    <Outlet />
    </main>
    <Footer/>{/* Footer vreau sa fie pe toate paginile  */}
    </Context.Provider>
    </>
  );
}

export default App;
