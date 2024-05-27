import { useEffect, useState } from 'react';
import { RiArrowGoBackLine } from "react-icons/ri";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import OrderItem from './OrderItem';

const DetailsOrder = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('details order title')
    }, [i18n.language])

    const { id } = useParams();
    const [order, setOrder] = useState({
        userData: '',
        deliveryData: [],
        productData: [],
        quantity: 0,
        total: 0,
        status: '',
        payment: '',
        pay: '',
        date: new Date(),
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/detailsorder/${id}`)
            .then(response => {
                setOrder(response.data.order);
            })
            .catch(error => {
                console.error('Error fetching order details:', error);
            });
    }, [id]);

    const [allProducts, setAllProducts] = useState([]);
    const [allStatus, setAllStatus] = useState([]);
    const [allPayments, setAllPayments] = useState([]);
    const [allPays, setAllPays] = useState([]);

    const fetchAllProducts = async () => {
        await fetch('http://localhost:5000/allproducts')
        .then((res) => res.json())
        .then((data) => {setAllProducts(data)});
    }

    const fetchAllStatus = async () => {
        await fetch('http://localhost:5000/allstatus')
        .then((res) => res.json())
        .then((data) => {setAllStatus(data)});
    }

    const fetchAllPayments = async () => {
        await fetch('http://localhost:5000/allpayments')
        .then((res) => res.json())
        .then((data) => setAllPayments(data))
    }

    const fetchAllPays = async () => {
        await fetch('http://localhost:5000/allpays')
        .then((res) => res.json())
        .then((data) => setAllPays(data))
    }

    useEffect(() => {
        fetchAllProducts();
        fetchAllStatus();
        fetchAllPays();
        fetchAllPayments();
    }, [])

    const getStatusName = (statusId) => {
        const status = allStatus.find(status => status._id === statusId)
        return status ? status.name : ''
    }

    const getPaymentName = (paymentId) => {
        const payment = allPayments.find(payment => payment._id === paymentId)
        return payment ? payment.name : ''
    }

    const getPayName = (payId) => {
        const pay = allPays.find(pay => pay._id === payId)
        return pay ? pay.name : ''
    }

    // Function to format date
    const formatDate = (date) => {
        return new Date(date).toLocaleString(); // Format the date as per user's locale
    };

    const [activeTab, setActiveTab] = useState('orderInfo')

    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-full' : 'w-[90%]'} transition-all duration-1000 h-[680px] rounded-md py-4 px-8 overflow-y-auto relative`}>
                        <div className='mt-2'>
                            <div className='mt-4 space-y-16'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex gap-6'>
                                        <button className={`px-6 py-2 border-primary border-2 rounded-md hover:bg-primary hover:text-white duration-300 ${activeTab === 'orderInfo' ? 'bg-primary text-white' : 'bg-white text-black'}`} onClick={() => setActiveTab('orderInfo')}>{t('order info')}</button>
                                        <button className={`px-6 py-2 border-primary border-2 rounded-md hover:bg-primary hover:text-white duration-300 ${activeTab === 'userInfo' ? 'bg-primary text-white' : 'bg-white text-black'}`} onClick={() => setActiveTab('userInfo')}>{t('order user info')}</button>
                                    </div>
                                    <Link to={'/listorder'} className="btn-primary rounded-md px-4">
                                        <div className='flex items-center gap-2'>
                                            <RiArrowGoBackLine />
                                            {t('back to list')}
                                        </div>
                                    </Link>
                                </div>

                                {/* Order info */}
                                {activeTab === 'orderInfo' && <div className='space-y-8'>
                                    <div className='border-b-[1px] border-third'>
                                        <div className='grid grid-cols-3 place-items-center'>
                                            <div className='col-span-1'>
                                                <h3 className='font-semibold mr-4'>{t('order products')}</h3>
                                            </div>
                                            <div className='col-span-2'>
                                                {order.productData.map((item, index) => (
                                                    <div key={index}>
                                                        {Object.keys(item).map(productId => {
                                                            const product = allProducts.find(p => p.id === parseInt(productId))
                                                            const { quantity, size } = item[productId]
                                                            
                                                            return (
                                                                <div key={productId}>
                                                                    <OrderItem product={product} quantity={quantity} size={size} />
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-3 place-items-center'>
                                        <div className='space-y-8 font-semibold col-span-1'>
                                            <h3>{t('order quantity')}</h3>
                                            <h3>{t('order payment')}</h3>
                                            <h3>{t('order pay')}</h3>
                                            <h3>{t('order total')}</h3>
                                            <h3>{t('order status')}</h3>
                                            <h3>{t('order date')}</h3>
                                        </div>
                                        <div className='col-span-2'>
                                            <div className='space-y-8'>
                                                <p>{order.quantity}</p>
                                                <p>{getPaymentName(order.payment) === '' ? 'None' : getPaymentName(order.payment)}</p>
                                                <p>{getPayName(order.pay) === '' ? 'None' : getPayName(order.pay)}</p>
                                                <p>${order.total.toFixed(2)}</p>
                                                <p>{getStatusName(order.status)}</p>
                                                <p>{formatDate(order.date)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>}

                                {/* User info */}
                                {activeTab === 'userInfo' && <div className='space-y-8'>
                                    <div className='grid grid-cols-3 place-items-center'>
                                        <div className='space-y-8 font-semibold col-span-1'>
                                            <h3>{t('user name')}</h3>
                                            <h3>{t('user email')}</h3>
                                            <h3>{t('user address')}</h3>
                                            <h3>{t('user phone')}</h3>
                                            <h3>{t('user city')}</h3>
                                            <h3>{t('user province')}</h3>
                                            <h3>{t('user district')}</h3>
                                            <h3>{t('user commune')}</h3>
                                            <h3>{t('user country')}</h3>
                                        </div>
                                        <div className='col-span-2'>
                                            <div className=''>
                                                {order.deliveryData.map(((item, index) => (
                                                    <div key={index} className='space-y-8'>
                                                        <p>{item.name === '' ? 'None' : item.name}</p>
                                                        <p>{item.email === '' ? 'None' : item.email}</p>
                                                        <p>{item.address === '' ? 'None' : item.address}</p>
                                                        <p>{item.phone === '' ? 'None' : item.phone}</p>
                                                        <p>{item.city === '' ? 'None' : item.city}</p>
                                                        <p>{item.province === '' ? 'None' : item.province}</p>
                                                        <p>{item.district === '' ? 'None' : item.district}</p>
                                                        <p>{item.commune === '' ? 'None' : item.commune}</p>
                                                        <p>{item.country === '' ? 'None' : item.country}</p>
                                                    </div>
                                                )))}
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailsOrder