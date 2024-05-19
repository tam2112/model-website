import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

import FooterLogo from '../Assets/logo.png';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const FooterLinks = [
    {
        id: 1,
        name: 'Customers',
        links: [
            { id: 1, name: 'Promotions', link: '/' },
            { id: 2, name: 'Delivery', link: '/' },
            { id: 3, name: 'Payment', link: '/' },
            { id: 4, name: 'Gift card', link: '/' },
        ],
    },
    {
        id: 2,
        name: 'About',
        links: [
            { id: 1, name: 'News', link: '/' },
            { id: 2, name: 'Public Offers', link: '/' },
            { id: 3, name: 'User Agreement', link: '/' },
            { id: 4, name: 'Privacy Policy', link: '/' },
        ],
    },
];

const Footer = () => {
    const [allCategories, setAllCategories] = useState([]);

    const fetchAllCategories = async () => {
        // Fetch danh sách các danh mục từ API
        try {
            const response = await fetch('http://localhost:5000/allcategories');
            const data = await response.json();
            setAllCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    useEffect(() => {
        fetchAllCategories();
    }, [])

    return (
        <>
            <div data-aos='zoom-in'>
                <div className="container">
                    <div className="flex flex-wrap justify-between items-center border-t-2 pt-8 pb-12 space-y-10 lg:space-y-0">
                        {/* header */}
                        <div className="space-y-6">
                            <img src={FooterLogo} alt="logo" className="lg:w-32 sm:w-28 w-24" />
                            <p className="lg:max-w-[400px] max-w-[300px] text-sm">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Id quasi architecto vero natus
                                tempore, nesciunt odit modi eius voluptatum inventore?
                            </p>
                            <div className="flex gap-4">
                                <a href="/" className="bg-primary rounded-full p-2 text-white text-center">
                                    <FaFacebookF />
                                </a>
                                <a href="/" className="bg-primary rounded-full p-2 text-white text-center">
                                    <FaInstagram />
                                </a>
                                <a href="/" className="bg-primary rounded-full p-2 text-white text-center">
                                    <FaTwitter />
                                </a>
                            </div>
                        </div>

                        {/* Footer links */}
                        <div className="grid grid-cols-3 gap-20 uppercase mt-0">
                            <div>
                                <h3 className='pb-4 font-semibold uppercase'>Navigation</h3>
                                <ul className='space-y-2'>
                                    {allCategories.map((cat) => (
                                        <li key={cat.id}>
                                            <Link
                                                to={`/${cat.name}`}
                                                className="text-gray-500 hover:text-primary text-sm uppercase"
                                            >
                                                {cat.name}
                                            </Link>
                                        </li>
                                    ))}
                                    <li>
                                        <Link
                                            to="/"
                                            className="text-gray-500 hover:text-primary text-sm uppercase"
                                        >
                                            Blog
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            {FooterLinks.map((item) => (
                                <div key={item.id}>
                                    <h3 className="pb-4 font-semibold">{item.name}</h3>
                                    <ul className="space-y-2">
                                        {item.links.map((link) => (
                                            <li key={link.id}>
                                                <Link
                                                    to={link.link}
                                                    className="text-gray-500 hover:text-primary text-sm"
                                                >
                                                    {link.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer;
