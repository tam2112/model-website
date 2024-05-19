import { LuKanbanSquare, LuLayoutDashboard } from "react-icons/lu";
import { CiCalendar, CiEdit, CiShoppingCart } from "react-icons/ci";
import { TbUsersPlus } from "react-icons/tb";
import { IoColorFillOutline } from "react-icons/io5";
import { PiChartLineLight, PiChartPieSliceLight } from "react-icons/pi";
import { FaCaretUp, FaChartArea } from "react-icons/fa6";
import { FaRegChartBar } from "react-icons/fa";
import { RiDoubleQuotesL } from "react-icons/ri";
import { MdOutlineCategory, MdOutlinePhotoSizeSelectLarge, MdOutlinePayments, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { HiOutlineChartBar } from "react-icons/hi";
import { GrStatusDisabled } from "react-icons/gr";
import { GiMoneyStack } from "react-icons/gi";
import { NavLink } from "react-router-dom";

import Logo from '../../assets/logo.png'

const Sidebar = ({ showSidebar }) => {
    const activeLink = 'flex items-center gap-2 p-3 bg-primary text-white rounded-md cursor-pointer';
    const normalLink = 'flex items-center gap-2 p-3 hover:bg-primary hover:text-white rounded-md cursor-pointer duration-300';

    return (
        <>
            <div className={`fixed top-0 ${showSidebar ? 'left-0' : '-left-[100%]'} bottom-0 w-[20%] bg-white overflow-y-scroll transition-all duration-1000`}>
                <div className='p-4 pt-4'>
                    <div className="mt-2">
                        <img src={Logo} alt="" className='w-36' />
                    </div>
                    <div className="mt-12 space-y-6">
                        {/* Dashboard */}
                        <div className="space-y-2">
                            <h3 className=" text-secondary">DASHBOARD</h3>
                            <NavLink to={'/'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <LuLayoutDashboard />
                                <p>Model Web</p>
                            </NavLink>
                        </div>

                        {/* Attributes */}
                        <div className="space-y-2">
                            <h3 className=" text-secondary uppercase">Attributes</h3>
                            <NavLink to={'/listsize'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <MdOutlinePhotoSizeSelectLarge />
                                <p>Sizes</p>
                            </NavLink>
                            <NavLink to={'/liststatus'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <GrStatusDisabled />
                                <p>Status</p>
                            </NavLink>
                            <NavLink to={'/listpayment'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <MdOutlinePayments />
                                <p>Payment</p>
                            </NavLink>
                            <NavLink to={'/listpay'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <GiMoneyStack />
                                <p>Pay</p>
                            </NavLink>
                        </div>

                        {/* Pages */}
                        <div className="space-y-2">
                            <h3 className=" text-secondary">PAGES</h3>
                            <NavLink to={'/listcategory'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <MdOutlineCategory />
                                <p>Categories</p>
                            </NavLink>
                            <NavLink to={'/listproduct'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <MdOutlineProductionQuantityLimits />
                                <p>Products</p>
                            </NavLink>
                            <NavLink to={'/listorder'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <CiShoppingCart />
                                <p>Orders</p>
                            </NavLink>
                            <NavLink to={'/listcustomer'} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                                <TbUsersPlus />
                                <p>Customers</p>
                            </NavLink>
                        </div>

                        {/* Apps */}
                        <div className="space-y-2">
                            <h3 className=" text-secondary">APPS</h3>
                            <div className="flex items-center gap-2 p-3 hover:bg-primary hover:text-white rounded-md cursor-pointer duration-300">
                                <CiCalendar />
                                <p>Calendar</p>
                            </div>
                            <div className="flex items-center gap-2 p-3 hover:bg-primary hover:text-white rounded-md cursor-pointer duration-300">
                                <LuKanbanSquare />
                                <p>Kandan</p>
                            </div>
                            <div className="flex items-center gap-2 p-3 hover:bg-primary hover:text-white rounded-md cursor-pointer duration-300">
                                <CiEdit />
                                <p>Editors</p>
                            </div>
                            <div className="flex items-center gap-2 p-3 hover:bg-primary hover:text-white rounded-md cursor-pointer duration-300">
                                <IoColorFillOutline />
                                <p>Color-Picker</p>
                            </div>
                        </div>
                        
                        {/* Charts */}
                        <div className="space-y-2">
                            <h3 className="text-secondary">CHARTS</h3>
                            <div className="flex items-center gap-2 p-3 hover:bg-primary hover:text-white rounded-md cursor-pointer duration-300">
                                <PiChartLineLight />
                                <p>Line</p>
                            </div>
                            <div className="flex items-center gap-2 p-3 hover:bg-primary hover:text-white rounded-md cursor-pointer duration-300">
                                <FaChartArea />
                                <p>Area</p>
                            </div>
                            <div className="flex items-center gap-2 p-3 hover:bg-primary hover:text-white rounded-md cursor-pointer duration-300">
                                <FaRegChartBar />
                                <p>Bar</p>
                            </div>
                            <div className="flex items-center gap-2 p-3 hover:bg-primary hover:text-white rounded-md cursor-pointer duration-300">
                                <PiChartPieSliceLight />
                                <p>Pie</p>
                            </div>
                            <div className="flex items-center gap-2 p-3 hover:bg-primary hover:text-white rounded-md cursor-pointer duration-300">
                                <RiDoubleQuotesL />
                                <p>Financial</p>
                            </div>
                            <div className="flex items-center gap-2 p-3 hover:bg-primary hover:text-white rounded-md cursor-pointer duration-300">
                                <HiOutlineChartBar />
                                <p>Color-Mapping</p>
                            </div>
                            <div className="flex items-center gap-2 p-3 hover:bg-primary hover:text-white rounded-md cursor-pointer duration-300">
                                <FaCaretUp />
                                <p>Pyramid</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar