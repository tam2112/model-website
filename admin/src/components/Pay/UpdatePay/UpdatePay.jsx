import { useEffect, useState } from 'react';
import { RiArrowGoBackLine } from "react-icons/ri";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

import upload_area from '../../../assets/upload_area.svg'

const UpdatePay = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('update pay title')
    }, [i18n.language])

    const { id } = useParams();
    const [pay, setPay] = useState({
        type: '',
        name: '',
        image: null,
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/detailspay/${id}`)
            .then(response => {
                setPay(response.data.pay);
            })
            .catch(error => {
                console.error('Error fetching pay details:', error);
            });
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPay(prevPay => ({
            ...prevPay,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setPay(prevPay => ({
            ...prevPay,
            image: e.target.files[0]
        }));
    };

    const updatePayWithImages = async () => {
        let formData = new FormData();

        // Thêm ảnh chính vào FormData
        if (pay.image instanceof File) {
            formData.append('image', pay.image);
        } else {
            formData.append('image', pay.image || '');
        }

        try {
            const uploadResponse = await fetch('http://localhost:5000/uploadsingle', {
                method: 'POST',
                body: formData,
            });
            const uploadData = await uploadResponse.json();
            if (uploadData.success) {
                const updatedPay = {
                    ...pay,
                    image: pay.image instanceof File ? uploadData.image_url : pay.image,
                };
                await axios.put(`http://localhost:5000/updatepay/${id}`, updatedPay);
                Swal.fire({
                    icon: 'success',
                    title: t('title swal'),
                    text: t('pay updated successfully'),
                    position: 'center',
                })
                setPay(updatedPay);
            } else {
                // Xử lý khi upload ảnh không thành công
                console.log('Failed to upload image');
            }
        } catch (error) {
            console.error('Error:', error);
            console.log("Failed to update pay");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        updatePayWithImages();
    };

    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-[70%]' : 'w-[60%]'} transition-all duration-1000 h-[680px] rounded-md py-4 px-8 overflow-y-auto relative`}>
                        <div className="space-y-6 mt-4">
                            <form onSubmit={handleSubmit} className='space-y-6'>
                                <div className="space-y-2">
                                    <p>{t('pay type')}</p>
                                    <input value={pay.type} onChange={handleInputChange} type="text" name="type" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                </div>
                                <div className="space-y-2">
                                    <p>{t('pay name')}</p>
                                    <input value={pay.name} onChange={handleInputChange} type="text" name="name" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                </div>
                                <div className='space-y-2'>
                                    <div>
                                        <p className='mb-4'>{t('pay image')}</p>
                                        <label htmlFor="file-input-image">
                                            <img src={pay.image || upload_area} alt="" className='w-28 h-[140px] object-contain' />
                                        </label>
                                        <input onChange={handleImageChange} type="file" name="main_img" id="file-input-image" hidden />
                                    </div>
                                </div>
                                <button type="submit" className='btn-primary uppercase'>{t('save')}</button>
                            </form>
                        </div>
                        <div className='absolute top-6 right-6 flex'>
                            <Link to={'/listpay'} className="btn-primary rounded-md px-4">
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
    );
};

export default UpdatePay;
