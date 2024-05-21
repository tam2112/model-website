import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

import { TfiReload } from "react-icons/tfi";
import { LiaShippingFastSolid } from "react-icons/lia";
import { ImUserCheck } from "react-icons/im";

import Box from '../../components/Assets/box.png';
import { ShopContext } from "../../Context/ShopContext";
import OrderItem from "./OrderItem";

const MyOrders = () => {
    const { t, i18n } = useTranslation()

    const [allOrders, setAllOrders] = useState([]);
    const [allStatus, setAllStatus] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const { userId } = useContext(ShopContext);

    useEffect(() => {
        window.document.title = t('my orders')
    }, [i18n.language])

    const fetchAllOrders = async () => {
        await fetch('http://localhost:5000/allorders')
        .then(res => res.json())
        .then(data => {
            // Sort data by date in descending order (newest to oldest)
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setAllOrders(data);
        });
    };

    const fetchAllStatus = async () => {
        await fetch('http://localhost:5000/allstatus')
        .then(res => res.json())
        .then(data => setAllStatus(data));
    };

    const fetchAllProducts = async () => {
        await fetch('http://localhost:5000/allproducts')
        .then(res => res.json())
        .then(data => setAllProducts(data));
    };

    useEffect(() => {
        fetchAllOrders();
        fetchAllStatus();
        fetchAllProducts();
    }, []);

    const cancelOrder = async (id) => {
        // Fetch the "Cancelled" status ID
        const cancelledStatus = allStatus.find(status => status.name === 'Cancelled');
        if (!cancelledStatus) {
            console.error('Cancelled status not found');
            return;
        }
        
        await fetch(`http://localhost:5000/updateorderstatus/${id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: cancelledStatus._id })
        });
        Swal.fire({
            icon: 'success',
            title: t('title swal'),
            text: t('cancel order success'),
            position: 'center',
        });
        await fetchAllOrders();
    };

    const getStatusName = (statusId) => {
        const status = allStatus.find(status => status._id === statusId);
        return status ? status.name : '';
    };

    // Filter out orders with "Cancelled" status
    const filterOrders = allOrders.filter(order => order.userData === userId && getStatusName(order.status) !== 'Cancelled');

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [orderIdToCancel, setOrderIdToCancel] = useState(null);

    const openConfirmation = (orderId) => {
        setOrderIdToCancel(orderId);
        setShowConfirmation(true);
    };
    
    const closeConfirmation = () => {
        setShowConfirmation(false);
    };

    const confirmCancel = async () => {
        await cancelOrder(orderIdToCancel);
        closeConfirmation();
    };
    
    const cancelDelete = () => {
        closeConfirmation();
    };

    return (
        <>
            <div className="py-20">
                <div className="container">
                    <div>
                        <div className="mt-16 space-y-8">
                            <h1 className="font-semibold font-marcellus text-4xl">{t('my orders')}</h1>
                            <div>
                                <div className="space-y-8">
                                    {filterOrders.map(order => (
                                        <div key={order._id} className="border-primary border-2 p-4 rounded-sm">
                                            <div className="grid grid-cols-[0.6fr_1.6fr_1fr_1fr_1fr_1fr] gap-4">
                                                <div>
                                                    <img src={Box} alt="" className="w-14" />
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        {order.productData.map((item, index) => (
                                                            <div key={index}>
                                                                {Object.keys(item).map(productId => {
                                                                    const product = allProducts.find(p => p.id === parseInt(productId));
                                                                    const { quantity, size } = item[productId];
                                                                    
                                                                    return (
                                                                        <div key={productId}>
                                                                            <OrderItem product={product} quantity={quantity} size={size} />
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        {order.deliveryData.map((item, index) => (
                                                            <div key={index} className="space-y-2">
                                                                <p className="font-semibold">{item.name}</p>
                                                                <p>{t('address')}: {item.address}</p>
                                                                <p>{t('city')}: {item.city}</p>
                                                                <p>{t('phone')}: {item.phone}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="grid place-items-center">
                                                    <p>${order.total.toFixed(2)}</p>
                                                </div>
                                                <div className="grid place-items-center">
                                                    <p>{t('items')}: {order.quantity}</p>
                                                </div>
                                                <div className="grid place-items-center">
                                                    {
                                                        getStatusName(order.status) === 'Processing' ? 
                                                            (<p className="flex items-center gap-2"><TfiReload /> {t(getStatusName(order.status))}</p>) 
                                                        : 
                                                            getStatusName(order.status) === 'Out for Delivery' ? 
                                                            (<p className="flex items-center gap-2"><LiaShippingFastSolid /> {t(getStatusName(order.status))}</p>) 
                                                        : (<p className="flex items-center gap-2"><ImUserCheck /> {t(getStatusName(order.status))}</p>)
                                                    }
                                                </div>
                                                <div className="grid place-items-center">
                                                    <button className="bg-red-300 hover:bg-red-400 transition-all duration-300 px-6 py-3 rounded-md text-white" onClick={() => openConfirmation(order._id)}>{t('track order')}</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-white sm:p-8 p-4 sm:rounded-md rounded-sm w-[70%] sm:w-[40%]">
                        <p className="sm:text-lg text-sm">{t('are you sure you want to cancel this order')}?</p>
                        <div className="flex justify-end mt-4">
                            <button className="btn-primary mr-4 sm:py-2 sm:px-10 py-2 px-8 text-sm" onClick={confirmCancel}>{t('yes')}</button>
                            <button className="btn-primary sm:py-2 sm:px-10 py-2 px-8 text-sm" onClick={cancelDelete}>{t('no')}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyOrders;
