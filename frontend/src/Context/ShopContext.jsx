import { createContext, useEffect, useState } from 'react';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};

    for (let index = 0; index < 300 + 1; index++) {
        cart[index] = 0;
    }

    return cart;
};

const getDefaultWishlist = () => {
    let wishlist = {};

    for (let index = 0; index < 300 + 1; index++) {
        wishlist[index] = 0;
    }

    return wishlist;
};

const ShopContextProvider = (props) => {

    const [all_product, setAll_product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [wishlistItems, setWishlistItems] = useState(getDefaultWishlist());

    useEffect(() => {
        fetch('http://localhost:5000/allproducts')
            .then((res) => res.json())
            .then((data) => {
                // Sort data by date in descending order (newest to oldest)
                data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setAll_product(data);
            });

        if (localStorage.getItem('auth-token')) {
            // Get cart
            fetch('http://localhost:5000/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: '',
            })
            .then((res) => res.json())
            .then((data) => setCartItems(data));

            // Get wishlist
            fetch('http://localhost:5000/getwishlist', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: '',
            })
            .then((res) => res.json())
            .then((data) => setWishlistItems(data));
        }
    }, [])

    // Function to update product sizes quantity
    const updateProductSizesQuantity = (productId, size, quantityChange) => {
        setAll_product(prevProducts => {
            return prevProducts.map(product => {
                if (product.id === productId) {
                    const updatedSizes = product.sizes.map(item => {
                        if (item.size === size) {
                            return {
                                ...item,
                                quantity: item.quantity + quantityChange
                            };
                        }
                        return item;
                    });
                    return {
                        ...product,
                        sizes: updatedSizes
                    };
                }
                return product;
            });
        });
    };

    // Handle cart
    const addToCart = async (itemId, selectedSize, price, quantityChange, callback) => {
        try {
            const response = await fetch('http://localhost:5000/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'itemId': itemId, 'size': selectedSize, 'price': price }),
            });
    
            const data = await response.json();
            
            // Update product sizes quantity
            updateProductSizesQuantity(itemId, selectedSize, quantityChange);

            // Update cart items
            setCartItems(prevCartItems => ({...prevCartItems, [itemId]: { quantity: data.quantity, size: selectedSize } }));
        
            if (callback) {
                callback();
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const removeFromCart = async (itemId, price, selectedSize, quantityChange) => {
        try {
            const response = await fetch('http://localhost:5000/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'itemId': itemId, 'price': price, 'size': selectedSize }),
            });
    
            const data = await response.json();
    
            // Cập nhật state sau khi yêu cầu đã hoàn thành thành công
            if (data && data.quantity >= 0) {
                updateProductSizesQuantity(itemId, selectedSize, quantityChange);
                setCartItems(prevCartItems => {
                    const updatedCartItems = { ...prevCartItems };
                    if (updatedCartItems[itemId]) {
                        updatedCartItems[itemId].quantity = data.quantity;
                        if (updatedCartItems[itemId].quantity === 0) {
                            delete updatedCartItems[itemId];
                        }
                    }
                    return updatedCartItems;
                });
            } else {
                console.error('Error removing from cart: Invalid data received');
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in selectedProducts) {
            const item = selectedProducts[itemId];
            const product = all_product.find((product) => product.id === Number(itemId));
            totalAmount += item.price * item.quantity;
        }

        return totalAmount.toFixed(2);
    };

    const [selectedProducts, setSelectedProducts] = useState({});
    const userId = localStorage.getItem('userId');
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        district: '',
        commune: '',
        country: '',
        city: '',
        province: '',
    });
    
    const addOrder = async (userId, deliveryInfo, products, payment, pay, total, quantity) => {
        try {
            const response = await fetch('http://localhost:5000/addorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                },
                body: JSON.stringify({
                    userId: userId,
                    deliveryInfo: deliveryInfo,
                    products: products,
                    payment: payment,
                    pay: pay,
                    total: total,
                    quantity: quantity,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Optionally, you can perform additional actions here upon successful order creation
                console.log('Order placed successfully');
            } else {
                // Handle error cases
                console.error('Error placing order:', data.message);
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };
    
    

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item].quantity > 0) {
                totalItem += cartItems[item].quantity;
            }
        }

        return totalItem;
    };

    // Handle wishlist
    const addToWishlist = (itemId) => {
        setWishlistItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:5000/addtowishlist', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'itemId': itemId }),
            })
            .then((res) => res.json())
            .then((data) => console.log(data));
        }
    };

    const removeFromWishlist = (itemId) => {
        setWishlistItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:5000/removefromwishlist', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'itemId': itemId }),
            })
            .then((res) => res.json())
            .then((data) => console.log(data));
        }
    };

    const getTotalWishItems = () => {
        let totalItem = 0;
        for (const item in wishlistItems) {
            if (wishlistItems[item] > 0) {
                totalItem += wishlistItems[item];
            }
        }

        return totalItem;
    };

    const contextValue = { selectedProducts, setSelectedProducts, userId, getTotalCartAmount, getTotalCartItems, getTotalWishItems, all_product, cartItems, addToCart, removeFromCart, wishlistItems, setWishlistItems, addToWishlist, removeFromWishlist, addOrder, userInfo, setUserInfo };

    return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
