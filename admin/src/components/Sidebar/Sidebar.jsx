import { LuKanbanSquare, LuLayoutDashboard } from "react-icons/lu";
import { CiCalendar, CiEdit, CiShoppingCart } from "react-icons/ci";
import { TbUsersPlus } from "react-icons/tb";
import { IoColorFillOutline } from "react-icons/io5";
import { PiChartLineLight, PiChartPieSliceLight } from "react-icons/pi";
import { FaCaretUp, FaChartArea } from "react-icons/fa6";
import { FaRegChartBar } from "react-icons/fa";
import { RiDoubleQuotesL } from "react-icons/ri";
import { MdOutlineCategory, MdOutlinePhotoSizeSelectLarge, MdOutlinePayments, MdOutlineProductionQuantityLimits, MdOutlineStackedBarChart } from "react-icons/md";
import { HiOutlineChartBar } from "react-icons/hi";
import { GrStatusDisabled } from "react-icons/gr";
import { GiMoneyStack } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Logo from '../../assets/logo.png'

const Sidebar = ({ showSidebar }) => {
    const { t } = useTranslation();

    const activeLink = 'flex items-center gap-2 p-3 bg-primary text-white rounded-md cursor-pointer';
    const normalLink = 'flex items-center gap-2 p-3 hover:bg-primary hover:text-white rounded-md cursor-pointer duration-300';

    return (
        <>
            <div className={`fixed top-0 ${showSidebar ? 'left-0' : '-left-[100%]'} bottom-0 w-[20%] bg-white overflow-y-scroll transition-all duration-1000`}>
                <div className='p-4 pt-4 select-none'>
                    <div className="mt-2">
                        <img src={Logo} alt="" className='w-36' />
                    </div>
                    <div className="mt-12 space-y-6">
                        {/* Dashboard */}
                        <div className="space-y-2">
                            <h3 className=" text-secondary uppercase">{t('dashboard')}</h3>
                            <NavLink to={'/'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <LuLayoutDashboard />
                                <p>E-commerce</p>
                            </NavLink>
                        </div>

                        {/* Attributes */}
                        <div className="space-y-2">
                            <h3 className=" text-secondary uppercase">{t('attributes')}</h3>
                            <NavLink to={'/listsize'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <MdOutlinePhotoSizeSelectLarge />
                                <p>{t('sizes')}</p>
                            </NavLink>
                            <NavLink to={'/liststatus'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <GrStatusDisabled />
                                <p>{t('status')}</p>
                            </NavLink>
                            <NavLink to={'/listpayment'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <MdOutlinePayments />
                                <p>{t('payment')}</p>
                            </NavLink>
                            <NavLink to={'/listpay'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <GiMoneyStack />
                                <p>{t('pay')}</p>
                            </NavLink>
                        </div>

                        {/* Pages */}
                        <div className="space-y-2">
                            <h3 className=" text-secondary uppercase">{t('pages')}</h3>
                            <NavLink to={'/listcategory'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <MdOutlineCategory />
                                <p>{t('categories')}</p>
                            </NavLink>
                            <NavLink to={'/listproduct'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <MdOutlineProductionQuantityLimits />
                                <p>{t('products')}</p>
                            </NavLink>
                            <NavLink to={'/listorder'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <CiShoppingCart />
                                <p>{t('orders')}</p>
                            </NavLink>
                            <NavLink to={'/listcustomer'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <TbUsersPlus />
                                <p>{t('customers')}</p>
                            </NavLink>
                        </div>

                        {/* Apps */}
                        {/* <div className="space-y-2">
                            <h3 className="text-secondary uppercase">{t('apps')}</h3>
                            <NavLink to={'/kanban'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <LuKanbanSquare />
                                <p>{t('kanban')}</p>
                            </NavLink>
                            <NavLink to={'/editor'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <CiEdit />
                                <p>{t('editor')}</p>
                            </NavLink>
                            <NavLink to={'/calendar'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <CiCalendar />
                                <p>{t('calendar')}</p>
                            </NavLink>
                            <NavLink to={'/color-picker'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <IoColorFillOutline />
                                <p>{t('color-picker')}</p>
                            </NavLink>
                        </div> */}
                        
                        {/* Charts */}
                        <div className="space-y-2">
                            <h3 className="text-secondary uppercase">{t('charts')}</h3>
                            <NavLink to={'/line'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <PiChartLineLight />
                                <p>{t('line')}</p>
                            </NavLink>
                            <NavLink to={'/area'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <FaChartArea />
                                <p>{t('area')}</p>
                            </NavLink>
                            <NavLink to={'/bar'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <FaRegChartBar />
                                <p>{t('bar')}</p>
                            </NavLink>
                            <NavLink to={'/pie'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <PiChartPieSliceLight />
                                <p>{t('pie')}</p>
                            </NavLink>
                            <NavLink to={'/financial'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <RiDoubleQuotesL />
                                <p>{t('financial')}</p>
                            </NavLink>
                            <NavLink to={'/color-mapping'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <HiOutlineChartBar />
                                <p>{t('color mapping')}</p>
                            </NavLink>
                            <NavLink to={'/pyramid'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <FaCaretUp />
                                <p>{t('pyramid')}</p>
                            </NavLink>
                            <NavLink to={'/stacked'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <MdOutlineStackedBarChart />
                                <p>{t('stacked')}</p>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar