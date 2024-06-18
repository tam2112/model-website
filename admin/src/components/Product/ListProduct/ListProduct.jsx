import { Link } from "react-router-dom"
import { BsDatabaseAdd } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbListDetails } from "react-icons/tb";
import { LiaEditSolid, LiaTrashRestoreAltSolid } from "react-icons/lia";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const ListProduct = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('list product title')
    }, [i18n.language])

    const [allProducts, setAllProducts] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [sortBy, setSortBy] = useState("all");
    const [allDeletedItems, setAllDeletedItems] = useState([]);

    const fetchInfo = async () => {
        await fetch('http://localhost:5000/allproducts')
        .then((res) => res.json())
        .then((data) => {
            // Sort data by date in descending order (newest to oldest)
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setAllProducts(data);
        });
    }    

    const fetchAllCategories = async () => {
        // Fetch danh sách các danh mục từ API
        try {
            const response = await fetch('http://localhost:5000/allcategories');
            const data = await response.json();
            setAllCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
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
        fetchAllCategories();
        fetchAllDeletedItems();
    }, [])

    console.log(sortBy);

    const sortProducts = (sortBy) => {
        let sortedProducts = [...allProducts];
        switch (sortBy) {
            case "all":
                fetchInfo();
                break;
            case "AZ":
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "ZA":
                sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "priceHighToLow":
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case "priceLowToHigh":
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            default:
                // Check if sortBy is a category ID
                const category = allCategories.find(category => category._id === sortBy);
                if (category) {
                    sortedProducts = allProducts.filter(product => product.category === sortBy);
                }
                break;
        }
        setAllProducts(sortedProducts);
    }

    const getCategoryName = (categoryId) => {
        const category = allCategories.find(category => category._id === categoryId);
        return category ? category.name : '';
    }

    const getCategoryPublished = (categoryId) => {
        const category = allCategories.find(category => category._id === categoryId);
        return category ? category.published : '';
    }

    const remove_product = async (id) => {
        await fetch('http://localhost:5000/removeproduct', {
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
    
    const handleSortChange = (event) => {
        const selectedSort = event.target.value;
        if (selectedSort !== sortBy) {
            setSortBy(selectedSort);
            sortProducts(selectedSort);
        }
    }

    const filterProduct = allDeletedItems.filter(item => item.type === 'product')
    
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-full' : 'w-[90%]'} transition-all duration-1000 h-[680px] rounded-md px-8 overflow-y-auto`}>
                        <div>
                            <div className={`fixed ${showSidebar ? 'w-[70%]' : 'w-[80%]'} bg-white z-10 py-4`}>
                                <div className="flex items-center justify-between gap-4 pb-8">
                                    <h2 className="font-semibold text-2xl">{t('all product list')}</h2>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-6">
                                            <h2 className="">{t('sort by')}</h2>
                                            <select name="sort" className='px-2 py-1 border-[1px] border-primary' onChange={handleSortChange}>
                                                <option value="all">{t('all')}</option>
                                                <option value="AZ">A-Z</option>
                                                <option value="ZA">Z-A</option>
                                                <option value="priceHighToLow">{t('price high to low')}</option>
                                                <option value="priceLowToHigh">{t('price low to high')}</option>
                                                {allCategories.map(category => (
                                                    <option key={category._id} value={category._id}>{t('category option')}: {category.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {filterProduct.length > 0 && <Link to={'/restoreproduct'} className="btn-primary rounded-md px-4">
                                            <div className="flex items-center gap-2">
                                                <LiaTrashRestoreAltSolid size={20} />
                                                {t('restore')}
                                            </div>
                                        </Link>}
                                        <Link to={'/addproduct'} className="btn-primary rounded-md px-4">
                                            <div className="flex items-center gap-2">
                                                <BsDatabaseAdd />
                                                {t('add')}
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="sm:grid lg:grid-cols-[0.7fr_2fr_1fr_1fr_1fr] sm:grid-cols-[0.7fr_1.5fr_1fr_1fr_1fr] hidden">
                                    <p>{t('product image')}</p>
                                    <p>{t('product title')}</p>
                                    <p>{t('product price')}</p>
                                    <p>{t('product category')}</p>
                                    <p>{t('functionality')}</p>
                                </div>
                                <hr className="mt-4 sm:block hidden border-third border-2" />
                            </div>
                            <div className="pt-40">
                                <div>
                                    {allProducts.map((product, index) => (
                                        <div key={index}>
                                            {getCategoryPublished(product.category) && <>
                                                <div className="flex items-center lg:space-x-6 sm:space-x-4">
                                                    <div>
                                                        <img src={product.main_img} alt="" className="w-28" />
                                                    </div>
                                                    <p className={`lg:w-[360px] ${showSidebar ? 'w-[250px]' : 'w-[300px] lg:w-[412px]'} truncate`} style={{marginLeft: `${showSidebar ? '24px' : '44px'}`}}>{product.name}</p>
                                                    <p className={`${showSidebar ? 'w-[172px]' : 'w-[202px]'}`}>${product.price.toFixed(2)}</p>
                                                    <p className={`${showSidebar ? 'w-[158px]' : 'w-[178px]'}`}>
                                                        {getCategoryName(product.category)}
                                                    </p>
                                                    <div className="w-[150px]" style={{ marginLeft: '36px' }}>
                                                        <div className="flex flex-col gap-4">
                                                            <Link to={`/detailsproduct/${product.id}`} className="w-[100px] border-primary border-2 py-2 justify-center rounded-md flex items-center cursor-pointer hover:bg-primary hover:text-white duration-300" onClick={() => {}}>
                                                                <div className="flex items-center gap-1">
                                                                    {t('details')}
                                                                    <TbListDetails />
                                                                </div>
                                                            </Link>
                                                            <Link to={`/updateproduct/${product.id}`} className="w-[100px] border-primary border-2 py-2 justify-center rounded-md flex items-center cursor-pointer hover:bg-primary hover:text-white duration-300">
                                                                <div className="flex items-center gap-1">
                                                                    {t('edit')}
                                                                    <LiaEditSolid />
                                                                </div>
                                                            </Link>
                                                            <div className="w-[100px] border-primary border-2 py-2 justify-center rounded-md flex items-center cursor-pointer hover:bg-primary hover:text-white duration-300" onClick={() => {remove_product(product.id)}}>
                                                                <div className="flex items-center gap-1">
                                                                    {t('delete')}
                                                                    <RiDeleteBinLine />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr className="my-4" />
                                            </>}
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

export default ListProduct