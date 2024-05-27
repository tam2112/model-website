import { useEffect, useState } from 'react';
import { RiArrowGoBackLine } from "react-icons/ri";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const DetailsProduct = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('details product title')
    }, [i18n.language])

    const { id } = useParams();
    const [product, setProduct] = useState({
        name: '',
        price: '',
        category: '',
        sizes: [],
        main_img: null,
        sub_img: []
    });
    const [allCategories, setAllCategories] = useState([]);
    const [allSizes, setAllSizes] = useState([]);

    const [activeTab, setActiveTab] = useState('info')

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

    useEffect(() => {
        axios.get(`http://localhost:5000/detailsproduct/${id}`)
            .then(response => {
                setProduct(response.data.product);
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
            });
    }, [id]);

    const getCategoryName = (categoryId) => {
        const category = allCategories.find(category => category._id === categoryId);
        return category ? category.name : '';
    }
    
    const getSizeName = (sizeId) => {
        const size = allSizes.find(size => size._id === sizeId)
        return size ? size.name : ''
    }

    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-full' : 'w-[90%]'} transition-all duration-1000 h-[680px] rounded-md py-4 px-8 overflow-y-auto relative`}>
                        <div className='mt-2'>
                            <div className='flex justify-between items-center'>
                                <div className='flex gap-6'>
                                    <button className={`px-6 py-2 border-primary border-2 rounded-md hover:bg-primary hover:text-white duration-300 ${activeTab === 'info' ? 'bg-primary text-white' : 'bg-white text-black'}`} onClick={() => setActiveTab('info')}>{t('product info')}</button>
                                    <button className={`px-6 py-2 border-primary border-2 rounded-md hover:bg-primary hover:text-white duration-300 ${activeTab === 'quantity' ? 'bg-primary text-white' : 'bg-white text-black'}`} onClick={() => setActiveTab('quantity')}>{t('product quantity')}</button>
                                    <button className={`px-6 py-2 border-primary border-2 rounded-md hover:bg-primary hover:text-white duration-300 ${activeTab === 'mainImage' ? 'bg-primary text-white' : 'bg-white text-black'} `} onClick={() => setActiveTab('mainImage')}>{t('product main image')}</button>
                                    <button className={`px-6 py-2 border-primary border-2 rounded-md hover:bg-primary hover:text-white duration-300 ${activeTab === 'subImage' ? 'bg-primary text-white' : 'bg-white text-black'} `} onClick={() => setActiveTab('subImage')}>{t('product sub image')}</button>
                                </div>
                                <Link to={'/listproduct'} className="btn-primary rounded-md px-4">
                                    <div className='flex items-center gap-2'>
                                        <RiArrowGoBackLine />
                                        {t('back to list')}
                                    </div>
                                </Link>
                            </div>
                            <hr className='my-4' />
                            
                            {/* Info */}
                            {activeTab === 'info' && <div className='mt-16'>
                                <div className='grid grid-cols-3 place-items-center'>
                                    <div className='space-y-8 font-semibold col-span-1'>
                                        <h3>{t('product name')}</h3>
                                        <h3>{t('product price')}</h3>
                                        <h3>{t('product category')}</h3>
                                    </div>
                                    <div className='space-y-8 col-span-2'>
                                        <p>{product.name}</p>
                                        <p>${Number(product.price).toFixed(2)}</p>
                                        <p>{getCategoryName(product.category)}</p>
                                    </div>
                                </div>
                            </div>}

                            {/* Quantity */}
                            {activeTab === 'quantity' && <div>
                                {product.sizes.map((item, index) => (
                                    <div key={index} className='mx-52'>
                                        <div className='flex space-y-4 items-center justify-between'>
                                            <h3 className='font-semibold text-lg'>{t('product size')} - {getSizeName(item.size)}</h3>
                                            <button className='border-[1px] border-primary min-w-[60px] py-2 rounded-sm cursor-default'>{item.quantity}</button>
                                        </div>
                                        <hr className='mt-2' />
                                    </div>
                                ))}
                            </div>}

                            {/* Main Image */}
                            {activeTab === 'mainImage' && <div className='mt-6 grid place-items-center'>
                                <img src={product.main_img} alt="" className='w-[70%] h-full object-cover' />
                            </div>}

                            {/* Sub Image */}
                            {activeTab === 'subImage' && <div className='mt-6 grid grid-cols-2 gap-2'>
                                {product.sub_img.map((image, index) => (
                                    <div key={index}>
                                        <img src={image} alt="" className='w-full h-full object-cover' />
                                    </div>
                                ))}
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailsProduct