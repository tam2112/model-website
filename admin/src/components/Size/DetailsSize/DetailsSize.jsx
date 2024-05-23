import { useEffect, useState } from 'react';
import { RiArrowGoBackLine } from "react-icons/ri";
import { MdPublishedWithChanges, MdOutlineUnpublished } from "react-icons/md";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next'

const DetailsSize = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('details size title')
    }, [i18n.language])

    const { id } = useParams();
    const [size, setSize] = useState({
        type: '',
        name: '',
        date: new Date(),
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/detailssize/${id}`)
            .then(response => {
                setSize(response.data.size);
            })
            .catch(error => {
                console.error('Error fetching size details:', error);
            });
    }, [id]);

    // Function to format date
    const formatDate = (date) => {
        return new Date(date).toLocaleString(); // Format the date as per user's locale
    };

    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-full' : 'w-[90%]'} transition-all duration-1000 h-[680px] rounded-md py-4 px-8 overflow-y-auto relative`}>
                        <div className='mt-2'>
                            <div className='mt-4 space-y-16'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <h2 className='text-2xl font-bold'>{t('details size')} - {size.name}</h2>
                                    </div>
                                    <Link to={'/listsize'} className="btn-primary rounded-md px-4">
                                        <div className='flex items-center gap-2'>
                                            <RiArrowGoBackLine />
                                            {t('back to list')}
                                        </div>
                                    </Link>
                                </div>
                                <div className='grid grid-cols-3 place-items-center'>
                                    <div className='space-y-8 font-semibold col-span-1'>
                                        <h3>{t('size type')}</h3>
                                        <h3>{t('size name')}</h3>
                                        <h3>{t('date created')}</h3>
                                    </div>
                                    <div className='space-y-8 col-span-2'>
                                        <p>{size.type}</p>
                                        <p>{size.name}</p>
                                        <p>{formatDate(size.date)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailsSize