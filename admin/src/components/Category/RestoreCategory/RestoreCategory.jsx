import { Link } from "react-router-dom"
import { LiaTrashRestoreAltSolid } from "react-icons/lia";
import { RiDeleteBinLine, RiArrowGoBackLine } from "react-icons/ri";
import { MdPublishedWithChanges, MdOutlineUnpublished } from "react-icons/md";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const RestoreCategory = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('restore category title')
    }, [i18n.language])

    const [allDeletedItems, setAllDeletedItems] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const fetchAllDeletedItems = async () => {
        // Fetch danh sách các danh mục từ API
        try {
            const response = await fetch('http://localhost:5000/alldeleteditems');
            const data = await response.json();
            setAllDeletedItems(data);
        } catch (error) {
            console.error('Error fetching deleted items:', error);
        }
    }

    useEffect(() => {
        fetchAllDeletedItems();
    }, [])

    const restore_category = async (id) => {
        await fetch('http://localhost:5000/restorecategory', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        }).then(() => {
            Swal.fire({
                icon: 'success',
                title: t('title swal'),
                text: t('restore success'),
                position: 'center',
            });
        })
        await fetchAllDeletedItems();
    }

    const remove_category = async (id) => {
        setItemToDelete(id);
        setShowConfirmation(true);
    }

    const confirmDelete = async () => {
        if (itemToDelete) {
            await fetch('http://localhost:5000/removedeleteditems', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ _id: itemToDelete })
            }).then(() => {
                Swal.fire({
                    icon: 'success',
                    title: t('title swal'),
                    text: t('delete success'),
                    position: 'center',
                });
            })
            await fetchAllDeletedItems();
            setItemToDelete(null);
            setShowConfirmation(false);
        }
    }

    const cancelDelete = () => {
        setItemToDelete(null);
        setShowConfirmation(false);
    }

    const filterCategories = allDeletedItems.filter(item => item.type === 'category')
    
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-full' : 'w-[90%]'} transition-all duration-1000 h-[680px] rounded-md px-8 overflow-y-auto`}>
                        <div>
                            <div className="fixed w-[1100px] bg-white py-4 z-10">
                                <div className="flex items-center justify-between gap-4 pb-8">
                                    <h2 className="font-semibold text-2xl">{t('all category list')} ({t('deleted')})</h2>
                                    <div className="flex items-center gap-6">
                                        <Link to={'/listcategory'} className="btn-primary rounded-md px-4">
                                            <div className='flex items-center gap-2'>
                                                <RiArrowGoBackLine />
                                                {t('back to list')}
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="sm:grid lg:grid-cols-[1.5fr_2fr_1fr_2fr] sm:grid-cols-[1.5fr_1.5fr_1fr_2fr] hidden">
                                    <p className="ml-4">{t('category name')}</p>
                                    <p>{t('category description')}</p>
                                    <p>{t('category published')}</p>
                                    <p className="ml-12">{t('functionality')}</p>
                                </div>
                                <hr className="mt-4 sm:block hidden border-third border-2" />
                            </div>
                            <div className="pt-40">
                                <div>
                                    {filterCategories.map((category, index) => (
                                        <div key={index}>
                                            <div className="flex items-center lg:space-x-6 sm:space-x-4">
                                                <p className={`lg:w-[210px] ${showSidebar ? 'w-[250px]' : 'w-[300px] lg:w-[240px]'}`} style={{marginLeft: `${showSidebar ? '24px' : '20px'}`}}>{category.data.name}</p>
                                                <p className={`${showSidebar ? 'w-[292px]' : 'w-[360px]'} truncate`}>{category.data.description}</p>
                                                <p className={`${showSidebar ? 'w-[168px]' : 'w-[188px]'}`} style={{ marginLeft: 60 }}>
                                                    {
                                                        category.data.published ? <MdPublishedWithChanges size={20} className="text-green-600" /> : <MdOutlineUnpublished size={20} className="text-red-600" />
                                                    }
                                                </p>
                                                <div className="w-[150px]" style={{ marginLeft: '36px' }}>
                                                    <div className="flex flex-col gap-4">
                                                        <div className="w-[100px] border-primary border-2 py-2 justify-center rounded-md flex items-center cursor-pointer hover:bg-primary hover:text-white duration-300" onClick={() => {restore_category(category.data.id)}}>
                                                            <div className="flex items-center gap-1">
                                                                {t('restore')}
                                                                <LiaTrashRestoreAltSolid />
                                                            </div>
                                                        </div>
                                                        <div className="w-[100px] border-primary border-2 py-2 justify-center rounded-md flex items-center cursor-pointer hover:bg-primary hover:text-white duration-300" onClick={() => {remove_category(category._id)}}>
                                                            <div className="flex items-center gap-1">
                                                                {t('delete')}
                                                                <RiDeleteBinLine />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="my-4" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showConfirmation && (
                <div className="fixed z-[999] inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-8 rounded-md">
                        <p className="text-lg">{t('are you sure you want to delete this category permanently')}</p>
                        <div className="flex justify-end mt-4">
                            <button className="btn-primary mr-4" onClick={confirmDelete}>{t('yes')}</button>
                            <button className="btn-primary" onClick={cancelDelete}>{t('no')}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default RestoreCategory