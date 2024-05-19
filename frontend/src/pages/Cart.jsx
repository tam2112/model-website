import { useEffect } from 'react';
import CartItems from '../components/CartItems/CartItems';

const Cart = () => {
    useEffect(() => {
        window.document.title = 'Cart Page'
    }, [])
    
    return (
        <>
            <div>
                <CartItems />
            </div>
        </>
    );
};

export default Cart;
