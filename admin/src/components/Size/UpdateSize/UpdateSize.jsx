import { useEffect, useState } from 'react';
import { RiArrowGoBackLine } from "react-icons/ri";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const UpdateSize = ({ showSidebar }) => {
    const { id } = useParams();
    const [size, setSize] = useState({
        type: '',
        name: '',
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSize(prevProduct => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/updatesize/${id}`, size);
            Swal.fire({
                icon: 'success',
                title: 'Thông báo',
                text: 'Size updated successfully!',
                position: 'center',
            }) 
        } catch (error) {
            console.error('Error updating size:', error);
            Swal.fire({
                icon: 'error',
                title: 'Thông báo',
                text: 'Failed to update size',
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
                                    <p>Type</p>
                                    <input value={size.type} onChange={handleInputChange} type="text" name="type" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                </div>
                                <div className="space-y-2">
                                    <p>Name</p>
                                    <input value={size.name} onChange={handleInputChange} type="text" name="name" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                </div>
                                <button type="submit" className='btn-primary'>SAVE</button>
                            </form>
                        </div>
                        <div className='absolute top-6 right-6 flex'>
                            <Link to={'/listsize'} className="btn-primary rounded-md px-4">
                                <div className='flex items-center gap-2'>
                                    <RiArrowGoBackLine />
                                    Back to list
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateSize;
