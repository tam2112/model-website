import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiArrowGoBackLine } from "react-icons/ri";
import Swal from 'sweetalert2';

const AddSize = ({ showSidebar }) => {
    const [sizeDetails, setSizeDetails] = useState({
        type: '',
        name: '',
    })

    // State để lưu trữ thông tin về lỗi cho mỗi trường
    const [errors, setErrors] = useState({
        type: '',
        name: '',
    });

    const changeHandler = (e) => {
        const { name, type, value } = e.target;

        setSizeDetails({...sizeDetails, [name]: value})

        // Kiểm tra và cập nhật trạng thái lỗi
        if (type === 'type') {
            setErrors({...errors, type: value.trim() ? '' : 'Loại size không được để trống'});
        }
        else if (name === 'name') {
            setErrors({...errors, name: value.trim() ? '' : 'Tên size không được để trống'});
        }
        
    }

    const Add_Size = async () => {
        // Kiểm tra trạng thái lỗi trước khi gửi yêu cầu
        if (!sizeDetails.name.trim()) {
            setErrors({...errors, name: 'Tên size không được để trống'});
            return;
        }
        else if (!sizeDetails.type.trim()) {
            setErrors({...errors, name: 'Loại size không được để trống'});
            return;
        }

        console.log(sizeDetails);

        let size = sizeDetails

        await fetch('http://localhost:5000/addsize', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(size),
        })
        .then((resp) => resp.json())
        .then((data) => {
            data.success ? 
                Swal.fire({
                    icon: 'success',
                    title: 'Thông báo',
                    text: 'Size Added',
                    position: 'center',
                }) 
            :
                Swal.fire({
                    icon: 'error',
                    title: 'Thông báo',
                    text: 'Failed to add size',
                    position: 'center',
                })
        })
        .catch((error) => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Thông báo',
                text: 'Failed to add size',
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
                                <p>Type</p>
                                <input value={sizeDetails.type} onChange={changeHandler} type="text" name="type" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                {errors.type && <p className="text-red-500">{errors.type}</p>}
                            </div>
                            <div className="space-y-2">
                                <p>Name</p>
                                <input value={sizeDetails.name} onChange={changeHandler} type="text" name="name" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                {errors.name && <p className="text-red-500">{errors.name}</p>}
                            </div>
                            <button onClick={() => Add_Size()} className='btn-primary'>ADD</button>
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
    )
}

export default AddSize