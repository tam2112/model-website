import { Link } from "react-router-dom"
import { BsDatabaseAdd } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbListDetails } from "react-icons/tb";
import { LiaEditSolid, LiaTrashRestoreAltSolid } from "react-icons/lia";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next'

const ListSize = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('list size title')
    }, [i18n.language])

    const [allSizes, setAllSizes] = useState([]);
    const [allDeletedItems, setAllDeletedItems] = useState([]);

    const fetchInfo = async () => {
        await fetch('http://localhost:5000/allsizes')
        .then((res) => res.json())
        .then((data) => {
            // Sort data by date in descending order (newest to oldest)
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setAllSizes(data);
        });
    }

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
        fetchInfo();
        fetchAllDeletedItems();
    }, [])

    const remove_size = async (id) => {
        await fetch('http://localhost:5000/removesize', {
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
                text: t('delete success'),
                position: 'center',
            });
        })
        await fetchInfo();
        await fetchAllDeletedItems();
    }

    const filterSizes = allDeletedItems.filter(item => item.type === 'size')
    
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-full' : 'w-[90%]'} transition-all duration-1000 h-[680px] rounded-md px-8 overflow-y-auto`}>
                        <div>
                            <div className="fixed w-[1100px] bg-white z-10 py-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-semibold text-2xl">{t('all sizes list')}</h2>
                                    <div className="flex items-center gap-6">
                                        {filterSizes.length > 0 && <Link to={'/restoresize'} className="btn-primary rounded-md px-4">
                                            <div className="flex items-center gap-2">
                                                <LiaTrashRestoreAltSolid size={20} />
                                                {t('restore')}
                                            </div>
                                        </Link>}
                                        <Link to={'/addsize'} className="btn-primary rounded-md px-4">
                                            <div className="flex items-center gap-2">
                                                <BsDatabaseAdd />
                                                {t('add')}
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="mt-8 sm:grid lg:grid-cols-[1.5fr_2fr_2fr] sm:grid-cols-[1.5fr_1.5fr_2fr] hidden">
                                    <p className="ml-4">{t('size type')}</p>
                                    <p>{t('size name')}</p>
                                    <p className="ml-12">{t('functionality')}</p>
                                </div>
                                <hr className="mt-4 sm:block hidden border-third border-2" />
                            </div>
                            <div className="pt-40">
                                <div>
                                    {allSizes.map((size, index) => (
                                        <div key={index}>
                                            <div className="flex items-center lg:space-x-6 sm:space-x-4">
                                                <p className={`lg:w-[260px] ${showSidebar ? 'w-[250px]' : 'w-[300px] lg:w-[300px]'}`} style={{marginLeft: '18px'}}>{size.type}</p>
                                                <p className={`${showSidebar ? 'w-[410px]' : 'w-[470px]'} truncate`}>{size.name}</p>
                                                <div className="w-[150px]" style={{ marginLeft: '36px' }}>
                                                    <div className="flex flex-col gap-4">
                                                        <Link to={`/detailssize/${size.id}`} className="w-[100px] border-primary border-2 py-2 justify-center rounded-md flex items-center cursor-pointer hover:bg-primary hover:text-white duration-300" onClick={() => {}}>
                                                            <div className="flex items-center gap-1">
                                                                {t('details')}
                                                                <TbListDetails />
                                                            </div>
                                                        </Link>
                                                        <Link to={`/updatesize/${size.id}`} className="w-[100px] border-primary border-2 py-2 justify-center rounded-md flex items-center cursor-pointer hover:bg-primary hover:text-white duration-300">
                                                            <div className="flex items-center gap-1">
                                                                {t('edit')}
                                                                <LiaEditSolid />
                                                            </div>
                                                        </Link>
                                                        <div className="w-[100px] border-primary border-2 py-2 justify-center rounded-md flex items-center cursor-pointer hover:bg-primary hover:text-white duration-300" onClick={() => {remove_size(size.id)}}>
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
        </>
    )
}

export default ListSize