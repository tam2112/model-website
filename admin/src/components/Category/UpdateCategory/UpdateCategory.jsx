import { useEffect, useState } from 'react';
import { RiArrowGoBackLine } from "react-icons/ri";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

const UpdateCategory = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('update category title')
    }, [i18n.language])

    const { id } = useParams();
    const [category, setCategory] = useState({
        name: '',
        description: '',
        published: true,
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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setCategory(prevCategory => ({
            ...prevCategory,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/updatecategory/${id}`, category);
            Swal.fire({
                icon: 'success',
                title: t('title swal'),
                text: t('category updated successfully'),
                position: 'center',
            })
        } catch (error) {
            console.error('Error updating category:', error);
            Swal.fire({
                icon: 'error',
                title: t('title swal'),
                text: t('failed to update category'),
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
                                    <p>{t('category name')}</p>
                                    <input value={category.name} onChange={handleInputChange} type="text" name="name" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                </div>
                                <div className="space-y-2">
                                    <p>{t('category description')}</p>
                                    <input value={category.description} onChange={handleInputChange} type="text" name="name" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                </div>
                                <div className="space-y-2">
                                    <p>{t('category published')}</p>
                                    <input checked={category.published} onChange={handleInputChange} type="checkbox" name="published" className="form-checkbox h-5 w-5 text-primary border-primary rounded focus:ring-primary checked:text-white checked:border-green-400" />
                                </div>
                                <button type="submit" className='btn-primary uppercase'>{t('save')}</button>
                            </form>
                        </div>
                        <div className='absolute top-6 right-6 flex'>
                            <Link to={'/listcategory'} className="btn-primary rounded-md px-4">
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

export default UpdateCategory;
