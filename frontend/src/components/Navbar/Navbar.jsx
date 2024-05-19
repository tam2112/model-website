import { Link, NavLink } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Tooltip } from 'react-tooltip';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CiSearch, CiUser, CiHeart, CiShoppingCart, CiCircleRemove } from 'react-icons/ci';
import { HiMenuAlt1 } from 'react-icons/hi';
import { PiGearLight, PiUserCircleLight } from "react-icons/pi";
import { LiaUserSecretSolid } from "react-icons/lia";

import NavLogo from '../Assets/logo.png';

import ResponsiveMenu from './ResponsiveMenu';
import { ShopContext } from '../../Context/ShopContext';
import Avatar from '../../components/Assets/default-avatar.jpg'
import SearchResults from './SearchResults';

const Navbar = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocus, setIsFocus] = useState(false);

    const searchInputRef = useRef(null);

    const { getTotalCartItems, getTotalWishItems, userId } = useContext(ShopContext);

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    const [user, setUser] = useState({
        name: '',
        email: '',
        avatar: '',
    })

    useEffect(() => {
        axios.get(`http://localhost:5000/detailsuser/${userId}`)
            .then(response => {
                setUser(response.data.user)
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            });
    }, [userId]);

    // Set up event listener for focus and blur events
    useEffect(() => {
        const handleFocus = () => {
            setIsFocus(true)
        };

        const handleBlur = () => {
            setIsFocus(false)
        };

        searchInputRef.current.addEventListener('focus', handleFocus);
        searchInputRef.current.addEventListener('blur', handleBlur);

        // Clean up event listener on unmount
        return () => {
            searchInputRef.current.removeEventListener('focus', handleFocus);
            searchInputRef.current.removeEventListener('blur', handleBlur);

        };
    }, []);
    

    const handleNotLoggedIn = () => {
        if (!localStorage.getItem('auth-token')) {
            // Hiển thị thông báo yêu cầu đăng nhập
            toast.error("Bạn cần đăng nhập trước!", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
            return;
        }
    }

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

    return (
        <>
            <div className="fixed top-0 left-0 right-0 bg-white z-[9999]">
                <div className="container">
                    <div className="flex items-center justify-between py-4 border-b-2">
                        {/* Nav links */}
                        <div className="lg:block hidden">
                            <ul className="flex items-center gap-8">
                                <li>
                                    <NavLink
                                        to="/"
                                        activeclass="active"
                                        className="hover:border-b-2 hover:border-black font-semibold text-primary uppercase"
                                    >
                                        Home
                                    </NavLink>
                                </li>
                                {allCategories.map((cat) => (
                                    <li key={cat.id}>
                                        <NavLink
                                            to={`/${cat.name}`}
                                            activeclass="active"
                                            className="hover:border-b-2 hover:border-black font-semibold text-primary uppercase"
                                        >
                                            {cat.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Bar icon */}
                        <div className="lg:hidden">
                            <HiMenuAlt1 className="text-2xl" onClick={() => setShowMenu(true)} />
                        </div>

                        {/* Logo */}
                        <div>
                            <Link to={'/'}>
                                <img src={NavLogo} alt="logo" className="w-32" />
                            </Link>
                        </div>

                        {/* Icons */}
                        <div className="flex gap-5">
                            <div>
                                <CiSearch className="text-2xl cursor-pointer" onClick={toggleSearch} id="search" />
                                <Tooltip anchorId="search" place="bottom" content="Search" />
                            </div>
                            <div className="hidden lg:block">
                                {
                                    localStorage.getItem('auth-token') ? 
                                    <>
                                        <div>
                                            <img src={user.avatar === '' ? Avatar : user.avatar} alt="" className='w-6 h-6 rounded-full object-cover cursor-pointer' onClick={() => setShowProfile(true)} />
                                        </div>
                                        {/* dropdown */}
                                        {showProfile && <div className='fixed top-16 right-10 bg-white min-w-[280px] shadow-md p-4'>
                                            <div className='flex justify-between items-center mb-4'>
                                                <h3 className='font-semibold'>User Profile</h3>
                                                <div className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-third duration-300 cursor-pointer'>
                                                    <CiCircleRemove size={24} onClick={() => setShowProfile(false)} />
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-4'>
                                                <div>
                                                    <img src={user.avatar === '' ? Avatar : user.avatar} alt="" className='w-14 h-14 object-cover rounded-full' />
                                                </div>
                                                <div>
                                                    <h2 className='font-semibold'>{user.name}</h2>
                                                    <p className='text-sm text-secondary'>{user.email}</p>
                                                </div>
                                            </div>
                                            <hr className='my-4' />
                                            <div className='flex flex-col gap-2'>
                                                <Link to={'/myprofile'} onClick={() => setShowProfile(false)}>
                                                    <p className='flex gap-2 items-center hover:bg-third duration-300 p-2 rounded-md cursor-pointer'><PiUserCircleLight size={20} /> My Profile</p>
                                                </Link>
                                                <Link to={'/myorders'} onClick={() => setShowProfile(false)}>
                                                    <p className='flex gap-2 items-center hover:bg-third duration-300 p-2 rounded-md cursor-pointer'><LiaUserSecretSolid size={20} /> My Order</p>
                                                </Link>
                                            </div>
                                            <hr className='my-4' />
                                            <button 
                                                onClick={() => { 
                                                    localStorage.removeItem('auth-token');
                                                    localStorage.removeItem('userId')
                                                    window.location.replace('/'); 
                                                }} 
                                                className='btn-primary w-full'
                                            >
                                                Logout
                                            </button>
                                        </div>}
                                    </> 
                                    : 
                                    <>
                                        <Link to="/login">
                                            <CiUser className="text-2xl cursor-pointer" id="login" />
                                        </Link>
                                        <Tooltip anchorId="login" place="bottom" content="Sign in" />
                                    </>
                                }
                            </div>
                            <div className="hidden relative cursor-pointer lg:block" onClick={handleNotLoggedIn}>
                                <Link to={`${localStorage.getItem('auth-token') ? '/wishlist' : '#'}`}>
                                    <CiHeart className="text-2xl cursor-pointer" id="wishlist" />
                                </Link>
                                <Tooltip anchorId="wishlist" place="bottom" content="Wishlist" />
                                {localStorage.getItem('auth-token') && 
                                    <>
                                        {getTotalWishItems() > 0 && <div className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 text-center text-xs text-white rounded-full">
                                            <span>{getTotalWishItems()}</span>
                                        </div>}
                                    </>
                                }
                            </div>
                            <div className="relative cursor-pointer" onClick={handleNotLoggedIn}>
                                <Link to={`${localStorage.getItem('auth-token') ? '/cart' : '#'}`}>
                                    <CiShoppingCart className="text-2xl cursor-pointer" id="cart" />
                                </Link>
                                <Tooltip anchorId="cart" place="bottom" content="Cart" />
                                {localStorage.getItem('auth-token') && 
                                    <>
                                        {getTotalCartItems() > 0 && <div className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 text-center text-xs text-white rounded-full">
                                            <span>{getTotalCartItems()}</span>
                                        </div>}
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Tablet + Mobile nav links */}
            <ResponsiveMenu showMenu={showMenu} setShowMenu={setShowMenu} />

            {/* Search input */}
            <div
                className={`${
                    showSearch ? 'top-20' : 'top-0'
                } fixed z-10 left-1/2 -translate-x-1/2 transition-all duration-300`}
            >
                <div className='relative z-20'>
                    <input
                        ref={searchInputRef}
                        type="text"
                        name="search"
                        id="search"
                        placeholder="What are you looking for?"
                        className="lg:w-[800px] md:w-[600px] w-[400px] border-[1px] rounded-full shadow-md outline-none p-3 pl-6"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {/* Search icon */}
                    <div className='absolute right-0 top-0 px-6 py-[14px] cursor-pointer z-10 rounded-tr-full rounded-br-full border-[1px] border-[#e8eaed] hover:bg-primary hover:text-white transition-all duration-300'>
                        <CiSearch size={20} />
                    </div>

                    {/* Search results */}
                    <div className={`absolute z-10 top-full bg-white left-5 w-[89%] rounded-sm ${showSearch ? 'opacity-100' : 'opacity-0'} transition-all duration-300`}>
                        <SearchResults searchQuery={searchQuery} setShowSearch={setShowSearch} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
