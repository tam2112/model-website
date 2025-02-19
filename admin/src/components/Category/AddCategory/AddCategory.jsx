import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiArrowGoBackLine } from "react-icons/ri";
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next'

const AddCategory = ({ showSidebar }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('add category title')
    }, [i18n.language])

    const [categoryDetails, setCategoryDetails] = useState({
        name: '',
        description: '',
        published: true,
    })

    // State để lưu trữ thông tin về lỗi cho mỗi trường
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        published: true,
    });

    const changeHandler = (e) => {
        const { name, value, type, checked } = e.target;

        // Xử lý cập nhật trạng thái dựa trên loại của input
        const newValue = type === 'checkbox' ? checked : value;

        setCategoryDetails({...categoryDetails, [name]: newValue});

        // Kiểm tra và cập nhật trạng thái lỗi
        if (name === 'name') {
            setErrors({...errors, name: value.trim() ? '' : t('category name cannot be blank')});
        }
    }

    const Add_Category = async () => {
        // Kiểm tra trạng thái lỗi trước khi gửi yêu cầu
        if (!categoryDetails.name.trim()) {
            setErrors({...errors, name: t('category name cannot be blank')});
            return;
        }

        console.log(categoryDetails);

        let category = categoryDetails

        await fetch('http://localhost:5000/addcategory', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(category),
        })
        .then((resp) => resp.json())
        .then((data) => {
            data.success ? 
                Swal.fire({
                    icon: 'error',
                    title: t('title swal'),
                    text: t('category added'),
                    position: 'center',
                })
            : 
                Swal.fire({
                    icon: 'error',
                    title: t('title swal'),
                    text: t(data.message),
                    position: 'center',
                })
        })
        .catch((error) => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: t('title swal'),
                text: t('failed to add category'),
                position: 'center',
            })
        });
    }
    
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000 py-4 h-screen`}>
                <div className={`container ${showSidebar ? '' : 'grid place-items-center'}`}>
                    <div className={`bg-white ${showSidebar ? 'w-[70%]' : 'w-[60%]'} transition-all duration-1000 h-[480px] rounded-md py-4 px-8 overflow-y-auto relative`}>
                        <div className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <p>{t('category name')}</p>
                                <input value={categoryDetails.name} onChange={changeHandler} type="text" name="name" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                                {errors.name && <p className="text-red-500">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <p>{t('category description')}</p>
                                <input value={categoryDetails.description} onChange={changeHandler} type="text" name="description" className="w-[50%] px-2 py-1 border-[1px] border-primary" />
                            </div>
                            <div className="space-y-2">
                                <p className='mb-2'>{t('category published')}</p>
                                <input checked={categoryDetails.published} onChange={changeHandler} type="checkbox" name="published" className="form-checkbox h-5 w-5 text-primary border-primary rounded focus:ring-primary checked:text-white checked:border-green-400" />
                            </div>
                            <button onClick={() => Add_Category()} className='btn-primary uppercase'>{t('add')}</button>
                        </div>
                        <div className='absolute top-6 right-6 flex'>
                            <Link to={'/listcategory'} className="btn-primary rounded-md px-4">
                                <div className='flex items-center gap-2'>
                                    <RiArrowGoBackLine />
                                    {t('back to list')}
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddCategory