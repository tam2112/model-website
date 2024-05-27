import { useEffect, useState } from 'react';
import { RiArrowGoBackLine } from "react-icons/ri";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import CustomerCart from './CustomerCart';
import { useTranslation } from 'react-i18next';

const DetailsCustomer = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('details customer title')
    }, [i18n.language])

    const { id } = useParams();
    const [customer, setCustomer] = useState({
        name: '',
        phone: '',
        birthday: '',
        address: '',
        district: '',
        commune: '',
        city: '',
        province: '',
        country: '',
        email: '',
        password: '',
        cartData: {},
        wishlistData: {},
        date: new Date(),
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/detailsuser/${id}`)
            .then(response => {
                setCustomer(response.data.user);
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            });
    }, [id]);

    // Function to format date
    const formatDate = (date) => {
        return new Date(date).toLocaleString(); // Format the date as per user's locale
    };

    const [activeTab, setActiveTab] = useState('info')

    const [allProducts, setAllProducts] = useState([])
    const fetchAllProducts = async () => {
        // Fetch danh sách các danh mục từ API
        try {
            const response = await fetch('http://localhost:5000/allproducts');
            const data = await response.json();
            setAllProducts(data);
        } catch (error) {
            console.error('Error fetching sizes:', error);
        }
    }

    useEffect(() => {
        fetchAllProducts()
    }, [])

    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-full' : 'w-[90%]'} transition-all duration-1000 h-[680px] rounded-md py-4 px-8 overflow-y-auto relative`}>
                        <div className='mt-2'>
                            <div className='mt-4 space-y-8'>
                                <div className='flex justify-between items-center'>
                                    <div className='flex gap-6'>
                                        <button className={`px-6 py-2 border-primary border-2 rounded-md hover:bg-primary hover:text-white duration-300 ${activeTab === 'info' ? 'bg-primary text-white' : 'bg-white text-black'}`} onClick={() => setActiveTab('info')}>{t('user info')}</button>
                                        <button className={`px-6 py-2 border-primary border-2 rounded-md hover:bg-primary hover:text-white duration-300 ${activeTab === 'contact' ? 'bg-primary text-white' : 'bg-white text-black'}`} onClick={() => setActiveTab('contact')}>{t('user contact')}</button>
                                        <button className={`px-6 py-2 border-primary border-2 rounded-md hover:bg-primary hover:text-white duration-300 ${activeTab === 'cart' ? 'bg-primary text-white' : 'bg-white text-black'}`} onClick={() => setActiveTab('cart')}>{t('user cart')}</button>
                                        <button className={`px-6 py-2 border-primary border-2 rounded-md hover:bg-primary hover:text-white duration-300 ${activeTab === 'wishlist' ? 'bg-primary text-white' : 'bg-white text-black'} `} onClick={() => setActiveTab('wishlist')}>{t('user wishlist')}</button>
                                    </div>
                                    <Link to={'/listcustomer'} className="btn-primary rounded-md px-4">
                                        <div className='flex items-center gap-2'>
                                            <RiArrowGoBackLine />
                                            {t('back to list')}
                                        </div>
                                    </Link>
                                </div>
                                <hr className='my-4' />

                                {/* Info */}
                                {activeTab === 'info' && <div className='grid grid-cols-3 place-items-center'>
                                    <div className='space-y-8 font-semibold col-span-1'>
                                        <h3>{t('user name')}</h3>
                                        <h3>{t('user email')}</h3>
                                        <h3>{t('user password')}</h3>
                                        <h3>{t('user date')}</h3>
                                    </div>
                                    <div className='space-y-8 col-span-2'>
                                        <p>{customer.name}</p>
                                        <p>{customer.email}</p>
                                        <p>{customer.password}</p>
                                        <p>{formatDate(customer.date)}</p>
                                    </div>
                                </div>}

                                {/* Contact */}
                                {activeTab === 'contact' && <div className='grid grid-cols-3 place-items-center'>
                                    <div className='space-y-8 font-semibold col-span-1'>
                                        <h3>{t('user phone')}</h3>
                                        <h3>{t('user address')}</h3>
                                        <h3>{t('user birthday')}</h3>
                                        <h3>{t('user district')}</h3>
                                        <h3>{t('user commune')}</h3>
                                        <h3>{t('user city')}</h3>
                                        <h3>{t('user province')}</h3>
                                        <h3>{t('user country')}</h3>
                                    </div>
                                    <div className='space-y-8 col-span-2'>
                                        <p>{customer.phone}</p>
                                        <p>{customer.address}</p>
                                        <p>{customer.birthday}</p>
                                        <p>{customer.district}</p>
                                        <p>{customer.commune}</p>
                                        <p>{customer.city}</p>
                                        <p>{customer.province}</p>
                                        <p>{customer.country}</p>
                                    </div>
                                </div>}

                                {/* Cart */}
                                {activeTab === 'cart' && <>
                                    <div className="sm:grid lg:grid-cols-[0.7fr_2fr_1fr_1fr_1fr_1fr] sm:grid-cols-[0.7fr_1.5fr_1fr_1fr_1fr_1fr] hidden" data-aos='zoom-in'>
                                        <p>{t('product image')}</p>
                                        <p>{t('product title')}</p>
                                        <p>{t('product price')}</p>
                                        <p>{t('product size')}</p>
                                        <p>{t('order quantity')}</p>
                                        <p>{t('order total')}</p>
                                    </div>
                                    <hr className="my-4 sm:block hidden" />
                                    <div>
                                        {Object.keys(customer.cartData).map((productId) => {
                                            const product = allProducts.find((p) => p.id === parseInt(productId));
                                            const { quantity, size } = customer.cartData[productId];

                                            if (product && quantity > 0) {
                                                return (
                                                    <div key={productId} data-aos='fade-up'>
                                                        <CustomerCart showSidebar={showSidebar} product={product} quantity={quantity} size={size} />
                                                        <hr className="my-4" />
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                </>}

                                {/* Wishlist */}
                                {activeTab === 'wishlist' && <div className='grid grid-cols-3 gap-4'>
                                    {allProducts.map((product) => {
                                        if (customer.wishlistData[product.id] > 0) {
                                            return (
                                                <div key={product.id} className='space-y-1'>
                                                    <div>
                                                        <img src={product.main_img} alt="" className='h-[500px]' />
                                                    </div>
                                                    <p>{product.name}</p>
                                                </div>
                                            )
                                        }
                                    })}
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailsCustomer