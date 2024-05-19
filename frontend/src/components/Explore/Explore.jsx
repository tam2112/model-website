import { Link, NavLink } from 'react-router-dom';

import Item from '../Item/Item';
import { useEffect, useState } from 'react';

const Explore = () => {
    const [explore, setExplore] = useState([])

    useEffect(() => {
        fetch('http://localhost:5000/explore')
            .then((res) => res.json())
            .then((data) => setExplore(data))
    }, [])

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
            <div className="py-10 min-h-screen overflow-hidden">
                <div className="container">
                    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
                        <div className="flex flex-col sm:justify-between">
                            <h1 className="lg:text-6xl sm:text-5xl text-4xl font-bold text-primary font-marcellus" data-aos='fade-up-right'>
                                Explore Now With Our Best Collection
                            </h1>
                            <ul className="mt-12 flex sm:flex-col sm:items-start items-center gap-14 sm:gap-8">
                                {allCategories.map((cat) => (
                                    <li key={cat.id} data-aos='fade-right'>
                                        <NavLink to={`/${cat.name}`} className="text-2xl text-primary font-semibold capitalize">
                                            {cat.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {explore.map((item, index) => (
                            <Item
                                key={index}
                                id={item.id}
                                image={item.main_img}
                                className={'w-[480px] h-[600px] object-cover hover:scale-95 duration-300'}
                            />
                        ))}
                        <div className="lg:border-b-2 flex items-end lg:justify-end justify-center">
                            <div><Link to={'/men'} className="hidden lg:block font-bold py-2" data-aos='fade-up'>See More</Link></div>
                            <div><Link to={'/men'} className="lg:hidden block btn-primary w-full" data-aos='fade-up'>See More</Link></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Explore;
