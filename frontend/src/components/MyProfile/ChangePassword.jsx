import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import axios from "axios";
import { ShopContext } from "../../Context/ShopContext";
import Swal from 'sweetalert2'

const ChangePassword = () => {
    const { userId } = useContext(ShopContext);
    const [user, setUser] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    useEffect(() => {
        window.document.title = 'Change password'
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!user.currentPassword || !user.newPassword || !user.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Thông báo',
                text: 'Vui lòng nhập đầy đủ thông tin',
                position: 'center',
            })
            return;
        }
    
        if (user.newPassword.length < 6) {
            Swal.fire({
                icon: 'error',
                title: 'Thông báo',
                text: 'Mật khẩu nhập vào phải tối thiểu 6 ký tự',
                position: 'center',
            })
            return;
        }
    
        if (user.newPassword !== user.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Thông báo',
                text: 'Mật khẩu mới phải trùng với Xác nhận mật khẩu',
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
                setError('Current password is incorrect');
                return;
            }
    
            // Update new password
            await axios.put(`http://localhost:5000/updateuser/${userId}`, { password: user.newPassword });
            Swal.fire({
                icon: 'success',
                title: 'Thông báo',
                text: 'Thay đổi mật khẩu thành công',
                position: 'center',
            }).then(() => {
                window.location.pathname = '/';
            });
        } catch (error) {
            console.error('Error updating user:', error);
            Swal.fire({
                icon: 'error',
                title: 'Thông báo',
                text: 'Mật khẩu hiện tại không đúng',
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
                            <h2 className="text-3xl font-semibold font-marcellus text-center">Change Password</h2>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <p>Current password <span className="text-red-600">*</span></p>
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
                                    <p>New password <span className="text-red-600">*</span></p>
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
                                    <p>Confirm new password <span className="text-red-600">*</span></p>
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
                                <button type="submit" className="btn-primary text-white bg-primary hover:bg-primary/80">Change Password</button>
                                <Link to={'/myprofile'}>
                                    <button className="btn-primary hover:underline hover:bg-white hover:text-primary w-full">Cancel</button>
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
