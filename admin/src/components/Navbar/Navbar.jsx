import { HiOutlineMenuAlt3, HiOutlineMenuAlt1 } from 'react-icons/hi'
import { CiBellOn, CiCircleRemove, CiLock, CiSearch, CiShoppingCart } from 'react-icons/ci'
import { GoChevronDown, GoComment, GoTasklist } from "react-icons/go";
import { MdOutlineAttachMoney } from "react-icons/md";

import Avatar from '../../assets/profile.jpg'
import { useState } from 'react';

const Navbar = ({ showSidebar, toggleShow }) => {
    const [showProfile, setShowProfile] = useState(false)

    return (
        <>
            <div className={`py-4 ${showSidebar ? 'ml-[300px]' : 'ml-0'} transition-all duration-1000`}>
                <div className="container">
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            <div className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary hover:text-white duration-300 cursor-pointer'>
                                <HiOutlineMenuAlt3 size={24} onClick={toggleShow} />
                            </div>
                            <div className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary hover:text-white duration-300 cursor-pointer'>
                                <CiSearch size={24} />
                            </div>
                        </div>

                        {/* Admin profile */}
                        <div className='flex gap-4 items-center'>
                            <div className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary hover:text-white duration-300 cursor-pointer'>
                                <CiShoppingCart size={24} />
                            </div>
                            <div className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary hover:text-white duration-300 cursor-pointer'>
                                <GoComment size={20} />
                            </div>
                            <div className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary hover:text-white duration-300 cursor-pointer'>
                                <CiBellOn size={24} />
                            </div>
                            <div className='flex gap-2 items-center cursor-pointer' onClick={() => setShowProfile(true)}>
                                <div>
                                    <img src={Avatar} alt="" className='w-8 h-8 object-cover rounded-full' />
                                </div>
                                <h3 className='font-semibold'>Hi Tam Minh</h3>
                                <GoChevronDown size={20} />

                            </div>
                            {/* dropdown */}
                            {showProfile && <div className='fixed top-16 right-10 bg-white min-w-[280px] shadow-md p-4'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className='font-semibold'>User Profile</h3>
                                    <div className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-third duration-300 cursor-pointer'>
                                        <CiCircleRemove size={24} onClick={() => setShowProfile(false)} />
                                    </div>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <div>
                                        <img src={Avatar} alt="" className='w-16 h-16 object-cover rounded-full' />
                                    </div>
                                    <div>
                                        <h2 className='font-semibold leading-[18px]'>Tam Minh</h2>
                                        <p className='text-sm text-secondary'>Administrator</p>
                                        <p className='text-sm text-secondary leading-3'>info@shop.com</p>
                                    </div>
                                </div>
                                <hr className='my-4' />
                                <div className='flex flex-col gap-2'>
                                    <p className='flex gap-2 items-center hover:bg-third duration-300 p-2 rounded-md cursor-pointer'><MdOutlineAttachMoney size={20} /> Account Settings</p>
                                    <p className='flex gap-2 items-center hover:bg-third duration-300 p-2 rounded-md cursor-pointer'><CiLock size={20} /> Messages & Emails</p>
                                    <p className='flex gap-2 items-center hover:bg-third duration-300 p-2 rounded-md cursor-pointer'><GoTasklist size={20} /> Tasks</p>
                                </div>
                                <hr className='my-4' />
                                <button className='btn-primary w-full'>Logout</button>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar