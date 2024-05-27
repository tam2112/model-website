import { Link } from "react-router-dom"
import { TbListDetails } from "react-icons/tb";
import { useEffect, useState } from "react";
import Box from '../../../assets/box.png'
import OrderItem from './OrderItem'
import Swal from "sweetalert2";
import { RiDeleteBinLine } from "react-icons/ri";
import { useTranslation } from 'react-i18next'

const ListOrder = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('list order title')
    }, [i18n.language])

    const [allOrders, setAllOrders] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [allStatus, setAllStatus] = useState([]);

    const fetchInfo = async () => {
        await fetch('http://localhost:5000/allorders')
        .then((res) => res.json())
        .then((data) => {
            // Sort data by date in descending order (newest to oldest)
            data.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Lấy trạng thái đã lưu từ localStorage và cập nhật cho mỗi đơn hàng
            data.forEach(order => {
                const storedStatus = localStorage.getItem(`order_status_${order._id}`);
                if (storedStatus) {
                    order.status = storedStatus;
                }
            });

            setAllOrders(data);
        });
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
        fetchInfo();
        fetchAllProducts();
        fetchAllStatus();
    }, [])

    const handleStatusChange = async (orderId, newStatusId) => {
        try {
            const response = await fetch(`http://localhost:5000/updateorderstatus/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatusId }), // Update the status field
            });
      
            if (!response.ok) {
                throw new Error('Failed to update order status');
            }
      
            // Update the local state
            setAllOrders((prevOrders) =>
                prevOrders.map((order) =>
                order._id === orderId? {...order, status: newStatusId } : order
                )
            );
        } catch (error) {
          console.error('Error updating order status:', error);
        }
    };

    const remove_order = async (id) => {
        await fetch('http://localhost:5000/removeorder', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ _id: id })
        }).then(() => {
            Swal.fire({
                icon: 'success',
                title: t('title swal'),
                text: t('delete success'),
                position: 'center',
            });
        })
        await fetchInfo();
    }

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

    const getStatusName = (statusId) => {
        const status = allStatus.find(status => status._id === statusId)
        return status ? status.name : ''
    }
    
    const [selectedStatus, setSelectedStatus] = useState('')
    
    const handleSortChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const filteredOrders = selectedStatus ? allOrders.filter((order) => order.status === selectedStatus) : allOrders;

    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-full' : 'w-[90%]'} transition-all duration-1000 h-[680px] rounded-md px-8 pb-4 overflow-y-auto`}>
                        <div>
                            <div className="fixed w-[1102px] bg-white z-10 py-4">
                                <div className="flex items-center justify-between gap-4 mt-4">
                                    <h2 className="font-semibold text-2xl">{t('all order list')}</h2>
                                    <div className="flex items-center gap-4">
                                        <p>{t('sort by')}</p>
                                        <select value={selectedStatus} onChange={handleSortChange} className="border-[1px] border-primary min-w-[160px] px-2 py-1">
                                            <option value="">{t('all status')}</option>
                                            {allStatus.map(status => (
                                                <option key={status._id} value={status._id}>{t(status.name)}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-28">
                                <div className="space-y-6">
                                    {filteredOrders.map(order => (
                                        <div key={order._id} className="border-primary border-2 p-4 rounded-sm">
                                            <div className="grid grid-cols-[0.6fr_2fr_1fr_1fr_1fr_1fr] gap-4">
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
                                                                <p>{t('order address')}: {item.address}</p>
                                                                <p>{t('order city')}: {item.city}</p>
                                                                <p>{t('order phone')}: {item.phone}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="grid place-items-center">
                                                    <p>{t('order items')}: {order.quantity}</p>
                                                </div>
                                                <div className="grid place-items-center">
                                                    <p>${order.total.toFixed(2)}</p>
                                                </div>
                                                <div className="grid place-items-center">
                                                    {getStatusName(order.status) !== 'Cancelled' && <select 
                                                        value={order.status} 
                                                        name="status"
                                                        className="border-[1px] border-primary px-2 py-1 rounded-sm disabled:cursor-not-allowed"
                                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                        disabled={getStatusName(order.status) === 'Cancelled'}
                                                    >
                                                        {allStatus
                                                            .filter(status => status.name !== 'Cancelled')
                                                            .map(status => (
                                                                <option key={status._id} value={status._id}>{t(status.name)}</option>
                                                        ))}
                                                    </select>}
                                                    {getStatusName(order.status) === 'Cancelled' && <p className="border-[1px] border-red-500 text-white bg-red-500 px-4 py-2 rounded-md">{t(getStatusName(order.status))}</p>}
                                                </div>
                                                    <div className="grid place-items-center">
                                                        <Link to={`/detailsorder/${order._id}`} className="w-[100px] border-primary border-2 py-2 justify-center rounded-md flex items-center cursor-pointer hover:bg-primary hover:text-white duration-300">
                                                            <div className="flex items-center gap-1">
                                                                {t('details')}
                                                                <TbListDetails />
                                                            </div>
                                                        </Link>
                                                        {getStatusName(order.status) === 'Cancelled' || getStatusName(order.status) === 'Delivered' && <div className="w-[100px] py-2 justify-center rounded-md flex items-center cursor-pointer bg-red-300 hover:bg-red-400 text-white duration-300" onClick={() => openConfirmation(order._id)}>
                                                            <div className="flex items-center gap-1">
                                                                {t('delete')}
                                                                <RiDeleteBinLine />
                                                            </div>
                                                        </div>}
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
                        <p className="sm:text-lg text-sm">{t('are you sure you want to delete this order')}</p>
                        <div className="flex justify-end mt-4">
                            <button className="btn-primary mr-4 sm:py-2 sm:px-10 py-2 px-8 text-sm" onClick={confirmDelete}>{t('yes')}</button>
                            <button className="btn-primary sm:py-2 sm:px-10 py-2 px-8 text-sm" onClick={cancelDelete}>{t('no')}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ListOrder