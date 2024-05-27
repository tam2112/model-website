import { useEffect, useState } from 'react'
import upload_area from '../../../assets/upload_area.svg'
import { Link } from 'react-router-dom'
import { RiArrowGoBackLine } from "react-icons/ri";
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next'

const AddProduct = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('add product title')
    }, [i18n.language])

    const [mainImage, setMainImage] = useState(false)
    const [subImages, setSubImages] = useState([])
    const [productDetails, setProductDetails] = useState({
        name: '',
        price: '',
        category: '',
        main_img: '',
        sub_img: [],
        sizes: {
            size: '',
            quantity: 0
        },
    })

    // State để lưu trữ thông tin về lỗi cho mỗi trường
    const [errors, setErrors] = useState({
        name: '',
        price: '',
        mainImage: '',
    });

    // State để lưu trữ danh sách category
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([])

    useEffect(() => {
        // Fetch danh sách category từ API khi component được render
        fetchCategories();
        fetchSizes()
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

    const [selectedCategory, setSelectedCategory] = useState('');
    const [filteredSizes, setFilteredSizes] = useState([]);

    const handleSizeChange = (sizeName) => {
        const filterSize = sizes.filter(item => item.type === sizeName)

        return filterSize;
    }

    const getCategoryName = (categoryId) => {
        const category = categories.find(category => category._id === categoryId);
        return category ? category.name : '';
    }

    useEffect(() => {
        if (selectedCategory !== '') {
            const typeSizes = handleSizeChange(getCategoryName(selectedCategory));
            setFilteredSizes(typeSizes);
        }
        else {
            setFilteredSizes([]);
        }

        console.log(selectedCategory);
    }, [selectedCategory, sizes]);

    // Thay đổi danh mục được chọn
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setProductDetails({...productDetails, category: e.target.value});
    };

    const mainImageHandler = (e) => {
        setMainImage(e.target.files[0])
    }

    const subImageHandler = (e) => {
        const files = e.target.files;
        const selectedImages = Array.from(files);

        setSubImages(selectedImages)
    }

    const changeHandler = (e) => {
        setProductDetails({...productDetails, [e.target.name]: e.target.value})

        // Kiểm tra và cập nhật trạng thái lỗi
        if (e.target.name === 'name') {
            setErrors({...errors, name: e.target.value.trim() ? '' : t('product name cannot be blank')});
        } else if (e.target.name === 'price') {
            setErrors({...errors, price: e.target.value.trim() ? '' : t('product price cannot be blank')});
        }
    }

    const Add_Product = async () => {
        // Kiểm tra trạng thái lỗi trước khi gửi yêu cầu
        if (!productDetails.name.trim()) {
            setErrors({...errors, name: t('product name cannot be blank')});
            return;
        }
        if (!productDetails.price.trim()) {
            setErrors({...errors, price: t('product price cannot be blank')});
            return;
        }
        if (!mainImage) {
            setErrors({...errors, mainImage: t('please select main image for product')});
            return;
        }
    
        // Xây dựng danh sách các size với số lượng tương ứng
        const sizesWithQuantities = filteredSizes.map(size => ({
            size: size._id, // Sử dụng _id của size từ filteredSizes
            quantity: sizeQuantities[size._id] || 0 // Lấy số lượng từ state sizeQuantities, nếu không có thì mặc định là 0
        }));
    
        console.log(sizesWithQuantities);
    
        // Cập nhật dữ liệu sản phẩm với danh sách sizes và số lượng
        const productData = {
            ...productDetails,
            sizes: sizesWithQuantities
        };
    
        let responseData;
    
        let formData = new FormData();
        formData.append('product', mainImage); // Thêm tệp chính vào FormData
    
        // Thêm tất cả các tệp phụ vào FormData
        subImages.forEach(image => {
            formData.append('product', image);
        });
    
        await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData,
        })
        .then((res) => res.json())
        .then((data) => { 
            responseData = data;
            if (responseData.success) {
                // Xử lý khi upload thành công
                productData.main_img = responseData.image_urls[0]; // Chỉ sử dụng URL của tệp chính
                productData.sub_img = responseData.image_urls.slice(1); // Sử dụng URL của các tệp phụ còn lại
    
                // Gửi yêu cầu thêm sản phẩm sau khi upload thành công
                fetch('http://localhost:5000/addproduct', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productData),
                })
                .then((resp) => resp.json())
                .then((data) => {
                    data.success ? 
                        Swal.fire({
                            icon: 'success',
                            title: t('title swal'),
                            text: t('product added'),
                            position: 'center',
                        }) 
                    : 
                        Swal.fire({
                            icon: 'error',
                            title: t('title swal'),
                            text: t(data.message),
                            position: 'center',
                        })
                })
                .catch((error) => {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: t('title swal'),
                        text: t('failed to add product'),
                        position: 'center',
                    })
                });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Thông báo',
                text: t('failed to upload image'),
                position: 'center',
            })
        });
    }
    

    const [sizeQuantities, setSizeQuantities] = useState({});

    const handleSizeQuantityChange = (sizeId, quantity) => {
        // Tạo một bản sao của object sizeQuantities để không ghi đè lên state hiện tại
        const newSizeQuantities = { ...sizeQuantities };
    
        // Cập nhật hoặc thêm thông tin quantity của size được chỉ định
        newSizeQuantities[sizeId] = quantity;
    
        // Cập nhật state sizeQuantities với object mới
        setSizeQuantities(newSizeQuantities);
    };
    
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4 h-screen`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-[70%]' : 'w-[60%]'} transition-all duration-1000 h-[680px] rounded-md py-4 px-8 overflow-y-auto relative`}>
                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <p>{t('product name')}</p>
                                <input value={productDetails.name} onChange={changeHandler} type="text" name="name" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                {errors.name && <p className="text-red-500">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <p>{t('product price')}</p>
                                <input value={productDetails.price} onChange={changeHandler} type="text" name="price" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                {errors.price && <p className="text-red-500">{errors.price}</p>}
                            </div>
                            <div className="space-y-2">
                                <p>{t('product category')}</p>
                                <select value={selectedCategory} onChange={handleCategoryChange} name="category" className='w-[50%] px-2 py-1 border-[1px] border-primary'>
                                    <option value="">-- {t('select product category')} --</option>
                                    {categories.map(category => (
                                        <option key={category._id} value={category._id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            {filteredSizes.length > 0 &&
                                <div className="space-y-4">
                                    <p>{t('product quantity')}</p>
                                    {filteredSizes.map((size) => (
                                        <div key={size._id} className='flex gap-4 items-center'>
                                            <label htmlFor="" className='w-28 h-[40px] text-center leading-[40px] bg-third'>{size.name}</label>
                                            <input type="number" defaultValue={0} className='border-[1px] border-primary w-[327px] px-2 py-2' onChange={(e) => handleSizeQuantityChange(size._id, e.target.value)} />
                                        </div>
                                    ))}
                                </div>
                            }
                            <div className="flex items-center gap-14">
                                <div>
                                    <p className='mb-4'>{t('product main image')}</p>
                                    <label htmlFor="file-input-main">
                                        <img src={mainImage ? URL.createObjectURL(mainImage) : upload_area} alt="" className='w-28 h-[164px] object-cover' />
                                    </label>
                                    <input onChange={mainImageHandler} type="file" name="main_img" id="file-input-main" hidden />
                                    {errors.mainImage && <p className="text-red-500">{errors.mainImage}</p>}
                                </div>
                                <div>
                                    <p className='mb-4'>{t('product sub image')}</p>
                                    <div className='flex gap-4 items-center'>
                                        <label htmlFor="file-input-sub">
                                            <div className='flex items-center gap-4'>
                                                {subImages.length > 0 ? (
                                                    subImages.map((image, index) => (
                                                        <img key={index} src={URL.createObjectURL(image)} alt="" className='w-28 h-[164px] object-cover' />
                                                    ))
                                                ) : (
                                                    <img src={upload_area} alt="" className='w-28 h-[164px] object-cover' />
                                                )}
                                            </div>
                                        </label>
                                        <input onChange={subImageHandler} type="file" name="sub_img" id="file-input-sub" multiple hidden />
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => Add_Product()} className='btn-primary uppercase'>{t('add')}</button>
                        </div>
                        <div className='absolute top-6 right-6 flex'>
                            <Link to={'/listproduct'} className="btn-primary rounded-md px-4">
                                <div className='flex items-center gap-2'>
                                    <RiArrowGoBackLine />
                                    {t('back to list')}
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddProduct