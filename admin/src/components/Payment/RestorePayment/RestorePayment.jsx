import { Link } from "react-router-dom"
import { LiaTrashRestoreAltSolid } from "react-icons/lia";
import { RiDeleteBinLine, RiArrowGoBackLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const RestorePayment = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('restore payment title')
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

    const restore_payment = async (id) => {
        await fetch('http://localhost:5000/restorepayment', {
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

    const remove_payment = async (id) => {
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

    const filterPayment = allDeletedItems.filter(item => item.type === 'payment')
    
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-full' : 'w-[90%]'} transition-all duration-1000 h-[680px] rounded-md px-8 overflow-y-auto`}>
                        <div>
                            <div className="fixed w-[1100px] bg-white py-4 z-10">
                                <div className="flex items-center justify-between gap-4 pb-8">
                                    <h2 className="font-semibold text-2xl">{t('all payment list')} ({t('deleted')})</h2>
                                    <div className="flex items-center gap-6">
                                        <Link to={'/listpayment'} className="btn-primary rounded-md px-4">
                                            <div className='flex items-center gap-2'>
                                                <RiArrowGoBackLine />
                                                {t('back to list')}
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="sm:grid lg:grid-cols-[1.5fr_2fr_2fr] sm:grid-cols-[1.5fr_1.5fr_2fr] hidden">
                                    <p className="ml-4">{t('payment name')}</p>
                                    <p>{t('payment description')}</p>
                                    <p className="ml-12">{t('functionality')}</p>
                                </div>
                                <hr className="mt-4 sm:block hidden border-third border-2" />
                            </div>
                            <div className="pt-40">
                                <div>
                                    {filterPayment.map((payment, index) => (
                                        <div key={index}>
                                            <div className="flex items-center lg:space-x-6 sm:space-x-4">
                                                <p className={`lg:w-[260px] ${showSidebar ? 'w-[250px]' : 'w-[300px] lg:w-[300px]'}`} style={{marginLeft: '18px'}}>{payment.data.name}</p>
                                                <p className={`${showSidebar ? 'w-[410px]' : 'w-[470px]'} truncate`}>{payment.data.description}</p>
                                                <div className="w-[150px]" style={{ marginLeft: '36px' }}>
                                                    <div className="flex flex-col gap-4">
                                                        <div className="w-[100px] border-primary border-2 py-2 justify-center rounded-md flex items-center cursor-pointer hover:bg-primary hover:text-white duration-300" onClick={() => {restore_payment(payment.data.id)}}>
                                                            <div className="flex items-center gap-1">
                                                                {t('restore')}
                                                                <LiaTrashRestoreAltSolid />
                                                            </div>
                                                        </div>
                                                        <div className="w-[100px] border-primary border-2 py-2 justify-center rounded-md flex items-center cursor-pointer hover:bg-primary hover:text-white duration-300" onClick={() => {remove_payment(payment._id)}}>
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
                        <p className="text-lg">{t('are you sure you want to delete this payment permanently')}</p>
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

export default RestorePayment