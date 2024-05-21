import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Item from '../Item/Item';

const TrendingProd = () => {
    const { t } = useTranslation()

    const [trending, setTrending] = useState([])

    useEffect(() => {
        fetch('http://localhost:5000/trending')
            .then((res) => res.json())
            .then((data) => setTrending(data))
    }, [])

    return (
        <>
            <div className="py-10 lg:pt-32 sm:pt-12 pt-8">
                <div className="container">
                    <div>
                        <div>
                            {trending.map((item, index) => (
                                <div key={item.id} className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                                    <div className="sm:space-y-12 space-y-4 max-w-[400px]" data-aos='fade-up'>
                                        <h1 className="lg:text-6xl sm:text-5xl text-4xl text-primary font-marcellus font-bold max-w-[300px]">
                                            {t('trending')}
                                        </h1>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h1 className="line-clamp-2 font-semibold max-w-[250px]">
                                                    {item.name}
                                                </h1>
                                                <p className="font-semibold">${item.price}.00</p>
                                            </div>
                                            <p className="text-sm">User 32392</p>
                                            <p className="line-clamp-3 text-sm" style={{ marginBottom: '20px' }}>
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci,
                                                laboriosam. Illum ab sapiente veniam placeat animi quidem corrupti,
                                                totam dignissimos.
                                            </p>
                                            <Link to={`/product/${item.id}`} className="btn-primary">
                                                {t('shop')}
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="sm:mt-0 mt-2">
                                        <Item
                                            id={item.id}
                                            key={index}
                                            image={item.main_img}
                                            className={'h-[640px] w-[500px] object-cover duration-300 hover:scale-95'}
                                        />
                                    </div>
                                    <div className="">
                                        <Item
                                            id={item.id}
                                            key={index}
                                            image={item.sub_img[0]}
                                            className={'h-[640px] w-[500px] object-cover duration-300 hover:scale-95'}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="border-b-2 pt-14"></div>
                </div>
            </div>
        </>
    );
};

export default TrendingProd;
