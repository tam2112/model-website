import { LiaTrashRestoreAltSolid } from "react-icons/lia";
import { RiArrowGoBackLine, RiDeleteBinLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import Swal from "sweetalert2";

const RestoreProduct = ({ showSidebar }) => {
    const [allCategories, setAllCategories] = useState([]);
    const [sortBy, setSortBy] = useState("all");
    const [allDeletedItems, setAllDeletedItems] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);


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
        fetchAllCategories();
        fetchAllDeletedItems();
    }, [])

    const filterProducts = allDeletedItems.filter(item => item.type === 'product')

    console.log(filterProducts);

    const sortProducts = (sortBy) => {
        let sortedProducts = [...filterProducts];
        switch (sortBy) {
            case "all":
                setAllDeletedItems();
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
                    sortedProducts = allDeletedItems.filter(product => product.category === sortBy);
                }
                break;
        }
        setAllDeletedItems(sortedProducts);
    }

    const getCategoryName = (categoryId) => {
        const category = allCategories.find(category => category._id === categoryId);
        return category ? category.name : '';
    }

    const restore_product = async (id) => {
        await fetch('http://localhost:5000/restoreproduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        }).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Thông báo',
                text: 'Restore success',
                position: 'center',
            });
        })
        await fetchAllDeletedItems()
    }

    const remove_product = async (id) => {
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
                    title: 'Thông báo',
                    text: 'Delete success',
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
    
    const handleSortChange = (event) => {
        const selectedSort = event.target.value;
        if (selectedSort !== sortBy) {
            setSortBy(selectedSort);
            sortProducts(selectedSort);
        }
    }
    
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-full' : 'w-[90%]'} transition-all duration-1000 h-[680px] rounded-md py-4 px-8 overflow-y-auto`}>
                        <div>
                            <div className="flex items-center justify-between gap-4 pb-8">
                                <h2 className="font-semibold text-2xl">All Products List (Deleted)</h2>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-6">
                                        <h2 className="">Sort by:</h2>
                                        <select name="sort" className='px-2 py-1 border-[1px] border-primary' onChange={handleSortChange}>
                                            <option value="all">All</option>
                                            <option value="AZ">A-Z</option>
                                            <option value="ZA">Z-A</option>
                                            <option value="priceHighToLow">Price: High to Low</option>
                                            <option value="priceLowToHigh">Price: Low to High</option>
                                            {allCategories.map(category => (
                                                <option key={category._id} value={category._id}>Category: {category.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <Link to={'/listproduct'} className="btn-primary rounded-md px-4">
                                        <div className='flex items-center gap-2'>
                                            <RiArrowGoBackLine />
                                            Back to list
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <div className="sm:grid lg:grid-cols-[0.7fr_2fr_1fr_1fr_1fr] sm:grid-cols-[0.7fr_1.5fr_1fr_1fr_1fr] hidden">
                                    <p>Products</p>
                                    <p>Title</p>
                                    <p>Price</p>
                                    <p>Category</p>
                                    <p>Functionality</p>
                                </div>
                                <hr className="my-4 sm:block hidden" />
                                <div>
                                    {filterProducts.map((product, index) => (
                                        <div key={index}>
                                            <div className="flex items-center lg:space-x-6 sm:space-x-4">
                                                <div>
                                                    <img src={product.data.main_img} alt="" className="w-28" />
                                                </div>
                                                <p className={`lg:w-[360px] ${showSidebar ? 'w-[250px]' : 'w-[300px] lg:w-[412px]'} truncate`} style={{marginLeft: `${showSidebar ? '24px' : '44px'}`}}>{product.data.name}</p>
                                                <p className={`${showSidebar ? 'w-[172px]' : 'w-[202px]'}`}>${product.data.price.toFixed(2)}</p>
                                                <p className={`${showSidebar ? 'w-[158px]' : 'w-[178px]'}`}>
                                                    {getCategoryName(product.data.category)}
                                                </p>
                                                <div className="w-[150px]" style={{ marginLeft: '36px' }}>
                                                    <div className="flex flex-col gap-4">
                                                        <div className="w-[100px] border-primary border-2 py-2 justify-center rounded-md flex items-center cursor-pointer hover:bg-primary hover:text-white duration-300" onClick={() => {restore_product(product.data.id)}}>
                                                            <div className="flex items-center gap-1">
                                                                Restore
                                                                <LiaTrashRestoreAltSolid size={20} />
                                                            </div>
                                                        </div>
                                                        <div className="w-[100px] border-primary border-2 py-2 justify-center rounded-md flex items-center cursor-pointer hover:bg-primary hover:text-white duration-300" onClick={() => {remove_product(product._id)}}>
                                                            <div className="flex items-center gap-1">
                                                                Delete
                                                                <RiDeleteBinLine size={20} />
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
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-8 rounded-md">
                        <p className="text-lg">Are you sure you want to delete this product permanently?</p>
                        <div className="flex justify-end mt-4">
                            <button className="btn-primary mr-4" onClick={confirmDelete}>Yes</button>
                            <button className="btn-primary" onClick={cancelDelete}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default RestoreProduct