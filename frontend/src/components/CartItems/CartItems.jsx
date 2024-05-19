import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import CartItem from '../CartItem/CartItem';
import { Link } from 'react-router-dom'

const CartItems = () => {
    const { all_product, cartItems, getTotalCartAmount } = useContext(ShopContext);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className="py-20">
                <div className="container">
                    <div className="lg:mx-28 mx-0">
                        {/* Cart items (Tablet + PC) */}
                        <div className="sm:block hidden">
                            <div className="py-14 text-center pb-16">
                                <h1 className="font-semibold lg:text-5xl sm:text-4xl text-3xl" data-aos='fade-up'>Shopping Cart</h1>
                            </div>
                            <div className="sm:grid lg:grid-cols-[0.7fr_2fr_1fr_1fr_1fr_1fr_0.2fr] sm:grid-cols-[0.7fr_1.5fr_1fr_1fr_1fr_1fr_0.2fr] hidden" data-aos='zoom-in'>
                                <p>Products</p>
                                <p>Title</p>
                                <p>Price</p>
                                <p>Size</p>
                                <p>Quantity</p>
                                <p>Total</p>
                                <p>Select</p>
                            </div>
                            <hr className="my-4 sm:block hidden" />
                            <div>
                                {Object.keys(cartItems).map((productId) => {
                                    const product = all_product.find((p) => p.id === parseInt(productId));
                                    const { quantity, size } = cartItems[productId];

                                    if (product && quantity > 0) {
                                        return (
                                            <div key={productId} data-aos='fade-up'>
                                                <CartItem product={product} quantity={quantity} size={size} />
                                                <hr className="my-4" />
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>

                        {/* Cart items (Mobile) */}
                        <div className="sm:hidden">
                            <div className="py-14 text-center pb-16">
                                <h1 className="font-semibold text-3xl" data-aos='fade-up'>Shopping Cart</h1>
                            </div>
                            <div>
                                {Object.keys(cartItems).map((productId) => {
                                    const product = all_product.find((p) => p.id === parseInt(productId));
                                    const { quantity, size } = cartItems[productId];

                                    if (product && quantity > 0) {
                                        return (
                                            <div key={productId} data-aos='fade-up'>
                                                <CartItem product={product} quantity={quantity} size={size} />
                                                <hr className="my-4" />
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>

                        {/* Cart total */}
                        <div className="mt-14 grid sm:grid-cols-2 grid-cols-1 lg:gap-32 gap-16">
                            {/* Cart total */}
                            <div className="space-y-8">
                                <h1 className="sm:text-4xl text-3xl font-semibold" data-aos='fade-up'>Cart Totals</h1>
                                <div data-aos='zoom-in'>
                                    <div className="flex justify-between items-center">
                                        <p>Subtotal</p>
                                        <p>${getTotalCartAmount()}</p>
                                    </div>
                                    <hr className="my-[10px]" />
                                    <div className="flex justify-between items-center">
                                        <p>Shipping Free</p>
                                        <p>Free</p>
                                    </div>
                                    <hr className="my-[10px]" />
                                    <div className="flex justify-between items-center font-semibold">
                                        <p>Total</p>
                                        <p>${getTotalCartAmount()}</p>
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <Link to='/order'>
                                        <button className="btn-primary" data-aos='fade-up'>PROCEED TO CHECKOUT</button>
                                    </Link>
                                </div>
                            </div>

                            {/* Promo code */}
                            <div className="grid place-items-center" data-aos='zoom-in'>
                                <div className="space-y-4">
                                    <p>If you have a promo code, enter it here</p>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            placeholder="promo code"
                                            className="px-2 pl-4 py-2 outline-none bg-gray-200 w-full"
                                        />
                                        <button className="btn-primary bg-primary text-white hover:border-primary/90 hover:bg-primary/90">
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartItems;
