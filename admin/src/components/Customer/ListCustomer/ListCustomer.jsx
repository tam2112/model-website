import { Link } from "react-router-dom"
import { TbListDetails } from "react-icons/tb";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ListCustomer = ({ showSidebar }) => {
    const [allCustomers, setAllCustomers] = useState([]);

    const fetchInfo = async () => {
        await fetch('http://localhost:5000/allusers')
        .then((res) => res.json())
        .then((data) => {
            // Sort data by date in descending order (newest to oldest)
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setAllCustomers(data);
        });
    }

    useEffect(() => {
        fetchInfo();
    }, [])

    // Function to format date
    const formatDate = (date) => {
        return new Date(date).toLocaleString(); // Format the date as per user's locale
    };
    
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-full' : 'w-[90%]'} transition-all duration-1000 h-[680px] rounded-md py-4 px-8 overflow-y-auto`}>
                        <div>
                            <div className="flex items-center justify-between gap-4 pb-8">
                                <h2 className="font-semibold text-2xl">All Customers List</h2>
                            </div>
                            <div>
                                <div className="sm:grid lg:grid-cols-[2fr_2.5fr_2fr_2fr] sm:grid-cols-[2fr_2.5fr_2fr_2fr] hidden">
                                    <p className="ml-4">Name</p>
                                    <p className="ml-2">Email</p>
                                    <p className="ml-12">Date</p>
                                    <p className="ml-12">Functionality</p>
                                </div>
                                <hr className="my-4 sm:block hidden" />
                                <div>
                                    {allCustomers.map((cus, index) => (
                                        <div key={index}>
                                            <div className="flex items-center lg:space-x-6 sm:space-x-4">
                                                <p className={`lg:w-[230px] ${showSidebar ? 'w-[250px]' : 'w-[300px] lg:w-[265px]'}`} style={{marginLeft: '16px'}}>{cus.name}</p>
                                                <p className={`${showSidebar ? 'w-[340px]' : 'w-[388px]'} truncate`}>{cus.email}</p>
                                                <p className={`${showSidebar ? 'w-[240px]' : 'w-[272px]'} truncate`}>{formatDate(cus.date)}</p>
                                                <div className="w-[100px]">
                                                    <div className="flex flex-col gap-4">
                                                        <Link to={`/detailsuser/${cus._id}`} className="w-[100px] border-primary border-2 py-2 justify-center rounded-md flex items-center cursor-pointer hover:bg-primary hover:text-white duration-300" onClick={() => {}}>
                                                            <div className="flex items-center gap-1">
                                                                Details
                                                                <TbListDetails />
                                                            </div>
                                                        </Link>
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

export default ListCustomer