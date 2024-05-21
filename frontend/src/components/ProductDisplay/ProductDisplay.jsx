import { useContext, useEffect, useState } from 'react';
import { CiHeart } from 'react-icons/ci';
import { IoHeart } from "react-icons/io5";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

import RelatedProducts from '../RelatedProducts/RelatedProducts';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
    const { t, i18n } = useTranslation()

    const { product } = props;
    const [currentCategory, setCurrentCategory] = useState('');
    const [slidesPerView, setSlidesPerView] = useState(2);
    const [isInWishlist, setIsInWishlist] = useState(false);

    const formattedPrice = product.price.toFixed(2);

    const { addToCart, addToWishlist, removeFromWishlist, wishlistItems, setWishlistItems } = useContext(ShopContext);

    useEffect(() => {
        window.document.title = product.name
    }, [])

    useEffect(() => {
        const updateSlidesPerView = () => {
            if (window.innerWidth > 1024) {
                setSlidesPerView(2);
            } else {
                setSlidesPerView(1);
            }
        };

        window.addEventListener('resize', updateSlidesPerView);
        updateSlidesPerView();

        return () => {
            window.removeEventListener('resize', updateSlidesPerView);
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);

        setCurrentCategory(product.category);
    }, [product]);

    const [allCategories, setAllCategories] = useState([]);
    const fetchAllCategories = async () => {
        // Fetch danh sách các danh mục từ API
        try {
            const response = await fetch('http://localhost:5000/allcategories');
            const data = await response.json();
            setAllCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }
    
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

    useEffect(() => {
        fetchAllCategories()
        fetchAllSizes()
    }, [])

    const getCategoryName = (categoryId) => {
        const category = allCategories.find(category => category._id === categoryId);
        return category ? category.name : '';
    }

    const getSizeName = (sizeId) => {
        const size = allSizes.find(size => size._id === sizeId)
        return size ? size.name : '';
    }

    const [sizeActive, setSizeActive] = useState('')

    useEffect(() => {
        if (localStorage.getItem('auth-token')) {
            if (wishlistItems[product.id] === 0) {
                setIsInWishlist(false);
            }
            else if (wishlistItems[product.id] === 1) {
                setIsInWishlist(true)
            }
        }
    }, [wishlistItems[product.id], product.id]);

    const [selectedSize, setSelectedSize] = useState('');

    const handleAddToCart = () => {
        if (!localStorage.getItem('auth-token')) {
            // Sử dụng react-toastify để hiển thị thông báo
            toast.error(t('log in first'), {
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

        if (!selectedSize) {
            toast.error(t('need select size'), {
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

        const selectedSizeObj = product.sizes.find(item => item.size === selectedSize);

        if (selectedSizeObj && selectedSizeObj.quantity === 0) {
            // Hiển thị thông báo khi size đã hết hàng
            toast.error(t('out of stock size'), {
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

        // Nếu có token và đã chọn kích thước, thực hiện thêm vào giỏ hàng
        toast.success(t('add to cart successfully'), {
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

        addToCart(product.id, selectedSize, product.price, -1);
    };

    const handleAddToWishlist = () => {
        if (!localStorage.getItem('auth-token')) {
            // Hiển thị thông báo yêu cầu đăng nhập
            toast.error(t('log in first'), {
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
    
        if (isInWishlist) {
            // Nếu sản phẩm đã có trong wishlist, xóa nó khỏi wishlist và đổi icon
            removeFromWishlist(product.id);
            setIsInWishlist(false);
    
            // Update the wishlistItems state
            const updatedWishlistItems = { ...wishlistItems };
            delete updatedWishlistItems[product.id];
            setWishlistItems(updatedWishlistItems);
    
            toast.success(t('removed from wishlist'), {
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
        } else {
            // Nếu sản phẩm chưa có trong wishlist, thêm nó vào wishlist và đổi icon
            addToWishlist(product.id);
            setIsInWishlist(true);
    
            // Update the wishlistItems state
            const updatedWishlistItems = { ...wishlistItems };
            updatedWishlistItems[product.id] = 1;
            setWishlistItems(updatedWishlistItems);
    
            toast.success(t('added to wishlist'), {
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
        }
    };

    return (
        <>
            <div className="py-20">
                <div className="container">
                    <div className="sm:grid sm:grid-cols-3 flex flex-col gap-8">
                        {/* img */}
                        <div className="col-span-2" data-aos='zoom-in'>
                            <Swiper
                                slidesPerView={slidesPerView}
                                spaceBetween={20}
                                autoplay={{
                                    delay: 2500,
                                    pauseOnMouseEnter: true,
                                }}
                                modules={[Autoplay]}
                                className="mySwiper"
                            >
                                <SwiperSlide>
                                    <div>
                                        <img src={product.main_img} alt="" className="w-[500px] h-[700px] object-cover" />
                                    </div>
                                </SwiperSlide>
                                {product.sub_img.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <div>
                                            <img src={item} alt="" className="w-[500px] h-[700px] object-cover" />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        {/* text content */}
                        <div className="col-span-1 sm:my-10 my-0" data-aos='fade-up'>
                            <div className="flex lg:flex-row flex-col justify-between lg:items-center items-start lg:space-y-0 space-y-2">
                                <h1 className="font-semibold text-xl uppercase">{product.name}</h1>
                                {isInWishlist ? (
                                    <IoHeart size={30} onClick={handleAddToWishlist} className='cursor-pointer' />
                                ) : (
                                    <CiHeart size={30} onClick={handleAddToWishlist} className='cursor-pointer' />
                                )}
                            </div>
                            <p className="text-xl mt-1">${formattedPrice}</p>
                            <p className="mt-1">{t('category')}: {t(getCategoryName(product.category))}</p>
                            <div className="mt-10">
                                <p className="mb-4">{t('select size')}</p>
                                <div className="flex flex-wrap gap-4">
                                    {product.sizes.map((item, index) => (
                                        <div key={index} className=''>
                                            <div className=''>
                                                <button 
                                                    className={`${sizeActive === getSizeName(item.size) ? 'bg-primary text-white' : ''} border-[1px] border-primary hover:bg-primary hover:text-white px-4 py-1 duration-300`} 
                                                    onClick={() => {
                                                        setSizeActive(getSizeName(item.size));
                                                        setSelectedSize(item.size); // Cập nhật kích thước được chọn
                                                    }}
                                                >
                                                    {getSizeName(item.size)}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex">
                                    {product.sizes.map((item, index) => (
                                        <div key={index} className=''>
                                            {sizeActive === getSizeName(item.size) && <div className='flex justify-center mt-4'>
                                                {item.quantity > 0 ? 
                                                    <p className='text-green-700'>
                                                        {i18n.language === 'en' ? 
                                                            `${t('yay in stock')} | ${t('only')} ${item.quantity} ${t('left')}` 
                                                            : 
                                                            `${t('yay in stock')} | ${t('only')} ${t('left')} ${item.quantity}`
                                                        }
                                                    </p> : 
                                                    <p className='text-red-700'>{t('oops out of stock')}</p>}
                                            </div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-8">
                                <button onClick={handleAddToCart} className="btn-primary uppercase w-full">
                                    {t('add to cart')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related product */}
            <div className="sm:py-20 py-8">
                <RelatedProducts currentCategory={currentCategory} currentProductId={product.id} />
            </div>
        </>
    );
};

export default ProductDisplay;
