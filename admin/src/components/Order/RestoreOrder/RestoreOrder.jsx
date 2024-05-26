import { Link } from "react-router-dom"
import { LiaTrashRestoreAltSolid } from "react-icons/lia";
import { RiDeleteBinLine, RiArrowGoBackLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'

import Box from '../../../assets/box.png'
import OrderItem from './OrderItem'

const RestoreOrder = ({ showSidebar }) => {
    const [allDeletedItems, setAllDeletedItems] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [allStatus, setAllStatus] = useState([]);

    const fetchAllDeletedItems = async () => {
        // Fetch danh sách các danh mục từ API
        try {
            const response = await fetch('http://localhost:5000/alldeleteditems');
            const data = await response.json();
            setAllDeletedItems(data);
        } catch (error) {
            console.error('Error fetching deleted items:', error);
        }
    }

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

    useEffect(() => {
        fetchAllDeletedItems();
        fetchAllProducts();
        fetchAllStatus();
    }, [])

    const restore_order = async (id) => {
        await fetch('http://localhost:5000/restoreorder', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: id })
        }).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Thông báo',
                text: 'Restore success',
                position: 'center',
            });
        })
        await fetchAllDeletedItems();
    }

    const remove_order = async (id) => {
        setItemToDelete(id);
        setShowConfirmation(true);
    }

    const confirmDelete = async () => {
        if (itemToDelete) {
            await fetch('http://localhost:5000/removedeleteditems', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ _id: itemToDelete })
            }).then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Thông báo',
                    text: 'Delete success',
                    position: 'center',
                });
            })
            await fetchAllDeletedItems();
            setItemToDelete(null);
            setShowConfirmation(false);
        }
    }

    const cancelDelete = () => {
        setItemToDelete(null);
        setShowConfirmation(false);
    }

    const getStatusName = (statusId) => {
        const status = allStatus.find(status => status._id === statusId)
        return status ? status.name : ''
    }

    const filteredOrders = allDeletedItems.filter(item => item.type === 'order')
    
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-full' : 'w-[90%]'} transition-all duration-1000 h-[680px] rounded-md py-4 px-8 overflow-y-auto`}>
                        <div>
                            <div className="flex items-center justify-between gap-4 pb-8">
                                <h2 className="font-semibold text-2xl">All Order List (Deleted)</h2>
                                <div className="flex items-center gap-6">
                                    <Link to={'/listorder'} className="btn-primary rounded-md px-4">
                                        <div className='flex items-center gap-2'>
                                            <RiArrowGoBackLine />
                                            Back to list
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <div className="space-y-6">
                                    {filteredOrders.map(order => (
                                        <div key={order.data._id} className="border-primary border-2 p-4 rounded-sm">
                                            <div className="grid grid-cols-[0.6fr_2fr_1fr_1fr_1fr_1fr] gap-4">
                                                <div>
                                                    <img src={Box} alt="" className="w-14" />
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        {order.data.productData.map((item, index) => (
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
                                                        {order.data.deliveryData.map((item, index) => (
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
                                                    <p>Items: {order.data.quantity}</p>
                                                </div>
                                                <div className="grid place-items-center">
                                                    <p>${order.data.total.toFixed(2)}</p>
                                                </div>
                                                <div className="grid place-items-center">
                                                    <p className="border-[1px] px-4 py-2 rounded-sm">{getStatusName(order.data.status)}</p>
                                                </div>
                                                    <div className="grid place-items-center">
                                                        <div className="w-[100px] border-primary border-2 py-2 justify-center rounded-md flex items-center cursor-pointer hover:bg-primary hover:text-white duration-300" onClick={() => {restore_order(order.data._id)}}>
                                                            <div className="flex items-center gap-1">
                                                                Restore
                                                                <LiaTrashRestoreAltSolid />
                                                            </div>
                                                        </div>
                                                        <div className="w-[100px] py-2 justify-center rounded-md flex items-center cursor-pointer bg-red-300 hover:bg-red-400 text-white duration-300" onClick={() => {remove_order(order._id)}}>
                                                            <div className="flex items-center gap-1">
                                                                Delete
                                                                <RiDeleteBinLine />
                                                            </div>
                                                        </div>
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
                    <div className="bg-white p-8 rounded-md">
                        <p className="text-lg">Are you sure you want to delete this order permanently?</p>
                        <div className="flex justify-end mt-4">
                            <button className="btn-primary mr-4" onClick={confirmDelete}>Yes</button>
                            <button className="btn-primary" onClick={cancelDelete}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default RestoreOrder