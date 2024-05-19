// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';

import upcoming_product from '../Assets/upcoming_product';
import Item from '../Item/Item';

const UpcomingProd = () => {
    return (
        <>
            <div className="py-10 overflow-hidden">
                <div className="container">
                    {/* header */}
                    <div className="flex sm:flex-row flex-col-reverse items-center justify-between pb-10 gap-2">
                        <p className="lg:max-w-[500px] sm:max-w-[300px] lg:mr-36 sm:mr-12 sm:line-clamp-3 line-clamp-2 sm:text-sm" data-aos='fade-right' data-aos-delay='500'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum vero doloribus quidem a
                            ratione vero doloribus quidem a ratione amet consectetur adipisicin vero doloribus quidem a
                            ratione amet consectetur adipisicin
                        </p>
                        <h1 className="lg:max-w-[700px] lg:text-6xl sm:text-4xl text-3xl font-bold font-marcellus text-primary" data-aos='fade-left' data-aos-delay='500'>
                            Upcoming Product Reusable Clothes
                        </h1>
                    </div>

                    {/* upcoming products */}
                    <div className="sm:grid hidden sm:grid-cols-3 grid-cols-1 gap-4">
                        {upcoming_product.map((item) => (
                            <div key={item.id} data-aos='flip-right' data-aos-delay='500'>
                                <img src={item.image} alt="" className="h-[600px] w-[500px] object-cover" />
                            </div>
                        ))}
                    </div>

                    {/* Upcoming prod mobile */}
                    <Swiper slidesPerView={1} spaceBetween={20} className="sm:hidden block mySwiper">
                        {upcoming_product.map((item, index) => (
                            <SwiperSlide key={item.id} className="space-y-2">
                                <Item key={index} image={item.image} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </>
    );
};

export default UpcomingProd;
