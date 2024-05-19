import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import AvatarDefault from '../Assets/default-avatar.jpg';
import { ShopContext } from '../../Context/ShopContext';

// Function to format date to yyyy-MM-dd
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const MyProfile = () => {
    const { userId } = useContext(ShopContext);

    const [user, setUser] = useState({
        email: '',
        name: '',
        birthday: '',
        phone: '',
        gender: '',
        avatar: '',
        address: '',
        city: '',
        province: '',
        district: '',
        commune: '',
        country: '',
    });

    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    useEffect(() => {
        window.document.title = 'My profile'
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:5000/detailsuser/${userId}`)
            .then(response => {
                const fetchedUser = response.data.user;
                setUser({
                    ...fetchedUser,
                    birthday: formatDate(fetchedUser.birthday) // Format the birthday date
                });
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            });
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setUser(prevUser => ({
            ...prevUser,
            avatar: e.target.files[0]
        }));
    };

    const updateUser = async (updatedUser) => {
        try {
            await axios.put(`http://localhost:5000/updateuser/${userId}`, updatedUser);
            setUser(updatedUser);
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };

    const handleDetailsSubmit = async (e) => {
        e.preventDefault();

        // Create a copy of the user state to update the user data
        const updatedUser = { ...user };

        // Handle avatar upload only if it has changed
        if (user.avatar instanceof File) {
            let formData = new FormData();
            formData.append('image', user.avatar);

            try {
                const uploadResponse = await fetch('http://localhost:5000/uploadsingle', {
                    method: 'POST',
                    body: formData,
                });
                const uploadData = await uploadResponse.json();

                if (uploadData.success) {
                    updatedUser.avatar = uploadData.image_url;
                } else {
                    console.log('Failed to upload avatar');
                    return; // Exit the function if avatar upload fails
                }
            } catch (error) {
                console.error('Error uploading avatar:', error);
                return; // Exit the function if there's an error in avatar upload
            }
        }

        // Update user data with the possibly updated avatar URL
        updateUser(updatedUser);
        setIsEditingDetails(false);
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();

        // Directly use the user state without reading from the form elements
        const updatedUser = { ...user };
    
        updateUser(updatedUser);
        setIsEditingAddress(false);
    };

    return (
        <>
            <div className="py-20 bg-[#faf9f8]">
                <div className="container px-52">
                    <div>
                        <div className='bg-[url("https://fullstack.edu.vn/static/media/cover-profile.3fb9fed576da4b28386a.png")] bg-center bg-no-repeat bg-cover w-full h-[300px] rounded-3xl relative'>
                            <div className='absolute top-[200px] left-[40px] pr-[40px] flex items-center gap-6 w-full'>
                                <div className='border-white border-8 rounded-full'>
                                    <img src={user.avatar === '' ? AvatarDefault : user.avatar} alt="" className='w-44 h-44 rounded-full object-cover' />
                                </div>
                                <h2 className='mt-20 font-bold text-2xl'>{user.name}</h2>
                            </div>
                        </div>
                    </div>
                    <div className='mt-32'>
                        <div className='grid grid-cols-2 gap-8'>
                            <form onSubmit={handleDetailsSubmit} className='space-y-6'>
                                <div className='p-8 bg-white rounded-2xl space-y-10'>
                                    <div className='flex justify-between items-center'>
                                        <h2 className='font-semibold'>My Details</h2>
                                        {isEditingDetails ? (
                                            <div className='flex gap-2'>
                                                <button type="submit" className='underline cursor-pointer'>Save</button>
                                                <button type="button" onClick={() => setIsEditingDetails(false)} className='underline cursor-pointer'>Cancel</button>
                                            </div>
                                        ) : (
                                            <p onClick={() => setIsEditingDetails(true)} className='underline cursor-pointer'>Edit</p>
                                        )}
                                    </div>
                                    <div className='space-y-4'>
                                        <div className='text-primary space-y-2'>
                                            <p className='text-sm text-primary/60'>Email</p>
                                            <input onChange={handleInputChange} type="email" name='email' value={user.email} className='border-b-[1px] border-primary px-2 py-1 rounded-sm w-full disabled:cursor-not-allowed disabled:bg-white' disabled={!isEditingDetails} />
                                        </div>
                                        <div className='text-primary space-y-2'>
                                            <p className='text-sm text-primary/60'>Name</p>
                                            <input onChange={handleInputChange} type="text" name='name' value={user.name} className='border-b-[1px] border-primary px-2 py-1 rounded-sm w-full disabled:cursor-not-allowed disabled:bg-white' disabled={!isEditingDetails} />
                                        </div>
                                        <div className='text-primary space-y-2'>
                                            <p className='text-sm text-primary/60'>Date of birth</p>
                                            <input onChange={handleInputChange} type="date" name='birthday' value={user.birthday} className='border-b-[1px] border-primary px-2 py-1 rounded-sm w-full disabled:cursor-not-allowed disabled:bg-white' disabled={!isEditingDetails} />
                                        </div>
                                        <div className='text-primary space-y-2'>
                                            <p className='text-sm text-primary/60'>Phone Number</p>
                                            <input onChange={handleInputChange} type="text" name='phone' value={user.phone} className='border-b-[1px] border-primary px-2 py-1 rounded-sm w-full disabled:cursor-not-allowed disabled:bg-white' disabled={!isEditingDetails} />
                                        </div>
                                        <div className='text-primary space-y-2'>
                                            <p className='text-sm text-primary/60'>Gender</p>
                                            <select onChange={handleInputChange} name="gender" value={user.gender} className='w-full px-2 py-1 border-b-[1px] border-primary rounded-sm disabled:cursor-not-allowed disabled:bg-white' disabled={!isEditingDetails}>
                                                <option value="skip">Select gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="not">Prefer not to say</option>
                                            </select>
                                        </div>
                                        <div className='text-primary space-y-2'>
                                            <div>
                                                <p className='mb-4'>Avatar</p>
                                                <label htmlFor="file-input-image">
                                                    <img src={user.avatar || AvatarDefault} alt="" className='w-12 h-12 rounded-full object-cover' />
                                                </label>
                                                <input onChange={handleImageChange} type="file" name="avatar" id="file-input-image" hidden disabled={!isEditingDetails} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <form onSubmit={handleAddressSubmit} className='space-y-6'>
                                <div className='p-8 bg-white rounded-2xl space-y-10 h-full'>
                                    <div className='flex justify-between items-center'>
                                        <h2 className='font-semibold'>Address</h2>
                                        {isEditingAddress ? (
                                            <div className='flex gap-2'>
                                                <button type="submit" className='underline cursor-pointer'>Save</button>
                                                <button type="button" onClick={() => setIsEditingAddress(false)} className='underline cursor-pointer'>Cancel</button>
                                            </div>
                                        ) : (
                                            <p onClick={() => setIsEditingAddress(true)} className='underline cursor-pointer'>Edit</p>
                                        )}
                                    </div>
                                    <div className='space-y-4'>
                                        <div className='text-primary space-y-2'>
                                            <p className='text-sm text-primary/60'>Address</p>
                                            <input onChange={handleInputChange} type="text" name='address' value={user.address} className='border-b-[1px] border-primary px-2 py-1 rounded-sm w-full disabled:cursor-not-allowed disabled:bg-white' disabled={!isEditingAddress} />
                                        </div>
                                        <div className='text-primary space-y-2'>
                                            <p className='text-sm text-primary/60'>City</p>
                                            <input onChange={handleInputChange} type="text" name='city' value={user.city} className='border-b-[1px] border-primary px-2 py-1 rounded-sm w-full disabled:cursor-not-allowed disabled:bg-white' disabled={!isEditingAddress} />
                                        </div>
                                        <div className='text-primary space-y-2'>
                                            <p className='text-sm text-primary/60'>Province</p>
                                            <input onChange={handleInputChange} type="text" name='province' value={user.province} className='border-b-[1px] border-primary px-2 py-1 rounded-sm w-full disabled:cursor-not-allowed disabled:bg-white' disabled={!isEditingAddress} />
                                        </div>
                                        <div className='text-primary space-y-2'>
                                            <p className='text-sm text-primary/60'>District</p>
                                            <input onChange={handleInputChange} type="text" name='district' value={user.district} className='border-b-[1px] border-primary px-2 py-1 rounded-sm w-full disabled:cursor-not-allowed disabled:bg-white' disabled={!isEditingAddress} />
                                        </div>
                                        <div className='text-primary space-y-2'>
                                            <p className='text-sm text-primary/60'>Commune</p>
                                            <input onChange={handleInputChange} type="text" name='commune' value={user.commune} className='border-b-[1px] border-primary px-2 py-1 rounded-sm w-full disabled:cursor-not-allowed disabled:bg-white' disabled={!isEditingAddress} />
                                        </div>
                                        <div className='text-primary space-y-2'>
                                            <p className='text-sm text-primary/60'>Country</p>
                                            <input onChange={handleInputChange} type="text" name='country' value={user.country} className='border-b-[1px] border-primary px-2 py-1 rounded-sm w-full disabled:cursor-not-allowed disabled:bg-white' disabled={!isEditingAddress} />
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className='p-8 bg-white rounded-2xl space-y-10'>
                                <div className='flex justify-between items-center'>
                                    <h2 className='font-semibold uppercase'>Privacy</h2>
                                </div>
                                <div className='space-y-4'>
                                    <div className='text-primary'>
                                        <Link to={'changepassword'}>
                                            <p className='hover:underline cursor-pointer'>Change password</p>
                                        </Link>
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

export default MyProfile;
