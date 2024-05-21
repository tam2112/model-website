import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ShopContext } from '../Context/ShopContext';
import Item from '../components/Item/Item';

const ShopCategory = (props) => {
    const { t, i18n } = useTranslation()

    const { all_product } = useContext(ShopContext);
    const [visibleProducts, setVisibleProducts] = useState(10);

    useEffect(() => {
        window.document.title = i18n.language === 'en' ? `${t(props.title)} ${t('clothing')}` : `${t('clothing')} ${t(props.title)}`
    }, [props.categoryId])

    useEffect(() => {
        const filteredProducts = all_product.filter((item) => item.category === props.categoryId);

        setVisibleProducts(filteredProducts.length > 10 ? 10 : filteredProducts.length);
    }, [props.categoryId, all_product]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [props.categoryId]);

    const loadMoreProducts = () => {
        setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + 10);
    };

    const filteredProducts = all_product.filter((item) => item.category === props.categoryId);

    return (
        <>
            <div className="pt-20">
                <div className="container">
                    <div className="py-10">
                        <h1 className="capitalize font-marcellus font-bold lg:text-6xl sm:text-5xl text-4xl text-center">
                            {i18n.language === 'en' ? `${t(props.title)} ${t('clothing')}` : `${t('clothing')} ${t(props.title)}`}
                        </h1>
                    </div>
                    <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-4">
                        {filteredProducts.slice(0, visibleProducts).map((item, index) => {
                            return (
                                <Item
                                    key={index}
                                    id={item.id}
                                    name={item.name}
                                    image={item.main_img}
                                    price={item.price}
                                    className={'hover:scale-95 duration-300'}
                                />
                            );
                        })}
                    </div>

                    {visibleProducts < filteredProducts.length && (
                        <div className="pt-12 text-center">
                            <button className="btn-primary" onClick={loadMoreProducts}>
                                {t('show')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ShopCategory;
