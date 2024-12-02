import {createBrowserRouter} from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminPanel from '../pages/AdminPanel';
import AllUsers from '../pages/AllUsers';
import AllProducts from '../pages/AllProducts';
import SendOTP from '../pages/otp/SendOTP';
import VerifyOTP from '../pages/otp/VerifyOTP';
import ResetPassword from '../pages/otp/ResetPassword';
import CategoryProduct from '../pages/CategoryProduct';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import SearchProduct from '../pages/SearchProduct';
import VerifyEmail from '../pages/otp/VerifyEmail';
import Succes from '../pages/Succes';
import Cancel from '../pages/Cancel';
import OrderPage from '../pages/OrderPage';
import AllOrders from '../pages/AllOrders';
import UserDetails from '../pages/UserDetails';
import WishList from '../pages/WishList';
import Reviews from '../components/Reviews';
import AdminStatistics from '../pages/AdminStatistics';
import Contact from '../components/Contact';
import Noutati from '../pages/Noutati';
import TopSellingBooks from '../pages/TopSellingBooks';

//crearea router-ului
//createBrowserRouter este apelata cu un array de obiecte care definesc rutele aplicatiei 
//fiecare obiect din acest array reprezinta o ruta
const router = createBrowserRouter([
    {
        path: '/', // specifica calea url pt aceasta ruta
        element: <App/>, //specifica componenta App care va fi randata cand utiliz navigheaza la aceasta ruta
        children: [ // avem aici un alt obiect
            {
                path: "", // aceasta ruta copil va fi redata cand utiliz este deja la ruta parinte(/) de aia este un string gol
                element:<Home/> // specifica componenta Home 
            },
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "register",
                element: <Register/>
            },
            {
                path: "user-details",
                element: <UserDetails/>
            },
            {
                path : "whish-list",
                element : <WishList/>
            },
            {
                path: 'send-otp',
                element: <SendOTP />
            },
            {
                path: 'verify-otp',
                element: <VerifyOTP />
            },
            {
                path: 'verify-email',
                element: <VerifyEmail />
            },
            {
                path: 'reset-password',
                element: <ResetPassword />
            },
            {
                path: "book-category",
                element: <CategoryProduct/>
            },
            {
                path: "book/:id",
                element: <ProductDetails/>
            },
            {
                path: "review/:id",
                element: <Reviews/>
            },
            {
                path: "cart",
                element: <Cart/>
            },
            {
                path : "success",
                element : <Succes/>
            },
            {
                path : "cancel",
                element : <Cancel/>
            },
            {
                path : "order",
                element : <OrderPage/>
            },
            {
                path: "search",
                element: <SearchProduct/>
            },
            {
                path: "contact",
                element: <Contact/>
            },
            {
                path: "top-selling-books",
                element: <TopSellingBooks/>
            },
            {
                path: "admin-panel",
                element: <AdminPanel/>,
                children :[
                    {
                        path: "all-users",
                        element: <AllUsers/>
                    },
                    {
                        path: "all-products",
                        element: <AllProducts/>
                    },
                    {
                        path: "all-order",
                        element: <AllOrders/>
                    },
                    {
                        path: "statistics",
                        element: <AdminStatistics/>
                    }

                ]
            }
        ]
    }
]);

//router-ul este exportat pentru a putea fi utilizat in alte parti ale aplicatiei, de obieci unde configurez RouterPRovider - adica in index.js ul principal 
export default router