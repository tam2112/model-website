import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiArrowGoBackLine } from "react-icons/ri";
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react';

const AddSize = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('add size title')
    }, [i18n.language])

    const [sizeDetails, setSizeDetails] = useState({
        type: '',
        name: '',
    })

    // State để lưu trữ thông tin về lỗi cho mỗi trường
    const [errors, setErrors] = useState({
        type: '',
        name: '',
    });

    const changeHandler = (e) => {
        const { name, type, value } = e.target;

        setSizeDetails({...sizeDetails, [name]: value})

        // Kiểm tra và cập nhật trạng thái lỗi
        if (type === 'type') {
            setErrors({...errors, type: value.trim() ? '' : t('size type cannot be blank')});
        }
        else if (name === 'name') {
            setErrors({...errors, name: value.trim() ? '' : t('size name cannot be blank')});
        }
        
    }

    const Add_Size = async () => {
        // Kiểm tra trạng thái lỗi trước khi gửi yêu cầu
        if (!sizeDetails.name.trim()) {
            setErrors({...errors, name: t('size name cannot be blank')});
            return;
        }
        else if (!sizeDetails.type.trim()) {
            setErrors({...errors, name: t('size type cannot be blank')});
            return;
        }

        console.log(sizeDetails);

        let size = sizeDetails

        await fetch('http://localhost:5000/addsize', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(size),
        })
        .then((resp) => resp.json())
        .then((data) => {
            data.success ? 
                Swal.fire({
                    icon: 'success',
                    title: t('title swal'),
                    text: t('size added'),
                    position: 'center',
                }) 
            :
                Swal.fire({
                    icon: 'error',
                    title: t('title swal'),
                    text: data.message,
                    position: 'center',
                })
        })
        .catch((error) => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: t('title swal'),
                text: t('failed to add size'),
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
                                <p>{t('size type')}</p>
                                <input value={sizeDetails.type} onChange={changeHandler} type="text" name="type" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                {errors.type && <p className="text-red-500">{errors.type}</p>}
                            </div>
                            <div className="space-y-2">
                                <p>{t('size name')}</p>
                                <input value={sizeDetails.name} onChange={changeHandler} type="text" name="name" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                {errors.name && <p className="text-red-500">{errors.name}</p>}
                            </div>
                            <button onClick={() => Add_Size()} className='btn-primary uppercase'>{t('add')}</button>
                        </div>
                        <div className='absolute top-6 right-6 flex'>
                            <Link to={'/listsize'} className="btn-primary rounded-md px-4">
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

export default AddSize