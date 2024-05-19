import { useContext, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { ShopContext } from '../../Context/ShopContext';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

const CartItem = ({ product, quantity, size }) => {

    const { selectedProducts, setSelectedProducts, userId, addToCart, removeFromCart } = useContext(ShopContext)

    const [allSizes, setAllSizes] = useState([])
    const fetchAllSizes = async () => {
        // Fetch danh sách các danh mục từ API
        try {
            const response = await fetch('http://localhost:5000/allsizes');
            const data = await response.json();
            setAllSizes(data);
        } catch (error) {
            console.error('Error fetching sizes:', error);
        }
    }

    const getSizeName = (sizeId) => {
        const size = allSizes.find(size => size._id === sizeId)
        return size ? size.name : '';
    }

    useEffect(() => {
        fetchAllSizes()
    }, [])

    const handleAddToCart = async () => {
        // Kiểm tra xem số lượng của kích thước sản phẩm có lớn hơn 0 không
        const sizeQuantity = product.sizes.find(sizeObj => sizeObj.size === size)?.quantity || 0;
        if (sizeQuantity > 0) {
            // Nếu số lượng lớn hơn 0, thêm vào giỏ hàng
            await addToCart(product.id, size, product.price, -1);
        } else {
            // Hiển thị thông báo khi size đã hết hàng
            toast.error("Size này đã hết hàng", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: {marginTop: '40px'},
                theme: 'colored'
            });
            return;
        }
    };

    console.log(selectedProducts);
    console.log(Object.keys(selectedProducts).length);
    
    const [showConfirmation, setShowConfirmation] = useState(false);

    const showConfirmationModal = () => {
        setShowConfirmation(true);
    };
    
    const hideConfirmationModal = () => {
        setShowConfirmation(false);
    };

    const handleRemoveFromCart = async () => {
        if (quantity === 1) {
            showConfirmationModal();
        } else {
            await removeFromCart(product.id, product.price, size, 1);
        }
    };

    const confirmDelete = async () => {
        await removeFromCart(product.id, product.price, size, 1);
        hideConfirmationModal();
    };
    
    const cancelDelete = () => {
        hideConfirmationModal();
    };   
    

    return (
        <>
            <div className='sm:block hidden'>
                <div className="flex items-center lg:space-x-6 sm:space-x-4">
                    <div>
                        <img src={product.main_img} alt="" className="w-28" />
                    </div>
                    <p className="lg:w-[320px] w-[225px] truncate">{product.name}</p>
                    <p className="w-[162px]">${product.price.toFixed(2)}</p>
                    <p className="w-[140px]">
                        {getSizeName(size)}
                    </p>
                    <div className="w-[166px] select-none">
                        <div className="flex items-center space-x-1">
                            <div className='cursor-pointer p-2 active:bg-third text-center border-third' onClick={handleRemoveFromCart}>
                                <AiOutlineMinus size={16} />
                            </div>
                            <button className="px-3 py-1 border-third border-[1px]">{quantity}</button>
                            <div 
                                className='cursor-pointer p-2 active:bg-third text-center border-third' 
                                onClick={() => {
                                    handleAddToCart();
                                }}>
                                <AiOutlinePlus size={16} />
                            </div>
                        </div>
                    </div>
                    <p className="w-[166px]">${(product.price * quantity).toFixed(2)}</p>
                    <div className='inline-block'>
                        <input
                            type="checkbox"
                            name="check"
                            id="check"
                            className='cursor-pointer w-6 h-6'
                            checked={selectedProducts[product.id] ? true : false}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedProducts((prevSelectedCartItems) => ({
                                        ...prevSelectedCartItems,
                                        [product.id]: { size, price: product.price, quantity },
                                    }));
                                } else {
                                    delete setSelectedProducts[product.id];
                                    setSelectedProducts({ ...setSelectedProducts });
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className='sm:hidden'>
                <div className="flex gap-4 space-y-2">
                    <div>
                        <img src={product.main_img} alt="" className="w-24" />
                    </div>
                    <div className="space-y-8">
                        <div className="space-y-1">
                            <p className="font-semibold max-w-[204px] truncate">
                                {product.name}
                            </p>
                            <p>${product.price}</p>
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <div className="p-2 border-third border-[1px]">
                                    <AiOutlineMinus
                                        size={16}
                                        className="cursor-pointer"
                                        onClick={() => handleRemoveFromCart()}
                                    />
                                </div>
                                <button className="px-3 py-1 border-third border-[1px]">
                                    {quantity}
                                </button>
                                <div className="p-2 border-third border-[1px]">
                                    <AiOutlinePlus
                                        size={16}
                                        className="cursor-pointer"
                                        onClick={() => handleAddToCart()}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-white sm:p-8 p-4 sm:rounded-md rounded-sm w-[70%] sm:w-[100%]">
                        <p className="sm:text-lg text-sm">Are you sure you want to remove this product from your cart?</p>
                        <div className="flex justify-end mt-4">
                            <button className="btn-primary mr-4 sm:py-2 sm:px-10 py-2 px-8 text-sm" onClick={confirmDelete}>Yes</button>
                            <button className="btn-primary sm:py-2 sm:px-10 py-2 px-8 text-sm" onClick={cancelDelete}>No</button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default CartItem;
