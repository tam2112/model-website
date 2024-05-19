import { useContext, useEffect, useMemo } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import Item from '../Item/Item';

const RelatedProducts = (props) => {
    const { all_product } = useContext(ShopContext);

    const relatedProducts = useMemo(() => {
        const filteredProducts = all_product.filter(
            (product) => product.category === props.currentCategory && product.id !== props.currentProductId,
        );
        const randomProducts = filteredProducts.sort(() => 0.5 - Math.random()).slice(0, 4);

        return randomProducts;
    }, [all_product, props.currentCategory, props.currentProductId]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [props.currentCategory]);

    return (
        <>
            <div className="lg:px-28 px-0">
                <div className="container">
                    <div className="pb-10">
                        <h1 className="lg:text-5xl sm:text-4xl text-3xl text-center font-semibold">Related Product</h1>
                    </div>
                    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                        {relatedProducts.map((item, index) => (
                            <Item
                                key={index}
                                id={item.id}
                                name={item.name}
                                image={item.main_img}
                                price={item.price}
                                className={'hover:scale-95 duration-300'}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RelatedProducts;
