import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Layout, Home } from './pages';
import ShopCategory from './pages/ShopCategory';
import Product from './pages/Product';
import Cart from './pages/Cart';
import LoginSignup from './pages/LoginSignup';
import { Newsletter } from './components';
import Wishlist from './pages/Wishlist'
import MyOrders from './components/MyOrders/MyOrders'
import Order from './components/Order/Order';
import OrderPayment from './components/Order/OrderPayment';
import MyProfile from './components/MyProfile/MyProfile';
import MyPurchase from './components/MyPurchase/MyPurchase'
import ChangePassword from './components/MyProfile/ChangePassword';

function App() {
    const [allCategories, setAllCategories] = useState([]);

    const fetchAllCategories = async () => {
        // Fetch danh sách các danh mục từ API
        try {
            const response = await fetch('http://localhost:5000/allcategories');
            const data = await response.json();
            setAllCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    useEffect(() => {
        fetchAllCategories();
    }, [])

    useEffect(() => {
        AOS.init({
            offset: 100,
            duration: 800,
            easing: 'ease-in-sine',
            delay: 300,
        });
        AOS.refresh();
    }, []);

    return (
        <>
            <ToastContainer />

            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        {
                            allCategories.map((category) => (
                                <Route key={category.id} id={category.id} path={`/${category.name}`} element={<ShopCategory title={category.name} category={category.name} categoryId={category._id} />} />
                            ))
                        }
                        <Route path="/product" element={<Product />}>
                            <Route path=":productId" element={<Product />} />
                        </Route>
                        <Route path="/login" element={<LoginSignup />} />
                        <Route path='/wishlist' element={<Wishlist />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/order" element={<Order />} />
                        <Route path='/myorders' element={<MyOrders />} />
                        <Route path='/myprofile' element={<MyProfile />} />
                        <Route path='/myprofile/changepassword' element={<ChangePassword />} />
                        <Route path='/mypurchase' element={<MyPurchase />} />
                        <Route path="/orderpayment" element={<OrderPayment />} />
                    </Route>
                    <Route path="/" element={<Newsletter />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
