import { useEffect } from 'react';
import { useTranslation } from 'react-i18next'

import CartItems from '../components/CartItems/CartItems';

const Cart = () => {
    const { t, i18n } = useTranslation()

    useEffect(() => {
        window.document.title = i18n.language === 'en' ? `${t('cart')} Page` : t('cart')
    }, [i18n.language])
    
    return (
        <>
            <div>
                <CartItems />
            </div>
        </>
    );
};

export default Cart;
