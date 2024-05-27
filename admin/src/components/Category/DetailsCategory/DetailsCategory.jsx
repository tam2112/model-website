import { useEffect, useState } from 'react';
import { RiArrowGoBackLine } from "react-icons/ri";
import { MdPublishedWithChanges, MdOutlineUnpublished } from "react-icons/md";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const DetailsCategory = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('details category title')
    }, [i18n.language])

    const { id } = useParams();
    const [category, setCategory] = useState({
        name: '',
        description: '',
        published: true,
        date: new Date(),
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/detailscategory/${id}`)
            .then(response => {
                setCategory(response.data.category);
            })
            .catch(error => {
                console.error('Error fetching category details:', error);
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
                                        <h2 className='text-2xl font-bold'>{t('details category')} ({category.name})</h2>
                                    </div>
                                    <Link to={'/listcategory'} className="btn-primary rounded-md px-4">
                                        <div className='flex items-center gap-2'>
                                            <RiArrowGoBackLine />
                                            {t('back to list')}
                                        </div>
                                    </Link>
                                </div>
                                <div className='grid grid-cols-3 place-items-center'>
                                    <div className='space-y-8 font-semibold col-span-1'>
                                        <h3>{t('category name')}</h3>
                                        <h3>{t('category description')}</h3>
                                        <h3>{t('category published')}</h3>
                                        <h3>{t('date created')}</h3>
                                    </div>
                                    <div className='space-y-8 col-span-2'>
                                        <p>{category.name}</p>
                                        <p>{category.description}</p>
                                        <p>{category.published ? <MdPublishedWithChanges size={20} className="text-green-600" /> : <MdOutlineUnpublished size={20} className="text-red-600" />}</p>
                                        <p>{formatDate(category.date)}</p>
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

export default DetailsCategory