import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiArrowGoBackLine } from "react-icons/ri";
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react';

const AddPayment = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('add payment title')
    }, [i18n.language])

    const [paymentDetails, setPaymentDetails] = useState({
        name: '',
        description: '',
    })

    // State để lưu trữ thông tin về lỗi cho mỗi trường
    const [errors, setErrors] = useState({
        name: '',
    });

    const changeHandler = (e) => {
        const { name, value } = e.target;

        setPaymentDetails({...paymentDetails, [name]: value})

        // Kiểm tra và cập nhật trạng thái lỗi
        if (name === 'name') {
            setErrors({...errors, name: value.trim() ? '' : t('payment name cannot be blank')});
        }
        
    }

    const Add_Payment = async () => {
        // Kiểm tra trạng thái lỗi trước khi gửi yêu cầu
        if (!paymentDetails.name.trim()) {
            setErrors({...errors, name: t('payment name cannot be blank')});
            return;
        }

        console.log(paymentDetails);

        let payment = paymentDetails

        await fetch('http://localhost:5000/addpayment', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payment),
        })
        .then((resp) => resp.json())
        .then((data) => {
            data.success ? 
                Swal.fire({
                    icon: 'success',
                    title: t('title swal'),
                    text: t('payment added'),
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
                text: t('failed to add payment'),
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
                                <p>{t('payment name')}</p>
                                <input value={paymentDetails.name} onChange={changeHandler} type="text" name="name" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                {errors.name && <p className="text-red-500">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <p>{t('payment description')}</p>
                                <input value={paymentDetails.description} onChange={changeHandler} type="text" name="description" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                            </div>
                            <button onClick={() => Add_Payment()} className='btn-primary uppercase'>{t('add')}</button>
                        </div>
                        <div className='absolute top-6 right-6 flex'>
                            <Link to={'/listpayment'} className="btn-primary rounded-md px-4">
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

export default AddPayment