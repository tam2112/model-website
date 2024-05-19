import { useEffect, useState } from 'react';
import { RiArrowGoBackLine } from "react-icons/ri";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const DetailsPay = ({ showSidebar }) => {
    const { id } = useParams();
    const [pay, setPay] = useState({
        type: '',
        name: '',
        date: new Date(),
    });

    useEffect(() => {
        axios.get(`http://localhost:5000/detailspay/${id}`)
            .then(response => {
                setPay(response.data.pay);
            })
            .catch(error => {
                console.error('Error fetching pay details:', error);
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
                                        <h2 className='text-2xl font-bold'>Details Pay - {pay.name}</h2>
                                    </div>
                                    <Link to={'/listpay'} className="btn-primary rounded-md px-4">
                                        <div className='flex items-center gap-2'>
                                            <RiArrowGoBackLine />
                                            Back to list
                                        </div>
                                    </Link>
                                </div>
                                <div className='grid grid-cols-3 place-items-center'>
                                    <div className='space-y-8 font-semibold col-span-1'>
                                        <h3>Type</h3>
                                        <h3>Name</h3>
                                        <h3>Image</h3>
                                        <h3>Date Created</h3>
                                    </div>
                                    <div className='space-y-8 col-span-2'>
                                        <p>{pay.type}</p>
                                        <p>{pay.name}</p>
                                        <p><img src={pay.image} alt="" className='w-12' /></p>
                                        <p>{formatDate(pay.date)}</p>
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

export default DetailsPay