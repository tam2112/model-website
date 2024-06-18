import { useState } from 'react';
import { useTranslation } from 'react-i18next'

import { HiOutlineMenuAlt3, HiOutlineMenuAlt1 } from 'react-icons/hi'
import { CiBellOn, CiCircleRemove, CiLock, CiSearch, CiShoppingCart, CiGlobe } from 'react-icons/ci'
import { GoChevronDown, GoComment, GoTasklist } from "react-icons/go";
import { MdOutlineAttachMoney } from "react-icons/md";

import Avatar from '../../assets/profile.jpg'
import VNFlag from '../../assets/vietnam-flag.png'
import EngFlag from '../../assets/english-flag.png'

const Navbar = ({ showSidebar, toggleShow }) => {
    const { t, i18n } = useTranslation();

    const [showProfile, setShowProfile] = useState(false)

    const [showLanguages, setShowLanguages] = useState(false)

    const toggleShowLanguages = () => {
        setShowLanguages(!showLanguages)
    }

    const handleLanguageChange = (lng) => {
        console.log(`Changing language to: ${lng}`);
        i18n.changeLanguage(lng);
        setShowLanguages(false)
    }

    return (
        <>
            <div className={`hidden sm:block py-4 ${showSidebar ? 'lg:ml-[300px] ml-0' : 'ml-0'} transition-all duration-1000`}>
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
                            <div className="relative cursor-pointer">
                                <div onClick={toggleShowLanguages}>
                                    <CiGlobe className='text-2xl cursor-pointer' />
                                </div>
                                {showLanguages && <div className='absolute z-50 top-[34px] right-[4px] rounded-sm bg-white shadow-lg min-w-[130px]'>
                                    <p onClick={() => handleLanguageChange('vi')} className={`flex items-center px-3 py-2 gap-2 hover:bg-primary/10 rounded-sm select-none ${i18n.language === 'vi' ? 'bg-primary/10 hover:bg-white' : ''}`}>
                                        <img src={VNFlag} alt="" className='w-4 object-cover' /> {t('vietnam flag')}
                                    </p>
                                    <p onClick={() => handleLanguageChange('en')} className={`flex items-center px-3 py-2 gap-2 hover:bg-primary/10 rounded-sm select-none ${i18n.language === 'en' ? 'bg-primary/10 hover:bg-white' : ''}`}>
                                        <img src={EngFlag} alt="" className='w-4 object-cover' /> {t('english flag')}
                                    </p>
                                </div>}
                            </div>
                            <div className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary hover:text-white duration-300 cursor-pointer'>
                                <CiShoppingCart size={24} />
                            </div>
                            <div className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary hover:text-white duration-300 cursor-pointer'>
                                <GoComment size={20} />
                            </div>
                            <div className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary hover:text-white duration-300 cursor-pointer'>
                                <CiBellOn size={24} />
                            </div>
                            <div className='flex gap-2 items-center cursor-pointer select-none' onClick={() => setShowProfile(true)}>
                                <div>
                                    <img src={Avatar} alt="" className='w-8 h-8 object-cover rounded-full' />
                                </div>
                                <h3 className='font-semibold'>{t('hi admin')}</h3>
                                <GoChevronDown size={20} />

                            </div>
                            {/* dropdown */}
                            {showProfile && <div className='fixed top-16 right-10 bg-white min-w-[280px] shadow-md p-4'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className='font-semibold'>{t('user profile')}</h3>
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
                                        <p className='text-sm text-secondary'>{t('administrator')}</p>
                                        <p className='text-sm text-secondary leading-3'>info@shop.com</p>
                                    </div>
                                </div>
                                <hr className='my-4' />
                                <div className='flex flex-col gap-2'>
                                    <p className='flex gap-2 items-center hover:bg-third duration-300 p-2 rounded-md cursor-pointer'><MdOutlineAttachMoney size={20} /> {t('account settings')}</p>
                                    <p className='flex gap-2 items-center hover:bg-third duration-300 p-2 rounded-md cursor-pointer'><CiLock size={20} /> {t('messages email')}</p>
                                    <p className='flex gap-2 items-center hover:bg-third duration-300 p-2 rounded-md cursor-pointer'><GoTasklist size={20} /> {t('tasks')}</p>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>

            <div className={`sm:hidden block py-4 ${showSidebar ? 'lg:ml-[300px] ml-0' : 'ml-0'} transition-all duration-1000`}>
                <div className="container">
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-4'>
                            <div className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary hover:text-white duration-300 cursor-pointer'>
                                <HiOutlineMenuAlt3 size={24} onClick={toggleShow} />
                            </div>
                        </div>
                        {/* Admin profile */}
                        <div className='flex gap-4 items-center'>
                            <div className='flex gap-2 items-center cursor-pointer select-none' onClick={() => setShowProfile(true)}>
                                <div>
                                    <img src={Avatar} alt="" className='w-6 h-6 object-cover rounded-full' />
                                </div>
                                <h3 className='font-semibold'>{t('hi admin')}</h3>
                                <GoChevronDown size={20} />
                            </div>
                            {/* dropdown */}
                            {showProfile && <div className='fixed top-16 right-10 bg-white min-w-[280px] shadow-md p-4'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className='font-semibold'>{t('user profile')}</h3>
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
                                        <p className='text-sm text-secondary'>{t('administrator')}</p>
                                        <p className='text-sm text-secondary leading-3'>info@shop.com</p>
                                    </div>
                                </div>
                                <hr className='my-4' />
                                <div className='flex flex-col gap-2'>
                                    <p className='flex gap-2 items-center hover:bg-third duration-300 p-2 rounded-md cursor-pointer'><MdOutlineAttachMoney size={20} /> {t('account settings')}</p>
                                    <p className='flex gap-2 items-center hover:bg-third duration-300 p-2 rounded-md cursor-pointer'><CiLock size={20} /> {t('messages email')}</p>
                                    <p className='flex gap-2 items-center hover:bg-third duration-300 p-2 rounded-md cursor-pointer'><GoTasklist size={20} /> {t('tasks')}</p>
                                </div>
                            </div>}
                        </div>
                        {/* Languages */}
                        <div className="relative cursor-pointer">
                            <div onClick={toggleShowLanguages}>
                                <CiGlobe className='text-2xl cursor-pointer' />
                            </div>
                            {showLanguages && <div className='absolute z-50 top-[34px] right-[4px] rounded-sm bg-white shadow-lg min-w-[130px]'>
                                <p onClick={() => handleLanguageChange('vi')} className={`flex items-center px-3 py-2 gap-2 hover:bg-primary/10 rounded-sm select-none ${i18n.language === 'vi' ? 'bg-primary/10 hover:bg-white' : ''}`}>
                                    <img src={VNFlag} alt="" className='w-4 object-cover' /> {t('vietnam flag')}
                                </p>
                                <p onClick={() => handleLanguageChange('en')} className={`flex items-center px-3 py-2 gap-2 hover:bg-primary/10 rounded-sm select-none ${i18n.language === 'en' ? 'bg-primary/10 hover:bg-white' : ''}`}>
                                    <img src={EngFlag} alt="" className='w-4 object-cover' /> {t('english flag')}
                                </p>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar