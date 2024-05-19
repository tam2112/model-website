import { useContext, useEffect } from "react";
import Item from "../Item/Item";
import { ShopContext } from "../../Context/ShopContext";

const WishlistItems = () => {
    const { all_product, wishlistItems } = useContext(ShopContext);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className="pt-20">
                <div className="container">
                    <div className="pt-10">
                        <h1 className="font-marcellus font-bold lg:text-6xl sm:text-5xl text-4xl text-center">
                            Favorite products
                        </h1>
                        <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-4">
                            {all_product.map((item, index) => {
                                if (wishlistItems[item.id] > 0) {
                                    return (
                                        <Item
                                            key={index}
                                            id={item.id}
                                            name={item.name}
                                            image={item.main_img}
                                            price={item.price}
                                            className={'hover:scale-95 duration-300 mt-10'}
                                        />
                                    );
                                }
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WishlistItems