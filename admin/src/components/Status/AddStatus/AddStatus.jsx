import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiArrowGoBackLine } from "react-icons/ri";
import Swal from 'sweetalert2';

const AddStatus = ({ showSidebar }) => {
    const [statusDetails, setStatusDetails] = useState({
        name: '',
        description: '',
    })

    // State để lưu trữ thông tin về lỗi cho mỗi trường
    const [errors, setErrors] = useState({
        name: '',
    });

    const changeHandler = (e) => {
        const { name, value } = e.target;

        setStatusDetails({...statusDetails, [name]: value})

        // Kiểm tra và cập nhật trạng thái lỗi
        if (name === 'name') {
            setErrors({...errors, name: value.trim() ? '' : 'Tên status không được để trống'});
        }
        
    }

    const Add_Status = async () => {
        // Kiểm tra trạng thái lỗi trước khi gửi yêu cầu
        if (!statusDetails.name.trim()) {
            setErrors({...errors, name: 'Tên status không được để trống'});
            return;
        }

        console.log(statusDetails);

        let status = statusDetails

        await fetch('http://localhost:5000/addstatus', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(status),
        })
        .then((resp) => resp.json())
        .then((data) => {
            data.success ? 
                Swal.fire({
                    icon: 'success',
                    title: 'Thông báo',
                    text: 'Status Added',
                    position: 'center',
                }) 
            : 
                Swal.fire({
                    icon: 'error',
                    title: 'Thông báo',
                    text: 'Failed to add status',
                    position: 'center',
                })
        })
        .catch((error) => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Thông báo',
                text: 'Failed to add status',
                position: 'center',
            })
        });
    }
    
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-[70%]' : 'w-[60%]'} transition-all duration-1000 h-[480px] rounded-md py-4 px-8 overflow-y-auto relative`}>
                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <p>Name</p>
                                <input value={statusDetails.name} onChange={changeHandler} type="text" name="name" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                {errors.name && <p className="text-red-500">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <p>Description</p>
                                <input value={statusDetails.description} onChange={changeHandler} type="text" name="description" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                            </div>
                            <button onClick={() => Add_Status()} className='btn-primary'>ADD</button>
                        </div>
                        <div className='absolute top-6 right-6 flex'>
                            <Link to={'/liststatus'} className="btn-primary rounded-md px-4">
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
    )
}

export default AddStatus