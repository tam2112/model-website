import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import axios from "axios";
import Swal from 'sweetalert2'
import { useTranslation } from "react-i18next";

import { ShopContext } from "../../Context/ShopContext";

const ChangePassword = () => {
    const { t, i18n } = useTranslation();

    const { userId } = useContext(ShopContext);
    const [user, setUser] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        window.document.title = t('change password')
    }, [i18n.language])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!user.currentPassword || !user.newPassword || !user.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: t('title swal'),
                text: t('please enter complete information'),
                position: 'center',
            })
            return;
        }
    
        if (user.newPassword.length < 6) {
            Swal.fire({
                icon: 'error',
                title: t('title swal'),
                text: t('the entered password must be at least 6 characters'),
                position: 'center',
            })
            return;
        }
    
        if (user.newPassword !== user.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: t('title swal'),
                text: t('the new password must match the confirm password'),
                position: 'center',
            })
            return;
        }
    
        try {
            // Verify current password
            const response = await axios.post('http://localhost:5000/verifyPassword', {
                userId,
                currentPassword: user.currentPassword
            });
    
            if (!response.data.success) {
                return;
            }
    
            // Update new password
            await axios.put(`http://localhost:5000/updateuser/${userId}`, { password: user.newPassword });
            Swal.fire({
                icon: 'success',
                title: t('title swal'),
                text: t('password changed successfully'),
                position: 'center',
            }).then(() => {
                window.location.pathname = '/';
            });
        } catch (error) {
            console.error('Error updating user:', error);
            Swal.fire({
                icon: 'error',
                title: t('title swal'),
                text: t('current password is incorrect'),
                position: 'center',
            })
        }
    };
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <>
            <div className="py-20 h-screen bg-[#faf9f8]">
                <div className="flex justify-center items-center mt-20">
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <h2 className="text-3xl font-semibold font-marcellus text-center">{t('change password')}</h2>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <p>{t('current password')} <span className="text-red-600">*</span></p>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            name="currentPassword"
                                            value={user.currentPassword}
                                            onChange={handleInputChange}
                                            className="px-2 py-1 border-[1px] border-primary w-[400px]"
                                        />
                                        <p className='absolute top-[6px] right-[10px] cursor-pointer' onClick={toggleCurrentPasswordVisibility}>
                                            {showCurrentPassword ? <IoEyeOutline size={20} /> : <IoEyeOffOutline size={20} />}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p>{t('new password')} <span className="text-red-600">*</span></p>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            name="newPassword"
                                            value={user.newPassword}
                                            onChange={handleInputChange}
                                            className="px-2 py-1 border-[1px] border-primary w-[400px]"
                                        />
                                        <p className='absolute top-[6px] right-[10px] cursor-pointer' onClick={toggleNewPasswordVisibility}>
                                            {showNewPassword ? <IoEyeOutline size={20} /> : <IoEyeOffOutline size={20} />}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p>{t('confirm new password')} <span className="text-red-600">*</span></p>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={user.confirmPassword}
                                            onChange={handleInputChange}
                                            className="px-2 py-1 border-[1px] border-primary w-[400px]"
                                        />
                                        <p className='absolute top-[6px] right-[10px] cursor-pointer' onClick={toggleConfirmPasswordVisibility}>
                                            {showConfirmPassword ? <IoEyeOutline size={20} /> : <IoEyeOffOutline size={20} />}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-4 mt-6">
                                <button type="submit" className="btn-primary text-white bg-primary hover:bg-primary/80">{t('change')}</button>
                                <Link to={'/myprofile'}>
                                    <button className="btn-primary hover:underline hover:bg-white hover:text-primary w-full">{t('cancel')}</button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;
