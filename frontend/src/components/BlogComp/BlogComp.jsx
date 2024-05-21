// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';

import { useTranslation } from 'react-i18next';

import Img1 from '../Assets/blog/blog1.png';
import Img2 from '../Assets/blog/blog2.jpg';
import Img3 from '../Assets/blog/blog3.jpg';
import Img4 from '../Assets/blog/blog4.jpg';

const BlogList = [
    {
        id: 1,
        img: Img1,
        title: '10 Trending Outfit Women To Shop From',
        description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate hic eius provident sequi, quos deleniti praesentium quas delectus. Voluptate, suscipit.',
    },
    {
        id: 2,
        img: Img2,
        title: 'The Winning Winter Trends',
        description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate hic eius provident sequi, quos deleniti praesentium quas delectus. Voluptate, suscipit.',
    },
    {
        id: 3,
        img: Img3,
        title: "Do's & Don'ts for Diva Dresses",
        description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate hic eius provident sequi, quos deleniti praesentium quas delectus. Voluptate, suscipit.',
    },
    {
        id: 4,
        img: Img4,
        title: 'The Scent Of An AND Woman',
        description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate hic eius provident sequi, quos deleniti praesentium quas delectus. Voluptate, suscipit.',
    },
];

const BlogComp = () => {
    const { t } = useTranslation()

    return (
        <>
            <div>
                <div className="container">
                    {/* header */}
                    <div>
                        <h1 className="lg:text-6xl sm:text-5xl text-4xl font-marcellus font-bold text-primary sm:pb-0 pb-4" data-aos='fade-right'>
                            {t('blog')}
                        </h1>
                    </div>

                    {/* blog list pc + tablet */}
                    <div className="hidden sm:grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 pt-10">
                        <div className="bg-black/50 h-[600px] relative rounded-sm group overflow-hidden cursor-pointer" data-aos='fade-up' data-aos-delay='400'>
                            {/* image */}
                            <div className="absolute z-[-1] top-0 w-full">
                                <img
                                    src={Img1}
                                    alt=""
                                    className="h-[600px] w-full object-cover rounded-sm group-hover:scale-125 duration-500"
                                />
                            </div>
                            {/* text content */}
                            <div className="absolute bottom-10 space-y-6 px-10 text-white">
                                <h1 className="text-white font-bold text-xl">10 Trending Outfit Women To Shop From</h1>
                                <p className="text-sm line-clamp-3">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate hic eius
                                    provident sequi, quos deleniti praesentium quas delectus. Voluptate, suscipit.
                                </p>
                                <p>{t('read')}</p>
                            </div>
                        </div>
                        <div className="grid grid-rows-2 gap-4" data-aos='fade-up' data-aos-delay='500'>
                            <div className="bg-black/50 relative rounded-sm group overflow-hidden cursor-pointer">
                                {/* image */}
                                <div className="absolute z-[-1] top-0 w-full">
                                    <img
                                        src={Img2}
                                        alt=""
                                        className="w-full object-cover rounded-sm h-[291px] group-hover:scale-125 duration-500"
                                    />
                                </div>
                                {/* text content */}
                                <div className="absolute bottom-10 space-y-6 px-10 text-white">
                                    <h1 className="text-white font-bold text-xl">The Winning Winter Trends</h1>
                                    <p>{t('read')}</p>
                                </div>
                            </div>
                            <div className="bg-black/50 relative rounded-sm group overflow-hidden cursor-pointer">
                                {/* image */}
                                <div className="absolute z-[-1] top-0 w-full">
                                    <img
                                        src={Img3}
                                        alt=""
                                        className="w-full object-cover rounded-sm h-[291px] group-hover:scale-125 duration-500"
                                    />
                                </div>
                                {/* text content */}
                                <div className="absolute bottom-10 space-y-6 px-10 text-white">
                                    <h1 className="text-white font-bold text-xl">Do's & Don'ts for Diva Dresses</h1>
                                    <p>{t('read')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid lg:grid-rows-2 lg:grid-cols-none sm:grid-cols-2 sm:col-span-2 lg:col-span-1 gap-4 sm:h-[291px] lg:h-auto" data-aos='fade-up' data-aos-delay='600'>
                            <div className="bg-black/50 relative rounded-sm group overflow-hidden cursor-pointer">
                                {/* image */}
                                <div className="absolute z-[-1] top-0 w-full">
                                    <img
                                        src={Img4}
                                        alt=""
                                        className="w-full object-cover rounded-sm h-[291px] group-hover:scale-125 duration-500"
                                    />
                                </div>
                                {/* text content */}
                                <div className="absolute bottom-10 space-y-6 px-10 text-white">
                                    <h1 className="text-white font-bold text-xl">The Scent Of An AND Woman</h1>
                                    <p>{t('read')}</p>
                                </div>
                            </div>
                            <div className="lg:border-b-2 grid place-items-end">
                                <p className="hidden lg:block pb-2 font-bold cursor-pointer">{t('see all blogs')}</p>
                                <button className="lg:hidden block w-full btn-primary">{t('see more')}</button>
                            </div>
                        </div>
                    </div>

                    {/* blog list mobile */}
                    <Swiper slidesPerView={1} spaceBetween={20} className="sm:hidden block mySwiper">
                        {BlogList.map((blog) => (
                            <SwiperSlide key={blog.id}>
                                <div className="bg-black/50 h-[460px] relative rounded-sm group overflow-hidden cursor-pointer" data-aos='fade-up'>
                                    {/* image */}
                                    <div className="absolute z-[-1] top-0 w-full">
                                        <img
                                            src={blog.img}
                                            alt=""
                                            className="h-[460px] w-full object-cover rounded-sm group-hover:scale-125 duration-500"
                                        />
                                    </div>
                                    {/* text content */}
                                    <div className="absolute bottom-10 space-y-6 px-10 text-white">
                                        <h1 className="text-white font-bold text-xl">{blog.title}</h1>
                                        <p className="text-sm line-clamp-3">{blog.description}</p>
                                        <p className="border-b-2 inline-block uppercase text-sm">{t('read')}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </>
    );
};

export default BlogComp;
