import { useEffect, useState } from 'react';
import { RiArrowGoBackLine } from "react-icons/ri";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import upload_area from '../../../assets/upload_area.svg'

const UpdateProduct = ({ showSidebar }) => {
    const { id } = useParams();
    const [product, setProduct] = useState({
        name: '',
        price: '',
        category: '',
        sizes: [],
        main_img: null,
        sub_img: []
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/detailsproduct/${id}`)
            .then(response => {
                setProduct(response.data.product);
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
            });
    }, [id]);

    // State để lưu trữ danh sách category
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([])

    useEffect(() => {
        fetchCategories();
        fetchSizes();
    }, []);

    // Function để fetch danh sách category từ API
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:5000/allcategories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSizes = async () => {
        try {
            const response = await fetch('http://localhost:5000/allsizes');
            const data = await response.json();
            setSizes(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const getSizeName = (sizeId) => {
        const size = sizes.find(size => size._id === sizeId)
        return size ? size.name : ''
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const handleQuantityChange = (e, sizeId) => {
        const { value } = e.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            sizes: prevProduct.sizes.map(item => {
                if (item.size === sizeId) {
                    return { ...item, quantity: parseInt(value) }; // Chuyển đổi value thành số nguyên
                }
                return item;
            })
        }));
    };

    const handleMainImageChange = (e) => {
        setProduct(prevProduct => ({
            ...prevProduct,
            main_img: e.target.files[0]
        }));
    };

    const handleSubImagesChange = (e) => {
        const files = e.target.files;
        setProduct(prevProduct => ({
            ...prevProduct,
            sub_img: Array.from(files)
        }));
    };

    const updateProductWithImages = async () => {
        let formData = new FormData();

        // Thêm ảnh chính vào FormData
        if (product.main_img instanceof File) {
            formData.append('product', product.main_img);
        } else {
            formData.append('product', product.main_img || '');
        }

        // Thêm các ảnh phụ vào FormData
        product.sub_img.forEach(image => {
            if (image instanceof File) {
                formData.append('product', image);
            } else {
                formData.append('product', image || '');
            }
        });

        try {
            const uploadResponse = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });
            const uploadData = await uploadResponse.json();
            if (uploadData.success) {
                // Nếu upload ảnh thành công, nhận URL mới và cập nhật thông tin sản phẩm
                const updatedProduct = {
                    ...product,
                    main_img: product.main_img instanceof File ? uploadData.image_urls[0] : product.main_img,
                    sub_img: uploadData.image_urls.length > 0 ? uploadData.image_urls.slice(1) : product.sub_img,
                };
                await axios.put(`http://localhost:5000/updateproduct/${id}`, updatedProduct);
                Swal.fire({
                    icon: 'success',
                    title: 'Thông báo',
                    text: 'Product updated successfully',
                    position: 'center',
                })
                setProduct(updatedProduct);
            } else {
                // Xử lý khi upload ảnh không thành công
                console.log('Failed to upload images');
            }
        } catch (error) {
            console.error('Error:', error);
            console.log("Failed to update product");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProductWithImages();
    };

    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-[70%]' : 'w-[60%]'} transition-all duration-1000 h-[680px] rounded-md py-4 px-8 overflow-y-auto relative`}>
                        <div className="space-y-6 mt-4">
                            <form onSubmit={handleSubmit} className='space-y-6'>
                                <div className="space-y-2">
                                    <p>Product Name</p>
                                    <input value={product.name} onChange={handleInputChange} type="text" name="name" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                </div>
                                <div className="space-y-2">
                                    <p>Price</p>
                                    <input value={product.price} onChange={handleInputChange} type="text" name="price" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                </div>
                                <div className="space-y-2">
                                    <p>Category</p>
                                    <select value={product.category} onChange={handleInputChange} name="category" className='w-[50%] px-2 py-1 border-[1px] border-primary'>
                                        <option value="">-- Select Category --</option>
                                        {categories.map(category => (
                                            <option key={category._id} value={category._id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <p>Quantity</p>
                                    {product.sizes.map((item, index) => (
                                        <div key={index} className='flex gap-4 items-center'>
                                            <label htmlFor="" className='w-28 h-[40px] text-center leading-[40px] bg-third'>
                                                {getSizeName(item.size)}
                                            </label>
                                            <input type="number" value={item.quantity} className='border-[1px] border-primary w-[327px] px-2 py-2' onChange={(e) => handleQuantityChange(e, item.size)} />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-14">
                                    <div>
                                        <p className='mb-4'>Main Image</p>
                                        <label htmlFor="file-input-main">
                                            <img src={product.main_img || upload_area} alt="" className='w-28 h-[164px] object-cover' />
                                        </label>
                                        <input onChange={handleMainImageChange} type="file" name="main_img" id="file-input-main" hidden />
                                    </div>
                                    <div>
                                        <p className='mb-4'>Sub Image</p>
                                        <div className='flex gap-4 items-center'>
                                            <label htmlFor="file-input-sub">
                                                <div className='flex items-center gap-4'>
                                                    {product.sub_img.length > 0 ? (
                                                        product.sub_img.map((image, index) => (
                                                            <img key={index} src={image} alt="" className='w-28 h-[164px] object-cover' />
                                                        ))
                                                    ) : (
                                                        <img src={upload_area} alt="" className='w-28 h-[164px] object-cover' />
                                                    )}
                                                </div>
                                            </label>
                                            <input onChange={handleSubImagesChange} type="file" name="sub_img" id="file-input-sub" multiple hidden />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className='btn-primary'>SAVE</button>
                            </form>
                        </div>
                        <div className='absolute top-6 right-6 flex'>
                            <Link to={'/listproduct'} className="btn-primary rounded-md px-4">
                                <div className='flex items-center gap-2'>
                                    <RiArrowGoBackLine />
                                    Back to list
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateProduct;