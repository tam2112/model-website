import { FaCircleUser } from 'react-icons/fa6';
import { HiOutlineXMark } from 'react-icons/hi2';
import { Link, NavLink } from 'react-router-dom';

const NavLinks = [
    { id: 1, name: 'HOME', link: '/' },
    { id: 2, name: 'WOMEN', link: '/womens' },
    { id: 3, name: 'MEN', link: '/mens' },
    { id: 4, name: 'KIDS', link: '/kids' },
];

const ResponsiveMenu = ({ showMenu, setShowMenu }) => {
    return (
        <>
            <div
                className={`${
                    showMenu ? 'left-0' : '-left-full'
                } lg:hidden fixed top-0 z-[9999] bg-white h-screen sm:w-[50%] w-[100%] rounded-r-xl shadow-md flex flex-col justify-between px-8 pb-6 pt-16 transition-all duration-300`}
            >
                <div className="absolute top-4 right-4">
                    <HiOutlineXMark size={30} onClick={() => setShowMenu(false)} />
                </div>
                <div className="pt-10">
                    <div className="flex items-center justify-start gap-3">
                        <FaCircleUser size={50} />
                        <div>
                            <h1>Hello User</h1>
                            <h1>Premium user</h1>
                        </div>
                    </div>
                    <nav className="mt-12">
                        <ul className="flex flex-col gap-4">
                            {NavLinks.map((nav) => (
                                <li key={nav.id}>
                                    <NavLink
                                        to={nav.link}
                                        activeclass="active"
                                        className="hover:border-b-2 hover:border-black font-semibold text-primary"
                                        onClick={() => setShowMenu(false)}
                                    >
                                        {nav.name}
                                    </NavLink>
                                </li>
                            ))}
                            <li className="border-t-2 pt-2">
                                <Link to="/" className="font-semibold text-primary" onClick={() => setShowMenu(false)}>
                                    LOG OUT
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default ResponsiveMenu;
