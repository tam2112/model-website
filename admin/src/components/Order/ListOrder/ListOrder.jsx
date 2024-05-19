import { Link } from "react-router-dom"
import { TbListDetails } from "react-icons/tb";
import { useEffect, useState } from "react";
import Box from '../../../assets/box.png'
import OrderItem from './OrderItem'
import Swal from "sweetalert2";

const ListOrder = ({ showSidebar }) => {
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
    
    const [selectedStatus, setSelectedStatus] = useState('')
    
    const handleSortChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const filteredOrders = selectedStatus ? allOrders.filter((order) => order.status === selectedStatus) : allOrders;
    
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-full' : 'w-[90%]'} transition-all duration-1000 h-[680px] rounded-md py-4 px-8 overflow-y-auto`}>
                        <div>
                            <div className="flex items-center justify-between gap-4 pb-8 mt-4">
                                <h2 className="font-semibold text-2xl">All Orders List</h2>
                                <div className="flex items-center gap-4">
                                    <p>Sort by:</p>
                                    <select value={selectedStatus} onChange={handleSortChange} className="border-[1px] border-primary min-w-[160px] px-2 py-1">
                                        <option value="">All Status</option>
                                        {allStatus.map(status => (
                                            <option key={status._id} value={status._id}>{status.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
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
                                                                <p>Address: {item.address}</p>
                                                                <p>City: {item.city}</p>
                                                                <p>Phone: {item.phone}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="grid place-items-center">
                                                    <p>Items: {order.quantity}</p>
                                                </div>
                                                <div className="grid place-items-center">
                                                    <p>${order.total.toFixed(2)}</p>
                                                </div>
                                                <div className="grid place-items-center">
                                                    <select 
                                                        value={order.status} 
                                                        name="status"
                                                        className="border-[1px] border-primary px-2 py-1"
                                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                    >
                                                        {allStatus.map(status => (
                                                            <option key={status._id} value={status._id}>{status.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                    <div className="grid place-items-center">
                                                        <Link to={`/detailsorder/${order._id}`} className="w-[100px] border-primary border-2 py-2 justify-center rounded-md flex items-center cursor-pointer hover:bg-primary hover:text-white duration-300">
                                                            <div className="flex items-center gap-1">
                                                                Details
                                                                <TbListDetails />
                                                            </div>
                                                        </Link>
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
        </>
    )
}

export default ListOrder