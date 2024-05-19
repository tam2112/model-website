import { useContext, useEffect, useState } from "react"

import { TfiReload } from "react-icons/tfi";
import { LiaShippingFastSolid } from "react-icons/lia";
import { ImUserCheck } from "react-icons/im";

import Box from '../../components/Assets/box.png'
import { ShopContext } from "../../Context/ShopContext"
import OrderItem from "./OrderItem"

const MyOrders = () => {
    const [allOrders, setAllOrders] = useState([])
    const [allStatus, setAllStatus] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const { userId } = useContext(ShopContext)

    const fetchAllOrders = async () => {
        await fetch('http://localhost:5000/allorders')
        .then(res => res.json())
        .then(data => {
            // Sort data by date in descending order (newest to oldest)
            data.sort((a, b) => new Date(b.date) - new Date(a.date));

            setAllOrders(data)
        })
    }

    const fetchAllStatus = async () => {
        await fetch('http://localhost:5000/allstatus')
        .then(res => res.json())
        .then(data => setAllStatus(data))
    }

    const fetchAllProducts = async () => {
        await fetch('http://localhost:5000/allproducts')
        .then(res => res.json())
        .then(data => setAllProducts(data))
    }

    useEffect(() => {
        fetchAllOrders();
        fetchAllStatus();
        fetchAllProducts();
    }, [])

    const remove_order = async (id) => {
        await fetch('http://localhost:5000/removeorder', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: id })
        })
        await fetchAllOrders();
    }

    const getStatusName = (statusId) => {
        const status = allStatus.find(status => status._id === statusId)
        return status ? status.name : ''
    }

    const filterOrders = allOrders.filter(order => order.userData === userId)

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [orderIdToRemove, setOrderIdToRemove] = useState(null);

    const openConfirmation = (orderId) => {
        setOrderIdToRemove(orderId);
        setShowConfirmation(true);
    }
    
    const closeConfirmation = () => {
        setShowConfirmation(false);
    }

    const confirmDelete = async () => {
        await remove_order(orderIdToRemove);
        closeConfirmation();
    }
    
    const cancelDelete = () => {
        closeConfirmation();
    }
    
    


    return (
        <>
            <div className="py-20">
                <div className="container">
                    <div>
                        <div className="mt-16 space-y-8">
                            <h1 className="font-semibold font-marcellus text-4xl">My Orders</h1>
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
                                                    <div>
                                                        {order.deliveryData.map((item, index) => (
                                                            <div key={index} className="space-y-2">
                                                                <p className="font-semibold">{item.name}</p>
                                                                <p>Address: {item.address}</p>
                                                                <p>City: {item.city}</p>
                                                                <p>Phone: {item.phone}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="grid place-items-center">
                                                    <p>${order.total.toFixed(2)}</p>
                                                </div>
                                                <div className="grid place-items-center">
                                                    <p>Items: {order.quantity}</p>
                                                </div>
                                                <div className="grid place-items-center">
                                                    {
                                                        getStatusName(order.status) === 'Processing' ? 
                                                            (<p className="flex items-center gap-2"><TfiReload /> {getStatusName(order.status)}</p>) 
                                                        : 
                                                            getStatusName(order.status) === 'Out for Delivery' ? 
                                                            (<p className="flex items-center gap-2"><LiaShippingFastSolid /> {getStatusName(order.status)}</p>) 
                                                        : (<p className="flex items-center gap-2"><ImUserCheck /> {getStatusName(order.status)}</p>)
                                                    }
                                                </div>
                                                <div className="grid place-items-center">
                                                    <button className="bg-red-300 hover:bg-red-400 transition-all duration-300 px-6 py-3 rounded-md text-white" onClick={() => openConfirmation(order._id)}>Track Order</button>
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
                        <p className="sm:text-lg text-sm">Are you sure you want to delete this order?</p>
                        <div className="flex justify-end mt-4">
                            <button className="btn-primary mr-4 sm:py-2 sm:px-10 py-2 px-8 text-sm" onClick={confirmDelete}>Yes</button>
                            <button className="btn-primary sm:py-2 sm:px-10 py-2 px-8 text-sm" onClick={cancelDelete}>No</button>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

export default MyOrders