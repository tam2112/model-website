import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiArrowGoBackLine } from "react-icons/ri";
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next'

import upload_area from '../../../assets/upload_area.svg'

const AddPay = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('add pay title')
    }, [i18n.language])

    const [image, setImage] = useState(false)
    const [payDetails, setPayDetails] = useState({
        type: '',
        name: '',
        image: '',
    })

    // State để lưu trữ thông tin về lỗi cho mỗi trường
    const [errors, setErrors] = useState({
        type: '',
        name: '',
    });

    const changeHandler = (e) => {
        const { name, value } = e.target;

        setPayDetails({...payDetails, [name]: value})

        // Kiểm tra và cập nhật trạng thái lỗi
        if (name === 'type') {
            setErrors({...errors, type: value.trim() ? '' : t('pay type cannot be blank')});
        }
        else if (name === 'name') {
            setErrors({...errors, name: value.trim() ? '' : t('pay name cannot be blank')});
        }
        
    }

    const imageHandler = (e) => {
        setImage(e.target.files[0])
    }

    const Add_Pay = async () => {
        // Kiểm tra trạng thái lỗi trước khi gửi yêu cầu
        if (!payDetails.type.trim()) {
            setErrors({...errors, type: t('pay type cannot be blank')});
            return;
        }
        if (!payDetails.name.trim()) {
            setErrors({...errors, name: t('pay name cannot be blank')});
            return;
        }

        console.log(payDetails);

        let pay = payDetails
        let formData = new FormData();
        formData.append('image', image);

        let responseData;

        await fetch('http://localhost:5000/uploadsingle', {
            method: 'POST',
            body: formData,
        })
        .then((res) => res.json())
        .then((data) => {
            responseData = data;
            if (responseData.success) {
                pay.image = responseData.image_url;

                fetch('http://localhost:5000/addpay', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(pay),
                })
                .then((resp) => resp.json())
                .then((data) => {
                    data.success ? 
                        Swal.fire({
                            icon: 'success',
                            title: t('title swal'),
                            text: t('pay added'),
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
                        text: t('failed to add pay'),
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
    
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4 h-screen`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-[70%]' : 'w-[60%]'} transition-all duration-1000 h-[480px] rounded-md py-4 px-8 overflow-y-auto relative`}>
                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <p>{t('pay type')}</p>
                                <input value={payDetails.type} onChange={changeHandler} type="text" name="type" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                {errors.type && <p className="text-red-500">{errors.type}</p>}
                            </div>
                            <div className="space-y-2">
                                <p>{t('pay name')}</p>
                                <input value={payDetails.name} onChange={changeHandler} type="text" name="name" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                {errors.name && <p className="text-red-500">{errors.name}</p>}
                            </div>
                            <div className='space-y-2'>
                                <div>
                                    <p className='mb-4'>{t('pay image')}</p>
                                    <label htmlFor="file-input-image">
                                        <img src={image ? URL.createObjectURL(image) : upload_area} alt="" className='w-28 h-[140px] object-contain' />
                                    </label>
                                    <input onChange={imageHandler} type="file" name="image" id="file-input-image" hidden />
                                </div>
                            </div>
                            <button onClick={() => Add_Pay()} className='btn-primary uppercase'>{t('add')}</button>
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
    )
}

export default AddPay