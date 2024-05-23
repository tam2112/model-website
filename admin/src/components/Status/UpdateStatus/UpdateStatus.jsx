import { useEffect, useState } from 'react';
import { RiArrowGoBackLine } from "react-icons/ri";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next'

const UpdateStatus = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('update status title')
    }, [i18n.language])

    const { id } = useParams();
    const [status, setStatus] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/detailsstatus/${id}`)
            .then(response => {
                setStatus(response.data.status);
            })
            .catch(error => {
                console.error('Error fetching status details:', error);
            });
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStatus(prevStatus => ({
            ...prevStatus,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/updatestatus/${id}`, status);
            Swal.fire({
                icon: 'success',
                title: t('title swal'),
                text: t('status updated successfully'),
                position: 'center',
            })
        } catch (error) {
            console.error('Error updating status:', error);
            Swal.fire({
                icon: 'error',
                title: t('title swal'),
                text: t('failed to update status'),
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
                                    <p>{t('status name')}</p>
                                    <input value={status.name} onChange={handleInputChange} type="text" name="name" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                </div>
                                <div className="space-y-2">
                                    <p>{t('status description')}</p>
                                    <input value={status.description} onChange={handleInputChange} type="text" name="description" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                </div>
                                <button type="submit" className='btn-primary uppercase'>{t('save')}</button>
                            </form>
                        </div>
                        <div className='absolute top-6 right-6 flex'>
                            <Link to={'/liststatus'} className="btn-primary rounded-md px-4">
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

export default UpdateStatus;
