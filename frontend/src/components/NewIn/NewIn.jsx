import { GrPrevious, GrNext } from 'react-icons/gr';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Item from '../Item/Item';

const NewIn = () => {
    const { t } = useTranslation()

    const [slidesPerView, setSlidesPerView] = useState(4);
    const [newIn, setNewIn] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/newin')
            .then((res) => res.json())
            .then((data) => {
                // Sort data by date in descending order (newest to oldest)
                data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setNewIn(data);
            });
    }, [])

    useEffect(() => {
        const updateSlidesPerView = () => {
            if (window.innerWidth > 1024) {
                setSlidesPerView(4);
            } else if (window.innerWidth < 1024 && window.innerWidth > 768) {
                setSlidesPerView(3);
            } else {
                setSlidesPerView(1);
            }
        };

        window.addEventListener('resize', updateSlidesPerView);
        updateSlidesPerView();

        return () => {
            window.removeEventListener('resize', updateSlidesPerView);
        };
    }, []);

    return (
        <>
            <div className="py-10 overflow-hidden">
                <div className="container">
                    <div className="space-y-4">
                        {/* header */}
                        <div className="flex sm:flex-row flex-col justify-between sm:items-center space-y-4">
                            <h1 className="lg:text-6xl sm:text-5xl text-4xl font-bold font-marcellus text-primary col-span-1" data-aos='fade-up-right'>
                                {t('new in')}
                            </h1>
                            <p className="lg:max-w-[500px] lg:mr-36 mr-0 max-w-[400px] line-clamp-2" data-aos='zoom-out'>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum vero doloribus quidem a
                                ratione
                            </p>
                            <div className="hidden lg:block" data-aos='fade-up-left'>
                                <div className="flex gap-2">
                                    <button className="btn-prev">
                                        <GrPrevious />
                                    </button>
                                    <p className="slide-page"></p>
                                    <button className="btn-next">
                                        <GrNext />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* new product */}
                        <Swiper
                            slidesPerView={slidesPerView}
                            spaceBetween={20}
                            pagination={{
                                type: 'fraction',
                                el: '.slide-page',
                            }}
                            navigation={{
                                nextEl: '.btn-next',
                                prevEl: '.btn-prev',
                            }}
                            modules={[Pagination, Navigation]}
                            className="mySwiper"
                        >
                            {newIn.map((item, index) => (
                                <SwiperSlide key={item.id} className="space-y-2">
                                    <Item
                                        key={index}
                                        id={item.id}
                                        image={item.main_img}
                                        price={item.price}
                                        name={item.name}
                                        className={'hover:scale-95 duration-300 '}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div className="hidden lg:border-b-2 border-b-0 sm:flex sm:justify-center lg:justify-end sm:items-center">
                        <div>
                            <Link to={'/womens'} className="hidden lg:block pt-20 text-right pb-2 cursor-pointer font-bold" data-aos='fade-up'>
                                {t('see all new clothes')}
                            </Link>
                        </div>
                        <div><Link to={'/womens'} className="lg:hidden sm:block btn-primary mt-12" data-aos='fade-up'>{t('see more')}</Link></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewIn;
