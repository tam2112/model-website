import { useEffect, useState } from 'react';
import { RiArrowGoBackLine } from "react-icons/ri";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

const UpdatePayment = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('update payment title')
    }, [i18n.language])

    const { id } = useParams();
    const [payment, setPayment] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/detailspayment/${id}`)
            .then(response => {
                setPayment(response.data.payment);
            })
            .catch(error => {
                console.error('Error fetching payment details:', error);
            });
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPayment(prevPayment => ({
            ...prevPayment,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/updatepayment/${id}`, payment);
            Swal.fire({
                icon: 'success',
                title: t('title swal'),
                text: t('payment updated successfully'),
                position: 'center',
            })
        } catch (error) {
            console.error('Error updating payment:', error);
            Swal.fire({
                icon: 'error',
                title: t('title swal'),
                text: t('failed to update payment'),
                position: 'center',
            })
        }
    };

    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-[70%]' : 'w-[60%]'} transition-all duration-1000 h-[680px] rounded-md py-4 px-8 overflow-y-auto relative`}>
                        <div className="space-y-6 mt-4">
                            <form onSubmit={handleSubmit} className='space-y-6'>
                                <div className="space-y-2">
                                    <p>{t('payment name')}</p>
                                    <input value={payment.name} onChange={handleInputChange} type="text" name="name" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                </div>
                                <div className="space-y-2">
                                    <p>{t('payment description')}</p>
                                    <input value={payment.description} onChange={handleInputChange} type="text" name="description" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                </div>
                                <button type="submit" className='btn-primary uppercase'>{t('save')}</button>
                            </form>
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
    );
};

export default UpdatePayment;
